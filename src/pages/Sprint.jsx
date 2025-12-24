import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Plus, Kanban, CalendarRange, List, ChevronDown,
  Target, Zap, CheckCircle2, CalendarClock, Users, Clock, AlertCircle,
  MoreHorizontal, Activity, CheckSquare, Filter, Settings, BarChart2,
  Copy, Check
} from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';

export default function Sprint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [viewMode, setViewMode] = useState('board');
  const [filter, setFilter] = useState('all');

  // Get project data
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => base44.entities.Project.filter({ id: projectId }).then(res => res[0]),
    enabled: !!projectId
  });

  // Get sprints
  const { data: sprints = [], isLoading } = useQuery({
    queryKey: ['sprints', projectId],
    queryFn: async () => {
      if (projectId) {
        return base44.entities.Sprint.filter({ project: projectId }, '-created_date');
      }
      return base44.entities.Sprint.list('-created_date');
    },
    enabled: true
  });

  // Categorize sprints
  const activeSprints = sprints.filter(sprint => {
    if (!sprint.start_date || !sprint.end_date) return false;
    const now = new Date();
    const start = new Date(sprint.start_date);
    const end = new Date(sprint.end_date);
    return now >= start && now <= end && sprint.status === 'active';
  });

  const upcomingSprints = sprints.filter(sprint => {
    if (!sprint.start_date) return false;
    const now = new Date();
    const start = new Date(sprint.start_date);
    return isAfter(start, now) && sprint.status !== 'completed';
  }).sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateA - dateB;
  });

  const completedSprints = sprints.filter(sprint => 
    sprint.status === 'completed' || (sprint.end_date && isBefore(new Date(sprint.end_date), new Date()))
  ).sort((a, b) => {
    const dateA = new Date(a.end_date || a.created_date);
    const dateB = new Date(b.end_date || b.created_date);
    return dateB - dateA;
  });

  // Calculate stats
  const totalSprints = sprints.length;
  const activeSprint = activeSprints[0];
  const nextSprint = upcomingSprints[0];
  const completedCount = completedSprints.length;

  const getSprintProgress = (sprint) => {
    // Mock progress calculation - replace with actual task completion logic
    if (sprint.status === 'completed') return 100;
    if (!sprint.start_date || !sprint.end_date) return 0;
    
    const now = new Date();
    const start = new Date(sprint.start_date);
    const end = new Date(sprint.end_date);
    const total = differenceInDays(end, start);
    const elapsed = differenceInDays(now, start);
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  };

  const getDaysRemaining = (sprint) => {
    if (!sprint.end_date) return 0;
    const now = new Date();
    const end = new Date(sprint.end_date);
    const days = differenceInDays(end, now);
    return Math.max(0, days);
  };

  const getDaysUntilStart = (sprint) => {
    if (!sprint.start_date) return 0;
    const now = new Date();
    const start = new Date(sprint.start_date);
    return Math.max(0, differenceInDays(start, now));
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'TBD';
    try {
      return `${format(new Date(startDate), 'MMM d')} - ${format(new Date(endDate), 'MMM d')}`;
    } catch {
      return 'Invalid date';
    }
  };

  const handleNewSprint = () => {
    if (projectId) {
      navigate(createPageUrl('SprintSetup') + `?projectId=${projectId}`);
    } else {
      navigate(createPageUrl('SprintSetup'));
    }
  };

  const handleViewSprint = (sprintId) => {
    navigate(createPageUrl('SprintDetail') + `?id=${sprintId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Loading sprints...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen flex flex-col">
      {/* TOP NAVIGATION */}
      <nav className="h-16 border-b border-slate-200 bg-white sticky top-0 z-50 px-6 flex items-center justify-between shrink-0">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-4 w-[40%]">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-800 transition-colors p-1 rounded hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-5 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 font-medium hover:text-slate-900 cursor-pointer transition-colors">
              BuildFlow
            </span>
            {project && (
              <>
                <span className="text-slate-300">/</span>
                <span className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold hover:bg-indigo-100 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {project.name}
                </span>
              </>
            )}
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">Sprints</span>
          </div>
          </div>

        {/* Center: Active Sprint Indicator */}
        {activeSprint && (
          <div className="hidden md:flex items-center justify-center w-[20%]">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span className="text-xs font-semibold text-green-700">
                {activeSprint.name || 'Active Sprint'} · Day {differenceInDays(new Date(), new Date(activeSprint.start_date)) + 1}/{differenceInDays(new Date(activeSprint.end_date), new Date(activeSprint.start_date)) + 1}
              </span>
            </div>
          </div>
        )}
            
        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-[40%]">
              {/* View Toggle */}
          <div className="hidden lg:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button 
              onClick={() => setViewMode('board')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'board'
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Board
                </button>
                <button 
                  onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
                  Timeline
                </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
              </div>

              {/* Filter */}
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors">
            <span>All Sprints</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* New Sprint Button */}
          <button
            onClick={handleNewSprint}
            className="bg-[#6B46C1] hover:bg-[#553C9A] text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-all hover:shadow-md active:translate-y-px"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Sprint</span>
          </button>
        </div>
      </nav>

      {/* SPRINT STATISTICS BAR */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-12 py-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-x-0 lg:divide-x divide-slate-100">
          
          {/* Stat 1: Total */}
          <div className="px-4 first:pl-0 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-purple-50 text-[#6B46C1]">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-500 group-hover:text-[#6B46C1] transition-colors">
                Total Sprints
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 font-mono">{totalSprints}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Across all time</p>
          </div>

          {/* Stat 2: Active */}
          {activeSprint ? (
            <div className="px-4 lg:px-8 group">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-green-50 text-green-600">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-500 group-hover:text-green-600 transition-colors">
                      Active Sprint
                    </span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 truncate">{activeSprint.name || 'Active Sprint'}</span>
                <span className="text-xs font-mono font-medium text-slate-500 whitespace-nowrap ml-2">
                  {getDaysRemaining(activeSprint)} days left
                    </span>
                  </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#10B981] h-2 rounded-full progress-bar-fill"
                  style={{ width: `${getSprintProgress(activeSprint)}%` }}
                ></div>
              </div>
                </div>
          ) : (
            <div className="px-4 lg:px-8 group">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-400">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-400">Active Sprint</span>
              </div>
              <div className="text-sm text-slate-400">No active sprint</div>
            </div>
          )}

          {/* Stat 3: Completed */}
          <div className="px-4 lg:px-8 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-blue-50 text-[#4A90E2]">
                <CheckCircle2 className="w-4 h-4" />
                  </div>
              <span className="text-sm font-semibold text-slate-500 group-hover:text-[#4A90E2] transition-colors">
                Completed
              </span>
                  </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 font-mono">{completedCount}</span>
                </div>
            <p className="text-xs text-slate-400 mt-1">
              {totalSprints > 0 ? Math.round((completedCount / totalSprints) * 100) : 0}% completion rate
            </p>
                  </div>

          {/* Stat 4: Next */}
          {nextSprint ? (
            <div className="px-4 lg:px-8 group">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-orange-50 text-[#F97316]">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-500 group-hover:text-[#F97316] transition-colors">
                  Next Sprint
                </span>
                  </div>
              <div className="font-bold text-slate-900 truncate">{nextSprint.name || 'Next Sprint'}</div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {getDaysUntilStart(nextSprint)} days away
              </p>
                </div>
          ) : (
            <div className="px-4 lg:px-8 group">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-400">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-400">Next Sprint</span>
              </div>
              <div className="text-sm text-slate-400">No upcoming sprint</div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT - BOARD VIEW */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-12">
        <div className="max-w-[1600px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            
            {/* COLUMN 1: ACTIVE */}
            <div className="flex flex-col gap-6 min-h-[600px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Sprint</h2>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {activeSprints.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* ACTIVE CARDS */}
              {activeSprints.length > 0 ? (
                activeSprints.map((sprint) => {
                  const progress = getSprintProgress(sprint);
                  const daysLeft = getDaysRemaining(sprint);
              return (
                <div 
                  key={sprint.id} 
                      onClick={() => handleViewSprint(sprint.id)}
                      className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.06)] card-transition border-l-[6px] border-l-[#10B981] group cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded text-[10px] font-bold text-green-700 uppercase tracking-wide border border-green-100">
                          <Activity className="w-3 h-3" />
                          On Track
                        </span>
                      </div>
                      
                      <div className="p-5">
                        <div className="mb-4 pr-16">
                          <span className="inline-block bg-green-50 text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded mb-2 uppercase tracking-wide">
                            Current
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#6B46C1] transition-colors">
                            {sprint.name || 'Untitled Sprint'}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatDateRange(sprint.start_date, sprint.end_date)}</span>
                          </div>
                        </div>

                        {sprint.goal && (
                          <p className="text-sm text-slate-500 mb-5 line-clamp-2">{sprint.goal}</p>
                        )}

                        {/* Progress Section */}
                        <div className="mb-5">
                          <div className="flex items-end justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-700">Progress</span>
                            <span className="text-xs font-mono font-medium text-slate-500">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#10B981] h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] progress-bar-fill"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 mb-5">
                          {sprint.team_members && sprint.team_members.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {sprint.team_members.length} Members
                            </div>
                          )}
                          {sprint.objectives && sprint.objectives.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Target className="w-3.5 h-3.5 text-slate-400" />
                              {sprint.objectives.length} Objectives
                      </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {daysLeft} days left
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {sprint.team_members && sprint.team_members.slice(0, 3).map((memberId, idx) => {
                              const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500'];
                              const initials = memberId.substring(0, 2).toUpperCase();
                              return (
                                <div
                                  key={idx}
                                  className={`w-7 h-7 rounded-full ${colors[idx % colors.length]} border-2 border-white text-[10px] text-white flex items-center justify-center font-bold`}
                                >
                                  {initials}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewSprint(sprint.id);
                              }}
                              className="px-3 py-1.5 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] text-xs font-bold rounded-md transition-colors border border-green-200/50"
                            >
                              View Board
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-sm text-slate-400">No active sprints</p>
                </div>
              )}
            </div>

            {/* COLUMN 2: UPCOMING */}
            <div className="flex flex-col gap-6 min-h-[600px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4A90E2]"></div>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upcoming</h2>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {upcomingSprints.length}
                  </span>
                </div>
                <button
                  onClick={handleNewSprint}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                    </div>

              {/* UPCOMING CARDS */}
              {upcomingSprints.length > 0 ? (
                upcomingSprints.map((sprint, idx) => {
                  const daysUntil = getDaysUntilStart(sprint);
                  const isNext = idx === 0;
                  return (
                    <div
                      key={sprint.id}
                      onClick={() => handleViewSprint(sprint.id)}
                      className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_12px_24px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.06)] card-transition border-l-[4px] ${
                        isNext ? 'border-l-[#4A90E2]' : 'border-l-slate-300'
                      } group cursor-pointer ${!isNext ? 'opacity-80 hover:opacity-100' : ''}`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                            isNext
                              ? 'bg-blue-50 text-[#4A90E2]'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isNext ? 'Next Up' : 'Draft'}
                          </span>
                          {isNext && (
                            <div className="text-[10px] font-bold text-[#4A90E2] bg-blue-50 px-2 py-0.5 rounded-full">
                              Starts in {daysUntil} days
                        </div>
                          )}
                        </div>
                        
                        <h3 className="text-base font-bold text-slate-900 leading-tight mb-1 group-hover:text-[#4A90E2] transition-colors">
                          {sprint.name || 'Untitled Sprint'}
                        </h3>
                        <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                          <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateRange(sprint.start_date, sprint.end_date)}</span>
                      </div>

                        {sprint.goal && (
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{sprint.goal}</p>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                          {sprint.objectives && sprint.objectives.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                              <span>{sprint.objectives.length} Planned</span>
                            </div>
                          )}
                          {sprint.team_members && sprint.team_members.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{sprint.team_members.length} Members</span>
                            </div>
                          )}
                          <div className="flex-1 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewSprint(sprint.id);
                              }}
                              className="text-xs font-bold text-[#4A90E2] hover:text-blue-700 transition-colors"
                            >
                              {isNext ? 'Start Sprint →' : 'Edit Plan'}
                            </button>
                          </div>
                          </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-sm text-slate-400">No upcoming sprints</p>
                </div>
              )}
                  </div>

            {/* COLUMN 3: COMPLETED */}
            <div className="flex flex-col gap-6 min-h-[600px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6B46C1]"></div>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completed</h2>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {completedSprints.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
        </div>

              {/* COMPLETED CARDS */}
              {completedSprints.length > 0 ? (
                completedSprints.map((sprint, idx) => {
                  const progress = getSprintProgress(sprint);
                  return (
                    <div
                      key={sprint.id}
                      onClick={() => handleViewSprint(sprint.id)}
                      className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_12px_24px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.06)] card-transition border-l-[4px] border-l-[#6B46C1] group cursor-pointer ${
                        idx > 0 ? 'opacity-75 hover:opacity-100' : ''
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <span className="inline-block bg-purple-50 text-[#6B46C1] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                            Completed
                          </span>
                          {sprint.end_date && (
                            <span className="text-[10px] font-medium text-slate-400">
                              Ended {format(new Date(sprint.end_date), 'MMM d')}
                        </span>
                      )}
                        </div>
                        
                        <h3 className="text-base font-bold text-slate-900 leading-tight mb-1 opacity-90">
                          {sprint.name || 'Untitled Sprint'}
                        </h3>
                        <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                          <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateRange(sprint.start_date, sprint.end_date)}</span>
                        </div>
                        
                        {/* Completed Progress */}
                        <div className="mb-4">
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#6B46C1] h-1.5 rounded-full opacity-80 progress-bar-fill"
                              style={{ width: `${progress}%` }}
                      ></div>
              </div>
            </div>
            
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3">
                            {progress === 100 ? (
                              <div className="flex items-center gap-1 text-xs text-[#10B981] font-medium bg-green-50 px-1.5 py-0.5 rounded">
                                <Check className="w-3 h-3" />
                                100%
              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                {progress}%
              </div>
                            )}
                            {sprint.objectives && sprint.objectives.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <CheckSquare className="w-3 h-3" />
                                {sprint.objectives.length}
            </div>
                            )}
          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewSprint(sprint.id);
                            }}
                            className="text-xs font-bold text-slate-400 hover:text-[#6B46C1] transition-colors"
                          >
                            Results
                          </button>
                  </div>
                    </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-sm text-slate-400">No completed sprints</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* FLOATING ACTION BUTTON (FAB) */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <div className="absolute bottom-full right-0 mb-4 hidden group-hover:flex flex-col gap-2 items-end">
          <button className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-200">
            Sprint Settings
            <Settings className="w-4 h-4 text-slate-400" />
              </button>
          <button className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-200 delay-75">
            Generate Report
            <BarChart2 className="w-4 h-4 text-slate-400" />
              </button>
          <button className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-200 delay-100">
            Use Template
            <Copy className="w-4 h-4 text-slate-400" />
              </button>
        </div>
        <button
          onClick={handleNewSprint}
          className="w-14 h-14 bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-full shadow-[0_4px_14px_rgba(107,70,193,0.5)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
