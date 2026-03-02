import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Rate limiting storage (simple in-memory, use Redis in production for multiple instances)
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit payload size

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ============ GOOGLE DRIVE INTEGRATION ============
async function liberarAcessoCliente(emailNovoUsuario) {
  if (!process.env.GOOGLE_KEYS_JSON) {
    console.warn('⚠️ GOOGLE_KEYS_JSON não configurado. Ignorando compartilhamento do Drive.');
    return;
  }

  try {
    let rawKeys = process.env.GOOGLE_KEYS_JSON.trim();

    // 1. Remove espaços especiais (non-breaking spaces)
    rawKeys = rawKeys.replace(/\u00A0/g, ' ');

    // 2. Converte \n literais em quebras de linha reais para limpar a estrutura
    rawKeys = rawKeys.replace(/\\n/g, '\n');

    // 3. CORREÇÃO CRUCIAL: Quebras de linha REAIS dentro de strings são inválidas no JSON.
    // Vamos encontrar o valor da private_key e re-escapar as quebras de linha dentro dela.
    rawKeys = rawKeys.replace(/("private_key":\s*")([\s\S]+?)(")/g, (match, p1, p2, p3) => {
      return p1 + p2.replace(/\n/g, '\\n') + p3;
    });

    const credentials = JSON.parse(rawKeys);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    await drive.permissions.create({
      // Este ID corresponde à sua pasta "SST EM CLOUD"
      fileId: '1LemUFaSmW2vsR7UlprdnTWqJw44VNri7',
      requestBody: {
        role: 'reader', // Acesso apenas para leitura
        type: 'user',
        emailAddress: emailNovoUsuario,
      },
      sendNotificationEmail: true,
    });
    console.log(`✅ Acesso liberado para: ${emailNovoUsuario}`);
  } catch (error) {
    console.error('❌ Erro no Google Drive:', error.message);
  }
}

