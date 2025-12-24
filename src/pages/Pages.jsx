import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, LayoutGrid, List, ArrowUpDown, Filter, Smartphone, 
  Tablet, Monitor, MoreHorizontal, Box, Activity, Database, Bug,
  ShieldAlert, PenTool, Layers, Lock, Plus, Image, ChevronDown, Cpu
} from 'lucide-react';
import TechStackView from '../components/pages/TechStackView';

export default function Pages() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProject, setSelectedProject] = useState(null);
  const [deviceView, setDeviceView] = useState('desktop');
  const [activeView, setActiveView] = useState('pages');

  const { data: pages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list('-updated_date')
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const { data: features = [] } = useQuery({
    queryKey: ['features'],
    queryFn: () => base44.entities.Feature.list()
  });

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: () => base44.entities.Todo.list()
  });

  // Filter pages by selected project and separate parent/child pages
  const allFilteredPages = selectedProject 
    ? pages.filter(p => p.project === selectedProject)
    : pages;
  
  // Separate parent pages (no parent_page) and subpages (has parent_page)
  const parentPages = allFilteredPages.filter(p => !p.parent_page);
  const subpages = allFilteredPages.filter(p => p.parent_page);
  
  // Group subpages by parent
  const subpagesByParent = subpages.reduce((acc, subpage) => {
    const parentId = subpage.parent_page;
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(subpage);
    return acc;
  }, {});
  
  // For display, we'll show parent pages with their subpages
  const filteredPages = parentPages;

  const getStatusColor = (status) => {
    const colors = {
      'Todo': 'bg-purple-50 text-purple-700 border-purple-100/50',
      'Doing': 'bg-blue-50 text-blue-700 border-blue-100/50',
      'Done': 'bg-green-50 text-green-700 border-green-100/50'
    };
    return colors[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Todo': 'Design',
      'Doing': 'Building',
      'Done': 'Complete'
    };
    return labels[status] || status;
  };

  const getProgressColor = (status) => {
    const colors = {
      'Todo': 'bg-purple-400',
      'Doing': 'bg-blue-500',
      'Done': 'bg-green-500'
    };
    return colors[status] || 'bg-slate-400';
  };

  const getPageProgress = (pageId) => {
    const pageTodos = todos.filter(t => t.page === pageId);
    if (pageTodos.length === 0) return 0;
    const completed = pageTodos.filter(t => t.completed).length;
    return Math.round((completed / pageTodos.length) * 100);
  };

  const getPageFeatures = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    if (!page || !page.linked_features) return [];
    return features.filter(f => page.linked_features.includes(f.id));
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const totalFeatures = filteredPages.reduce((sum, page) => sum + getPageFeatures(page.id).length, 0);
  const testedPages = filteredPages.filter(p => p.status === 'Done').length;
  const testPercentage = filteredPages.length > 0 ? Math.round((testedPages / filteredPages.length) * 100) : 0;

  return (
    <div className="flex-1 flex overflow-hidden">
      {activeView === 'techstack' ? (
        <TechStackView />
      ) : (
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-6 py-8 pb-20">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
            <Link to={createPageUrl('Projects')} className="hover:text-slate-900 transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {selectedProjectData && (
              <>
                <span className="text-slate-900">{selectedProjectData.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </>
            )}
            <span className="text-slate-900">Pages</span>
          </div>

          {/* Header Section */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Pages</h1>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <span>{filteredPages.length} pages</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{totalFeatures} features</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-green-600 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> {testPercentage}% complete
                </span>
              </div>
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Flow Builder Button */}
              <button
                onClick={() => navigate(createPageUrl('FlowBuilder'))}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm text-xs font-medium transition-colors"
              >
                <Layers className="w-3.5 h-3.5" /> Flow Builder
              </button>

              {/* Project Selector */}
              <div className="relative">
                <select
                  value={selectedProject || ''}
                  onChange={(e) => setSelectedProject(e.target.value || null)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors pr-8 appearance-none cursor-pointer"
                >
                  <option value="">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="h-8 w-px bg-slate-200 mx-1"></div>

              {/* Device Preview Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200/50">
                <button 
                  onClick={() => setDeviceView('mobile')}
                  className={`p-1.5 rounded-md transition-all ${
                    deviceView === 'mobile' 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeviceView('tablet')}
                  className={`p-1.5 rounded-md transition-all ${
                    deviceView === 'tablet' 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2 py-1.5 rounded-md transition-all ${
                    deviceView === 'desktop' 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                  } text-[10px] font-bold flex items-center gap-1.5`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
              </div>
            </div>
          </header>

          {/* Pages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {filteredPages.map((page) => {
              const progress = getPageProgress(page.id);
              const pageFeatures = getPageFeatures(page.id);
              const pageTodos = todos.filter(t => t.page === page.id);
              const bugs = pageTodos.filter(t => !t.completed && t.task?.toLowerCase().includes('bug')).length;

              return (
                <div key={page.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden border-b border-slate-100 flex items-center justify-center">
                    {page.frontend_code ? (
                      <div 
                        className={`bg-white shadow-lg overflow-hidden ${
                          deviceView === 'mobile' ? 'w-[90px] h-[160px] rounded-[12px] border-[3px] border-slate-800' :
                          deviceView === 'tablet' ? 'w-[140px] h-[187px] rounded-[10px] border-[3px] border-slate-800' :
                          'w-full h-full'
                        }`}
                      >
                        <div 
                          className="w-full h-full overflow-hidden"
                          style={{
                            transform: deviceView === 'mobile' ? 'scale(0.24)' : deviceView === 'tablet' ? 'scale(0.18)' : 'scale(0.25)',
                            transformOrigin: 'top left',
                            width: deviceView === 'mobile' ? '417%' : deviceView === 'tablet' ? '556%' : '400%',
                            height: deviceView === 'mobile' ? '417%' : deviceView === 'tablet' ? '556%' : '400%'
                          }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: page.frontend_code }} />
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={`bg-white shadow-sm border border-slate-200/60 overflow-hidden flex flex-col ${
                          deviceView === 'mobile' ? 'w-[90px] h-[160px] rounded-[12px]' :
                          deviceView === 'tablet' ? 'w-[140px] h-[187px] rounded-[10px]' :
                          'absolute inset-4 rounded-lg'
                        }`}
                        style={{
                          backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                          backgroundSize: '12px 12px'
                        }}
                      >
                        {/* Simulated UI */}
                        <div className={`border-b border-slate-100 flex items-center px-2 gap-1 ${deviceView === 'mobile' ? 'h-4' : deviceView === 'tablet' ? 'h-6' : 'h-8 px-3 gap-2'}`}>
                          <div className={`bg-slate-200 rounded-full ${deviceView === 'mobile' ? 'w-8 h-1' : deviceView === 'tablet' ? 'w-12 h-1.5' : 'w-16 h-2'}`}></div>
                          <div className="flex-1"></div>
                          <div className={`bg-slate-200 rounded-full ${deviceView === 'mobile' ? 'w-2 h-2' : deviceView === 'tablet' ? 'w-3 h-3' : 'w-4 h-4'}`}></div>
                        </div>
                        <div className={`grid grid-cols-2 gap-1 ${deviceView === 'mobile' ? 'p-1.5' : deviceView === 'tablet' ? 'p-2' : 'p-3 gap-2'}`}>
                          <div className={`bg-blue-50/50 rounded border border-blue-100 ${deviceView === 'mobile' ? 'h-8' : deviceView === 'tablet' ? 'h-12' : 'h-16'}`}></div>
                          <div className={`bg-slate-50 rounded border border-slate-100 ${deviceView === 'mobile' ? 'h-8' : deviceView === 'tablet' ? 'h-12' : 'h-16'}`}></div>
                          <div className={`col-span-2 bg-slate-50 rounded border border-slate-100 ${deviceView === 'mobile' ? 'h-10' : deviceView === 'tablet' ? 'h-16' : 'h-20'}`}></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Link
                        to={createPageUrl('PageDetail') + '?id=' + page.id}
                        className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-xs shadow-md border border-slate-200 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      >
                        View Page
                      </Link>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm ${getStatusColor(page.status)}`}>
                        {page.status === 'Doing' && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                          </span>
                        )}
                        {page.status === 'Done' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                        {page.status === 'Todo' && <PenTool className="w-3 h-3" />}
                        {getStatusLabel(page.status)}
                      </span>
                    </div>

                    {/* Bug Badge */}
                    {bugs > 0 && (
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white text-red-600 border border-red-100 shadow-sm">
                          <Bug className="w-3 h-3" /> {bugs}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-base mb-0.5">{page.name}</h3>
                        <div className="text-xs text-slate-500 font-mono">/{page.path || page.name.toLowerCase().replace(/\s+/g, '-')}</div>
                        {subpagesByParent[page.id] && subpagesByParent[page.id].length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600">
                            <FileText className="w-3 h-3" />
                            <span>{subpagesByParent[page.id].length} subpagina{subpagesByParent[page.id].length > 1 ? '\'s' : ''}</span>
                          </div>
                        )}
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Box className="w-3.5 h-3.5" /> {pageFeatures.length} features
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" /> {pageTodos.length} tasks
                        </div>
                      </div>
                      
                      {/* Progress */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${getProgressColor(page.status)}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">{progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Create New Page Card */}
            <button 
              onClick={() => navigate(createPageUrl('CreatePage'))}
              className="group relative bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-4 min-h-[340px]"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-blue-200 transition-all">
                <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Create New Page
                </h3>
                <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                  Start from scratch or use a template
                </p>
              </div>
            </button>

          </div>
        </div>
      </main>
      )}
    </div>
  );
}