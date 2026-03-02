import React, { useState, useEffect } from 'react';
import { Search, Folder, MoreVertical, ExternalLink, LogOut, CloudLightning, LayoutGrid, List as ListIcon, CheckCircle2, FileText, FileVideo, FileImage, File, ArrowLeft, Loader2, X, Download } from 'lucide-react';
import { FolderItem, User, DriveFile } from '../types';

// Helper para extrair ID da pasta da URL do Google Drive
const getFolderIdFromUrl = (url: string) => {
  if (!url) return null;
  const match = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

// Helper para formatar tamanho de arquivo
const formatFileSize = (size?: string) => {
  if (!size) return '';
  const bytes = parseInt(size);
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper para ícones de arquivos baseados no mimeType
const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('pdf')) return <FileText className="text-red-500" />;
  if (mimeType.includes('video')) return <FileVideo className="text-blue-500" />;
  if (mimeType.includes('image')) return <FileImage className="text-emerald-500" />;
  if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="text-blue-600" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileText className="text-green-600" />;
  return <File className="text-slate-400" />;
};

interface DashboardProps {
  folders: FolderItem[];
  currentUser: User | null;
  onLogout: () => void;
  onFolderClick: (folderName: string) => void;
  onDeleteUser?: (id: string) => void;
  onResetPassword?: (id: string) => void;
}

// Helper para mapear temas para classes CSS
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