// Database configuration
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : undefined,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Test database connection and initialize tables
pool.connect((err, client, release) => {
  if (err) {
    console.warn('Error connecting to database:', err.message);
  } else {
    console.log('Connected to database successfully');

    // Initialize tables
    const initSql = `
      CREATE TABLE IF NOT EXISTS app_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE,
        login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP WITH TIME ZONE,
        reset_password_token VARCHAR(255),
        reset_password_expires TIMESTAMP WITH TIME ZONE
      );

      -- Add columns if they don't exist
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_users' AND column_name='reset_password_token') THEN
          ALTER TABLE app_users ADD COLUMN reset_password_token VARCHAR(255);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_users' AND column_name='reset_password_expires') THEN
          ALTER TABLE app_users ADD COLUMN reset_password_expires TIMESTAMP WITH TIME ZONE;
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS site_visits (
        id SERIAL PRIMARY KEY,
        visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT,
        ip_address VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS folders (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url TEXT,
        theme VARCHAR(50) DEFAULT 'green',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS access_logs (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255),
        folder_name VARCHAR(255),
        accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    client.query(initSql, (err, res) => {
      release();
      if (err) {
        console.error('Error initializing database tables:', err);
      } else {
        console.log('Database tables initialized successfully');
      }
    });
  }
});

// ============ AUTHENTICATION API ============

// ============ EMAIL CONFIGURATION ============
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'srv-captain--mailserver',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'sstemcloud@ehspro.com.br',
    pass: process.env.SMTP_PASS || 'D@nkelS2',
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ SMTP Error:', error.message);
  } else {
    console.log('✅ SMTP Server is ready to take messages');
  }
});

// Rate limiting check
const checkRateLimit = (ip) => {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, firstAttempt: now };

  // Reset if window expired
  if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - attempts.firstAttempt)) / 60000);
    return { allowed: false, remaining: 0, timeLeft };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - attempts.count };
};

// Record login attempt
const recordLoginAttempt = (ip) => {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
  attempts.count++;
  loginAttempts.set(ip, attempts);
};

// Clear login attempts on success
const clearLoginAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// Login endpoint (secure)
app.post('/api/auth/login', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    console.log('Login attempt from IP:', ip);

    // Check rate limit
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      console.log('Rate limit exceeded for IP:', ip);
      return res.status(429).json({
        error: `Muitas tentativas. Tente novamente em ${rateCheck.timeLeft} minutos.`,
        locked: true
      });
    }

    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    // Input validation
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Sanitize email (basic)
    const sanitizedEmail = email.toLowerCase().trim();

    console.log('Searching for user with email:', sanitizedEmail);

    // Query user (parameterized query - safe from SQL injection)
    const result = await pool.query(
      'SELECT id, name, email, password_hash, role, locked_until FROM app_users WHERE LOWER(email) = $1',
      [sanitizedEmail]
    );

    console.log('Query result rows:', result.rows.length);

    if (result.rows.length === 0) {
      console.log('User not found in database');
      recordLoginAttempt(ip);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = result.rows[0];

    console.log('User found:', user.name, user.email);
    console.log('Password hash from DB length:', user.password_hash?.length);
    console.log('Password hash first 20 chars:', user.password_hash?.substring(0, 20));

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      console.log('Account is locked');
      return res.status(423).json({ error: 'Conta temporariamente bloqueada. Tente mais tarde.' });
    }

    // Verify password - try bcrypt first, then fallback to plain text for master
    console.log('Comparing password...');
    let isValid = false;

    // Try bcrypt comparison
    try {
      isValid = await bcrypt.compare(password, user.password_hash);
      console.log('Bcrypt compare result:', isValid);
    } catch (e) {
      console.log('Bcrypt error:', e.message);
    }

    // FALLBACK: For master admin, also accept plain password 'dankels2'
    if (!isValid && user.email === 'daniel-ehs@outlook.com' && password === 'dankels2') {
      console.log('Using master password fallback');
      isValid = true;
    }

    console.log('Password valid:', isValid);

    if (!isValid) {
      console.log('Password comparison failed');
      recordLoginAttempt(ip);

      // Update login attempts in DB
      await pool.query(
        'UPDATE app_users SET login_attempts = login_attempts + 1 WHERE id = $1',
        [user.id]
      );

      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    console.log('Login successful!');

    // Success - clear rate limit and reset login attempts
    clearLoginAttempts(ip);
    await pool.query(
      'UPDATE app_users SET last_login = NOW(), login_attempts = 0, locked_until = NULL WHERE id = $1',
      [user.id]
    );

    // Return user info (never return password)
    res.json({
      success: true,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create master user (run once)
app.post('/api/auth/create-master', async (req, res) => {
  try {
    // Check if master already exists
    const existing = await pool.query(
      "SELECT id FROM app_users WHERE role = 'admin' LIMIT 1"
    );

    // Delete existing master to recreate with correct hash
    await pool.query("DELETE FROM app_users WHERE email = 'daniel-ehs@outlook.com'");

    // Create master user with secure password hash generated HERE on the server
    const passwordHash = await bcrypt.hash('dankels2', 12);

    console.log('Generated hash length:', passwordHash.length);
    console.log('Generated hash:', passwordHash);

    const result = await pool.query(
      `INSERT INTO app_users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, 'admin') RETURNING id, name, email, role`,
      ['Daniel Santos', 'daniel-ehs@outlook.com', passwordHash]
    );

    res.json({
      success: true,
      message: 'Master user created successfully',
      user: result.rows[0],
      hashLength: passwordHash.length
    });

  } catch (error) {
    console.error('Error creating master user:', error);
    res.status(500).json({ error: 'Failed to create master user' });
  }
});

// Reset password for a user (emergency route)
app.post('/api/auth/reset-master-password', async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash('dankels2', 12);

    console.log('New hash length:', passwordHash.length);
    console.log('New hash:', passwordHash);

    // Test immediately if it works
    const testCompare = await bcrypt.compare('dankels2', passwordHash);
    console.log('Immediate test compare result:', testCompare);

    const result = await pool.query(
      `UPDATE app_users SET password_hash = $1, login_attempts = 0, locked_until = NULL 
       WHERE email = 'daniel-ehs@outlook.com' RETURNING id, name, email`,
      [passwordHash]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify what was saved
    const verify = await pool.query(
      'SELECT password_hash, LENGTH(password_hash) as len FROM app_users WHERE email = $1',
      ['daniel-ehs@outlook.com']
    );
    console.log('Saved hash length:', verify.rows[0].len);
    console.log('Saved hash:', verify.rows[0].password_hash);

    // Test compare with saved hash
    const savedCompare = await bcrypt.compare('dankels2', verify.rows[0].password_hash);
    console.log('Saved hash compare result:', savedCompare);

    // Also clear rate limiting
    loginAttempts.clear();

    res.json({
      success: true,
      message: 'Password reset and rate limit cleared',
      hashLength: passwordHash.length,
      savedHashLength: verify.rows[0].len,
      immediateTest: testCompare,
      savedTest: savedCompare
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Debug route - test password comparison
app.get('/api/debug/test-password', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT password_hash FROM app_users WHERE email = $1',
      ['daniel-ehs@outlook.com']
    );

    if (result.rows.length === 0) {
      return res.json({ error: 'User not found' });
    }

    const hash = result.rows[0].password_hash;
    const testResult = await bcrypt.compare('dankels2', hash);

    res.json({
      hashLength: hash.length,
      hashStart: hash.substring(0, 30),
      hashEnd: hash.substring(hash.length - 10),
      compareResult: testResult
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Get all users (admin only - for admin panel)
app.get('/api/auth/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at, last_login FROM app_users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Forgot Password Endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

    const result = await pool.query('SELECT id, name FROM app_users WHERE LOWER(email) = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      // For security, don't reveal if user exists. But user requested "modal mostra que o email não cadastrado".
      return res.status(404).json({ error: 'E-mail não encontrado no nosso sistema.' });
    }

    const user = result.rows[0];
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      'UPDATE app_users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [token, expires, user.id]
    );

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"SST em Cloud" <${process.env.SMTP_USER || 'sstemcloud@ehspro.com.br'}>`,
      to: email,
      subject: 'Recuperação de Senha - SST em Cloud',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
          <h2 style="color: #0284c7;">Olá, ${user.name}!</h2>
          <p>Você solicitou a recuperação de senha da sua conta no <strong>SST em Cloud</strong>.</p>
          <p>Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Recuperar Minha Senha</a>
          </div>
          <p style="font-size: 12px; color: #666;">Se você não solicitou isso, por favor ignore este e-mail.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 10px; color: #999;">SST em Cloud &copy; ${new Date().getFullYear()}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'E-mail de recuperação enviado com sucesso!' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação de recuperação.' });
  }
});

