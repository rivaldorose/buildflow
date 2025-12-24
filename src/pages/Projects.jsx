import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Layers, Plus, FileText, CheckCircle2, Bug, Timer, Eye, Pencil, 
  Settings, Wind, MoreHorizontal, Trash2, Server, Github, Globe, 
  Database, Zap, X, Save, ExternalLink
} from 'lucide-react';

export default function Projects() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingMetadata, setEditingMetadata] = useState(null);
  const [metadataForm, setMetadataForm] = useState({
    backend_active: false,
    github_repo: '',
    hosted_url: '',
    hosting_platform: '',
    database_platform: '',
    api_deployed: false,
    api_url: ''
  });

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

  const updateProjectMetadataMutation = useMutation({
    mutationFn: ({ projectId, metadata }) => base44.entities.Project.update(projectId, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditingMetadata(null);
      setMetadataForm({
        backend_active: false,
        github_repo: '',
        hosted_url: '',
        hosting_platform: '',
        database_platform: '',
        api_deployed: false,
        api_url: ''
      });
    }
  });

  const handleEditMetadata = (project) => {
    setEditingMetadata(project.id);
    setMetadataForm({
      backend_active: project.backend_active || false,
      github_repo: project.github_repo || '',
      hosted_url: project.hosted_url || '',
      hosting_platform: project.hosting_platform || '',
      database_platform: project.database_platform || '',
      api_deployed: project.api_deployed || false,
      api_url: project.api_url || ''
    });
  };

  const handleSaveMetadata = () => {
    if (!editingMetadata) return;
    updateProjectMetadataMutation.mutate({
      projectId: editingMetadata,
      metadata: metadataForm
    });
  };

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
    const count = filteredProjects.length;
    const totalCount = projects.length;
    
    // When company filter is active, show it in the count
    if (companyFilter !== 'all') {
      if (filter === 'all') {
        return `${count} projecten voor ${companyFilter}`;
      } else if (filter === 'active') {
        return `${count} actieve projecten voor ${companyFilter}`;
      } else {
        const filterLabels = {
          'Planning': 'planning',
          'Building': 'actieve',
          'Review': 'review',
          'Done': 'voltooide',
          'archived': 'gearchiveerde',
          'templates': 'template'
        };
        const label = filterLabels[filter] || filter.toLowerCase();
        return `${count} ${label} projecten voor ${companyFilter}`;
      }
    }
    
    // When filter is 'all' or not active, show total number of projects
    if (filter === 'all') {
      return `${totalCount} projecten`;
    } else if (filter === 'active') {
      return `${count} actieve projecten`;
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
      return `${count} ${label} projecten`;
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

              {/* Company Filter - Always visible */}
              <div className="flex items-center p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 px-3">
                  <span className="text-xs font-medium text-slate-500">Bedrijf:</span>
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium border-0 bg-transparent text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors cursor-pointer ${
                      companyFilter !== 'all' ? 'text-blue-700 font-semibold' : ''
                    }`}
                  >
                    <option value="all">Alle bedrijven</option>
                    {uniqueCompanies.length > 0 ? (
                      uniqueCompanies.map(company => (
                        <option key={company} value={company}>{company}</option>
                      ))
                    ) : (
                      <option value="all" disabled>Geen bedrijven beschikbaar</option>
                    )}
                  </select>
                  {companyFilter !== 'all' && (
                    <button
                      onClick={() => setCompanyFilter('all')}
                      className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Filter wissen"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400 text-sm">
                  {companyFilter !== 'all' 
                    ? `Geen projecten gevonden voor ${companyFilter}${filter !== 'all' ? ` met status "${filter}"` : ''}`
                    : filter === 'all' 
                      ? 'Geen projecten gevonden' 
                      : `Geen ${filter === 'active' ? 'actieve' : filter === 'archived' ? 'gearchiveerde' : filter === 'templates' ? 'template' : filter.toLowerCase()} projecten gevonden`}
                </p>
                {(filter !== 'all' || companyFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setFilter('all');
                      setCompanyFilter('all');
                    }}
                    className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Wis alle filters
                  </button>
                )}
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
                    <div className="space-y-2 mb-4">
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

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                      {project.backend_active && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-200">
                          <Server className="w-3 h-3" />
                          Backend
                        </div>
                      )}
                      {project.github_repo && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                          <Github className="w-3 h-3" />
                          GitHub
                        </div>
                      )}
                      {project.hosted_url && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200">
                          <Globe className="w-3 h-3" />
                          Live
                        </div>
                      )}
                      {project.database_platform && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium border border-purple-200">
                          <Database className="w-3 h-3" />
                          {project.database_platform}
                        </div>
                      )}
                      {project.api_deployed && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium border border-orange-200">
                          <Zap className="w-3 h-3" />
                          API
                        </div>
                      )}
                      <button
                        onClick={() => handleEditMetadata(project)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md text-xs font-medium border border-slate-200 transition-colors"
                        title="Edit metadata"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
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

      {/* Metadata Edit Modal */}
      {editingMetadata && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setEditingMetadata(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-50">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Project Metadata</h3>
                  <p className="text-sm text-slate-500 mt-1">Configure backend, GitHub, hosting en meer</p>
                </div>
                <button
                  onClick={() => setEditingMetadata(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Backend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-slate-500" />
                    <label className="text-sm font-semibold text-slate-900">Backend Actief</label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metadataForm.backend_active}
                      onChange={(e) => setMetadataForm({ ...metadataForm, backend_active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Github className="w-5 h-5 text-slate-500" />
                  GitHub Repository
                </label>
                <input
                  type="text"
                  placeholder="bijv. github.com/username/repo"
                  value={metadataForm.github_repo}
                  onChange={(e) => setMetadataForm({ ...metadataForm, github_repo: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Hosting */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Globe className="w-5 h-5 text-slate-500" />
                    Hosting URL
                  </label>
                  <input
                    type="text"
                    placeholder="bijv. https://app.vercel.app"
                    value={metadataForm.hosted_url}
                    onChange={(e) => setMetadataForm({ ...metadataForm, hosted_url: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Globe className="w-5 h-5 text-slate-500" />
                    Platform
                  </label>
                  <select
                    value={metadataForm.hosting_platform}
                    onChange={(e) => setMetadataForm({ ...metadataForm, hosting_platform: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="">Selecteer platform</option>
                    <option value="Vercel">Vercel</option>
                    <option value="Netlify">Netlify</option>
                    <option value="AWS">AWS</option>
                    <option value="Google Cloud">Google Cloud</option>
                    <option value="Azure">Azure</option>
                    <option value="DigitalOcean">DigitalOcean</option>
                    <option value="Anders">Anders</option>
                  </select>
                </div>
              </div>

              {/* Database */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Database className="w-5 h-5 text-slate-500" />
                  Database Platform
                </label>
                <select
                  value={metadataForm.database_platform}
                  onChange={(e) => setMetadataForm({ ...metadataForm, database_platform: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">Geen database</option>
                  <option value="Supabase">Supabase</option>
                  <option value="Firebase">Firebase</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MySQL">MySQL</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="Redis">Redis</option>
                  <option value="Anders">Anders</option>
                </select>
              </div>

              {/* API */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-slate-500" />
                    <label className="text-sm font-semibold text-slate-900">API Gedeployed</label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metadataForm.api_deployed}
                      onChange={(e) => setMetadataForm({ ...metadataForm, api_deployed: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {metadataForm.api_deployed && (
                  <input
                    type="text"
                    placeholder="bijv. https://api.example.com"
                    value={metadataForm.api_url}
                    onChange={(e) => setMetadataForm({ ...metadataForm, api_url: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50 rounded-b-xl">
              <button
                onClick={() => setEditingMetadata(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleSaveMetadata}
                disabled={updateProjectMetadataMutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {updateProjectMetadataMutation.isPending ? 'Opslaan...' : 'Opslaan'}
              </button>
            </div>
          </div>
        </>
      )}

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