import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, Sparkles, Layout as LayoutIcon, ArrowUpLeft, Mic, 
  Smartphone, Eye, ListChecks, Layers, CheckCircle2, AlertCircle, 
  Check, AlertTriangle, ChevronDown, ArrowRight
} from 'lucide-react';

export default function ReviewCreatePage() {
  const navigate = useNavigate();
  const [selectedSprint, setSelectedSprint] = useState('current');
  const [assignee, setAssignee] = useState('You (Admin)');
  const [priority, setPriority] = useState('Medium');
  const [applyDesignSystem, setApplyDesignSystem] = useState(true);
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);

  const handleCreate = () => {
    // Save all data and navigate
    localStorage.setItem('pageCreated', JSON.stringify({
      sprint: selectedSprint,
      assignee,
      priority,
      applyDesignSystem
    }));
    navigate(createPageUrl('Pages'));
  };

  const features = [
    { icon: '🎤', name: 'Mic Recording', priority: 'HIGH', todos: 6, completed: 0 },
    { icon: '📊', name: 'Waveform Visualization', priority: 'MED', todos: 5, completed: 0 },
    { icon: '🗣️', name: 'Speech-to-Text', priority: 'HIGH', todos: 5, completed: 0 }
  ];

  const priorityColors = {
    HIGH: 'bg-red-50 text-red-600 border-red-100',
    MED: 'bg-orange-50 text-orange-600 border-orange-100',
    LOW: 'bg-blue-50 text-blue-700 border-blue-100'
  };

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden relative">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="h-16 bg-white border-b border-slate-200 w-full flex items-center px-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
        </div>
        <div className="p-8 opacity-30 blur-[4px]">
          <div className="grid grid-cols-4 gap-6">
            <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
            <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10"></div>
      </div>

      {/* Main Modal */}
      <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
        <main className="w-full max-w-[1000px] bg-white rounded-2xl shadow-2xl shadow-slate-900/40 border border-slate-200 flex flex-col overflow-hidden h-[90vh]">
          
          {/* Header */}
          <div className="flex-none bg-white border-b border-slate-200 relative">
            <div className="w-full h-1 bg-slate-100">
              <div className="h-full bg-blue-600 w-full rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>

            <div className="px-8 py-6 flex justify-between items-start">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100 text-blue-600 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Review & Create Page</h1>
                  <p className="text-slate-500 text-sm font-medium mt-1">Everything looks good! Review and create your page.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right mr-2 hidden sm:block">
                  <span className="block text-xs text-slate-400 font-medium">Step 5 of 5</span>
                  <span className="text-xs font-bold text-green-600">Final Step</span>
                </div>
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  onClick={() => navigate(createPageUrl('Pages'))}
                  className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex-1 flex overflow-hidden bg-slate-50/50">
            
            {/* LEFT: REVIEW SUMMARY */}
            <div className="w-[60%] overflow-y-auto p-8 border-r border-slate-200 bg-white space-y-10">
              
              {/* Page Overview */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Page Overview</h2>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Edit Details</button>
                </div>
                
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-colors group">
                  <div className="flex items-start gap-5 border-b border-slate-100 pb-5 mb-5">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-3xl border border-slate-100 shrink-0">
                      🎤
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 truncate">Voice Practice Screen</h3>
                        <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold flex items-center gap-1.5 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Ready to Create
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        Allows users to practice negotiation scenarios using voice input, with real-time AI responses and feedback from an AI negotiation coach.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Type</span>
                      <div className="text-sm font-semibold text-slate-700 flex items-center gap-2 mt-0.5">
                        <LayoutIcon className="w-3.5 h-3.5 text-slate-400" /> Feature Screen
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Parent</span>
                      <div className="text-sm font-semibold text-slate-700 flex items-center gap-2 mt-0.5">
                        <ArrowUpLeft className="w-3.5 h-3.5 text-slate-400" /> Home Screen
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Route</span>
                      <div className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded w-fit mt-1">/voice-practice</div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Permissions</span>
                      <div className="text-sm font-semibold text-slate-700 flex items-center gap-2 mt-0.5">
                        <Mic className="w-3.5 h-3.5 text-slate-400" /> Microphone
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Design Preview */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Design Source</h2>
                  <div className="flex gap-3">
                    <button className="text-xs font-semibold text-slate-500 hover:text-slate-800">Fullscreen</button>
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Replace</button>
                  </div>
                </div>

                <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                  <div className="h-48 w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwMDAwIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMzMzMiLz4KPC9zdmc+')]"></div>
                    <div className="w-32 h-48 bg-white/10 backdrop-blur-sm rounded-t-xl border-t border-x border-white/20 transform translate-y-8 flex flex-col p-3 gap-2">
                      <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                      <div className="h-16 w-full bg-white/5 rounded-lg border border-white/10"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500/80"></div>
                        <div className="flex-1 h-8 bg-white/10 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 rounded bg-purple-500/90 text-white text-[10px] font-bold backdrop-blur-md shadow-lg border border-white/10">
                      Aura AI Generated
                    </span>
                  </div>
                  
                  <div className="bg-white p-3 flex justify-between items-center border-t border-slate-200">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile (393x852)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">2.3 MB</span>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Features & TODOs</h2>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-200">
                      {features.length} Added
                    </span>
                  </div>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Edit Features</button>
                </div>

                <div className="space-y-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-100 text-sm mr-3">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-800">{feature.name}</h4>
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${priorityColors[feature.priority]}`}>
                            {feature.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${(feature.completed / feature.todos) * 100}%` }}></div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{feature.todos} TODOs · Not started</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sprint Assignment */}
              <section>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Assign to Sprint</h2>
                
                <div className="space-y-3">
                  <label className="group flex items-start gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors bg-white">
                    <input 
                      type="radio" 
                      name="sprint" 
                      checked={selectedSprint === 'backlog'}
                      onChange={() => setSelectedSprint('backlog')}
                      className="mt-0.5 w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">Don't assign yet</span>
                      <span className="text-xs text-slate-500">Add to backlog for later planning</span>
                    </div>
                  </label>

                  <label className="group relative flex items-start gap-4 p-4 border-2 border-orange-200 bg-orange-50/30 rounded-xl cursor-pointer transition-colors shadow-sm ring-1 ring-orange-100/50">
                    <input 
                      type="radio" 
                      name="sprint" 
                      checked={selectedSprint === 'current'}
                      onChange={() => setSelectedSprint('current')}
                      className="mt-0.5 w-5 h-5 text-orange-500 border-orange-400 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                          Assign to Sprint 2: Voice & AI
                        </span>
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200 uppercase">
                          Current
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-600 flex items-center gap-3">
                        <span>Dec 16 - Dec 22</span>
                        <span className="text-slate-300">•</span>
                        <span>6 days remaining</span>
                      </div>
                      
                      <div className="mt-3 bg-white/60 p-2 rounded-lg border border-orange-200/60">
                        <div className="flex justify-between text-[10px] mb-1 font-medium">
                          <span className="text-slate-500">Capacity Load</span>
                          <span className="text-orange-600 font-bold">⚠️ +24 pts (Total: 48/32)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                          <div className="h-full bg-slate-400 w-[75%]"></div>
                          <div className="h-full bg-orange-500 w-[25%] animate-pulse"></div>
                        </div>
                        <p className="text-[10px] text-orange-600 mt-1.5 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          This page exceeds sprint capacity.
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="group flex items-start gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors bg-white">
                    <input 
                      type="radio" 
                      name="sprint" 
                      checked={selectedSprint === 'next'}
                      onChange={() => setSelectedSprint('next')}
                      className="mt-0.5 w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Assign to Sprint 3: Polish</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 uppercase">
                          Upcoming
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">Dec 23 - Jan 5 · 0 points planned</span>
                    </div>
                  </label>
                </div>
              </section>
              
              {/* Additional Settings */}
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden" open={showAdditionalSettings}>
                <summary 
                  onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors list-none"
                >
                  <span className="text-sm font-bold text-slate-700">Additional Settings</span>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Assignee, Priority, Tags</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </div>
                </summary>
                <div className="p-4 pt-0 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Assignee</label>
                      <div className="relative">
                        <select 
                          value={assignee}
                          onChange={(e) => setAssignee(e.target.value)}
                          className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option>You (Admin)</option>
                          <option>Sarah Designer</option>
                          <option>Mike Developer</option>
                          <option>Unassigned</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Priority</label>
                      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                        {['Low', 'Medium', 'High'].map((p) => (
                          <button 
                            key={p}
                            onClick={() => setPriority(p)}
                            className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${
                              priority === p 
                                ? 'bg-white text-orange-600 shadow-sm border border-slate-200' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                            }`}
                          >
                            {p === 'Medium' ? 'Med' : p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <label className="flex items-start gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      checked={applyDesignSystem}
                      onChange={(e) => setApplyDesignSystem(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-900 block">Apply DealMaker Design System</span>
                      <span className="text-xs text-slate-500">Colors, typography, and spacing will match your design system automatically.</span>
                    </div>
                  </label>
                </div>
              </details>
            </div>

            {/* RIGHT: PREVIEW & STATS */}
            <div className="w-[40%] bg-slate-50 border-l border-slate-200 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Page Card Preview */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">How it will appear</h3>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden w-full max-w-sm mx-auto transform transition-transform hover:-translate-y-1 duration-300">
                    <div className="h-32 bg-slate-800 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwMDAwIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMzMzMiLz4KPC9zdmc+')]"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-24 bg-white/10 rounded-t-lg border-t border-x border-white/10 backdrop-blur-sm"></div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
                          Voice
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎤</span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">Voice Practice</h4>
                            <p className="text-[10px] text-slate-500 font-medium">/voice-practice</p>
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <ListChecks className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold">16</span> <span className="text-slate-400 font-normal">todos</span>
                          </div>
                          <div className="w-px h-3 bg-slate-200"></div>
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold">3</span> <span className="text-slate-400 font-normal">feats</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-400 font-medium">Progress</span>
                            <span className="text-slate-600 font-bold">0%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full">
                            <div className="h-full w-0 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[10px] text-orange-700 font-bold">
                              S2
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">Dec 22</span>
                          </div>
                          <div className="flex -space-x-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Ready to Create
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Check, text: 'Page details complete', color: 'green' },
                      { icon: Check, text: 'Design added (Aura AI)', color: 'green' },
                      { icon: Check, text: '3 features defined', color: 'green' },
                      { icon: AlertCircle, text: 'Sprint 2 Overloaded', color: 'orange' }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      const colorClasses = item.color === 'green' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-orange-100 text-orange-600';
                      return (
                        <div key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                          <div className={`w-5 h-5 rounded-full ${colorClasses} flex items-center justify-center text-xs shrink-0`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className={`truncate ${item.color === 'orange' ? 'font-medium text-orange-700' : ''}`}>
                            {item.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                      🎉 All systems go!
                    </span>
                  </div>
                </div>

                {/* Project Impact */}
                <div className="bg-slate-100 rounded-xl border border-slate-200 p-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Project Impact</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Pages</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-lg font-bold text-slate-900">12</span>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-1 rounded">+1</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Features</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-lg font-bold text-slate-900">78</span>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-1 rounded">+3</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-orange-800">Sprint Capacity Warning</p>
                      <p className="text-[10px] text-orange-700 mt-1 leading-snug">
                        Adding this page puts Sprint 2 at 150% load. Consider moving to Sprint 3.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex-none bg-white border-t border-slate-200 p-5 flex items-center justify-between z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              ← Previous: Add Features
            </button>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-100 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready to create
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Save as Draft
              </button>
              <button 
                onClick={handleCreate}
                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all text-sm font-bold flex items-center gap-2 transform active:scale-95 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Create Page 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}