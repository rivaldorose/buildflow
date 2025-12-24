import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, Activity as ActivityIcon, Filter, Calendar, 
  FileText, Target, Box, Palette, GitBranch, User, Clock
} from 'lucide-react';
import { format } from 'date-fns';

export default function Activity() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-updated_date')
  });

  const { data: pages = [] } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list('-updated_date', 50)
  });

  const { data: features = [] } = useQuery({
    queryKey: ['features'],
    queryFn: () => base44.entities.Feature.list('-updated_date', 50)
  });

  const { data: sprints = [] } = useQuery({
    queryKey: ['sprints'],
    queryFn: () => base44.entities.Sprint.list('-updated_date', 50)
  });

  const { data: designSystems = [] } = useQuery({
    queryKey: ['designSystems'],
    queryFn: () => base44.entities.DesignSystem.list('-updated_date', 50)
  });

  // Combine all activities
  const allActivities = useMemo(() => {
    const activities = [];

    projects.forEach(item => {
      activities.push({
        id: `project-${item.id}`,
        type: 'project',
        name: item.name,
        action: 'updated',
        timestamp: new Date(item.updated_date),
        projectId: item.id,
        projectName: item.name,
        icon: Box,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      });
    });

    pages.forEach(item => {
      const project = projects.find(p => p.id === item.project);
      activities.push({
        id: `page-${item.id}`,
        type: 'page',
        name: item.name,
        action: item.status === 'Done' ? 'completed' : 'updated',
        timestamp: new Date(item.updated_date),
        projectId: item.project,
        projectName: project?.name || 'Unknown',
        icon: FileText,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
      });
    });

    features.forEach(item => {
      const project = projects.find(p => p.id === item.project);
      activities.push({
        id: `feature-${item.id}`,
        type: 'feature',
        name: item.name,
        action: item.status === 'Done' ? 'completed' : 'updated',
        timestamp: new Date(item.updated_date),
        projectId: item.project,
        projectName: project?.name || 'Unknown',
        icon: Target,
        color: 'text-green-600',
        bg: 'bg-green-50'
      });
    });

    sprints.forEach(item => {
      const project = projects.find(p => p.id === item.project);
      activities.push({
        id: `sprint-${item.id}`,
        type: 'sprint',
        name: item.name,
        action: 'updated',
        timestamp: new Date(item.updated_date),
        projectId: item.project,
        projectName: project?.name || 'Unknown',
        icon: Calendar,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
      });
    });

    designSystems.forEach(item => {
      const project = projects.find(p => p.id === item.project);
      activities.push({
        id: `design-${item.id}`,
        type: 'design',
        name: project?.name || 'Design System',
        action: 'updated',
        timestamp: new Date(item.updated_date),
        projectId: item.project,
        projectName: project?.name || 'Unknown',
        icon: Palette,
        color: 'text-pink-600',
        bg: 'bg-pink-50'
      });
    });

    return activities.sort((a, b) => b.timestamp - a.timestamp);
  }, [projects, pages, features, sprints, designSystems]);

  // Filter activities
  const filteredActivities = allActivities.filter(activity => {
    const projectMatch = selectedProject === 'all' || activity.projectId === selectedProject;
    const typeMatch = selectedType === 'all' || activity.type === selectedType;
    return projectMatch && typeMatch;
  });

  const getActionText = (action) => {
    const actions = {
      'updated': 'was updated',
      'completed': 'was completed',
      'created': 'was created'
    };
    return actions[action] || action;
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return format(date, 'MMM d');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to={createPageUrl('Home')} className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Activity</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Activity Feed</h1>
            <p className="text-slate-500">Track all changes across your projects</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="project">Projects</option>
              <option value="page">Pages</option>
              <option value="feature">Features</option>
              <option value="sprint">Sprints</option>
              <option value="design">Design Systems</option>
            </select>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="divide-y divide-slate-100">
            {filteredActivities.length === 0 ? (
              <div className="p-12 text-center">
                <ActivityIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No activities found</p>
              </div>
            ) : (
              filteredActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="p-5 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${activity.bg} ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-slate-900">
                              <span className="font-semibold">{activity.name}</span>
                              {' '}
                              <span className="text-slate-500">{getActionText(activity.action)}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-slate-500">{activity.projectName}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-xs text-slate-400 capitalize">{activity.type}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 whitespace-nowrap">{getRelativeTime(activity.timestamp)}</span>
                            <Link
                              to={createPageUrl('ProjectDetail') + '?id=' + activity.projectId}
                              className="opacity-0 group-hover:opacity-100 text-xs font-medium text-blue-600 hover:text-blue-700 transition-opacity whitespace-nowrap"
                            >
                              View Project →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{allActivities.length}</div>
            <div className="text-xs text-slate-500">Total Activities</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{allActivities.filter(a => a.type === 'project').length}</div>
            <div className="text-xs text-slate-500">Project Updates</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{allActivities.filter(a => a.action === 'completed').length}</div>
            <div className="text-xs text-slate-500">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
            <div className="text-xs text-slate-500">Active Projects</div>
          </div>
        </div>

      </div>
    </div>
  );
}