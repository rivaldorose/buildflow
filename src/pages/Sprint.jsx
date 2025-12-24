import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, ChevronDown, List, Calendar as CalendarIcon, 
  CheckCircle2, RefreshCw, Calendar, SkipForward, AlertCircle,
  Clock, CalendarDays, ArrowRight, Check, Trophy, PlusCircle,
  Download
} from 'lucide-react';

export default function Sprint() {
  const [viewMode, setViewMode] = useState('list');
  const [selectedProject, setSelectedProject] = useState(null);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const { data: features = [] } = useQuery({
    queryKey: ['features'],
    queryFn: () => base44.entities.Feature.list()
  });

  const { data: sprints = [] } = useQuery({
    queryKey: ['sprints'],
    queryFn: () => base44.entities.Sprint.list('-updated_date')
  });

  // Filter sprints by project if selected
  const filteredSprints = selectedProject 
    ? sprints.filter(s => s.project === selectedProject)
    : sprints;

  // Map sprint data for display
  const displaySprints = filteredSprints.map(sprint => {
    const sprintFeatures = features.filter(f => f.project === sprint.project);
    const completedFeatures = sprintFeatures.filter(f => f.status === 'Done').length;
    
    // Calculate days left for active sprints
    const daysLeft = sprint.end_date 
      ? Math.ceil((new Date(sprint.end_date) - new Date()) / (1000 * 60 * 60 * 24))
      : null;
    
    // Calculate starts in for upcoming sprints
    const startsIn = sprint.start_date
      ? Math.ceil((new Date(sprint.start_date) - new Date()) / (1000 * 60 * 60 * 24))
      : null;
    
    return {
      ...sprint,
      startDate: sprint.start_date ? new Date(sprint.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      endDate: sprint.end_date ? new Date(sprint.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      daysLeft: daysLeft > 0 ? daysLeft : null,
      startsIn: startsIn > 0 ? startsIn : null,
      features: {
        completed: completedFeatures,
        total: sprintFeatures.length
      },
      velocity: sprint.velocity || 0
    };
  });

  const activeSprint = displaySprints.find(s => s.status === 'Active' || s.status === 'active');
  const completedCount = displaySprints.filter(s => s.status === 'Completed' || s.status === 'completed').length;
  const upcomingCount = displaySprints.filter(s => s.status === 'Planning' || s.status === 'upcoming').length;
  const activeCount = displaySprints.filter(s => s.status === 'Active' || s.status === 'active').length;

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const milestones = [
    { name: 'First Sprint', status: 'completed', date: 'Completed Dec 15', icon: 'check' },
    { name: 'MVP Features', status: 'active', date: 'Due Dec 22', icon: 'active' },
    { name: 'Beta Testing', status: 'upcoming', date: 'Jan 5, 2025', icon: 'upcoming' },
    { name: 'Public Launch', status: 'upcoming', date: 'Feb 17, 2025', icon: 'upcoming' }
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      
      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto p-8 pb-20">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to={createPageUrl('Projects')} className="hover:text-slate-900 transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-4 h-4" />
            {selectedProjectData && (
              <>
                <span className="hover:text-slate-900 cursor-pointer transition-colors">{selectedProjectData.name}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="font-medium text-slate-900">Sprints</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {selectedProjectData ? `${selectedProjectData.name} - Sprints` : 'Sprints'}
              </h1>
              <p className="text-slate-500 font-medium">
                {displaySprints.length} total • {activeCount} active • {upcomingCount} upcoming • {completedCount} completed
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="bg-white p-1 rounded-lg border border-slate-200 flex items-center shadow-sm">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
                <button 
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'timeline' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Timeline
                </button>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

              {/* Filter */}
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value || null)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-white bg-white border border-slate-200 shadow-sm transition-all appearance-none pr-8"
                style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3E%3Cpath fill=%27%2394a3b8%27 d=%27M1 1l5 5 5-5%27 stroke=%27%2394a3b8%27 stroke-width=%271.5%27 fill=%27none%27/%3E%3C/svg%3E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
              >
                <option value="">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Sprint Banner */}
          {activeSprint && (
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100/60 p-6 mb-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-blue-100/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      Active Sprint
                    </span>
                    <span className="text-xs text-orange-600 font-medium flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                      <Clock className="w-3 h-3" /> {activeSprint.daysLeft} days left
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{activeSprint.name}</h2>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {activeSprint.startDate} - {activeSprint.endDate}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-colors">
                    Complete Sprint
                  </button>
                  <Link
                    to={createPageUrl('SprintDetail') + '?id=' + activeSprint.id}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    View Board
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-4 gap-6 relative z-10 bg-white/60 rounded-xl p-4 border border-blue-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Completion</span>
                    <span className="text-blue-600">{activeSprint.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${activeSprint.progress}%` }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Pages</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{activeSprint.pages.completed}/{activeSprint.pages.total}</span>
                    <span className="text-xs text-slate-400">completed</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Features</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{activeSprint.features.completed}/{activeSprint.features.total}</span>
                    <span className="text-xs text-slate-400">done</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Velocity</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{activeSprint.velocity}</span>
                    <span className="text-xs text-slate-400">/ 32 pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sprints List Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              All Sprints
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{displaySprints.length}</span>
            </h3>

            {displaySprints.map((sprint) => {
              const isCompleted = sprint.status === 'Completed' || sprint.status === 'completed';
              const isActive = sprint.status === 'Active' || sprint.status === 'active';
              const isUpcoming = sprint.status === 'Planning' || sprint.status === 'upcoming';

              return (
                <div 
                  key={sprint.id} 
                  className={`group bg-white rounded-xl border-l-4 border-y border-r border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 ${
                    isCompleted ? 'border-l-emerald-500' : 
                    isActive ? 'border-l-blue-500' : 
                    'border-l-slate-300 opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isCompleted ? 'bg-emerald-50 text-emerald-600' :
                          isActive ? 'bg-blue-50 text-blue-600' :
                          'bg-slate-50 text-slate-500 border border-slate-100'
                        }`}>
                          {isCompleted && <CheckCircle2 className="w-5 h-5" />}
                          {isActive && <RefreshCw className="w-5 h-5 animate-[spin_4s_linear_infinite]" />}
                          {isUpcoming && <Calendar className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-bold text-slate-900">{sprint.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              isActive ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {isCompleted ? 'Completed' : isActive ? 'Active' : 'Upcoming'}
                            </span>
                            {sprint.isEarly && (
                              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                                <Trophy className="w-3 h-3" /> Early
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 mt-0.5">{sprint.startDate} - {sprint.endDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isCompleted && (
                          <>
                            <button className="text-slate-400 hover:text-slate-900 text-sm font-medium">Report</button>
                            <button className="text-slate-900 hover:text-blue-600 text-sm font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-200 transition-colors">View Details</button>
                          </>
                        )}
                        {isActive && (
                          <>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              On Track
                            </span>
                            <Link
                              to={createPageUrl('SprintDetail') + '?id=' + sprint.id}
                              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 px-3 py-1.5"
                            >
                              View Details <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        )}
                        {isUpcoming && (
                          <>
                            <button className="text-slate-400 hover:text-slate-900 text-sm font-medium flex items-center gap-1">
                              <SkipForward className="w-3.5 h-3.5" /> Skip
                            </button>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-100 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">Plan Sprint</button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-5 gap-8 items-center border-t border-slate-100 pt-5">
                      <div className="col-span-2">
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                          <span>{isUpcoming ? 'Starts in' : 'Progress'}</span>
                          <span className={`font-bold ${
                            isCompleted ? 'text-emerald-600' : 
                            isActive ? 'text-blue-600' : 
                            'text-slate-700'
                          }`}>
                            {isUpcoming ? `${sprint.startsIn} days` : `${sprint.progress}%`}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          {!isUpcoming && (
                            <div 
                              className={`h-full rounded-full transition-all ${
                                isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${sprint.progress}%` }}
                            ></div>
                          )}
                        </div>
                      </div>
                      {isCompleted && (
                        <>
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Pages</div>
                            <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                              {sprint.pages.completed}/{sprint.pages.total}
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Velocity</div>
                            <div className="text-sm font-semibold text-slate-900">{sprint.velocity} pts</div>
                          </div>
                        </>
                      )}
                      {isActive && (
                        <>
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Features</div>
                            <div className="text-sm font-semibold text-slate-900">{sprint.features.completed}/{sprint.features.total} done</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Blockers</div>
                            <div className="text-sm font-semibold text-rose-600 flex items-center gap-1 cursor-pointer hover:underline">
                              {sprint.bugs} bug
                            </div>
                          </div>
                        </>
                      )}
                      {isUpcoming && (
                        <>
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Est. Scope</div>
                            <div className="text-sm font-semibold text-slate-900">{sprint.estimatedPoints} pts</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Readiness</div>
                            <div className={`text-sm font-semibold flex items-center gap-1 ${
                              sprint.readiness.ready === sprint.readiness.total ? 'text-emerald-600' : 
                              sprint.readiness.ready > 0 ? 'text-emerald-600' : 
                              'text-amber-500'
                            }`}>
                              {sprint.readiness.ready}/{sprint.readiness.total} ready 
                              {sprint.readiness.ready === sprint.readiness.total ? 
                                <Check className="w-3 h-3" /> : 
                                <AlertCircle className="w-3 h-3" />
                              }
                            </div>
                          </div>
                        </>
                      )}
                      <div className="flex justify-end">
                        {!isUpcoming ? (
                          <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                            className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100" 
                            title="You"
                            alt="User"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-medium">
                            ?
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Right Sidebar (Metrics) */}
      <aside className="w-[300px] bg-white border-l border-slate-200 hidden xl:flex flex-col h-full shrink-0">
        <div className="p-6 overflow-y-auto">
          
          {/* Velocity Chart Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Overall Progress</h3>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
              <div className="flex items-end gap-3 h-24 mb-2">
                {displaySprints.map((sprint, idx) => {
                  const height = sprint.velocity ? `${(sprint.velocity / 32) * 100}%` : 
                                sprint.estimatedPoints ? `${(sprint.estimatedPoints / 32) * 100}%` : '45%';
                  
                  return (
                    <div key={sprint.id} className="flex-1 flex flex-col items-center justify-end gap-1 group cursor-pointer">
                      {sprint.velocity && (
                        <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" 
                          style={{ color: sprint.status === 'completed' ? '#10B981' : '#3B82F6' }}>
                          {sprint.velocity}
                        </span>
                      )}
                      <div 
                        className={`w-full rounded-t-sm transition-colors ${
                          sprint.status === 'completed' ? 'bg-emerald-400 group-hover:bg-emerald-500' :
                          sprint.status === 'active' ? 'bg-blue-500 shadow-sm' :
                          'bg-transparent border-t border-x border-slate-300 border-dashed'
                        }`}
                        style={{ height }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                {displaySprints.map((_, idx) => (
                  <span key={idx}>S{idx + 1}</span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Avg Velocity</div>
                <div className="text-lg font-bold text-slate-900">26 pts</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Target End</div>
                <div className="text-lg font-bold text-slate-900">Feb 17</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full mb-8"></div>

          {/* Milestones */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Milestones</h3>
            <div className="relative space-y-6 pl-2">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200"></div>

              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative flex items-center gap-3 group">
                  <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center z-10 ${
                    milestone.status === 'completed' ? 'bg-emerald-100 ring-1 ring-emerald-200' :
                    milestone.status === 'active' ? 'bg-blue-100 ring-1 ring-blue-200' :
                    'bg-white ring-1 ring-slate-200'
                  }`}>
                    {milestone.icon === 'check' && <Check className="w-3 h-3 text-emerald-600" />}
                    {milestone.icon === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                    {milestone.icon === 'upcoming' && <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${
                      milestone.status === 'completed' ? 'line-through decoration-slate-400 text-slate-400' :
                      milestone.status === 'active' ? 'text-slate-900' :
                      'text-slate-500 font-medium'
                    }`}>
                      {milestone.name}
                    </div>
                    <div className={`text-xs ${
                      milestone.status === 'completed' ? 'text-slate-400' :
                      milestone.status === 'active' ? 'text-blue-600 font-medium' :
                      'text-slate-400'
                    }`}>
                      {milestone.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full mb-8"></div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-left">
                <PlusCircle className="w-4 h-4 text-slate-400" />
                Create Backlog Item
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-left">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                View Calendar
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-left">
                <Download className="w-4 h-4 text-slate-400" />
                Export Report
              </button>
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}