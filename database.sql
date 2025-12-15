-- Criação da tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Acesso ao Drive
CREATE TABLE IF NOT EXISTS drive_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    folder_path VARCHAR(255) NOT NULL, 
    access_level VARCHAR(20) DEFAULT 'read', -- 'read', 'write', 'admin'
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir um usuário de teste (Opcional - Senha precisa ser hasheada na real)
-- INSERT INTO users (username, password_hash, email) VALUES ('admin', 'hash_da_senha', 'admin@example.com');
