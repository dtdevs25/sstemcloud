import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : undefined,
  // Disable SSL for internal CapRover connections by default
  // To enable, set DB_SSL=true in environment variables
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
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS drive_access (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        access_level VARCHAR(20) DEFAULT 'read',
        granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

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

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Placeholder query
    res.json({ message: 'Database connected', time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
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
