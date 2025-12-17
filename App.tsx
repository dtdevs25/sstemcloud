import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Advantages } from './components/Advantages';
import { SupportSection } from './components/SupportSection';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { AccessLog, FolderItem, User } from './types';
import { CheckCircle2, XCircle, X } from 'lucide-react';

// Initial Mock Data Folders
const initialFolders: FolderItem[] = [
  { id: 1, name: 'ARTIGOS', theme: 'green', url: 'https://drive.google.com/drive/folders/19hVitWHrnWONZDwv9qvclwdWtEEuZS_e?usp=drive_link' },
  { id: 2, name: 'BÔNUS 1', theme: 'red', url: 'https://drive.google.com/drive/folders/18jcv_OpXx9QzWr4SvMqMd5IhLSMskXLy?usp=drive_link' },
  { id: 3, name: 'BÔNUS 2', theme: 'orange', url: 'https://drive.google.com/drive/folders/13XMg4BW3v3XZSfjEzZU5wpy7qKdxhLMs?usp=drive_link' },
  { id: 4, name: 'BÔNUS 3', theme: 'green', url: 'https://drive.google.com/drive/folders/1ssBshUZ9Zmirp0KrnGcSB1YckHGp3xuQ?usp=drive_link' },
  { id: 5, name: 'CARTILHAS – LIVROS E MANUAIS', theme: 'green', url: 'https://drive.google.com/drive/folders/1c9fC-tx4Ui2A3KJnRti00buuZ3QefBs3?usp=drive_link' },
  { id: 6, name: 'CAT – COMUNICADO DE ACIDENTE DO TRABALHO', theme: 'amber', url: 'https://drive.google.com/drive/folders/1VK1SoYIAqOpbkPOx4REsGmJ75EW-hBm2?usp=drive_link' },
  { id: 7, name: 'CERTIFICADOS', theme: 'lime', url: 'https://drive.google.com/drive/folders/1Hm0JEGY9uKq4S_V1-0ZvEObxK_HpMQfG?usp=drive_link' },
  { id: 8, name: 'CHECK LIST', theme: 'purple', url: 'https://drive.google.com/drive/folders/1TEE87PDEDuBf5ax5jDDprxYM946Sf2Fo?usp=drive_link' },
  { id: 9, name: 'CIPA', theme: 'red', url: 'https://drive.google.com/drive/folders/1AEIaBQGAYagnQ6X2LiXAgd1Vcr86KMwp?usp=drive_link' },
  { id: 10, name: 'COVID-19', theme: 'blue', url: 'https://drive.google.com/drive/folders/1Y7ZXfpkGl5AiepvesAQIjBliVcdKed4X?usp=drive_link' },
  { id: 11, name: 'DIÁLOGOS DE SEGURANÇA', theme: 'rose', url: 'https://drive.google.com/drive/folders/17GAz6IzVySGPTINHLXHCqTZAN4-T5Vxn?usp=drive_link' },
  { id: 12, name: 'DICAS', theme: 'orange', url: 'https://drive.google.com/drive/folders/1pbrmNXQNFIMxaxY2LVQ1k6Xu-S5-hALT?usp=drive_link' },
  { id: 13, name: 'ERGONOMIA', theme: 'orange', url: 'https://drive.google.com/drive/folders/1bsoeAcj57ZoWU1T3kHkgGOcWrmNqXT4c?usp=drive_link' },
  { id: 14, name: 'FOTOS PARA TREINAMENTOS', theme: 'blue', url: 'https://drive.google.com/drive/folders/1dje54XFEWWgtytSjjMarkpiOgQhBivIt?usp=drive_link' },
  { id: 15, name: 'FUNDACENTRO', theme: 'green', url: 'https://drive.google.com/drive/folders/1inYmpmLnmhFvOJDP5xh8yZW7irkupreX?usp=drive_link' },
  { id: 16, name: 'INFOGRÁFICOS', theme: 'orange', url: 'https://drive.google.com/drive/folders/1t07nxJlIn0u62WzRf3csi5kygXR_ANpe?usp=drive_link' },
  { id: 17, name: 'LAUDOS', theme: 'red', url: 'https://drive.google.com/drive/folders/1wYMzdUnUsYX3_mAt57N7BoWipGKrlL3N?usp=drive_link' },
  { id: 18, name: 'LIBERAÇÕES DE TRABALHO', theme: 'pink', url: 'https://drive.google.com/drive/folders/1k5TQXqC3V7oEwRBFxELxH38XnjzkOD4l?usp=drive_link' },
  { id: 19, name: 'MEIO AMBIENTE', theme: 'amber', url: 'https://drive.google.com/drive/folders/1khM11AbS_sHs2PBUp8LTdDL3baLUs545?usp=drive_link' },
  { id: 20, name: 'ORDEM DE SERVIÇO', theme: 'red', url: 'https://drive.google.com/drive/folders/1NtweM9PJk2JCd8ux7efaE5sHc9xCC7Rl?usp=drive_link' },
  { id: 21, name: 'PCA – PROGRAMA DE CONSERVAÇÃO AUDITIVA', theme: 'yellow', url: 'https://drive.google.com/drive/folders/1szXc8RaT6qliFtvg4VNQTvXaoW_xfvKk?usp=drive_link' },
  { id: 22, name: 'PCMAT – PROGRAMA DE CONDIÇÕES E MEIO AMBIENTE DE TRABALHO NA INDUSTRIA DE CONSTRUÇÃO', theme: 'green', url: 'https://drive.google.com/drive/folders/1muOIzWj0JU_eRQNpj53DmiYXuGWvg7yX?usp=drive_link' },
  { id: 23, name: 'PCMSO – PROGRAMA DE CONTROLE MÉDICO E SAÚDE OCUPACIONAL', theme: 'purple', url: 'https://drive.google.com/drive/folders/1iSuX2M8n3BvFSoSuQl5yHjZVvVP2a8ni?usp=drive_link' },
  { id: 24, name: 'PGR – PROGRAMA DE GERENCIAMENTO DE RISCOS', theme: 'orange', url: 'https://drive.google.com/drive/folders/1eEb4hGOHXdzFbnqWDfln_D770NG78GXN?usp=drive_link' },
  { id: 25, name: 'PPP – PERFIL PREFISSIOGRÁFICO PREVIDENCIARIO', theme: 'lime', url: 'https://drive.google.com/drive/folders/1FRHsGPiyHj0D1LEYLGjuWDSW3gfBT6ig?usp=drive_link' },
  { id: 26, name: 'PPR – PROGRAMA DE PROTEÇÃO RESPIRATÓRIA', theme: 'orange', url: 'https://drive.google.com/drive/folders/1WQKhEda9N9j-uJUuYnnbgoeLY2_tEAhh?usp=drive_link' },
  { id: 27, name: 'PPRA – PROGRAMA DE PREVENÇÃO DE RISCOS AMBIENTAIS', theme: 'indigo', url: 'https://drive.google.com/drive/folders/1uJv1bLRGk9Ff2MgpuJ0UC3dg5SRDw577?usp=drive_link' },
  { id: 28, name: 'PROCEDIMENTOS', theme: 'emerald', url: 'https://drive.google.com/drive/folders/1Jtc_8bWDsuovWIHvXbCB9kUe4MotXt9z?usp=drive_link' },
  { id: 29, name: 'QUALIDADE', theme: 'gray', url: 'https://drive.google.com/drive/folders/1dvT5dc1e0AmmF-2Y6aKOoBWdJq747EMg?usp=drive_link' },
  { id: 30, name: 'RECURSOS HUMANOS', theme: 'teal', url: 'https://drive.google.com/drive/folders/1QJFb_BOe3cgVg7Rg8iUKn5BWRiE_3vvu?usp=drive_link' },
  { id: 31, name: 'TREINAMENTOS PRONTOS', theme: 'cyan', url: 'https://drive.google.com/drive/folders/1LZytR9Fk1ZswTsN7l0sfoFEc1jnUy5kK?usp=drive_link' },
  { id: 32, name: 'VIDEOS', theme: 'sky', url: 'https://drive.google.com/drive/folders/1-R5aKLH4lp21w0Q5W-7KBm2oVQs7sFRh?usp=drive_link' },
];

