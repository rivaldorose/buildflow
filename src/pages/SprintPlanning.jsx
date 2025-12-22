import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { 
  ArrowLeft, X, CalendarClock, Minus, Plus, Calendar, ChevronDown,
  PencilLine, BarChart2, Sparkles, ArrowRight
} from 'lucide-react';

export default function SprintPlanning() {
  const navigate = useNavigate();
  const [sprintsEnabled, setSprintsEnabled] = useState(true);
  const [duration, setDuration] = useState(2);
  const [startDay, setStartDay] = useState('Monday');
  const [sprintCount, setSprintCount] = useState(4);
  const [velocity, setVelocity] = useState(20);
  const [sprintNames, setSprintNames] = useState({
    1: 'Planning & Setup',
    2: 'Core Features'
  });
  const [reminders, setReminders] = useState({
    ending: true,
    planning: true,
    standup: false
  });

  const durations = [1, 2, 3, 4];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const toggleReminder = (key) => {
    setReminders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const createProjectMutation = useMutation({
    mutationFn: async (projectData) => {
      return await base44.entities.Project.create(projectData);
    },
    onSuccess: (project) => {
      localStorage.setItem('newProjectId', project.id);
      localStorage.removeItem('projectSetup');
      navigate(createPageUrl('ProjectReady'));
    }
  });

  const handleFinish = async () => {
    const setupData = JSON.parse(localStorage.getItem('projectSetup') || '{}');
    
    const projectData = {
      name: setupData.name || 'New Project',
      description: setupData.description || '',
      ai_builder: setupData.aiBuilder?.primaryBuilder === 'base44' ? 'Base44' : 
                  setupData.aiBuilder?.primaryBuilder === 'lovable' ? 'Lovable' :
                  setupData.aiBuilder?.primaryBuilder === 'v0' ? 'v0' : 'Cursor',
      status: 'Planning',
      progress: 0
    };

    createProjectMutation.mutate(projectData);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200 flex flex-col max-h-[90vh] relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100 absolute top-0 left-0 z-20">
          <div className="h-full bg-blue-500 w-[83%] rounded-r-full transition-all duration-500"></div>
        </div>

        {/* Header */}
        <div className="px-8 pt-6 pb-2 flex items-center justify-between shrink-0 bg-white z-10">
          <button 
            onClick={() => navigate(createPageUrl('AIBuilderPreferences'))}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -ml-1 rounded-md hover:bg-slate-50 group"
          >
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Step 5 of 6</span>
            <button 
              onClick={() => navigate(createPageUrl('Home'))}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-8 py-6 overflow-y-auto flex-1">
          
          {/* Hero Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Sprint Planning</h1>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Optional</span>
            </div>
            <p className="text-slate-500 text-[15px]">Organize your work into sprints for better productivity and tracking.</p>
          </div>

          {/* Main Toggle Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Use Sprint Planning</h3>
                <p className="text-xs text-slate-500">Enable 2-week cycles for this project</p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <label className="flex items-center cursor-pointer relative">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={sprintsEnabled}
                onChange={(e) => setSprintsEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Sprint Configuration Form */}
          {sprintsEnabled && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* Settings Section */}
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  Sprint Settings
                  <div className="h-px bg-slate-100 flex-1"></div>
                </h2>

                <div className="space-y-5">
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sprint Duration</label>
                    <div className="grid grid-cols-4 gap-2">
                      {durations.map(weeks => (
                        <label key={weeks} className="cursor-pointer">
                          <input 
                            type="radio" 
                            name="duration" 
                            className="sr-only"
                            checked={duration === weeks}
                            onChange={() => setDuration(weeks)}
                          />
                          <div className={`border rounded-lg py-2 text-center text-sm font-medium transition-all ${
                            duration === weeks 
                              ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-[0_0_0_1px_#3B82F6]' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                          }`}>
                            {weeks} week{weeks > 1 ? 's' : ''}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Start Day & Date */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Sprint Start Day</label>
                      <div className="relative">
                        <select 
                          value={startDay}
                          onChange={(e) => setStartDay(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2.5 shadow-sm"
                        >
                          {weekDays.map(day => (
                            <option key={day}>{day}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <input 
                          type="text" 
                          value="Dec 23, 2024"
                          readOnly
                          className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm cursor-pointer hover:border-slate-300"
                        />
                        <div className="absolute -bottom-5 left-0 text-[10px] text-slate-400 font-medium pl-1">Starts next Monday</div>
                      </div>
                    </div>
                  </div>

                  {/* Sprint Count */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Sprints</label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-sm w-32">
                        <button 
                          onClick={() => setSprintCount(Math.max(1, sprintCount - 1))}
                          className="px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-l-lg border-r border-slate-100 hover:text-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input 
                          type="number" 
                          value={sprintCount}
                          onChange={(e) => setSprintCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                          className="w-full text-center text-sm font-semibold text-slate-900 border-none focus:ring-0 p-0 h-full"
                          min="1"
                          max="20"
                        />
                        <button 
                          onClick={() => setSprintCount(Math.min(20, sprintCount + 1))}
                          className="px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-r-lg border-l border-slate-100 hover:text-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-slate-400">Planning for approx. {sprintCount * duration} weeks</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Visual */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-blue-900">Your Sprint Plan</h3>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Dec 23 - Feb 17</span>
                </div>

                {/* Horizontal Timeline Bar */}
                <div className="flex gap-1 mb-5 h-8 w-full">
                  {[1, 2, 3, 4].slice(0, sprintCount).map((s, idx) => (
                    <div 
                      key={s}
                      className={`flex-1 relative group cursor-help ${
                        idx === 0 ? 'bg-blue-500 rounded-l-md' : 
                        idx === 1 ? 'bg-blue-200' : 
                        'bg-slate-200'
                      } ${idx === sprintCount - 1 ? 'rounded-r-md' : ''}`}
                    >
                      <div className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${
                        idx === 0 ? 'text-white opacity-90' :
                        idx === 1 ? 'text-blue-700 opacity-60' :
                        'text-slate-500 opacity-60'
                      }`}>
                        S{s}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timeline Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"></div>
                      <span className="font-medium text-slate-700">Sprint 1</span>
                      <span className="text-xs text-slate-400">Dec 23 - Jan 6</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-white border border-blue-100 px-1.5 py-0.5 rounded">Upcoming</span>
                  </div>
                  <div className="flex items-center justify-between text-sm opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <span className="font-medium text-slate-700">Sprint 2</span>
                      <span className="text-xs text-slate-400">Jan 6 - Jan 20</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Planned</span>
                  </div>
                  {sprintCount > 2 && (
                    <div className="pl-5 pt-1">
                      <div className="h-4 border-l border-slate-200 border-dashed"></div>
                      <span className="text-[11px] text-slate-400 pl-2">+ {sprintCount - 2} more sprints planned</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible: Sprint Names */}
              <details className="group border-t border-slate-100 pt-6">
                <summary className="flex items-center justify-between cursor-pointer list-none select-none text-slate-700 hover:text-blue-600 transition-colors">
                  <div className="flex items-center gap-2">
                    <PencilLine className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="font-medium text-sm">Customize Sprint Names</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="pt-4 pl-6 space-y-3">
                  {[1, 2].map(num => (
                    <div key={num} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 w-6">S{num}</span>
                      <input 
                        type="text" 
                        value={sprintNames[num]}
                        onChange={(e) => setSprintNames({ ...sprintNames, [num]: e.target.value })}
                        className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  ))}
                  <div className="mt-2">
                    <button 
                      onClick={() => setSprintNames({ 1: 'Planning & Setup', 2: 'Core Features' })}
                      className="text-[11px] text-slate-400 hover:text-slate-600 underline decoration-slate-300"
                    >
                      Reset to default names
                    </button>
                  </div>
                </div>
              </details>

              {/* Collapsible: Velocity */}
              <details className="group border-t border-slate-100 pt-6">
                <summary className="flex items-center justify-between cursor-pointer list-none select-none text-slate-700 hover:text-blue-600 transition-colors">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="font-medium text-sm">Initial Velocity</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="pt-4 pl-6">
                  <p className="text-xs text-slate-500 mb-3">Estimated story points per sprint. This auto-adjusts later.</p>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      value={velocity}
                      onChange={(e) => setVelocity(parseInt(e.target.value))}
                      className="w-48 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="w-12 h-8 flex items-center justify-center bg-slate-100 rounded border border-slate-200 font-mono text-sm font-semibold text-slate-700">
                      {velocity}
                    </div>
                  </div>
                </div>
              </details>

              {/* Reminders */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Sprint Reminders</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={reminders.ending}
                      onChange={() => toggleReminder('ending')}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      Remind me when sprint is ending (2 days before)
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={reminders.planning}
                      onChange={() => toggleReminder('planning')}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      Remind me to plan next sprint
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={reminders.standup}
                      onChange={() => toggleReminder('standup')}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      Daily standup reminder (9:00 AM)
                    </span>
                  </label>
                </div>
              </div>

              {/* Benefits Box */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-200" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900 mb-1">Why use sprints?</h4>
                  <ul className="text-[13px] text-emerald-800/80 space-y-1 list-disc list-inside marker:text-emerald-400">
                    <li>Focus on a manageable set of tasks</li>
                    <li>Track velocity to improve future estimates</li>
                    <li>Prevent scope creep during development</li>
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 p-6 z-20">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate(createPageUrl('AIBuilderPreferences'))}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                Previous
              </button>
              <button 
                onClick={handleFinish}
                className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip Sprint Planning
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">You can edit this later</span>
              <button 
                onClick={handleFinish}
                disabled={createProjectMutation.isPending}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group active:scale-[0.98]"
              >
                {createProjectMutation.isPending ? 'Creating...' : 'Finish Setup'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}