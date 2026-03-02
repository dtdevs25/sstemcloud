import React, { useState, useEffect } from 'react';
import {
  LogOut, Search, Activity, Layout, Users, Plus, Edit2, Trash2, Folder,
  CheckCircle2, FolderOpen, Save, X, Mail, Key, CloudLightning,
  LayoutGrid, List as ListIcon, Calendar, ExternalLink, Eye,
  User as LucideUser, FileText
} from 'lucide-react';
import { AccessLog, FolderItem, FolderTheme, User } from '../types';

interface AdminDashboardProps {
  logs: AccessLog[];
  folders: FolderItem[];
  users: User[];
  onLogout: () => void;
  // Folder Actions
  onAddFolder: (folder: Omit<FolderItem, 'id'>) => void;
  onEditFolder: (id: number, folder: Partial<FolderItem>) => void;
  onDeleteFolder: (id: number) => void;
  // User Actions
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onEditUser: (id: string, user: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
  onResetPassword: (id: string) => void;
  currentUser: User | null;
}

const themeOptions: { value: FolderTheme; label: string; class: string }[] = [
  { value: 'green', label: 'Verde', class: 'bg-green-500' },
  { value: 'red', label: 'Vermelho', class: 'bg-red-500' },
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'orange', label: 'Laranja', class: 'bg-orange-500' },
  { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
  { value: 'sky', label: 'Céu', class: 'bg-sky-500' },
  { value: 'teal', label: 'Verde Água', class: 'bg-teal-500' },
  { value: 'indigo', label: 'Índigo', class: 'bg-indigo-500' },
  { value: 'gray', label: 'Cinza', class: 'bg-gray-500' },
];

// Helper para classes CSS de pastas
const getThemeClasses = (theme: string) => {
  const themes: Record<string, { color: string; bg: string; border: string }> = {
    green: { color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
    red: { color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' },
    blue: { color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
    orange: { color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200' },
    purple: { color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200' },
    gray: { color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' },
    pink: { color: 'text-pink-500', bg: 'bg-pink-100', border: 'border-pink-200' },
    cyan: { color: 'text-cyan-500', bg: 'bg-cyan-100', border: 'border-cyan-200' },
    amber: { color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
    lime: { color: 'text-lime-600', bg: 'bg-lime-100', border: 'border-lime-200' },
    emerald: { color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    teal: { color: 'text-teal-600', bg: 'bg-teal-100', border: 'border-teal-200' },
    rose: { color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-200' },
    yellow: { color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    sky: { color: 'text-sky-500', bg: 'bg-sky-100', border: 'border-sky-200' },
    indigo: { color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-200' },
  };
  return themes[theme] || themes.green;
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  logs,
  folders,
  users,
  onLogout,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onResetPassword,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'content' | 'users'>('users');

  // --- Site Visits State ---
  const [siteVisits, setSiteVisits] = useState({ total: 0, today: 0 });

  // Fetch site visits on mount
  useEffect(() => {
    fetch('/api/visits')
      .then(res => res.json())
      .then(data => setSiteVisits({ total: data.total || 0, today: data.today || 0 }))
      .catch(() => setSiteVisits({ total: 0, today: 0 }));

    // No App.tsx já existe uma lógica de logs em memória, 
    // mas aqui no Admin vamos buscar o histórico real do banco
    if (activeTab === 'logs') {
      fetch('/api/logs')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Atualizar o estado no componente pai ou localmente se necessário
            // Por enquanto, o App.tsx gerencia logs, mas podemos implementar fetch local aqui se preferir
          }
        })
        .catch(err => console.error('Error fetching logs:', err));
    }
  }, [activeTab]);

  // --- View States ---
  const [folderViewMode, setFolderViewMode] = useState<'grid' | 'list'>('grid');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [logSearchTerm, setLogSearchTerm] = useState('');

  // Filter Logs
  const filteredLogs = logs.filter(log =>
    log.user?.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
    log.folder?.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
    log.timestamp?.toLowerCase().includes(logSearchTerm.toLowerCase())
  );

  // --- Folder Modal States ---
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);
  const [folderForm, setFolderForm] = useState({ name: '', url: '', theme: 'green' as FolderTheme });

  // --- Delete Confirmation Modal State (Folders) ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<FolderItem | null>(null);

  // --- Delete Confirmation Modal State (Users) ---
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // --- User Modal States ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'user' as 'user' | 'admin' });
  const [createdTempPassword, setCreatedTempPassword] = useState<string | null>(null);
  const [isUserSuccessModalOpen, setIsUserSuccessModalOpen] = useState(false);

  // Filter Users
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // --- Handlers Folders ---
  const handleOpenFolderModal = (folder?: FolderItem) => {
    if (folder) {
      setEditingFolder(folder);
      setFolderForm({ name: folder.name, url: folder.url, theme: folder.theme });
    } else {
      setEditingFolder(null);
      setFolderForm({ name: '', url: '', theme: 'green' });
    }
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFolder) {
      onEditFolder(editingFolder.id, folderForm);
    } else {
      onAddFolder(folderForm);
    }
    setIsFolderModalOpen(false);
  };

  // Abrir modal de confirmação de exclusão
  const handleOpenDeleteModal = (folder: FolderItem) => {
    setFolderToDelete(folder);
    setIsDeleteModalOpen(true);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (folderToDelete) {
      onDeleteFolder(folderToDelete.id);
      setFolderToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // --- Handlers Users ---
  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      // Nota: Não preenchemos a senha ao editar para manter segurança, só se o admin quiser redefinir manualmente
      setUserForm({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'user' });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      if (!userForm.password) {
        const { password, ...userWithoutPassword } = userForm;
        onEditUser(editingUser.id, userWithoutPassword);
      } else {
        onEditUser(editingUser.id, userForm);
      }
      setIsUserModalOpen(false);
    } else {
      // Create new user (temporary password logic handled by backend)
      try {
        const response = await fetch('/api/auth/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm)
        });
        const data = await response.json();
        if (data.success) {
          onAddUser(data.user); // No need to re-fetch or clear entire state if the component handles it
          setCreatedTempPassword(data.tempPassword);
          setIsUserModalOpen(false);
          setIsUserSuccessModalOpen(true);
        } else {
          alert(data.error || 'Erro ao criar usuário');
        }
      } catch (err) {
        console.error('Error creating user:', err);
        alert('Falha na comunicação com o servidor');
      }
    }
  };

  // Abrir modal de confirmação de exclusão de usuário
  const handleOpenDeleteUserModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  // Confirmar exclusão de usuário
  const handleConfirmDeleteUser = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      setUserToDelete(null);
      setIsDeleteUserModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Header Admin Estilo Navbar Simplificado */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer group">
                <img
                  src="/logo.png"
                  alt="Logo SST em Cloud"
                  className="h-10 w-auto mr-3 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="font-extrabold text-xl text-gray-900 tracking-tight group-hover:text-brand-700 transition-colors">
                  SST em <span className="text-brand-500">CLOUD</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900 leading-none">{currentUser?.name || 'Administrador'}</span>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mt-1">
                  Master
                </span>
              </div>

              <button
                onClick={onLogout}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-all shadow-sm border border-red-100 group"
                title="Sair"
              >
                <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs */}
        <div className="flex space-x-1 sm:space-x-4 mb-8 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'users' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={18} /> Clientes
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'content' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Layout size={18} /> Conteúdo do Drive
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'logs' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Activity size={18} /> Monitoramento (Logs)
          </button>
        </div>

        {/* --- TAB: LOGS --- */}
        {activeTab === 'logs' && (
          <div className="animate-fadeIn">
            {/* Header Section */}
            {/* Stats Dashboard for Logs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
                <span className="text-3xl font-black text-sky-600 mb-1">{siteVisits.total}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Eye size={12} /> Visitas Total
                </span>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
                <span className="text-3xl font-black text-emerald-600 mb-1">{siteVisits.today}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acessos Hoje</span>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
                <span className="text-3xl font-black text-slate-900 mb-1">{filteredLogs.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logs Filtrados</span>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-3xl font-black text-green-600 uppercase">ON</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Sistema</span>
              </div>
            </div>

            {/* Header Section with Title and Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Histórico de Atividade</h1>
                <p className="text-slate-500 text-sm">Monitore todas as interações dos usuários com as pastas do Drive.</p>
              </div>

              <div className="relative group w-full lg:w-80">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border-0 bg-white shadow-sm ring-1 ring-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:ring-offset-0 transition-all text-sm"
                  placeholder="Pesquisar por usuário ou pasta..."
                  value={logSearchTerm}
                  onChange={(e) => setLogSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Logs Table */}
            {/* Logs Table with Modern Design */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasta Acessada</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Data e Hora</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {[...filteredLogs].reverse().map((log, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-black text-xs uppercase mr-3 border border-brand-100/50 group-hover:scale-105 transition-transform">
                              {log.user.substring(0, 2)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900 leading-none">{log.user.split('@')[0]}</span>
                              <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">{log.user}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-semibold text-slate-700">
                              {log.folder}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-xs text-slate-500 font-mono tracking-tighter">
                          {log.timestamp}
                        </td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-slate-50 rounded-full">
                              <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold text-sm">Nenhum registro encontrado para sua busca.</p>
                            <button
                              onClick={() => setLogSearchTerm('')}
                              className="text-brand-600 font-bold text-xs uppercase hover:underline"
                            >
                              Limpar Filtros
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: CONTENT (FOLDERS) --- */}
        {activeTab === 'content' && (
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Gerenciar Pastas</h1>
                <p className="text-slate-500">Adicione, edite ou remova pastas do painel do cliente.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                  <button
                    onClick={() => setFolderViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${folderViewMode === 'grid' ? 'bg-slate-100 text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Grade"
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button
                    onClick={() => setFolderViewMode('list')}
                    className={`p-2 rounded-md transition-all ${folderViewMode === 'list' ? 'bg-slate-100 text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Lista"
                  >
                    <ListIcon size={20} />
                  </button>
                </div>

                <button
                  onClick={() => handleOpenFolderModal()}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
                >
                  <Plus size={18} /> Nova Pasta
                </button>
              </div>
            </div>

            {/* Folder View Content */}
            {folderViewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {folders.map((folder) => {
                  const styles = getThemeClasses(folder.theme);

                  return (
                    <div
                      key={folder.id}
                      className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Action Buttons Overlay */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-slate-100">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenFolderModal(folder); }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar Pasta"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(folder); }}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Excluir Pasta"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex flex-col h-full justify-between pointer-events-none">
                        <div className="mb-4">
                          <div className={`
                            inline-flex items-center justify-center p-3.5 rounded-2xl mb-4
                            ${styles.bg} ${styles.color} shadow-sm
                            `}>
                            <Folder className="w-8 h-8 fill-current opacity-90" />
                          </div>

                          <h3 className="font-bold text-sm leading-snug truncate text-slate-700">
                            {folder.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                            {folder.url || 'Sem link'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Google Drive
                          </span>
                          <FolderOpen size={14} className="text-slate-300" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full divide-y divide-slate-100" style={{ minWidth: '600px' }}>
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nome da Pasta</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Link de Destino</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider" style={{ minWidth: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {folders.map((folder) => {
                      const styles = getThemeClasses(folder.theme);
                      return (
                        <tr key={folder.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${styles.bg}`}>
                                <Folder className={`h-5 w-5 ${styles.color} fill-current`} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-slate-900">{folder.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-slate-500 max-w-xs truncate">
                              <ExternalLink size={14} />
                              <span className="truncate">{folder.url || 'Não configurado'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenFolderModal(folder)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleOpenDeleteModal(folder)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {folders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 mt-4">
                <p className="text-slate-400">Nenhuma pasta criada.</p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: USERS --- */}
        {activeTab === 'users' && (
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Gerenciar Usuários</h1>
                <p className="text-slate-500">Controle quem tem acesso ao sistema SST.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative group w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all sm:text-sm shadow-sm"
                    placeholder="Buscar cliente..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => handleOpenUserModal()}
                  className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm whitespace-nowrap"
                >
                  <Plus size={18} /> Novo Usuário
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nome / Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Data da Compra</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Função</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{user.name}</span>
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                              <Mail size={12} className="mr-1.5 opacity-70" /> {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar size={14} className="text-slate-400" />
                            <span>{user.createdAt}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                              Admin Master
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              Cliente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => onResetPassword(user.email)}
                              className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Resetar Senha"
                            >
                              <Key size={18} />
                            </button>
                            <button
                              onClick={() => handleOpenUserModal(user)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar Usuário"
                            >
                              <Edit2 size={18} />
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleOpenDeleteUserModal(user)}
                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir Usuário"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                          Nenhum usuário encontrado para "{userSearchTerm}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- FOLDER MODAL --- */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {editingFolder ? 'Editar Pasta' : 'Nova Pasta'}
              </h3>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Pasta</label>
                <input
                  type="text"
                  required
                  value={folderForm.name}
                  onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                  placeholder="Ex: Documentos 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link de Redirecionamento</label>
                <input
                  type="url"
                  value={folderForm.url}
                  onChange={(e) => setFolderForm({ ...folderForm, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Tema</label>
                <div className="flex flex-wrap gap-2">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setFolderForm({ ...folderForm, theme: theme.value })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${folderForm.theme === theme.value ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'} ${theme.class}`}
                      title={theme.label}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- USER MODAL (Modernized) --- */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsUserModalOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slideUp border border-white/20">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-500 text-white rounded-2xl shadow-lg shadow-brand-500/30">
                  <LucideUser size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 leading-none">
                    {editingUser ? 'Editar Perfil' : 'Novo Cliente'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-[0.2em] font-black">
                    {editingUser ? 'Atualizar credenciais' : 'Cadastro de Acesso'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-200/50 rounded-full transition-all text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:bg-white text-slate-700 font-bold placeholder-slate-300 transition-all outline-none"
                    placeholder="Nome do cliente ou empresa"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email de Acesso</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:bg-white text-slate-700 font-bold placeholder-slate-300 transition-all outline-none"
                    placeholder="email@exemplo.com"
                  />
                </div>

                {editingUser ? (
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Alterar Senha (Opcional)</label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:bg-white text-slate-700 font-bold placeholder-slate-300 transition-all outline-none"
                      placeholder="Deixe vazio para não alterar"
                    />
                  </div>
                ) : (
                  <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100/50 flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-800 uppercase tracking-wide">Senha Temporária</h4>
                      <p className="text-[11px] text-amber-600 font-medium mt-1 leading-relaxed">
                        Uma senha segura será gerada automaticamente e enviada para o e-mail do cliente ao salvar.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nível de Permissão</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserForm({ ...userForm, role: 'user' })}
                      className={`py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${userForm.role === 'user' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      Cliente
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserForm({ ...userForm, role: 'admin' })}
                      className={`py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${userForm.role === 'admin' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      Master
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-brand-500/20 hover:-translate-y-1 uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <Save size={18} />
                  {editingUser ? 'Atualizar' : 'Criar Acesso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- USER SUCCESS MODAL --- */}
      {isUserSuccessModalOpen && createdTempPassword && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30 flex items-center justify-center mx-auto mb-6 scale-110">
                <CheckCircle2 size={40} />
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-2">Usuário Criado!</h3>
              <p className="text-slate-400 font-medium mb-8">O cliente foi cadastrado e os dados de acesso foram enviados por e-mail.</p>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Senha Temporária Gerada</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-black text-brand-600 tracking-[0.2em] font-mono">{createdTempPassword}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdTempPassword);
                      alert('Senha copiada para a área de transferência!');
                    }}
                    className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-brand-500 transition-all border border-slate-100"
                    title="Copiar Senha"
                  >
                    <FileText size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsUserSuccessModalOpen(false);
                  setCreatedTempPassword(null);
                }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && folderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-red-50">
              <h3 className="font-bold text-lg text-red-700 flex items-center gap-2">
                <Trash2 size={20} />
                Confirmar Exclusão
              </h3>
            </div>

            <div className="p-6">
              <div className="bg-red-100 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-800 font-medium text-sm">
                  ⚠️ <strong>Atenção:</strong> Esta ação não pode ser desfeita!
                </p>
              </div>

              <p className="text-gray-700 mb-2">
                Você está prestes a excluir a pasta:
              </p>
              <p className="font-bold text-gray-900 text-lg mb-4 bg-gray-100 p-3 rounded-lg">
                📁 {folderToDelete.name}
              </p>
              <p className="text-gray-600 text-sm">
                A pasta será <strong>permanentemente removida</strong> do banco de dados e todos os usuários perderão acesso a ela.
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                type="button"
                onClick={() => { setIsDeleteModalOpen(false); setFolderToDelete(null); }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Excluir Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE USER CONFIRMATION MODAL --- */}
      {isDeleteUserModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-red-50">
              <h3 className="font-bold text-lg text-red-700 flex items-center gap-2">
                <Trash2 size={20} />
                Confirmar Exclusão de Usuário
              </h3>
            </div>

            <div className="p-6">
              <div className="bg-red-100 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-800 font-medium text-sm">
                  ⚠️ <strong>Atenção:</strong> Esta ação não pode ser desfeita!
                </p>
              </div>

              <p className="text-gray-700 mb-2">
                Você está prestes a excluir o usuário:
              </p>
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <p className="font-bold text-gray-900">{userToDelete.name}</p>
                <p className="text-gray-600 text-sm">{userToDelete.email}</p>
              </div>
              <p className="text-gray-600 text-sm">
                O usuário <strong>perderá acesso imediatamente</strong> ao sistema.
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                type="button"
                onClick={() => { setIsDeleteUserModalOpen(false); setUserToDelete(null); }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Excluir Usuário
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};