import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, Play, FileText, CheckCircle2, Loader2, MoreHorizontal,
  Check, GripVertical, PartyPopper, Mic, Bot, BarChart3, Settings as SettingsIcon,
  Plus, User, Book, CreditCard, Trophy, UserCircle, Clock, CalendarDays
} from 'lucide-react';

export default function SprintDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const sprintId = urlParams.get('id') || '2';

  const { data: pages = [] } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list()
  });

  const { data: features = [] } = useQuery({
    queryKey: ['features'],
    queryFn: () => base44.entities.Feature.list()
  });

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: () => base44.entities.Todo.list()
  });

  // Mock sprint data
  const sprint = {
    id: 2,
    name: 'Sprint 2: Voice & AI Features',
    status: 'Active',
    startDate: 'Dec 16',
    endDate: 'Dec 22, 2024',
    daysLeft: 3,
    progress: 60,
    velocity: { current: 24, target: 32 },
    pages: {
      total: 5,
      done: 3,
      inProgress: 2
    }
  };

  const sprintPages = [
    { 
      id: 1, 
      name: 'Onboarding Screen', 
      icon: PartyPopper, 
      status: 'done', 
      features: 3, 
      tested: '3/3', 
      working: 3,
      points: 5,
      timeSpent: '6h',
      assignee: 'JD',
      finishedDate: 'Dec 18'
    },
    { 
      id: 2, 
      name: 'Voice Practice Screen', 
      icon: Mic, 
      status: 'testing', 
      features: 5, 
      progress: 60,
      working: 2,
      partial: 1,
      bug: '#23',
      points: 8,
      timeSpent: '8h / 12h',
      dueDate: 'Dec 20',
      assignee: 'avatar'
    },
    { 
      id: 3, 
      name: 'AI Response Screen', 
      icon: Bot, 
      status: 'testing', 
      features: 4, 
      progress: 50,
      working: 2,
      points: 6,
      timeSpent: '4h / 8h',
      dueDate: 'Dec 21',
      assignee: 'AL'
    },
    { 
      id: 4, 
      name: 'Results Screen', 
      icon: BarChart3, 
      status: 'todo', 
      features: 4,
      points: 5,
      dueDate: 'Dec 22',
      blocked: 'Voice Practice'
    },
    { 
      id: 5, 
      name: 'Settings Screen', 
      icon: SettingsIcon, 
      status: 'todo', 
      features: 3,
      points: 3,
      dueDate: 'Dec 22'
    }
  ];

  const backlogPages = [
    { name: 'Lesson Library Screen', icon: Book, status: 'Ready', points: 8, features: 6, priority: 'High' },
    { name: 'Subscription Flow', icon: CreditCard, status: 'Ready', points: 5, features: 4, priority: 'High' },
    { name: 'Leaderboard Screen', icon: Trophy, status: 'Designed', points: 6, features: 5, priority: 'Medium' },
    { name: 'Profile Customization', icon: UserCircle, status: 'Designed', points: 3, features: 3, priority: 'Low' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'done': 'border-l-green-500',
      'testing': 'border-l-orange-500',
      'todo': 'border-l-slate-300'
    };
    return colors[status] || 'border-l-slate-300';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'done': 'bg-green-50 text-green-700 border-green-100',
      'testing': 'bg-orange-50 text-orange-700 border-orange-100 animate-pulse',
      'todo': 'bg-slate-100 text-slate-500 border-slate-200'
    };
    return badges[status] || badges.todo;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'done': 'Done',
      'testing': 'Testing',
      'todo': 'Not Started'
    };
    return labels[status] || status;
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1440px] mx-auto p-8 pb-20">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to={createPageUrl('Projects')} className="hover:text-slate-900 cursor-pointer">
            Projects
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-slate-900 cursor-pointer">DealMaker</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-slate-900">Sprint Planning</span>
        </div>

        {/* Sprint Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{sprint.name}</h1>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-semibold">
                  <span className="relative w-2 h-2 rounded-full bg-green-500">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping"></span>
                  </span>
                  {sprint.status}
                </span>
              </div>
              <p className="text-slate-500 font-medium">
                {sprint.startDate} - {sprint.endDate} 
                <span className="text-slate-400 mx-2">•</span> 
                <span className="text-orange-600 font-medium">{sprint.daysLeft} days remaining</span>
              </p>
            </div>
            
            <div className="flex items-center gap-8 text-sm">
              <div className="flex flex-col items-end">
                <span className="text-slate-400 font-medium mb-1">Velocity</span>
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  {sprint.velocity.current}/{sprint.velocity.target} pts
                  <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs">On Track</span>
                </div>
              </div>
              <div className="flex items-center gap-6 border-l border-slate-100 pl-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>{sprint.pages.total} Pages</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{sprint.pages.done} Done</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>{sprint.pages.inProgress} In Progress</span>
                </div>
              </div>
              <div className="pl-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-slate-900 w-16">{sprint.progress}%</span>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full relative overflow-hidden transition-all" 
                  style={{ width: `${sprint.progress}%` }}
                >
                  <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20" 
                    style={{ 
                      backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', 
                      backgroundSize: '1rem 1rem' 
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>{sprint.pages.done} of {sprint.pages.total} pages completed</span>
                <span>Target: {sprint.pages.total} pages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* LEFT COLUMN: Active Sprint */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900">Sprint 2 - In Progress</h2>
              <span className="text-xs font-medium text-slate-500">Drag to reorder priority</span>
            </div>

            {sprintPages.map((page) => {
              const Icon = page.icon;
              const isDone = page.status === 'done';
              const isTesting = page.status === 'testing';
              const isTodo = page.status === 'todo';

              return (
                <div 
                  key={page.id}
                  className={`group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-l-[4px] ${getStatusColor(page.status)} ${isTodo ? 'opacity-90' : ''}`}
                >
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 cursor-grab">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className="p-4 pl-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-[80px] h-[60px] rounded-lg border flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-slate-50 border-slate-100' :
                        isTesting ? 'bg-orange-50/50 border-orange-100' :
                        'bg-slate-50 border-slate-200 grayscale'
                      }`}>
                        <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center">
                          <Icon className={`w-4 h-4 ${
                            isDone ? 'text-slate-400' :
                            isTesting ? 'text-orange-500' :
                            'text-slate-400'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-bold ${isTodo ? 'text-slate-700' : 'text-slate-900'}`}>{page.name}</h3>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(page.status)}`}>
                            {isDone && <Check className="w-3 h-3" />}
                            {getStatusLabel(page.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                          <span>{page.features} features{isTodo && ' planned'}</span>
                          {page.progress !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500" style={{ width: `${page.progress}%` }}></div>
                              </div>
                              <span className="text-slate-600">{page.progress}%</span>
                            </div>
                          )}
                          {isDone && (
                            <>
                              <span className="text-green-600 font-medium">✅ {page.tested} tested</span>
                              <span className="text-green-600 font-medium">🟢 {page.working} working</span>
                            </>
                          )}
                        </div>
                        {(page.working || page.partial || page.bug || page.blocked) && (
                          <div className="flex items-center gap-2 text-[11px]">
                            {page.working && <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{page.working} working</span>}
                            {page.partial && <span className="text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">{page.partial} partial</span>}
                            {page.bug && (
                              <a href="#" className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded hover:underline border border-red-100 flex items-center gap-1">
                                ⚠️ Bug {page.bug}
                              </a>
                            )}
                            {page.blocked && (
                              <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1">
                                ⚠️ Blocked by {page.blocked}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600">{page.points} points</span>
                        {page.finishedDate && <span>Finished {page.finishedDate}</span>}
                        {page.dueDate && <span className={isTesting ? 'text-orange-600' : ''}>Due {page.dueDate}</span>}
                        {page.timeSpent && <span>{page.timeSpent}</span>}
                      </div>
                      <div>
                        {page.assignee === 'avatar' ? (
                          <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                            alt="User" 
                            className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200"
                          />
                        ) : page.assignee ? (
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            page.assignee === 'JD' ? 'bg-indigo-100 border-indigo-200 text-indigo-700' :
                            page.assignee === 'AL' ? 'bg-pink-100 border-pink-200 text-pink-700' :
                            'border-slate-300 text-slate-400'
                          }`}>
                            {page.assignee}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Drop Zone */}
            <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-copy">
              <Plus className="w-5 h-5 mb-1" />
              <span className="text-sm font-medium">Drop pages here to add to sprint</span>
            </div>

            {/* Capacity Summary */}
            <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
              <div className="flex justify-between items-center text-sm font-medium text-slate-700 mb-2">
                <span>Sprint Capacity</span>
                <span className="text-green-600">89% Utilized</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                <div>Total: {sprint.pages.total} pages</div>
                <div>Points: {sprint.velocity.current} / 27 completed</div>
                <div>Velocity: On track 🟢</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Backlog */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900">Sprint 3 (Planned)</h2>
              <span className="text-xs font-medium text-slate-500">Starts Dec 23, 2024</span>
            </div>

            {backlogPages.map((page, idx) => {
              const Icon = page.icon;
              const priorityColor = {
                'High': 'text-red-500',
                'Medium': 'text-yellow-600',
                'Low': 'text-blue-500'
              }[page.priority] || 'text-slate-500';

              return (
                <div key={idx} className="group relative bg-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200">
                  <div className="p-4">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-[60px] h-[45px] rounded bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-slate-900 text-sm">{page.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            page.status === 'Ready' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {page.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="bg-slate-200 text-slate-600 px-1.5 rounded">{page.points} pts</span>
                          <span>{page.features} features</span>
                          <span className="text-slate-400">•</span>
                          <span className={`font-medium ${priorityColor}`}>{page.priority} Priority</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400 font-medium">
                ← Drag pages to Sprint 2 if capacity allows
              </span>
            </div>

            {/* Backlog Summary */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 border-dashed">
              <div className="flex justify-between items-center text-sm font-medium text-slate-700 mb-2">
                <span>Planning Summary</span>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <div>Next Sprint: 4 pages planned</div>
                <div>Estimated: 22 story points</div>
                <div>Recommended capacity: 20-24 points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Burndown Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Sprint Burndown</h3>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">2 pts behind ideal</span>
            </div>
            
            <div className="relative h-[200px] w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="1"></line>
                <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="1"></line>
                <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1"></line>
                <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="1"></line>
                <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="1"></line>
                <line x1="0" y1="10" x2="100" y2="90" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4"></line>
                <polyline points="0,10 16,20 33,35 50,45" fill="none" stroke="#3b82f6" strokeWidth="2.5"></polyline>
                <circle cx="50" cy="45" r="2.5" fill="#3b82f6" stroke="white" strokeWidth="1"></circle>
              </svg>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                <span>Dec 16</span>
                <span>17</span>
                <span>18</span>
                <span className="text-slate-900 font-bold">19 (Today)</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-400">
                <div className="w-3 h-0.5 border-t border-slate-400 border-dashed"></div> Ideal
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <div className="w-3 h-0.5 bg-blue-500 rounded"></div> Actual
              </div>
            </div>
          </div>

          {/* Velocity Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Sprint Velocity</h3>
              <div className="text-right">
                <div className="text-xs text-slate-500">Average velocity</div>
                <div className="text-sm font-bold text-slate-900">26 pts / sprint</div>
              </div>
            </div>

            <div className="h-[200px] flex items-end justify-around gap-4 pb-2 relative">
              <div className="absolute w-full top-[25%] border-t border-red-300 border-dashed flex justify-end">
                <span className="text-[10px] text-red-400 -mt-4 bg-white px-1">Avg</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-16 group">
                <div className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">28</div>
                <div className="w-full bg-emerald-100 rounded-t-md h-[160px] relative overflow-hidden group-hover:bg-emerald-200 transition-colors">
                  <div className="absolute bottom-0 w-full bg-emerald-500 h-full"></div>
                </div>
                <span className="text-xs font-medium text-slate-600">Sprint 1</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-16 group">
                <div className="text-xs font-bold text-blue-600">24</div>
                <div className="w-full bg-blue-100 rounded-t-md h-[135px] relative overflow-hidden group-hover:bg-blue-200 transition-colors ring-2 ring-blue-500 ring-offset-2">
                  <div className="absolute bottom-0 w-full bg-blue-500 h-[75%] animate-pulse"></div>
                </div>
                <span className="text-xs font-bold text-slate-900">Sprint 2</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-16 group">
                <div className="text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">22</div>
                <div className="w-full bg-slate-100 rounded-t-md h-[125px] relative overflow-hidden group-hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300"></div>
                <span className="text-xs font-medium text-slate-400">Sprint 3</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> In Progress
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div> Planned
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}