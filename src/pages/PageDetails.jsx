import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, Layout as LayoutIcon, ChevronDown, Pencil, Code2, 
  Tags, Home, Mic, ArrowRight, Check, AlertCircle, Sparkles, Copy,
  MoreHorizontal, CheckCircle2, GitFork, Eye, ListChecks, Layers,
  AlertTriangle, Edit2
} from 'lucide-react';

export default function PageDetails() {
  const navigate = useNavigate();
  const [pageName, setPageName] = useState('Voice Practice Screen');
  const [pageIcon, setPageIcon] = useState('🎤');
  const [description, setDescription] = useState('');
  const [pageType, setPageType] = useState('Feature Screen');
  const [navTitle, setNavTitle] = useState('Voice Practice');
  const [parentPage, setParentPage] = useState('Home Screen');
  const [routePath, setRoutePath] = useState('voice-practice');
  const [componentName, setComponentName] = useState('VoicePracticeScreen');
  const [permissions, setPermissions] = useState({ microphone: true, camera: false, notifications: false, location: false });
  const [tags, setTags] = useState(['Voice', 'AI']);
  const [showTechnical, setShowTechnical] = useState(true);
  const [showMetadata, setShowMetadata] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState('auth');
  const [flowPosition, setFlowPosition] = useState('end');

  const togglePermission = (key) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleNext = () => {
    localStorage.setItem('pageDetails', JSON.stringify({
      pageName, pageIcon, description, pageType, navTitle, parentPage, routePath, permissions, tags
    }));
    navigate(createPageUrl('Pages'));
  };

  const selectedPermissions = Object.entries(permissions).filter(([k, v]) => v);

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden relative">
      
      {/* Background Context */}
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
        <main className="w-full max-w-[1000px] bg-white rounded-2xl shadow-2xl shadow-slate-900/40 border border-slate-200 flex flex-col overflow-hidden h-[85vh]">
          
          {/* Header */}
          <div className="flex-none bg-white border-b border-slate-200">
            <div className="w-full h-1 bg-slate-100">
              <div className="h-full bg-blue-600 w-[60%] rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500"></div>
            </div>

            <div className="px-8 py-5 flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100 text-blue-600 shadow-sm">
                  <LayoutIcon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Page Details</h1>
                  <p className="text-slate-500 text-sm font-medium mt-1">Configure navigation, flows, and page properties.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right mr-2 hidden sm:block">
                  <span className="block text-xs text-slate-400 font-medium">Step 3 of 5</span>
                  <span className="text-xs font-bold text-slate-700">Configuration</span>
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
            
            {/* LEFT: FORM */}
            <div className="w-[60%] overflow-y-auto p-8 border-r border-slate-200 bg-white">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-10 pb-8">
                
                {/* Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Basic Information</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">Required</span>
                  </div>

                  {/* Page Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Page Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        placeholder="e.g., Settings, Profile" 
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 text-sm transition-all shadow-sm group-hover:border-slate-400"
                        maxLength={50}
                      />
                      <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium font-mono">{pageName.length}/50</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs font-medium text-slate-400 py-1">Suggestions:</span>
                      <button type="button" className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">Mic Recording Page</button>
                      <button type="button" className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-xs font-medium hover:bg-slate-100 transition-colors">Practice Session</button>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Page Icon <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-3xl shadow-sm relative group cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                        {pageIcon}
                        <div className="absolute -bottom-1 -right-1 bg-white border border-slate-200 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="w-3 h-3 text-slate-500" />
                        </div>
                      </div>
                      <button type="button" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all">
                        Change Icon
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Description <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                      <textarea 
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={200}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 text-sm transition-all shadow-sm resize-none" 
                        placeholder="Describe what users can accomplish on this page..."
                      />
                      <span className="absolute right-3 bottom-3 text-xs text-slate-400 font-medium font-mono">{description.length}/200</span>
                    </div>
                    <p className="text-xs text-slate-500">Allows users to practice negotiation scenarios using voice input.</p>
                  </div>

                  {/* Page Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Page Type</label>
                    <div className="relative">
                      <select 
                        value={pageType}
                        onChange={(e) => setPageType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm appearance-none shadow-sm cursor-pointer hover:border-slate-400"
                      >
                        <option>Feature Screen</option>
                        <option>Main Screen</option>
                        <option>Settings</option>
                        <option>Dashboard</option>
                        <option>Form/Input</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Flow Assignment */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Assign to Flow</h2>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">NEW</span>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                    <div className="mb-6 relative z-10">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
                        User Flow
                        <span className="text-slate-400 font-normal">Group this page with related screens in a user journey</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GitFork className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <select 
                          value={selectedFlow}
                          onChange={(e) => setSelectedFlow(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-slate-400 shadow-sm"
                        >
                          <option value="none">None (not in any flow)</option>
                          <option value="auth">🔐 Authentication Flow</option>
                          <option value="onboarding">🎉 Onboarding Flow</option>
                          <option value="main">🏠 Main App Flow</option>
                          <option value="new">+ Create New Flow</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 pb-6 border-b border-slate-100">
                      <span className="block text-xs font-bold text-slate-700 mb-3">Position in flow</span>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="flow_pos" 
                            checked={flowPosition === 'end'}
                            onChange={() => setFlowPosition('end')}
                            className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">Add at end <span className="text-slate-400 font-normal ml-1">(Step 6)</span></span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="flow_pos" 
                            checked={flowPosition === 'start'}
                            onChange={() => setFlowPosition('start')}
                            className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900">Add at start <span className="text-slate-400 font-normal ml-1">(Step 1, shifts others)</span></span>
                        </label>
                        <div className="flex items-center gap-3 group">
                          <input 
                            type="radio" 
                            name="flow_pos" 
                            checked={flowPosition === 'after'}
                            onChange={() => setFlowPosition('after')}
                            className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm text-slate-700 whitespace-nowrap cursor-pointer">After:</span>
                            <select className="text-sm py-1 pl-2 pr-6 border border-slate-200 rounded bg-slate-50 text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-slate-300 transition-colors w-full">
                              <option>Email Verification</option>
                              <option>Login</option>
                              <option>Signup</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-700">Flow Preview</span>
                        <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline">
                          <Edit2 className="w-3 h-3" /> Edit Flow Order
                        </button>
                      </div>
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 overflow-x-auto">
                        <div className="flex items-center min-w-max pb-2">
                          {['Login', 'Signup', 'Forgot', 'Reset', 'Verify', 'Voice'].map((step, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && <div className="w-8 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-slate-300" /></div>}
                              <div className="flex flex-col items-center gap-2 group cursor-default">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${
                                  idx === 5 
                                    ? 'bg-blue-50 border border-blue-500 text-blue-600 ring-2 ring-blue-100 ring-offset-1' 
                                    : 'bg-white border border-slate-200 text-slate-400 group-hover:border-slate-300'
                                }`}>
                                  {idx + 1}
                                </div>
                                <span className={`text-[10px] font-medium ${
                                  idx === 5 ? 'font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded' : 'text-slate-500'
                                }`}>
                                  {step}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* Technical Details */}
                <details className="group border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden" open={showTechnical}>
                  <summary 
                    onClick={() => setShowTechnical(!showTechnical)}
                    className="px-5 py-3 bg-white border-b border-slate-200 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors select-none list-none"
                  >
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-400" /> Technical Details
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  
                  <div className="p-5 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Route Path</label>
                        <div className="flex items-center bg-white border border-slate-300 rounded-md px-3 py-2 text-sm shadow-sm">
                          <span className="text-slate-400 select-none">/</span>
                          <input 
                            type="text" 
                            value={routePath}
                            onChange={(e) => setRoutePath(e.target.value)}
                            className="flex-1 outline-none text-slate-700 font-mono text-xs ml-0.5"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Component Name</label>
                        <input 
                          type="text" 
                          value={componentName}
                          readOnly
                          className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm font-mono text-slate-500 cursor-not-allowed shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 block">Permissions Required</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries({ microphone: 'Microphone', camera: 'Camera', notifications: 'Notifications', location: 'Location' }).map(([key, label]) => (
                          <label 
                            key={key}
                            className={`flex items-center gap-2.5 p-2 rounded-md border cursor-pointer transition-colors ${
                              permissions[key] 
                                ? 'border-blue-200 bg-blue-50/50 hover:border-blue-300' 
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={permissions[key]}
                              onChange={() => togglePermission(key)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>

                {/* Metadata */}
                <details className="group border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden" open={showMetadata}>
                  <summary 
                    onClick={() => setShowMetadata(!showMetadata)}
                    className="px-5 py-3 bg-white border-b border-slate-200 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors select-none list-none"
                  >
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Tags className="w-4 h-4 text-slate-400" /> Metadata & Notes
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-200 text-xs font-semibold text-slate-700">
                          {tag} 
                          <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        placeholder="+ Add tag" 
                        className="bg-transparent text-xs outline-none min-w-[60px] placeholder:text-slate-400"
                      />
                    </div>
                    <div className="text-xs text-slate-400 flex justify-between mt-4 pt-4 border-t border-slate-200">
                      <span>Created by You</span>
                      <span>Dec 19, 2024</span>
                    </div>
                  </div>
                </details>

              </form>
            </div>

            {/* RIGHT: PREVIEW */}
            <div className="w-[40%] bg-slate-50 flex flex-col border-l border-slate-200">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Preview Card */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Preview</h3>
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
                          <span className="text-xl">{pageIcon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">{navTitle}</h4>
                            <p className="text-[10px] text-slate-500 font-medium">/{routePath}</p>
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

                        {selectedFlow !== 'none' && (
                          <div className="pt-3 border-t border-slate-100 space-y-2">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 font-medium">Flow</span>
                              <div className="flex items-center gap-1.5">
                                <GitFork className="w-3 h-3 text-slate-400" />
                                <span className="font-bold text-slate-800">🔐 Authentication</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 font-medium">Position</span>
                              <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Step 6 (Last)</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 font-medium">Connects from</span>
                              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 rounded">Email Verification</span>
                            </div>
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[10px] text-orange-700 font-bold">S2</div>
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
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Flow Length</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-lg font-bold text-slate-900">6</span>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1 rounded">Steps</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-orange-800">Sprint Capacity Warning</p>
                      <p className="text-[10px] text-orange-700 mt-1 leading-snug">Adding this page puts Sprint 2 at 150% load. Consider moving to Sprint 3.</p>
                    </div>
                  </div>
                </div>

                {/* Validation */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900">Validation</h3>
                    <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">PASSING</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-none text-green-600">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">Page name is unique</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-none text-green-600">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">Icon selected</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5 flex-none text-yellow-600">
                        <AlertCircle className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">Description recommended</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-none text-green-600">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">Valid route format</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Quick Actions</h3>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md transition-all group">
                    <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 group-hover:bg-purple-100 transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-slate-700">Auto-fill from Design</span>
                      <span className="block text-[10px] text-slate-500">Analyze uploaded image</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md transition-all group">
                    <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100 group-hover:bg-slate-100 transition-colors">
                      <Copy className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-slate-700">Use Template</span>
                      <span className="block text-[10px] text-slate-500">Pre-fill common types</span>
                    </div>
                  </button>
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
              ← Previous: Design
            </button>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All required fields complete
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Draft saved 2m ago</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Save as Draft</button>
              <button 
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all text-sm font-bold flex items-center gap-2 transform active:scale-95"
              >
                Continue to Design <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}