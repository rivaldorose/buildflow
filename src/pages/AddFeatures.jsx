import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, ListChecks, Bot, Sparkles, ChevronDown, GripVertical, 
  MoreHorizontal, Plus, ArrowDownUp, Activity, User, Navigation as NavIcon, 
  Server, AlertTriangle, Loader2, LayoutTemplate, Lightbulb, Check
} from 'lucide-react';

export default function AddFeatures() {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([
    {
      id: 1,
      name: 'Mic Recording',
      icon: '🎤',
      priority: 'High',
      expanded: true,
      todos: [
        { id: 1, text: 'Request iOS Microphone Permission', completed: false },
        { id: 2, text: 'Request Android Microphone Permission', completed: false },
        { id: 3, text: 'Handle Recording Start/Stop', completed: false }
      ]
    },
    {
      id: 2,
      name: 'Speech-to-Text Integration',
      icon: '🗣️',
      priority: 'High',
      expanded: false,
      todos: [
        { id: 1, text: 'Setup Speech Recognition API', completed: false },
        { id: 2, text: 'Handle real-time transcription', completed: false }
      ]
    }
  ]);

  const [aiSuggestions] = useState([
    {
      id: 1,
      name: 'Waveform Visualization',
      icon: '📊',
      priority: 'Medium',
      todos: [
        'Real-time waveform rendering',
        'Color adaptation from design system',
        'Smooth animation (60fps)'
      ]
    },
    {
      id: 2,
      name: 'Save Recordings',
      icon: '💾',
      priority: 'Low',
      description: 'Database integration for audio blobs...'
    }
  ]);

  const toggleFeatureExpanded = (featureId) => {
    setFeatures(features.map(f => 
      f.id === featureId ? { ...f, expanded: !f.expanded } : f
    ));
  };

  const toggleTodo = (featureId, todoId) => {
    setFeatures(features.map(f => 
      f.id === featureId 
        ? { 
            ...f, 
            todos: f.todos.map(t => 
              t.id === todoId ? { ...t, completed: !t.completed } : t
            )
          }
        : f
    ));
  };

  const getCompletedTodos = (feature) => {
    return feature.todos.filter(t => t.completed).length;
  };

  const getTotalTodos = () => {
    return features.reduce((sum, f) => sum + f.todos.length, 0);
  };

  const handleNext = () => {
    localStorage.setItem('pageFeatures', JSON.stringify(features));
    navigate(createPageUrl('Pages'));
  };

  const priorityColors = {
    High: 'bg-red-50 text-red-700 border-red-100',
    Medium: 'bg-orange-50 text-orange-700 border-orange-100',
    Low: 'bg-blue-50 text-blue-700 border-blue-100'
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
        <main className="w-full max-w-[1100px] bg-white rounded-2xl shadow-2xl shadow-slate-900/40 border border-slate-200 flex flex-col overflow-hidden h-[85vh]">
          
          {/* Header */}
          <div className="flex-none bg-white border-b border-slate-200">
            <div className="w-full h-1 bg-slate-100">
              <div className="h-full bg-blue-600 w-[80%] rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500"></div>
            </div>

            <div className="px-8 py-5 flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100 text-purple-600 mt-1 shadow-sm">
                  <ListChecks className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add Features & TODOs</h1>
                  <p className="text-slate-500 text-sm font-medium mt-1">Break down your page into features (optional)</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right mr-2 hidden sm:block">
                  <span className="block text-xs text-slate-400 font-medium">Step 4 of 5</span>
                  <button 
                    onClick={handleNext}
                    className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    Skip this step →
                  </button>
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
          <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT: FEATURE BUILDER */}
            <div className="w-[65%] overflow-y-auto p-8 border-r border-slate-200 bg-white space-y-8">
              
              {/* AI Suggestions */}
              <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-1 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <Bot className="w-24 h-24 text-purple-600" />
                </div>
                
                <div className="p-5 pb-3 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-purple-100 text-purple-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">AI Feature Suggestions</h3>
                      <p className="text-xs text-slate-500 font-medium">We analyzed your <span className="text-purple-700">Voice Practice Screen</span> design</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold bg-white text-purple-700 px-2 py-1 rounded border border-purple-100 shadow-sm uppercase tracking-wide">
                      {aiSuggestions.length} New
                    </span>
                  </div>

                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
                        <div className="flex items-start gap-4">
                          <input 
                            type="checkbox" 
                            className="mt-1 w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{suggestion.icon}</span>
                                <span className="text-sm font-bold text-slate-800">{suggestion.name}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${priorityColors[suggestion.priority]}`}>
                                {suggestion.priority}
                              </span>
                            </div>
                            
                            {suggestion.todos && (
                              <details className="group/details mt-3">
                                <summary className="text-xs text-purple-600 font-medium flex items-center gap-1 cursor-pointer hover:text-purple-700 select-none list-none">
                                  <span>View {suggestion.todos.length} detected TODOs</span>
                                  <ChevronDown className="w-3 h-3 group-open/details:rotate-180 transition-transform" />
                                </summary>
                                <div className="mt-3 pl-2 space-y-2 border-l-2 border-purple-100">
                                  {suggestion.todos.map((todo, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                                      <span className="text-xs text-slate-600">{todo}</span>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )}
                            
                            {suggestion.description && (
                              <div className="mt-1 text-xs text-slate-400">{suggestion.description}</div>
                            )}
                          </div>
                          <button className="text-xs font-semibold bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200">
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between">
                    <button className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1">
                      View all suggestions <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="flex gap-3">
                      <button className="text-xs font-medium text-slate-400 hover:text-slate-600">Ignore All</button>
                      <button className="text-xs font-bold text-purple-600 hover:text-purple-700">Add Selected (0)</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Added Features */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Features for Voice Practice Screen ({features.length})
                  </h2>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <ArrowDownUp className="w-3 h-3" /> Sort
                  </button>
                </div>

                {features.map((feature) => {
                  const completedCount = getCompletedTodos(feature);
                  const totalCount = feature.todos.length;
                  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                  return (
                    <div key={feature.id} className="bg-white rounded-xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors">
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 mt-1.5">
                            <GripVertical className="w-5 h-5" />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-lg border border-slate-100">
                                  {feature.icon}
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-slate-900">{feature.name}</h3>
                                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{completedCount}/{totalCount} TODOs</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${priorityColors[feature.priority]}`}>
                                  {feature.priority}
                                </span>
                                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>

                            {feature.expanded && (
                              <div className="space-y-2 pt-2">
                                {feature.todos.map((todo) => (
                                  <label key={todo.id} className="flex items-start gap-3 group/todo cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={todo.completed}
                                      onChange={() => toggleTodo(feature.id, todo.id)}
                                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className={`text-sm transition-colors ${
                                      todo.completed 
                                        ? 'text-slate-400 line-through' 
                                        : 'text-slate-600 group-hover/todo:text-slate-900'
                                    }`}>
                                      {todo.text}
                                    </span>
                                  </label>
                                ))}
                                
                                <div className="pt-2 flex items-center gap-2">
                                  <button className="text-xs font-medium text-slate-400 hover:text-blue-600 flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Add TODO
                                  </button>
                                </div>
                              </div>
                            )}

                            {!feature.expanded && (
                              <button 
                                onClick={() => toggleFeatureExpanded(feature.id)}
                                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                              >
                                <ChevronDown className="w-3 h-3" /> Expand TODOs
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex justify-between items-center rounded-b-xl">
                        <span className="text-[10px] text-slate-400 font-medium">Added just now</span>
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-xs font-semibold text-slate-500 hover:text-blue-600">Edit</button>
                          <button className="text-xs font-semibold text-slate-500 hover:text-red-600">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 transition-all group">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-blue-100 group-hover:border-blue-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">Add Feature Manually</span>
                </button>
              </div>
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="w-[35%] bg-slate-50 flex flex-col border-l border-slate-200">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" /> Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                      <span className="block text-2xl font-bold text-slate-800">{features.length}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Features</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                      <span className="block text-2xl font-bold text-slate-800">{getTotalTodos()}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">TODOs</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">High Priority</span>
                      <span className="font-bold text-slate-700">{features.filter(f => f.priority === 'High').length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Medium Priority</span>
                      <span className="font-bold text-slate-700">{features.filter(f => f.priority === 'Medium').length}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 text-center">~18 story points estimated</p>
                  </div>
                </div>

                {/* Common Features */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Common Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: User, label: 'User Input' },
                      { icon: NavIcon, label: 'Navigation' },
                      { icon: Server, label: 'API Integration' },
                      { icon: AlertTriangle, label: 'Error Handling' },
                      { icon: Loader2, label: 'Loading States' }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all flex items-center gap-1.5 group">
                          <Icon className="w-3 h-3 text-slate-400 group-hover:text-blue-500" /> {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Templates */}
                <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 space-y-3">
                  <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate className="w-3.5 h-3.5" /> Feature Templates
                  </h3>
                  {[
                    { icon: '📝', name: 'Form Validation', todos: '8 TODOs', priority: 'High Priority' },
                    { icon: '🔐', name: 'Auth & Login', todos: '10 TODOs', priority: 'Critical' }
                  ].map((template, idx) => (
                    <button key={idx} className="w-full flex items-center justify-between p-2.5 bg-white border border-blue-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{template.icon}</span>
                        <div className="text-left">
                          <span className="block text-xs font-bold text-slate-800">{template.name}</span>
                          <span className="block text-[10px] text-slate-500">{template.todos} · {template.priority}</span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                  <button className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 pt-1">
                    Browse All Templates
                  </button>
                </div>

                {/* Tips */}
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-yellow-800">Pro Tip</h4>
                      <p className="text-xs text-yellow-700 leading-relaxed">
                        Break features into small, testable TODOs. Aim for tasks that take less than 1 hour to complete.
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
              ← Previous: Page Details
            </button>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {features.length} features added
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Save as Draft
              </button>
              <button 
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all text-sm font-bold flex items-center gap-2 transform active:scale-95"
              >
                Next: Review & Create →
              </button>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}