// Reset Password Endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token e senha são obrigatórios' });

    const result = await pool.query(
      'SELECT id FROM app_users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const userId = result.rows[0].id;
    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      'UPDATE app_users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [passwordHash, userId]
    );

    res.json({ success: true, message: 'Senha redefinida com sucesso!' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha.' });
  }
});

// Create new user (admin function)
app.post('/api/auth/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Check if email already exists
    const existing = await pool.query('SELECT id FROM app_users WHERE LOWER(email) = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    // Hash password with strong salt rounds
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO app_users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at`,
      [name, email.toLowerCase().trim(), passwordHash, role || 'user']
    );

    // Liberar acesso no Google Drive
    if (role !== 'admin') {
      liberarAcessoCliente(email.toLowerCase().trim());
    }

    res.json({ success: true, user: result.rows[0] });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
app.put('/api/auth/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    let query, params;

    if (password) {
      // Update with new password
      const passwordHash = await bcrypt.hash(password, 12);
      query = 'UPDATE app_users SET name = $1, email = $2, password_hash = $3, role = $4 WHERE id = $5 RETURNING id, name, email, role';
      params = [name, email.toLowerCase().trim(), passwordHash, role, id];
    } else {
      // Update without password
      query = 'UPDATE app_users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role';
      params = [name, email.toLowerCase().trim(), role, id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
app.delete('/api/auth/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the last admin
    const admins = await pool.query("SELECT id FROM app_users WHERE role = 'admin'");
    const userToDelete = await pool.query('SELECT role FROM app_users WHERE id = $1', [id]);

    if (userToDelete.rows[0]?.role === 'admin' && admins.rows.length <= 1) {
      return res.status(400).json({ error: 'Não é possível excluir o último administrador' });
    }

    const result = await pool.query('DELETE FROM app_users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Debug route to check users in database
app.get('/api/debug/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM app_users');
    res.json({
      count: result.rows.length,
      users: result.rows.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
    });
  } catch (error) {
    console.error('Debug users error:', error);
    res.json({ error: error.message, hint: 'Table app_users may not exist' });
  }
});

// ============ FOLDERS API ============

// Listar todas as pastas
app.get('/api/folders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM folders ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting folders:', error);
    res.status(500).json({ error: 'Failed to get folders', folders: [] });
  }
});

// Criar nova pasta
app.post('/api/folders', async (req, res) => {
  try {
    const { name, url, theme } = req.body;
    const result = await pool.query(
      'INSERT INTO folders (name, url, theme) VALUES ($1, $2, $3) RETURNING *',
      [name, url || '', theme || 'green']
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Atualizar pasta
app.put('/api/folders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, theme } = req.body;
    const result = await pool.query(
      'UPDATE folders SET name = $1, url = $2, theme = $3 WHERE id = $4 RETURNING *',
      [name, url, theme, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// Deletar pasta
app.delete('/api/folders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM folders WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

// ============ ACCESS LOGS API ============

// Obter todos os logs de acesso (admin)
app.get('/api/logs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        al.id, 
        al.user_email as user, 
        al.folder_name as folder, 
        al.accessed_at as timestamp 
      FROM access_logs al 
      ORDER BY al.accessed_at DESC 
      LIMIT 1000
    `);

    // Formatar timestamp para o frontend
    const logs = result.rows.map(log => ({
      ...log,
      timestamp: log.timestamp.toLocaleString('pt-BR')
    }));

    res.json(logs);
  } catch (error) {
    console.error('Error getting logs:', error);
    res.status(500).json({ error: 'Failed to get logs', logs: [] });
  }
});

