-- Script para criar a tabela de pastas e inserir os dados iniciais
-- Execute este script no seu banco de dados PostgreSQL

-- Criar tabela de pastas (caso não exista)
CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT,
    theme VARCHAR(50) DEFAULT 'green',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Limpar dados existentes (opcional - descomente se quiser resetar)
-- DELETE FROM folders;

-- Inserir as pastas
INSERT INTO folders (name, url, theme) VALUES
('ARTIGOS', 'https://drive.google.com/drive/folders/19hVitWHrnWONZDwv9qvclwdWtEEuZS_e?usp=drive_link', 'green'),
('BÔNUS 1', 'https://drive.google.com/drive/folders/18jcv_OpXx9QzWr4SvMqMd5IhLSMskXLy?usp=drive_link', 'red'),
('BÔNUS 2', 'https://drive.google.com/drive/folders/13XMg4BW3v3XZSfjEzZU5wpy7qKdxhLMs?usp=drive_link', 'orange'),
('BÔNUS 3', 'https://drive.google.com/drive/folders/1ssBshUZ9Zmirp0KrnGcSB1YckHGp3xuQ?usp=drive_link', 'green'),
('CARTILHAS – LIVROS E MANUAIS', 'https://drive.google.com/drive/folders/1c9fC-tx4Ui2A3KJnRti00buuZ3QefBs3?usp=drive_link', 'green'),
('CAT – COMUNICADO DE ACIDENTE DO TRABALHO', 'https://drive.google.com/drive/folders/1VK1SoYIAqOpbkPOx4REsGmJ75EW-hBm2?usp=drive_link', 'amber'),
('CERTIFICADOS', 'https://drive.google.com/drive/folders/1Hm0JEGY9uKq4S_V1-0ZvEObxK_HpMQfG?usp=drive_link', 'lime'),
('CHECK LIST', 'https://drive.google.com/drive/folders/1TEE87PDEDuBf5ax5jDDprxYM946Sf2Fo?usp=drive_link', 'purple'),
('CIPA', 'https://drive.google.com/drive/folders/1AEIaBQGAYagnQ6X2LiXAgd1Vcr86KMwp?usp=drive_link', 'red'),
('COVID-19', 'https://drive.google.com/drive/folders/1Y7ZXfpkGl5AiepvesAQIjBliVcdKed4X?usp=drive_link', 'blue'),
('DIÁLOGOS DE SEGURANÇA', 'https://drive.google.com/drive/folders/17GAz6IzVySGPTINHLXHCqTZAN4-T5Vxn?usp=drive_link', 'rose'),
('DICAS', 'https://drive.google.com/drive/folders/1pbrmNXQNFIMxaxY2LVQ1k6Xu-S5-hALT?usp=drive_link', 'orange'),
('ERGONOMIA', 'https://drive.google.com/drive/folders/1bsoeAcj57ZoWU1T3kHkgGOcWrmNqXT4c?usp=drive_link', 'orange'),
('FOTOS PARA TREINAMENTOS', 'https://drive.google.com/drive/folders/1dje54XFEWWgtytSjjMarkpiOgQhBivIt?usp=drive_link', 'blue'),
('FUNDACENTRO', 'https://drive.google.com/drive/folders/1inYmpmLnmhFvOJDP5xh8yZW7irkupreX?usp=drive_link', 'green'),
('INFOGRÁFICOS', 'https://drive.google.com/drive/folders/1t07nxJlIn0u62WzRf3csi5kygXR_ANpe?usp=drive_link', 'orange'),
('LAUDOS', 'https://drive.google.com/drive/folders/1wYMzdUnUsYX3_mAt57N7BoWipGKrlL3N?usp=drive_link', 'red'),
('LIBERAÇÕES DE TRABALHO', 'https://drive.google.com/drive/folders/1k5TQXqC3V7oEwRBFxELxH38XnjzkOD4l?usp=drive_link', 'pink'),
('MEIO AMBIENTE', 'https://drive.google.com/drive/folders/1khM11AbS_sHs2PBUp8LTdDL3baLUs545?usp=drive_link', 'amber'),
('ORDEM DE SERVIÇO', 'https://drive.google.com/drive/folders/1NtweM9PJk2JCd8ux7efaE5sHc9xCC7Rl?usp=drive_link', 'red'),
('PCA – PROGRAMA DE CONSERVAÇÃO AUDITIVA', 'https://drive.google.com/drive/folders/1szXc8RaT6qliFtvg4VNQTvXaoW_xfvKk?usp=drive_link', 'yellow'),
('PCMAT – PROGRAMA DE CONDIÇÕES E MEIO AMBIENTE DE TRABALHO NA INDUSTRIA DE CONSTRUÇÃO', 'https://drive.google.com/drive/folders/1muOIzWj0JU_eRQNpj53DmiYXuGWvg7yX?usp=drive_link', 'green'),
('PCMSO – PROGRAMA DE CONTROLE MÉDICO E SAÚDE OCUPACIONAL', 'https://drive.google.com/drive/folders/1iSuX2M8n3BvFSoSuQl5yHjZVvVP2a8ni?usp=drive_link', 'purple'),
('PGR – PROGRAMA DE GERENCIAMENTO DE RISCOS', 'https://drive.google.com/drive/folders/1eEb4hGOHXdzFbnqWDfln_D770NG78GXN?usp=drive_link', 'orange'),
('PPP – PERFIL PREFISSIOGRÁFICO PREVIDENCIARIO', 'https://drive.google.com/drive/folders/1FRHsGPiyHj0D1LEYLGjuWDSW3gfBT6ig?usp=drive_link', 'lime'),
('PPR – PROGRAMA DE PROTEÇÃO RESPIRATÓRIA', 'https://drive.google.com/drive/folders/1WQKhEda9N9j-uJUuYnnbgoeLY2_tEAhh?usp=drive_link', 'orange'),
('PPRA – PROGRAMA DE PREVENÇÃO DE RISCOS AMBIENTAIS', 'https://drive.google.com/drive/folders/1uJv1bLRGk9Ff2MgpuJ0UC3dg5SRDw577?usp=drive_link', 'indigo'),
('PROCEDIMENTOS', 'https://drive.google.com/drive/folders/1Jtc_8bWDsuovWIHvXbCB9kUe4MotXt9z?usp=drive_link', 'emerald'),
('QUALIDADE', 'https://drive.google.com/drive/folders/1dvT5dc1e0AmmF-2Y6aKOoBWdJq747EMg?usp=drive_link', 'gray'),
('RECURSOS HUMANOS', 'https://drive.google.com/drive/folders/1QJFb_BOe3cgVg7Rg8iUKn5BWRiE_3vvu?usp=drive_link', 'teal'),
('TREINAMENTOS PRONTOS', 'https://drive.google.com/drive/folders/1LZytR9Fk1ZswTsN7l0sfoFEc1jnUy5kK?usp=drive_link', 'cyan'),
('VIDEOS', 'https://drive.google.com/drive/folders/1-R5aKLH4lp21w0Q5W-7KBm2oVQs7sFRh?usp=drive_link', 'sky');

-- Verificar inserção
SELECT COUNT(*) as total_pastas FROM folders;
