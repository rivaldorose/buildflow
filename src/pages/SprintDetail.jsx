import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  ArrowLeft, Edit2, Edit3, Calendar, Zap, CheckCircle2, Clock,
  Target, CheckCircle, Rocket, TrendingUp, BarChart2, Settings,
  MoreVertical, Activity, KanbanSquare, Plus, UploadCloud,
  FileText, Download, ExternalLink, ChevronDown, Square, Check,
  UserPlus, PlusSquare
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export default function SprintDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sprintId = searchParams.get('id');
  const queryClient = useQueryClient();

  // Get sprint data
  const { data: sprint, isLoading: sprintLoading } = useQuery({
    queryKey: ['sprint', sprintId],
    queryFn: async () => {
      const sprints = await base44.entities.Sprint.filter({ id: sprintId });
      return sprints[0];
    },
    enabled: !!sprintId
  });

  // Get project data
  const { data: project } = useQuery({
    queryKey: ['project', sprint?.project],
    queryFn: async () => {
      if (!sprint?.project) return null;
      const projects = await base44.entities.Project.filter({ id: sprint.project });
      return projects[0];
    },
    enabled: !!sprint?.project
  });

  // Get project todos for progress calculation
  const { data: projectTodos = [] } = useQuery({
    queryKey: ['projectTodos', sprint?.project],
    queryFn: async () => {
      if (!sprint?.project) return [];
      return await base44.entities.ProjectTodo.filter({ project: sprint.project });
    },
    enabled: !!sprint?.project
  });

  // Calculate real progress from todos
  const totalTasks = projectTodos.length;
  const completedTasks = projectTodos.filter(t => t.completed).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const daysLeft = sprint && sprint.end_date 
    ? Math.max(0, differenceInDays(new Date(sprint.end_date), new Date()))
    : 0;

  const getSprintDuration = () => {
    if (!sprint?.start_date || !sprint?.end_date) return 'TBD';
    const start = new Date(sprint.start_date);
    const end = new Date(sprint.end_date);
    const days = differenceInDays(end, start) + 1;
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')} (${days} days)`;
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'TBD';
    try {
      return `${format(new Date(startDate), 'MMM d')} - ${format(new Date(endDate), 'MMM d')}`;
    } catch {
      return 'Invalid date';
    }
  };

  if (sprintLoading) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Loading sprint...</div>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Sprint not found</div>
      </div>
    );
  }

  const objectives = sprint.objectives || [];

  return (
    <div className="bg-[#FAF8F5] min-h-screen flex flex-col">
      {/* TOP BAR (Project Header) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 lg:px-12 py-5">
          {/* Back Link */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors text-sm font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {project ? project.name : 'Sprints'}
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Sprint Identity */}
            <div className="flex items-start gap-5 w-full lg:w-[60%]">
              {/* Sprint Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B46C1] to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0 cursor-pointer hover:opacity-90 transition-opacity relative group">
                <Target className="w-7 h-7" />
                <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Edit2 className="w-4 h-4 text-white" />
                </div>
        </div>

              {/* Info Stack */}
              <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight cursor-pointer hover:text-[#6B46C1] transition-colors">
                    {sprint.name || 'Untitled Sprint'}
                  </h1>
                  <button className="text-slate-300 hover:text-slate-500">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                {sprint.goal && (
                  <p className="text-[#6B7280] text-base">{sprint.goal}</p>
                )}
                
                <div className="flex items-center flex-wrap gap-3 mt-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-green-50 text-[#10B981] text-xs font-bold border border-green-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    {sprint.status === 'active' ? 'Active' : sprint.status || 'Active'}
                  </span>
                  {project && (
                    <>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                        {project.name}
                      </span>
                    </>
                  )}
                  {sprint.start_date && (
                    <span className="text-xs text-slate-400 font-medium ml-1">
                      Started {format(new Date(sprint.start_date), 'MMM d, yyyy')}
                </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right: Quick Stats & Actions */}
            <div className="flex flex-col lg:items-end gap-4 w-full lg:w-[40%]">
              {/* Quick Stats */}
              <div className="flex items-center gap-6 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5 w-32">
                    <span>Progress</span>
                    <span className="text-[#6B46C1]">{progress}%</span>
                </div>
                  <div className="w-32 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#6B46C1] h-1.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
              </div>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Zap className="w-3.5 h-3.5 text-[#F97316]" />
                    {sprint.name || 'Sprint'}
                </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5">{daysLeft} days left</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                  <BarChart2 className="w-4 h-4" />
                  Analytics
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-8 px-6 lg:px-12 border-t border-slate-100 overflow-x-auto">
          <button className="py-4 text-[15px] font-bold text-[#6B46C1] border-b-2 border-[#6B46C1] whitespace-nowrap">
            Overview
          </button>
          <button className="py-4 text-[15px] font-medium text-slate-500 hover:text-[#6B46C1] border-b-2 border-transparent hover:border-[#6B46C1]/20 transition-all whitespace-nowrap">
            Board
          </button>
          <button className="py-4 text-[15px] font-medium text-slate-500 hover:text-[#6B46C1] border-b-2 border-transparent hover:border-[#6B46C1]/20 transition-all whitespace-nowrap">
            Tasks
          </button>
          <button className="py-4 text-[15px] font-medium text-slate-500 hover:text-[#6B46C1] border-b-2 border-transparent hover:border-[#6B46C1]/20 transition-all whitespace-nowrap">
            Team
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Main) */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            
            {/* SECTION 1: ACTIVE SPRINT */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08),0_4px_8px_rgba(0,0,0,0.04)] card-transition p-8 border-l-[6px] border-l-[#10B981] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Activity className="w-32 h-32 text-green-50 -rotate-12" />
              </div>

              {/* Header */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold text-[#10B981] border border-green-100 uppercase tracking-wide">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                      </span>
                      Active Sprint
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{sprint.name || 'Untitled Sprint'}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {getSprintDuration()}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-3xl font-bold text-slate-900 font-mono">{daysLeft}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Days Left</div>
                </div>
              </div>

              {/* Progress */}
              <div className="relative z-10 mb-8">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Sprint Progress</span>
                  <span className="text-sm font-mono font-bold text-[#10B981]">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="bg-[#10B981] h-3 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)] relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
              </div>
            </div>
                <div className="flex justify-between mt-2 text-xs font-medium text-slate-500">
                  <span>{completedTasks} tasks done</span>
                  <span>{totalTasks} total tasks</span>
          </div>
        </div>

              {/* Stats Grid */}
              <div className="relative z-10 grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Health</div>
                  <div className="text-lg font-bold text-[#10B981] flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Good
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Velocity</div>
                  <div className="text-lg font-bold text-[#6B46C1] font-mono">
                    {sprint.start_date ? Math.round(completedTasks / Math.max(1, differenceInDays(new Date(), new Date(sprint.start_date)))) : 'N/A'}
                  </div>
            </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Blockers</div>
                  <div className="text-lg font-bold text-slate-400">
                    {projectTodos.filter(t => t.priority === 'High' && !t.completed).length}
                  </div>
                        </div>
                      </div>

              {/* Objectives & Actions */}
              <div className="relative z-10 flex flex-col md:flex-row gap-8 border-t border-slate-100 pt-6">
                      <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Objectives</h3>
                  <div className="space-y-2">
                    {objectives.length > 0 ? (
                      objectives.map((objective, idx) => {
                        const isCompleted = objective.status === 'completed' || objective.priority === 'completed';
                        return (
                          <div key={idx} className="flex items-center gap-3 group/item cursor-pointer">
                            <div className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              isCompleted
                                ? 'border-[#10B981] bg-[#10B981] text-white'
                                : 'border-slate-300 group-hover/item:border-[#6B46C1]'
                            }`}>
                              {isCompleted && <Check className="w-3 h-3" />}
                            </div>
                            <span className={`text-sm ${
                              isCompleted
                                ? 'text-slate-500 line-through decoration-slate-300'
                                : 'text-slate-700 font-medium'
                            }`}>
                              {objective.title || `Objective ${idx + 1}`}
                              </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400">No objectives defined</p>
                        )}
                      </div>
                    </div>
                <div className="flex items-end gap-3">
                  <button className="px-5 py-2.5 bg-[#6B46C1] hover:bg-[#553C9A] text-white text-sm font-semibold rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95 flex items-center gap-2">
                    <KanbanSquare className="w-4 h-4" />
                    Open Board
                  </button>
                  <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-colors">
                    Add Task
                  </button>
                      </div>
                    </div>
            </section>

            {/* SECTION 2: PROJECT STATISTICS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-purple-50 text-[#6B46C1] group-hover:bg-[#6B46C1] group-hover:text-white transition-colors">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Total Progress</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 font-mono mb-2">{progress}%</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#6B46C1] to-[#4A90E2] h-1.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
            </div>
                <p className="text-[10px] text-slate-400">{completedTasks} of {totalTasks} tasks</p>
              </div>

              {/* Stat 2 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-green-50 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Tasks Done</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 font-mono mb-2">{completedTasks}</div>
                <p className="text-[10px] text-slate-400">Out of {totalTasks} total</p>
              </div>

              {/* Stat 3 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-blue-50 text-[#4A90E2] group-hover:bg-[#4A90E2] group-hover:text-white transition-colors">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Avg Velocity</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 font-mono mb-2">
                  {sprint.start_date ? Math.round(completedTasks / Math.max(1, differenceInDays(new Date(), new Date(sprint.start_date)))) : '0'}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  Tasks per day
            </div>
          </div>

              {/* Stat 4 */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-orange-50 text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Time Left</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 font-mono mb-2">
                  {daysLeft}
                  <span className="text-base text-slate-400 font-sans ml-1">d</span>
            </div>
                <p className="text-[10px] text-slate-400">Days remaining</p>
              </div>
            </section>

            {/* SECTION 3: RECENT ACTIVITY */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                <button className="text-sm font-semibold text-[#6B46C1] hover:text-indigo-800">View All</button>
              </div>
              
              <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-4 before:w-px before:bg-slate-200">
                {projectTodos.filter(t => t.completed).slice(0, 5).map((todo, idx) => {
                  // Try to parse updated_date or created_date for timestamp
                  const todoDate = todo.updated_date || todo.created_date || new Date().toISOString();
                  const dateStr = format(new Date(todoDate), 'MMM d, yyyy');
                  
                  return (
                    <div key={todo.id || idx} className="relative flex gap-4 items-start group">
                      <div className="absolute -left-[21px] mt-1.5 w-2.5 h-2.5 rounded-full bg-green-200 border-2 border-white ring-1 ring-slate-100 group-hover:bg-[#10B981] transition-colors"></div>
                      <div className="w-8 h-8 rounded-full bg-[#6B46C1] text-white flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">
                          <span className="font-semibold">Task completed:</span> {todo.task || 'Untitled task'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{dateStr}</p>
                      </div>
                    </div>
                  );
                })}
                {projectTodos.filter(t => t.completed).length === 0 && (
                  <p className="text-sm text-slate-400 italic">No completed tasks yet</p>
                )}
              </div>

              <button className="w-full mt-6 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors border border-dashed border-slate-200">
                Show more activity
              </button>
            </section>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="xl:col-span-1 flex flex-col gap-8">
            
            {/* Sprint Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Sprint Info</h3>
                <button className="text-slate-400 hover:text-[#6B46C1]">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">Status</span>
                  <div className="relative">
                    <select className="appearance-none bg-green-50 text-[#10B981] text-xs font-bold pl-2 pr-6 py-1 rounded cursor-pointer border-none focus:ring-0">
                      <option>Active</option>
                      <option>Planning</option>
                      <option>Completed</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-[#10B981] absolute right-1.5 top-1.5 pointer-events-none" />
            </div>
          </div>

                {sprint.start_date && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500 font-medium">Start Date</span>
                    <span className="text-sm text-slate-900 font-medium">
                      {format(new Date(sprint.start_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}

                {sprint.end_date && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500 font-medium">End Date</span>
                    <span className="text-sm text-slate-900 font-medium">
                      {format(new Date(sprint.end_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}

                {sprint.duration_weeks && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500 font-medium">Duration</span>
                    <span className="text-sm text-slate-900 font-medium">{sprint.duration_weeks} weeks</span>
                  </div>
                )}

                {project && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500 font-medium">Project</span>
                    <Link
                      to={createPageUrl('ProjectDetail') + `?id=${project.id}`}
                      className="text-sm text-[#6B46C1] hover:underline font-medium"
                    >
                      {project.name}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Team <span className="text-slate-400 font-normal text-sm">
                    ({sprint.team_members?.length || 0})
                  </span>
                </h3>
                <button className="text-xs font-bold text-[#6B46C1] hover:bg-purple-50 px-2 py-1 rounded transition-colors">
                  <UserPlus className="w-3 h-3 inline mr-1" />
                  Invite
                </button>
              </div>

              <div className="space-y-4">
                {sprint.team_members && sprint.team_members.length > 0 ? (
                  sprint.team_members.map((memberId, idx) => {
                    const colors = ['bg-[#6B46C1]', 'bg-purple-500', 'bg-blue-500'];
                    const initials = memberId.substring(0, 2).toUpperCase();
                    return (
                      <div key={idx} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                        <div className="relative">
                          <div className={`w-9 h-9 rounded-full ${colors[idx % colors.length]} text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm`}>
                            {initials}
                          </div>
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900">Member {idx + 1}</h4>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Member</span>
              </div>
                          <p className="text-xs text-slate-500">Active</p>
                </div>
              </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-400">No team members assigned</p>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:text-[#6B46C1] hover:border-[#6B46C1] hover:bg-purple-50 transition-all group text-left shadow-sm">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500 group-hover:bg-white group-hover:text-[#6B46C1] transition-colors">
                    <Zap className="w-4 h-4" />
                  </div>
                  Start New Sprint
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:text-[#6B46C1] hover:border-[#6B46C1] hover:bg-purple-50 transition-all group text-left shadow-sm">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500 group-hover:bg-white group-hover:text-[#6B46C1] transition-colors">
                    <PlusSquare className="w-4 h-4" />
              </div>
                  Create Task
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:text-[#6B46C1] hover:border-[#6B46C1] hover:bg-purple-50 transition-all group text-left shadow-sm">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500 group-hover:bg-white group-hover:text-[#6B46C1] transition-colors">
                    <UserPlus className="w-4 h-4" />
              </div>
                  Invite Member
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      </div>
  );
}