export const Dashboard: React.FC<DashboardProps> = ({ folders, currentUser, onLogout, onFolderClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  // States for File Explorer
  const [currentFolderFiles, setCurrentFolderFiles] = useState<DriveFile[]>([]);
  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [openedFolder, setOpenedFolder] = useState<FolderItem | null>(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  // States for Drive Search
  const [driveSearchResults, setDriveSearchResults] = useState<DriveFile[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Effect for Global Drive Search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearchLoading(true);
        try {
          const res = await fetch(`/api/drive/search?q=${encodeURIComponent(searchTerm)}`);
          const data = await res.json();
          setDriveSearchResults(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Drive search error:', err);
        } finally {
          setIsSearchLoading(false);
        }
      } else {
        setDriveSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFolderClick = async (folder: FolderItem) => {
    setSelectedFolderId(folder.id);
    onFolderClick(folder.name);

    const folderId = getFolderIdFromUrl(folder.url);
    if (!folderId) {
      // Fallback para abertura externa se não for uma URL padrão de pasta
      if (folder.url && folder.url !== '#') {
        window.open(folder.url, '_blank');
      } else {
        alert(`A pasta "${folder.name}" ainda não possui um link configurado.`);
      }
      return;
    }

    // Se temos um ID de pasta, abrimos o explorador interno
    setOpenedFolder(folder);
    setIsFileModalOpen(true);
    setIsFilesLoading(true);
    setCurrentFolderFiles([]);

    try {
      const res = await fetch(`/api/drive/files/${folderId}`);
      const data = await res.json();
      setCurrentFolderFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setIsFilesLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Header Estilo Navbar Simplificado */}
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

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-gray-900 leading-none">{currentUser?.name || 'Usuário'}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {currentUser?.role === 'admin' ? 'Master' : 'Cliente'}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-all shadow-sm border border-red-100 group shrink-0"
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

        {/* Toolbar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl font-bold text-gray-800">Meus Arquivos</h2>
            <p className="text-sm text-gray-500 mt-1">Gerencie e acesse todos os seus documentos SST</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative group w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 border-0 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-sm"
                placeholder="O que você está procurando?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center bg-white rounded-xl p-1 border border-gray-200 shadow-sm shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Visualização em Grade"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Visualização em Lista"
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Drive Search Results (Global) */}
        {searchTerm.length > 2 && (
          <div className="mb-12 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CloudLightning className="text-brand-500" size={18} />
                Resultados no Drive para "{searchTerm}"
              </h3>
              {isSearchLoading && <Loader2 className="animate-spin text-brand-500" size={18} />}
            </div>

            {driveSearchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {driveSearchResults.map((file) => (
                  <a
                    key={file.id}
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-white rounded-xl border border-slate-100 hover:border-brand-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      {getFileIcon(file.mimeType)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-700 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-black">{formatFileSize(file.size) || 'Drive File'}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : !isSearchLoading && (
              <p className="text-slate-400 text-sm italic">Nenhum arquivo encontrado com este nome no Drive.</p>
            )}
            <div className="h-px bg-slate-100 w-full my-8"></div>
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Categorias</h3>
        </div>

        {/* View Content */}
        {viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredFolders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;
              const styles = getThemeClasses(folder.theme);

              return (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`
                    group relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-300
                    ${isSelected
                      ? 'ring-2 ring-brand-500 shadow-lg scale-[1.02] bg-brand-50/30'
                      : 'border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-gray-200'
                    }
                  `}
                >
                  {/* Selection Checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-brand-600 animate-fadeIn">
                      <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                    </div>
                  )}

                  <div className="flex flex-col h-full justify-between">
                    <div className="mb-4">
                      <div className={`
                        inline-flex items-center justify-center p-3.5 rounded-2xl mb-4 transition-transform group-hover:scale-110 duration-300
                        ${styles.bg} ${styles.color} shadow-sm
                      `}>
                        <Folder className="w-8 h-8 fill-current opacity-90" />
                      </div>

                      <h3 className={`font-bold text-sm leading-snug truncate pr-6 ${isSelected ? 'text-brand-700' : 'text-gray-700'}`}>
                        {folder.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1 font-medium">Google Drive</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 group-hover:text-brand-500 transition-colors">
                        Acessar
                      </span>
                      <ExternalLink size={14} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Origem</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Acesso</th>
                    <th scope="col" className="relative px-6 py-4"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredFolders.map((folder) => {
                    const isSelected = selectedFolderId === folder.id;
                    const styles = getThemeClasses(folder.theme);

                    return (
                      <tr
                        key={folder.id}
                        onClick={() => handleFolderClick(folder)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-brand-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${styles.bg}`}>
                              <Folder className={`h-5 w-5 ${styles.color} fill-current`} />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-bold ${isSelected ? 'text-brand-700' : 'text-gray-900'}`}>{folder.name}</div>
                              <div className="text-xs text-gray-400 md:hidden">Google Drive</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-gray-500">Google Drive</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-500">Link Externo</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isSelected && <CheckCircle2 size={18} className="text-brand-600 inline-block mr-2" />}
                          <button className="text-gray-400 hover:text-brand-600">
                            <ExternalLink size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredFolders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mt-6">
            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
              <Folder className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma pasta encontrada</h3>
            <p className="text-gray-500 mt-1">Tente buscar por outro termo.</p>
          </div>
        )}

      </main>

      {/* Internal File Explorer Modal */}
      {isFileModalOpen && openedFolder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsFileModalOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slideUp">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${getThemeClasses(openedFolder.theme).bg} ${getThemeClasses(openedFolder.theme).color} shadow-sm`}>
                  <Folder size={22} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 leading-none">{openedFolder.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-brand-600 font-black uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-full">Drive Interno</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {currentFolderFiles.length} itens</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white custom-scrollbar">
              {isFilesLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-5">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-800 font-black text-lg">Consultando arquivos...</p>
                    <p className="text-slate-400 text-sm mt-1">Isso pode levar alguns segundos dependendo da conexão.</p>
                  </div>
                </div>
              ) : currentFolderFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentFolderFiles.map((file) => (
                    <div
                      key={file.id}
                      className="group flex flex-col p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/10 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors shadow-sm group-hover:shadow-md">
                          <div className="group-hover:scale-110 transition-transform duration-300">
                            {getFileIcon(file.mimeType)}
                          </div>
                        </div>
                        <div className="flex gap-1 group-hover:translate-x-0 translate-x-1 opacity-0 group-hover:opacity-100 transition-all">
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-brand-100"
                            title="Abrir no Google Drive"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </div>

                      <div className="mb-5 flex-1 pr-2">
                        <h4 className="text-sm font-black text-slate-800 line-clamp-2 mb-2 group-hover:text-brand-700 transition-colors leading-relaxed">
                          {file.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] py-1 px-2.5 bg-slate-100 text-slate-500 rounded-lg font-black uppercase tracking-tighter">
                            {file.mimeType.split('/').pop()?.split('.').pop() || 'File'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>

                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-slate-50 group-hover:bg-brand-500 text-slate-700 group-hover:text-white rounded-2xl text-center text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-brand-500/20"
                      >
                        Visualizar Conteúdo
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <FileText size={40} className="text-slate-200" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xl">Pasta Vazia</h4>
                  <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Nenhum arquivo ou documento foi encontrado nesta categoria no Drive.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                  Conectado ao Drive de Segurança
                </span>
              </div>
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="px-6 py-2.5 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
              >
                Fechar Explorador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};