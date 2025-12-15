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

// Initial Mock Data Folders
const initialFolders: FolderItem[] = [
  { id: 1, name: 'ARTIGOS', theme: 'green', url: '#' },
  { id: 2, name: 'BÔNUS 1', theme: 'red', url: '#' },
  { id: 3, name: 'BÔNUS 2', theme: 'orange', url: '#' },
  { id: 4, name: 'BÔNUS 3', theme: 'green', url: '#' },
  { id: 5, name: 'CARTILHAS - LIVROS E...', theme: 'green', url: '#' },
  { id: 6, name: 'CAT - COMUNICADO D...', theme: 'amber', url: '#' },
  { id: 7, name: 'CERTIFICADOS', theme: 'lime', url: '#' },
  { id: 8, name: 'CHECK LIST', theme: 'purple', url: '#' },
  { id: 9, name: 'CIPA', theme: 'red', url: '#' },
  { id: 10, name: 'COVID-19', theme: 'blue', url: '#' },
  { id: 11, name: 'DIÁLOGOS DE...', theme: 'rose', url: '#' },
  { id: 12, name: 'DICAS', theme: 'orange', url: '#' },
  { id: 13, name: 'DIVULGAÇÃO', theme: 'emerald', url: '#' },
  { id: 14, name: 'ERGONOMIA', theme: 'orange', url: '#' },
  { id: 15, name: 'FOTOS PARA...', theme: 'blue', url: '#' },
  { id: 16, name: 'FUNDACENTRO', theme: 'green', url: '#' },
  { id: 17, name: 'INFOGRÁFICOS', theme: 'orange', url: '#' },
  { id: 18, name: 'LAUDOS', theme: 'red', url: '#' },
  { id: 19, name: 'LIBERAÇÕES DE...', theme: 'pink', url: '#' },
  { id: 20, name: 'MEIO AMBIENTE', theme: 'amber', url: '#' },
  { id: 21, name: 'ORDENS DE SERVIÇO', theme: 'red', url: '#' },
  { id: 22, name: 'PCA - PROGRAMA DE...', theme: 'yellow', url: '#' },
  { id: 23, name: 'PCMAT - PROGRAMA D...', theme: 'green', url: '#' },
  { id: 24, name: 'PCMSO - PROGRAMA ...', theme: 'purple', url: '#' },
  { id: 25, name: 'PGR - PROGRAMA DE...', theme: 'orange', url: '#' },
  { id: 26, name: 'PPP - PERFIL...', theme: 'lime', url: '#' },
  { id: 27, name: 'PPR - PROGRAMA DE...', theme: 'orange', url: '#' },
  { id: 28, name: 'PPRA - PROGRAMA DE...', theme: 'indigo', url: '#' },
  { id: 29, name: 'PROCEDIMENTOS', theme: 'emerald', url: '#' },
  { id: 30, name: 'QUALIDADE', theme: 'gray', url: '#' },
  { id: 31, name: 'RECURSOS HUMANOS', theme: 'teal', url: '#' },
  { id: 32, name: 'TREINAMENTOS...', theme: 'cyan', url: '#' },
  { id: 33, name: 'VIDEOS', theme: 'sky', url: '#' },
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

  // Login Logic
  const handleLogin = (email: string, password: string) => {
    // Busca usuário
    const user = users.find(u => u.email === email && u.password === password);

    // Fallback para hardcoded master caso o usuario tenha sido deletado por engano no localStorage
    if (!user && email === 'admin@sst.com' && password === 'master123') {
       const masterUser: User = { id: '0', name: 'Master Fallback', email: 'admin@sst.com', password: 'master123', role: 'admin', createdAt: 'N/A' };
       setIsAuthenticated(true);
       setCurrentUser(masterUser);
       setCurrentPage('admin');
       return;
    }

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      
      if (user.role === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('dashboard');
      }
    } else {
      alert('E-mail ou senha inválidos.');
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

  // --- Folder Management (CRUD) ---
  const handleAddFolder = (newFolder: Omit<FolderItem, 'id'>) => {
    const nextId = folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1;
    setFolders([...folders, { ...newFolder, id: nextId }]);
  };

  const handleEditFolder = (id: number, updatedData: Partial<FolderItem>) => {
    setFolders(folders.map(f => f.id === id ? { ...f, ...updatedData } : f));
  };

  const handleDeleteFolder = (id: number) => {
    setFolders(folders.filter(f => f.id !== id));
  };

  // --- User Management (CRUD) ---
  const handleAddUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString('pt-BR')
    };
    setUsers([...users, user]);
  };

  const handleEditUser = (id: string, updatedData: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updatedData } : u));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleResetPassword = (email: string) => {
    alert(`Simulação: Um e-mail de redefinição de senha foi enviado para ${email}.`);
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
        <Hero onBuyClick={() => setIsPaymentModalOpen(true)} />
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
    </div>
  );
};

export default App;