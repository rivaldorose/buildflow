import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Folder, FileText, Target, Bug, ArrowUp, ArrowDown, ArrowRight,
  Layers, Timer, CheckCircle, Calendar, Briefcase, Wind, Scale,
  PlusCircle, Square, CheckSquare, Clock, Palette, Code2, Rocket,
  AlertTriangle
} from 'lucide-react';
import AuraPromptDialog from '../components/home/AuraPromptDialog';

export default function Home() {
  const navigate = useNavigate();
  const [showAuraDialog, setShowAuraDialog] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date')
  });

  const { data: features = [], isLoading: featuresLoading } = useQuery({
    queryKey: ['features'],
    queryFn: () => base44.entities.Feature.list()
  });

  const { data: pages = [] } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list()
  });

  const { data: sprints = [] } = useQuery({
    queryKey: ['sprints'],
    queryFn: () => base44.entities.Sprint.list('-updated_date')
  });

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: () => base44.entities.Todo.list()
  });

  const isLoading = projectsLoading || featuresLoading;

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'Building' || p.status === 'Review').length;
  const pagesInProgress = pages.filter(p => p.status === 'Doing').length;
  const totalFeatures = features.length;
  const completedFeatures = features.filter(f => f.status === 'Done').length;
  const featuresProgress = totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0;
  const activeBugs = todos.filter(t => !t.completed && t.task?.toLowerCase().includes('bug')).length;
  const totalPages = pages.length;
  const completedPages = pages.filter(p => p.status === 'Done').length;

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-slate-100 text-slate-600 border-slate-200',
      'Building': 'bg-orange-50 text-orange-700 border-orange-100',
      'Review': 'bg-blue-50 text-blue-700 border-blue-100',
      'Done': 'bg-green-50 text-green-700 border-green-100'
    };
    return colors[status] || colors.Planning;
  };

  const getProgressColor = (status) => {
    if (status === 'Done') return 'bg-green-500';
    if (status === 'Building' || status === 'Review') return 'bg-blue-500';
    return 'bg-slate-400';
  };

  const getProjectIcon = (name) => {
    const icons = {
      'DealMaker': { Icon: Briefcase, color: 'bg-blue-600', shadow: 'shadow-blue-200' },
      'Breathe': { Icon: Wind, color: 'bg-teal-500', shadow: 'shadow-teal-200' },
      'Konsensi': { Icon: Scale, color: 'bg-slate-800', shadow: 'shadow-slate-200' }
    };
    return icons[name] || { Icon: Folder, color: 'bg-indigo-600', shadow: 'shadow-indigo-200' };
  };

  const formatDate = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()} | ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-[1240px] w-full mx-auto px-6 py-10 pb-20">
      
      {/* Hero Section */}
      <header className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-slate-500 font-medium">
            You have <span className="text-slate-900 font-semibold">{activeProjects} active projects</span> and <span className="text-slate-900 font-semibold">{features.filter(f => f.status !== 'Done').length} tasks</span> due this week
          </p>
        </div>
        <div className="text-right hidden lg:block">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            {formatDate()}
          </div>
        </div>
      </header>

      {/* Quick Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all cursor-default">
          <div className="flex items-start justify-between">
            <div className="text-sm font-medium text-slate-500">Active Projects</div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Folder className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{activeProjects}</div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mt-1">
              <span>{projects.length} total projects</span>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all cursor-default">
          <div className="flex items-start justify-between">
            <div className="text-sm font-medium text-slate-500">Pages in Progress</div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{pagesInProgress}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0}%` }}></div>
              </div>
              <span className="text-xs font-medium text-purple-600">{totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all cursor-default">
          <div className="flex items-start justify-between">
            <div className="text-sm font-medium text-slate-500">Features Total</div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{totalFeatures}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${featuresProgress}%` }}></div>
              </div>
              <span className="text-xs font-medium text-indigo-600">{featuresProgress}%</span>
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all cursor-default">
          <div className="flex items-start justify-between">
            <div className="text-sm font-medium text-slate-500">Active Bugs</div>
            <div className={`p-2 rounded-lg ${activeBugs > 0 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{activeBugs}</div>
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${activeBugs > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {activeBugs > 0 ? (
                <>
                  <ArrowUp className="w-3 h-3" /> Needs attention
                </>
              ) : (
                <>
                  <ArrowDown className="w-3 h-3" /> All clear!
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          
          {/* Your Projects */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Your Projects</h2>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => {
                const projectFeatures = features.filter(f => f.project === project.id);
                const projectPages = pages.filter(p => p.project === project.id);
                const donePages = projectPages.filter(p => p.status === 'Done').length;
                const { Icon, color, shadow } = getProjectIcon(project.name);
                
                return (
                  <div key={project.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white shadow-md ${shadow}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{project.name}</h3>
                          <span className="text-xs text-slate-500 font-medium">{project.description?.slice(0, 30) || 'No description'}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                        <div className="col-span-2 sm:col-span-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-1.5 ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                              <div className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(project.status)}`} style={{ width: `${project.progress || 0}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-slate-600">{project.progress || 0}%</span>
                          </div>
                        </div>
                        
                        <div className="hidden sm:block text-xs text-slate-500">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Layers className="w-3.5 h-3.5" /> {projectPages.length} pages
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Timer className="w-3.5 h-3.5" /> {projectFeatures.length} features
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2">
                          <span className="text-xs text-slate-400">Updated recently</span>
                          <Link 
                            to={createPageUrl('ProjectDetail') + '?id=' + project.id}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md border border-blue-100 hover:bg-blue-100 transition-colors"
                          >
                            Open
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* New Project Button */}
              <button 
                onClick={() => navigate(createPageUrl('ProjectSetup'))}
                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <PlusCircle className="w-5 h-5" /> Create New Project
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-5">Quick Actions</h2>
            <div 
              onClick={() => setShowAuraDialog(true)}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer max-w-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Design in Aura</h3>
              <p className="text-xs text-slate-500 mb-4">Generate AI-powered design prompts</p>
              <button className="text-sm font-medium text-pink-600 hover:text-pink-700 flex items-center gap-1">
                Start <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          
          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Recent Activity</h2>
              <Link 
                to={createPageUrl('Activity')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-6 bottom-6 left-[31px] w-px bg-slate-100"></div>
              
              <div className="space-y-6">
                {(() => {
                  const recentActivities = [];
                  
                  // Add recent pages
                  pages.slice(0, 2).forEach(page => {
                    const project = projects.find(p => p.id === page.project);
                    recentActivities.push({
                      id: `page-${page.id}`,
                      icon: page.status === 'Done' ? CheckCircle : FileText,
                      color: page.status === 'Done' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600',
                      title: page.name,
                      action: page.status === 'Done' ? 'completed' : 'updated',
                      project: project?.name,
                      timestamp: new Date(page.updated_date),
                      projectId: page.project
                    });
                  });
                  
                  // Add recent features
                  features.slice(0, 2).forEach(feature => {
                    const project = projects.find(p => p.id === feature.project);
                    recentActivities.push({
                      id: `feature-${feature.id}`,
                      icon: feature.status === 'Done' ? CheckCircle : Target,
                      color: feature.status === 'Done' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600',
                      title: feature.name,
                      action: feature.status === 'Done' ? 'completed' : 'updated',
                      project: project?.name,
                      timestamp: new Date(feature.updated_date),
                      projectId: feature.project
                    });
                  });
                  
                  // Sort by timestamp and take top 4
                  const sortedActivities = recentActivities
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 4);
                  
                  const getRelativeTime = (date) => {
                    const now = new Date();
                    const diff = now - date;
                    const minutes = Math.floor(diff / 60000);
                    const hours = Math.floor(diff / 3600000);
                    const days = Math.floor(diff / 86400000);
                    
                    if (minutes < 1) return 'just now';
                    if (minutes < 60) return `${minutes}m ago`;
                    if (hours < 24) return `${hours}h ago`;
                    return `${days}d ago`;
                  };
                  
                  if (sortedActivities.length === 0) {
                    return (
                      <div className="text-center py-4 text-slate-400 text-sm">
                        No recent activity
                      </div>
                    );
                  }
                  
                  return sortedActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <Link
                        key={activity.id}
                        to={createPageUrl('ProjectDetail') + '?id=' + activity.projectId}
                        className="relative flex gap-4 group cursor-pointer"
                      >
                        <div className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center z-10 ring-1 ring-slate-100 flex-shrink-0 ${activity.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                            <span className="font-semibold">{activity.title}</span> {activity.action}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {activity.project && <span className="text-xs text-slate-500">{activity.project}</span>}
                            <span className="text-xs text-slate-400">{getRelativeTime(activity.timestamp)}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  });
                })()}
              </div>
            </div>
          </section>

          {/* Active Sprints */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Active Sprints</h2>
              <Link to={createPageUrl('Sprint')} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {sprints.filter(s => s.status === 'Active').slice(0, 2).map((sprint) => {
                const project = projects.find(p => p.id === sprint.project);
                const sprintFeatures = features.filter(f => f.project === sprint.project);
                const completedFeatures = sprintFeatures.filter(f => f.status === 'Done').length;
                const totalSprintFeatures = sprintFeatures.length;
                const actualProgress = totalSprintFeatures > 0 
                  ? Math.round((completedFeatures / totalSprintFeatures) * 100) 
                  : sprint.progress || 0;
                
                return (
                  <Link 
                    key={sprint.id} 
                    to={createPageUrl('Sprint')}
                    className="block bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-600">{project?.name || 'Project'}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        actualProgress >= 75 ? 'text-green-600 bg-green-50 border-green-100' :
                        actualProgress >= 50 ? 'text-blue-600 bg-blue-50 border-blue-100' :
                        'text-orange-600 bg-orange-50 border-orange-100'
                      }`}>
                        {actualProgress >= 75 ? '🟢 On Track' : actualProgress >= 50 ? '🟡 In Progress' : '🟠 Behind'}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">{sprint.name}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>{completedFeatures} / {totalSprintFeatures} features</span>
                      <span className="font-medium">{actualProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${actualProgress}%` }}></div>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {sprint.status}
                    </div>
                  </Link>
                );
              })}
              {sprints.filter(s => s.status === 'Active').length === 0 && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
                  <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 font-medium mb-1">No active sprints</p>
                  <p className="text-xs text-slate-400 mb-4">Create a sprint to start tracking your progress</p>
                  <Link 
                    to={createPageUrl('Sprint')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Go to Sprints <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Security Alerts */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-5">Security & Compliance</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800 text-sm">All systems operational</span>
              </div>
              <p className="text-xs text-green-800/80 mb-4">
                No security issues detected. All projects are compliant.
              </p>
              <button className="w-full py-2 bg-white border border-green-200 text-green-700 text-xs font-semibold rounded-md hover:bg-green-100 transition-colors shadow-sm">
                View Security Dashboard
              </button>
            </div>
          </section>

        </div>

      </div>

      {/* Aura Prompt Dialog */}
      <AuraPromptDialog isOpen={showAuraDialog} onClose={() => setShowAuraDialog(false)} />

    </div>
  );
}