// Initial Users
const initialUsers: User[] = [
  { id: '1', name: 'Administrador', email: 'admin@sst.com', password: 'master123', role: 'admin', createdAt: '01/01/2024' },
  { id: '2', name: 'Cliente Padrão', email: 'cliente@sst.com', password: 'sst123', role: 'user', createdAt: '10/05/2024' }
];

type PageView = 'landing' | 'login' | 'dashboard' | 'admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // State Persistence
  const [logs, setLogs] = useState<AccessLog[]>(() => {
    const saved = localStorage.getItem('sst_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [folders, setFolders] = useState<FolderItem[]>(() => {
    const saved = localStorage.getItem('sst_folders');
    return saved ? JSON.parse(saved) : initialFolders;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sst_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Effects
  useEffect(() => { localStorage.setItem('sst_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('sst_folders', JSON.stringify(folders)); }, [folders]);
  useEffect(() => { localStorage.setItem('sst_users', JSON.stringify(users)); }, [users]);

  // Buscar pastas do banco de dados
  useEffect(() => {
    fetch('/api/folders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Converter formato do banco para formato do app
          const dbFolders = data.map((f: any) => ({
            id: f.id,
            name: f.name,
            url: f.url || '#',
            theme: f.theme || 'green'
          }));
          setFolders(dbFolders);
          localStorage.setItem('sst_folders', JSON.stringify(dbFolders));
        }
      })
      .catch(err => console.log('Using local folders - API not available'));
  }, []);

  // Buscar usuários do banco de dados
  useEffect(() => {
    fetch('/api/auth/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Converter formato do banco para formato do app
          const dbUsers = data.map((u: any) => ({
            id: u.id.toString(),
            name: u.name,
            email: u.email,
            password: '', // Nunca armazenar senha
            role: u.role,
            createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : 'N/A'
          }));
          setUsers(dbUsers);
        }
      })
      .catch(err => console.log('Using local users - API not available'));
  }, []);

  // Registrar visita ao site (uma vez por sessão)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('sst_visited');
    if (!hasVisited && currentPage === 'landing') {
      fetch('/api/visits', { method: 'POST' })
        .then(() => sessionStorage.setItem('sst_visited', 'true'))
        .catch(err => console.log('Visit tracking not available'));
    }
  }, [currentPage]);

  // Login Logic - Conectado ao Banco de Dados com Segurança
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.user) {
        // Login bem sucedido via API
        const apiUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          password: '', // Nunca armazenar senha
          role: data.user.role,
          createdAt: new Date(data.user.createdAt).toLocaleDateString('pt-BR')
        };

        setIsAuthenticated(true);
        setCurrentUser(apiUser);

        if (apiUser.role === 'admin') {
          setCurrentPage('admin');
        } else {
          setCurrentPage('dashboard');
        }
        return;
      }

      // Se a API retornou erro
      if (data.error) {
        showToast(data.error, 'error');
        return;
      }

    } catch (error) {
      console.log('API not available, trying local fallback');

      // Fallback para localStorage se a API não estiver disponível
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);

        if (user.role === 'admin') {
          setCurrentPage('admin');
        } else {
          setCurrentPage('dashboard');
        }
      } else {
        showToast('E-mail ou senha inválidos.', 'error');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const logAccess = (folderName: string) => {
    const newLog: AccessLog = {
      user: currentUser?.email || 'Desconhecido',
      folder: folderName,
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  // --- Folder Management (CRUD) - Conectado ao Banco de Dados ---
  const handleAddFolder = async (newFolder: Omit<FolderItem, 'id'>) => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFolder)
      });
      const createdFolder = await response.json();
      if (createdFolder.id) {
        setFolders([...folders, {
          id: createdFolder.id,
          name: createdFolder.name,
          url: createdFolder.url || '#',
          theme: createdFolder.theme
        }]);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      // Fallback para localStorage
      const nextId = folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1;
      setFolders([...folders, { ...newFolder, id: nextId }]);
    }
  };

  const handleEditFolder = async (id: number, updatedData: Partial<FolderItem>) => {
    try {
      const folderToUpdate = folders.find(f => f.id === id);
      if (!folderToUpdate) return;

      const updatedFolder = { ...folderToUpdate, ...updatedData };
      await fetch(`/api/folders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFolder)
      });
      setFolders(folders.map(f => f.id === id ? { ...f, ...updatedData } : f));
    } catch (error) {
      console.error('Error updating folder:', error);
      // Fallback para localStorage
      setFolders(folders.map(f => f.id === id ? { ...f, ...updatedData } : f));
    }
  };

  const handleDeleteFolder = async (id: number) => {
    try {
      await fetch(`/api/folders/${id}`, { method: 'DELETE' });
      setFolders(folders.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
      // Fallback para localStorage
      setFolders(folders.filter(f => f.id !== id));
    }
  };

  // --- User Management (CRUD) - Conectado ao Banco de Dados ---
  const handleAddUser = async (newUser: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();

      if (data.success && data.user) {
        const createdUser: User = {
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          password: '', // Nunca armazenar senha
          role: data.user.role,
          createdAt: new Date(data.user.created_at).toLocaleDateString('pt-BR')
        };
        setUsers([...users, createdUser]);
        showToast('Usuário criado com sucesso!', 'success');
      } else if (data.error) {
        showToast('Erro: ' + data.error, 'error');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Fallback para localStorage
      const user: User = {
        ...newUser,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      setUsers([...users, user]);
    }
  };

  const handleEditUser = async (id: string, updatedData: Partial<User>) => {
    try {
      await fetch(`/api/auth/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      setUsers(users.map(u => u.id === id ? { ...u, ...updatedData } : u));
      showToast('Usuário atualizado!', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      setUsers(users.map(u => u.id === id ? { ...u, ...updatedData } : u));
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/auth/users/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.error) {
        showToast('Erro: ' + data.error, 'error');
        return;
      }

      setUsers(users.filter(u => u.id !== id));
      showToast('Usuário removido!', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleResetPassword = (email: string) => {
    showToast(`E-mail de redefinição enviado para ${email}`, 'success');
  };

  // Routing
  if (isAuthenticated) {
    if (currentPage === 'admin') {
      return (
        <AdminDashboard
          logs={logs}
          folders={folders}
          users={users}
          onLogout={handleLogout}
          onAddFolder={handleAddFolder}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onResetPassword={handleResetPassword}
        />
      );
    }
    if (currentPage === 'dashboard') {
      return <Dashboard folders={folders} onLogout={handleLogout} onFolderClick={logAccess} />;
    }
  }

  if (currentPage === 'login') {
    return <Login onBack={() => setCurrentPage('landing')} onLogin={handleLogin} />;
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar onLoginClick={() => setCurrentPage('login')} />
      <main>
        <Hero onBuyClick={() => {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }} />
        <Features />
        <Advantages />
        <SupportSection />
        <Pricing onBuyClick={() => setIsPaymentModalOpen(true)} />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-[100] animate-slideIn"
          style={{
            animation: 'slideIn 0.3s ease-out forwards'
          }}
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm ${toast.type === 'success'
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
            }`}>
            {toast.type === 'success'
              ? <CheckCircle2 className="w-5 h-5 text-green-500" />
              : <XCircle className="w-5 h-5 text-red-500" />
            }
            <span className={`font-medium text-sm ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
              {toast.message}
            </span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Toast Animation CSS */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default App;