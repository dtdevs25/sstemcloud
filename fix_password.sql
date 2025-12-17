-- Script para ATUALIZAR a senha do usuário master
-- Execute este SQL COMPLETO no Adminer
-- COPIE TODO O HASH SEM QUEBRAR A LINHA!

-- Senha: dankels2
-- Hash COMPLETO (60 caracteres): $2b$12$ZaraOVNUtoGiqJjAQISwuOYytHhPiYL0dQev7pZnYceuF.kdDjGQAy

UPDATE app_users 
SET password_hash = '$2b$12$ZaraOVNUtoGiqJjAQISwuOYytHhPiYL0dQev7pZnYceuF.kdDjGQAy'
WHERE email = 'daniel-ehs@outlook.com';

-- Verificar se o hash tem 60 caracteres
SELECT id, name, email, LENGTH(password_hash) as hash_length, password_hash FROM app_users WHERE email = 'daniel-ehs@outlook.com';
