-- Script para criar a tabela de usuários e o usuário master
-- Execute este script no seu banco de dados PostgreSQL

-- Criar tabela de usuários (caso não exista)
CREATE TABLE IF NOT EXISTS app_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de logs de acesso (caso não exista)
CREATE TABLE IF NOT EXISTS access_logs (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    folder_name VARCHAR(255),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário master (Daniel Santos)
-- Senha: dankels2 (criptografada com bcrypt, salt rounds 12)
INSERT INTO app_users (name, email, password_hash, role) VALUES
('Daniel Santos', 'daniel-ehs@outlook.com', '$2b$12$OANMQK9K9bT3R/vzIT49xOffvoo10V7droS.eF0kJYqeoE/FZea0uO', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Verificar inserção
SELECT id, name, email, role, created_at FROM app_users;