// Registrar log de acesso
app.post('/api/logs', async (req, res) => {
  try {
    const { email, folderName } = req.body;

    if (!email || !folderName) {
      return res.status(400).json({ error: 'Email and folder name are required' });
    }

    await pool.query(
      'INSERT INTO access_logs (user_email, folder_name) VALUES ($1, $2)',
      [email, folderName]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording access log:', error);
    res.status(500).json({ error: 'Failed to record log' });
  }
});

// Rota para popular pastas iniciais (executar uma vez)
app.post('/api/folders/seed', async (req, res) => {
  try {
    // Verificar se já existem pastas
    const existing = await pool.query('SELECT COUNT(*) as count FROM folders');
    if (parseInt(existing.rows[0].count) > 0) {
      return res.json({ message: 'Folders already seeded', count: existing.rows[0].count });
    }

    // Pastas iniciais
    const folders = [
      { name: 'ARTIGOS', theme: 'green', url: 'https://drive.google.com/drive/folders/19hVitWHrnWONZDwv9qvclwdWtEEuZS_e?usp=drive_link' },
      { name: 'BÔNUS 1', theme: 'red', url: 'https://drive.google.com/drive/folders/18jcv_OpXx9QzWr4SvMqMd5IhLSMskXLy?usp=drive_link' },
      { name: 'BÔNUS 2', theme: 'orange', url: 'https://drive.google.com/drive/folders/13XMg4BW3v3XZSfjEzZU5wpy7qKdxhLMs?usp=drive_link' },
      { name: 'BÔNUS 3', theme: 'green', url: 'https://drive.google.com/drive/folders/1ssBshUZ9Zmirp0KrnGcSB1YckHGp3xuQ?usp=drive_link' },
      { name: 'CARTILHAS – LIVROS E MANUAIS', theme: 'green', url: 'https://drive.google.com/drive/folders/1c9fC-tx4Ui2A3KJnRti00buuZ3QefBs3?usp=drive_link' },
      { name: 'CAT – COMUNICADO DE ACIDENTE DO TRABALHO', theme: 'amber', url: 'https://drive.google.com/drive/folders/1VK1SoYIAqOpbkPOx4REsGmJ75EW-hBm2?usp=drive_link' },
      { name: 'CERTIFICADOS', theme: 'lime', url: 'https://drive.google.com/drive/folders/1Hm0JEGY9uKq4S_V1-0ZvEObxK_HpMQfG?usp=drive_link' },
      { name: 'CHECK LIST', theme: 'purple', url: 'https://drive.google.com/drive/folders/1TEE87PDEDuBf5ax5jDDprxYM946Sf2Fo?usp=drive_link' },
      { name: 'CIPA', theme: 'red', url: 'https://drive.google.com/drive/folders/1AEIaBQGAYagnQ6X2LiXAgd1Vcr86KMwp?usp=drive_link' },
      { name: 'COVID-19', theme: 'blue', url: 'https://drive.google.com/drive/folders/1Y7ZXfpkGl5AiepvesAQIjBliVcdKed4X?usp=drive_link' },
      { name: 'DIÁLOGOS DE SEGURANÇA', theme: 'rose', url: 'https://drive.google.com/drive/folders/17GAz6IzVySGPTINHLXHCqTZAN4-T5Vxn?usp=drive_link' },
      { name: 'DICAS', theme: 'orange', url: 'https://drive.google.com/drive/folders/1pbrmNXQNFIMxaxY2LVQ1k6Xu-S5-hALT?usp=drive_link' },
      { name: 'ERGONOMIA', theme: 'orange', url: 'https://drive.google.com/drive/folders/1bsoeAcj57ZoWU1T3kHkgGOcWrmNqXT4c?usp=drive_link' },
      { name: 'FOTOS PARA TREINAMENTOS', theme: 'blue', url: 'https://drive.google.com/drive/folders/1dje54XFEWWgtytSjjMarkpiOgQhBivIt?usp=drive_link' },
      { name: 'FUNDACENTRO', theme: 'green', url: 'https://drive.google.com/drive/folders/1inYmpmLnmhFvOJDP5xh8yZW7irkupreX?usp=drive_link' },
      { name: 'INFOGRÁFICOS', theme: 'orange', url: 'https://drive.google.com/drive/folders/1t07nxJlIn0u62WzRf3csi5kygXR_ANpe?usp=drive_link' },
      { name: 'LAUDOS', theme: 'red', url: 'https://drive.google.com/drive/folders/1wYMzdUnUsYX3_mAt57N7BoWipGKrlL3N?usp=drive_link' },
      { name: 'LIBERAÇÕES DE TRABALHO', theme: 'pink', url: 'https://drive.google.com/drive/folders/1k5TQXqC3V7oEwRBFxELxH38XnjzkOD4l?usp=drive_link' },
      { name: 'MEIO AMBIENTE', theme: 'amber', url: 'https://drive.google.com/drive/folders/1khM11AbS_sHs2PBUp8LTdDL3baLUs545?usp=drive_link' },
      { name: 'ORDEM DE SERVIÇO', theme: 'red', url: 'https://drive.google.com/drive/folders/1NtweM9PJk2JCd8ux7efaE5sHc9xCC7Rl?usp=drive_link' },
      { name: 'PCA – PROGRAMA DE CONSERVAÇÃO AUDITIVA', theme: 'yellow', url: 'https://drive.google.com/drive/folders/1szXc8RaT6qliFtvg4VNQTvXaoW_xfvKk?usp=drive_link' },
      { name: 'PCMAT – PROGRAMA DE CONDIÇÕES E MEIO AMBIENTE DE TRABALHO NA INDUSTRIA DE CONSTRUÇÃO', theme: 'green', url: 'https://drive.google.com/drive/folders/1muOIzWj0JU_eRQNpj53DmiYXuGWvg7yX?usp=drive_link' },
      { name: 'PCMSO – PROGRAMA DE CONTROLE MÉDICO E SAÚDE OCUPACIONAL', theme: 'purple', url: 'https://drive.google.com/drive/folders/1iSuX2M8n3BvFSoSuQl5yHjZVvVP2a8ni?usp=drive_link' },
      { name: 'PGR – PROGRAMA DE GERENCIAMENTO DE RISCOS', theme: 'orange', url: 'https://drive.google.com/drive/folders/1eEb4hGOHXdzFbnqWDfln_D770NG78GXN?usp=drive_link' },
      { name: 'PPP – PERFIL PREFISSIOGRÁFICO PREVIDENCIARIO', theme: 'lime', url: 'https://drive.google.com/drive/folders/1FRHsGPiyHj0D1LEYLGjuWDSW3gfBT6ig?usp=drive_link' },
      { name: 'PPR – PROGRAMA DE PROTEÇÃO RESPIRATÓRIA', theme: 'orange', url: 'https://drive.google.com/drive/folders/1WQKhEda9N9j-uJUuYnnbgoeLY2_tEAhh?usp=drive_link' },
      { name: 'PPRA – PROGRAMA DE PREVENÇÃO DE RISCOS AMBIENTAIS', theme: 'indigo', url: 'https://drive.google.com/drive/folders/1uJv1bLRGk9Ff2MgpuJ0UC3dg5SRDw577?usp=drive_link' },
      { name: 'PROCEDIMENTOS', theme: 'emerald', url: 'https://drive.google.com/drive/folders/1Jtc_8bWDsuovWIHvXbCB9kUe4MotXt9z?usp=drive_link' },
      { name: 'QUALIDADE', theme: 'gray', url: 'https://drive.google.com/drive/folders/1dvT5dc1e0AmmF-2Y6aKOoBWdJq747EMg?usp=drive_link' },
      { name: 'RECURSOS HUMANOS', theme: 'teal', url: 'https://drive.google.com/drive/folders/1QJFb_BOe3cgVg7Rg8iUKn5BWRiE_3vvu?usp=drive_link' },
      { name: 'TREINAMENTOS PRONTOS', theme: 'cyan', url: 'https://drive.google.com/drive/folders/1LZytR9Fk1ZswTsN7l0sfoFEc1jnUy5kK?usp=drive_link' },
      { name: 'VIDEOS', theme: 'sky', url: 'https://drive.google.com/drive/folders/1-R5aKLH4lp21w0Q5W-7KBm2oVQs7sFRh?usp=drive_link' },
    ];

    // Inserir todas as pastas
    for (const folder of folders) {
      await pool.query(
        'INSERT INTO folders (name, url, theme) VALUES ($1, $2, $3)',
        [folder.name, folder.url, folder.theme]
      );
    }

    res.json({ success: true, message: 'Folders seeded successfully', count: folders.length });
  } catch (error) {
    console.error('Error seeding folders:', error);
    res.status(500).json({ error: 'Failed to seed folders' });
  }
});

// ============ VISITS API ============

// Registrar uma visita
app.post('/api/visits', async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

    await pool.query(
      'INSERT INTO site_visits (user_agent, ip_address) VALUES ($1, $2)',
      [userAgent, ipAddress]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error registering visit:', error);
    res.status(500).json({ error: 'Failed to register visit' });
  }
});

// Obter total de visitas
app.get('/api/visits', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM site_visits');
    const todayResult = await pool.query(
      "SELECT COUNT(*) as today FROM site_visits WHERE visited_at >= CURRENT_DATE"
    );

    res.json({
      total: parseInt(result.rows[0].total),
      today: parseInt(todayResult.rows[0].today)
    });
  } catch (error) {
    console.error('Error getting visits:', error);
    res.status(500).json({ error: 'Failed to get visits', total: 0, today: 0 });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
