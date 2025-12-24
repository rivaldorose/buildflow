import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, ChevronDown, LayoutGrid, List, ArrowUpDown, Filter, Clock,
  Briefcase, Wind, Scale, Layers, Layout, Component as ComponentIcon,
  MoreHorizontal, AlertCircle, Palette, Plus
} from 'lucide-react';

export default function DesignSystems() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSystems, setSelectedSystems] = useState([]);

  const { data: designSystems = [], isLoading } = useQuery({
    queryKey: ['designSystems'],
    queryFn: () => base44.entities.DesignSystem.list('-updated_date')
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const { data: pages = [] } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list()
  });

  const getProjectData = (projectId) => {
    return projects.find(p => p.id === projectId);
  };

  const getPagesUsingSystem = (projectId) => {
    return pages.filter(p => p.project === projectId).length;
  };

  const getProjectIcon = (projectName) => {
    const icons = {
      'DealMaker': { Icon: Briefcase, color: 'bg-blue-600', shadow: 'shadow-blue-600/20' },
      'Breathe': { Icon: Wind, color: 'bg-sky-400', shadow: 'shadow-sky-400/20' },
      'Konsensi': { Icon: Scale, color: 'bg-emerald-600', shadow: 'shadow-emerald-600/20' },
      'BuildFlow': { Icon: Layers, color: 'bg-slate-900', shadow: 'shadow-slate-900/20' }
    };
    return icons[projectName] || { Icon: Layers, color: 'bg-indigo-600', shadow: 'shadow-indigo-600/20' };
  };

  const getStatusBadge = (status = 'Active') => {
    const badges = {
      'Active': 'bg-green-50 text-green-700 border-green-100',
      'Draft': 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return badges[status] || badges.Active;
  };

  const templates = [
    { name: 'Modern Blue', colors: ['#3B82F6', '#6366F1', '#E2E8F0'] },
    { name: 'Vibrant Orange', colors: ['#F97316', '#F59E0B', '#1E293B'] },
    { name: 'Minimal Gray', colors: ['#1E293B', '#94A3B8', '#E2E8F0'] }
  ];

  const toggleSystemSelection = (systemId) => {
    setSelectedSystems(prev =>
      prev.includes(systemId) ? prev.filter(id => id !== systemId) : [...prev, systemId]
    );
  };

  const totalColors = designSystems.reduce((sum, ds) => {
    return sum + (ds.brand_colors?.length || 0) + (ds.neutral_colors?.length || 0) + (ds.semantic_colors?.length || 0);
  }, 0);

  const activeCount = designSystems.length;
  const draftCount = 0;

  return (
    <div className="flex flex-1 overflow-hidden">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1140px] mx-auto p-8 pb-20">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Workspace</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-900">Design Systems</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Design Systems</h1>
              <p className="text-slate-500 font-medium">
                {activeCount} active systems • {draftCount} draft • {totalColors} colors defined
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="bg-white p-1 rounded-lg border border-slate-200 flex items-center shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

              {/* Sort */}
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-white bg-white border border-slate-200 shadow-sm transition-all group">
                <ArrowUpDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                Recently Updated
              </button>

              {/* Filter */}
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-white bg-white border border-slate-200 shadow-sm transition-all group">
                <Filter className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                All Projects
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Design Systems Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {designSystems.map((system) => {
              const project = getProjectData(system.project);
              const pagesCount = getPagesUsingSystem(system.project);
              const { Icon, color, shadow } = getProjectIcon(project?.name);
              const brandColors = system.brand_colors || [];
              const componentsCount = 8; // Mock data

              return (
                <div 
                  key={system.id} 
                  onClick={() => navigate(createPageUrl('DesignSystem') + '?id=' + system.id)}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-lg ${shadow}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{project?.name || 'System'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge('Active')}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Recently
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-8 flex-1 bg-[#FAFAFA]">
                    {/* Colors */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Color Palette</h4>
                      <div className="flex gap-4">
                       {brandColors.slice(0, 5).map((colorObj, idx) => (
                         <div 
                           key={idx} 
                           className="group/c relative cursor-pointer"
                           onClick={(e) => {
                             e.stopPropagation();
                             navigator.clipboard.writeText(colorObj.color);
                           }}
                         >
                           <div 
                             className="w-12 h-12 rounded-full shadow-sm ring-2 ring-white hover:scale-110 hover:shadow-lg transition-all"
                             style={{ backgroundColor: colorObj.color }}
                           ></div>
                           <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 opacity-0 group-hover/c:opacity-100 transition-opacity whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                             {colorObj.color}
                           </span>
                         </div>
                       ))}
                      </div>
                    </div>

                    {/* Typography & Spacing */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Typography</h4>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-2">
                          <div className="text-xl font-semibold text-slate-900 leading-tight">
                            {project?.name?.slice(0, 12) || 'Preview'}
                          </div>
                          <div className="text-xs text-slate-500 leading-relaxed">
                            {project?.description?.slice(0, 25) || 'Sample text...'}
                          </div>
                          <div className="pt-1 border-t border-slate-100 mt-2 text-[10px] text-slate-400 font-medium">
                            {system.typography?.heading_font || 'Inter'} + {system.typography?.body_font || 'Inter'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Spacing</h4>
                        <div className="flex items-end gap-1 h-[88px] pt-4">
                          <div className="h-6 w-2 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">8</span>
                          </div>
                          <div className="h-6 w-4 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">16</span>
                          </div>
                          <div className="h-6 w-6 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">24</span>
                          </div>
                          <div className="h-6 w-8 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">32</span>
                          </div>
                          <div className="h-6 w-12 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">48</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Layout className="w-3.5 h-3.5 text-slate-400" />
                        Applied to {pagesCount} pages
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <ComponentIcon className="w-3.5 h-3.5 text-slate-400" />
                        {componentsCount} Components
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-3">
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       navigate(createPageUrl('DesignSystem') + '?id=' + system.id);
                     }}
                     className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                   >
                     View Details
                   </button>
                   <div className="flex gap-2">
                     <button 
                       onClick={(e) => e.stopPropagation()}
                       className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                     >
                       Export
                     </button>
                     <button 
                       onClick={(e) => e.stopPropagation()}
                       className="w-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                     >
                       <MoreHorizontal className="w-4 h-4" />
                     </button>
                   </div>
                  </div>
                </div>
              );
            })}

            {/* Create New Card */}
            <div 
              onClick={() => navigate(createPageUrl('CreateDesignSystem'))}
              className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[400px]"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-white group-hover:shadow-md transition-all">
                <Palette className="w-10 h-10 text-slate-400 group-hover:text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create Design System</h3>
              <p className="text-slate-500 text-center text-sm max-w-xs mb-8">
                Start from scratch or use a template to maintain consistency across your projects.
              </p>
              <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                + New Design System
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[320px] bg-white border-l border-slate-200 overflow-y-auto hidden xl:block">
        <div className="p-6 space-y-8">
          
          {/* Templates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Popular Templates</h3>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</a>
            </div>
            <div className="space-y-3">
              {templates.map((template, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">{template.name}</span>
                    <div className="flex -space-x-1">
                      {template.colors.map((color, i) => (
                        <div key={i} className="w-3 h-3 rounded-full ring-1 ring-white" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Compare */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Compare Systems</h3>
            <div className="space-y-2 mb-4">
              {designSystems.slice(0, 4).map((system) => {
                const project = getProjectData(system.project);
                return (
                  <label key={system.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedSystems.includes(system.id)}
                      onChange={() => toggleSystemSelection(system.id)}
                    />
                    <span className="text-sm font-medium text-slate-700">{project?.name || 'System'}</span>
                  </label>
                );
              })}
            </div>
            <button 
              disabled={selectedSystems.length < 2}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare Selected ({selectedSystems.length})
            </button>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Recent Exports */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Exports</h3>
            <div className="relative pl-2 border-l border-slate-200 space-y-6">
              <div className="relative pl-4">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                <p className="text-xs font-semibold text-slate-900">System → Tailwind</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Recently</p>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                <p className="text-xs font-semibold text-slate-900">Theme → CSS Vars</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Earlier</p>
              </div>
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}