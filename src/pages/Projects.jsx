import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Layers, Plus, FileText, CheckCircle2, Bug, Timer, Eye, Pencil, 
  Settings, Wind, MoreHorizontal, Trash2
} from 'lucide-react';

export default function Projects() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date')
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId) => base44.entities.Project.delete(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteConfirm(null);
    }
  });

  const handleDeleteProject = (projectId) => {
    deleteProjectMutation.mutate(projectId);
  };

  const { data: features = [] } = useQuery({
    queryKey: ['features'],
    queryFn: () => base44.entities.Feature.list()
  });

  const { data: pages = [] } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list()
  });

  const getProjectStats = (projectId) => {
    const projectPages = pages.filter(p => p.project === projectId);
    const projectFeatures = features.filter(f => f.project === projectId);
    const doneFeatures = projectFeatures.filter(f => f.status === 'Done').length;
    
    return {
      pagesCount: projectPages.length,
      featuresTotal: projectFeatures.length,
      featuresDone: doneFeatures,
      bugsCount: 0 // Could be calculated from features if we had bug tracking
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-slate-100 text-slate-600 border-slate-200',
      'Building': 'bg-orange-50 text-orange-600 border-orange-100',
      'Review': 'bg-blue-50 text-blue-700 border-blue-100',
      'Done': 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    return colors[status] || colors.Planning;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Planning': 'Planning',
      'Building': 'In Development',
      'Review': 'In Review',
      'Done': 'Ready to Launch'
    };
    return labels[status] || status;
  };

  const getProgressColor = (status) => {
    if (status === 'Done') return 'bg-emerald-500';
    return 'bg-blue-500';
  };

  const getProjectInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const getProjectGradient = (index) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-emerald-400 to-teal-500',
      'from-slate-700 to-slate-900',
      'from-purple-500 to-pink-600',
      'from-orange-400 to-red-500'
    ];
    return gradients[index % gradients.length];
  };

  const totalPages = pages.length;
  const totalFeatures = features.length;

  // Get unique companies for filter
  const uniqueCompanies = useMemo(() => {
    const companies = projects
      .map(p => p.company)
      .filter(c => c && c.trim() !== '')
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return companies;
  }, [projects]);

  // Filter projects based on selected filter and company filter
  const filteredProjects = useMemo(() => {
    let filtered = projects;
    
    // First apply status filter
    if (filter === 'all') {
      filtered = projects;
    } else if (filter === 'active') {
      // Active = Building or Review status
      filtered = projects.filter(p => p.status === 'Building' || p.status === 'Review');
    } else if (filter === 'archived') {
      // Archived = Done status
      filtered = projects.filter(p => p.status === 'Done');
    } else if (filter === 'templates') {
      // Templates = projects with template status or type
      filtered = projects.filter(p => p.status === 'Template' || p.product_type?.toLowerCase().includes('template'));
    } else {
      // Filter by exact status match (Planning, Building, Review, Done)
      filtered = projects.filter(p => p.status === filter);
    }
    
    // Then apply company filter
    if (companyFilter !== 'all') {
      filtered = filtered.filter(p => p.company === companyFilter);
    }
    
    return filtered;
  }, [projects, filter, companyFilter]);

  // Get count text based on filter
  const getProjectCountText = () => {
    // When filter is 'all' or not active, show total number of projects
    if (filter === 'all') {
      return `${projects.length} projecten`;
    } else if (filter === 'active') {
      return `${filteredProjects.length} actieve projecten`;
    } else {
      // When a specific filter is active, show filtered count
      const filterLabels = {
        'Planning': 'planning',
        'Building': 'actieve',
        'Review': 'review',
        'Done': 'voltooide',
        'archived': 'gearchiveerde',
        'templates': 'template'
      };
      const label = filterLabels[filter] || filter.toLowerCase();
      return `${filteredProjects.length} ${label} projecten`;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      
      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8 pb-12">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Your Projects</h1>
              <p className="text-slate-500 text-sm font-medium">
                {getProjectCountText()} • {totalPages} pages • {totalFeatures} features
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter Pills */}
              <div className="flex items-center p-1 bg-white border border-slate-200 rounded-lg shadow-sm flex-wrap gap-1">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('Planning')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'Planning' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Planning
              </button>
              <button 
                onClick={() => setFilter('active')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'active' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setFilter('Review')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'Review' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Review
              </button>
              <button 
                onClick={() => setFilter('Done')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'Done' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Done
              </button>
              </div>

              {/* Company Filter Dropdown */}
              {uniqueCompanies.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Bedrijf:</span>
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-md text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-colors shadow-sm"
                  >
                    <option value="all">Alle bedrijven</option>
                    {uniqueCompanies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </header>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400 text-sm">
                  {filter === 'all' ? 'Geen projecten gevonden' : `Geen ${filter === 'active' ? 'actieve' : filter === 'archived' ? 'gearchiveerde' : filter === 'templates' ? 'template' : filter.toLowerCase()} projecten gevonden`}
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => {
              const stats = getProjectStats(project.id);
              const progress = project.progress || 0;
              
              return (
                <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col">
                  <div className="p-6 flex-1">
                    {/* Top */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getProjectGradient(index)} flex items-center justify-center text-white text-xl font-bold shadow-sm`}>
                          {project.name === 'Breathe' ? (
                            <Wind className="w-8 h-8" />
                          ) : (
                            getProjectInitials(project.name)
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">
                            {project.description?.slice(0, 30) || 'No description'}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {stats.pagesCount} Pages
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        {stats.featuresDone}/{stats.featuresTotal} Features
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Bug className="w-4 h-4 text-slate-400" />
                        {stats.bugsCount} Bugs
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Timer className="w-4 h-4 text-slate-400" />
                        In Progress
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-500">Overall Progress</span>
                        <span className="text-slate-900">{progress}% complete</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${getProgressColor(project.status)}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-xl">
                    <span className="text-xs font-medium text-slate-400">Updated recently</span>
                    <div className="flex items-center gap-1">
                      <Link
                        to={createPageUrl('ProjectDetail') + '?id=' + project.id}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
            )}

            {/* New Project Card */}
            <button 
              onClick={() => navigate(createPageUrl('ProjectSetup'))}
              className="bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 group flex flex-col items-center justify-center p-8 min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600">Start New Project</h3>
              <p className="text-sm text-slate-500">Build your next app</p>
            </button>

          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDeleteConfirm(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white rounded-xl shadow-2xl z-50 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Project?</h3>
                <p className="text-sm text-slate-600">
                  This will permanently delete this project and all its pages, features, and data. This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteProject(deleteConfirm)}
                disabled={deleteProjectMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Right Sidebar (Activity) */}
      <aside className="w-[280px] border-l border-slate-200 bg-white hidden xl:block overflow-y-auto">
        <div className="p-6 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Activity</h2>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="relative space-y-6">
            {/* Vertical Line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-slate-100"></div>

            {/* Item 1 */}
            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-500 z-10"></div>
              <p className="text-sm text-slate-900 font-medium leading-snug">New project created</p>
              <span className="text-xs text-slate-400 mt-1 block">Just now</span>
            </div>

            {/* Item 2 */}
            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 z-10"></div>
              <p className="text-sm text-slate-900 font-medium leading-snug">Feature completed</p>
              <span className="text-xs text-slate-400 mt-1 block">2 hours ago</span>
            </div>

            {/* Item 3 */}
            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-orange-400 z-10"></div>
              <p className="text-sm text-slate-900 font-medium leading-snug">Sprint started</p>
              <span className="text-xs text-slate-400 mt-1 block">1 day ago</span>
            </div>

            {/* Item 4 */}
            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-500 z-10"></div>
              <p className="text-sm text-slate-900 font-medium leading-snug">Project deployed</p>
              <span className="text-xs text-slate-400 mt-1 block">2 days ago</span>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">v1.0.0</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">Production</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
}