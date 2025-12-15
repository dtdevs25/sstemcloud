import React, { useState } from 'react';
import { Search, Folder, MoreVertical, ExternalLink, LogOut, CloudLightning, LayoutGrid, List as ListIcon, CheckCircle2 } from 'lucide-react';
import { FolderItem } from '../types';

interface DashboardProps {
  folders: FolderItem[];
  onLogout: () => void;
  onFolderClick: (folderName: string) => void;
}

// Helper para mapear temas para classes CSS (caso não venha do suporte legado)
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

export const Dashboard: React.FC<DashboardProps> = ({ folders, onLogout, onFolderClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFolderClick = (folder: FolderItem) => {
    setSelectedFolderId(folder.id);
    onFolderClick(folder.name);
    
    // Abre o link em nova aba se existir
    if (folder.url && folder.url !== '#') {
      window.open(folder.url, '_blank');
    } else {
      // Feedback visual se não houver link
      alert(`A pasta "${folder.name}" ainda não possui um link configurado pelo administrador.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-2.5 rounded-xl text-white shadow-lg shadow-brand-500/30">
                <CloudLightning size={22} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-2xl text-gray-800 tracking-tight">
              SSTem<span className="text-brand-600">Cloud</span>
            </span>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all sm:text-sm shadow-inner"
                placeholder="Pesquisar arquivos e pastas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Profile / Avatar (Opcional) */}
             <div className="hidden sm:flex items-center gap-2 mr-2">
               <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                 US
               </div>
             </div>

            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-200 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-sm"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toolbar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Meus Arquivos</h2>
            <p className="text-sm text-gray-500 mt-1">Gerencie e acesse todos os seus documentos SST</p>
          </div>
          
          <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Visualização em Grade"
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Visualização em Lista"
            >
              <ListIcon size={20} />
            </button>
          </div>
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
    </div>
  );
};