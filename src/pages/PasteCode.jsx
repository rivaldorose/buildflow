import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, Code2, FileCode, Palette, Braces, Moon, Sun, Wand2, 
  Trash2, Layout, CreditCard, FormInput, LayoutDashboard, CheckCircle, 
  AlertTriangle, Monitor, Tablet, Smartphone, ChevronDown, Maximize, 
  RotateCw, Terminal, Check, AlertCircle, Settings2, ChevronUp, Plus,
  Github
} from 'lucide-react';

export default function PasteCode() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voice Practice Screen</title>
</head>
<body>
  <div class="voice-practice">
    <div class="mic-button">
      🎤
    </div>
  </div>
</body>
</html>`);
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [showConsole, setShowConsole] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const handleNext = () => {
    localStorage.setItem('pastedCode', JSON.stringify({ htmlCode, cssCode, jsCode }));
    navigate(createPageUrl('Pages'));
  };

  const templates = [
    { id: 'basic', icon: Layout, label: 'Basic Page' },
    { id: 'card', icon: CreditCard, label: 'Card Layout' },
    { id: 'form', icon: FormInput, label: 'Form' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }
  ];

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
        <main className="w-full max-w-[1400px] bg-white rounded-2xl shadow-2xl shadow-slate-900/40 border border-slate-200 flex flex-col overflow-hidden h-[90vh]">
          
          {/* Header */}
          <div className="flex-none bg-white border-b border-slate-200">
            <div className="w-full h-1 bg-slate-100">
              <div className="h-full bg-blue-600 w-[40%] rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>

            <div className="px-6 py-4 flex justify-between items-center">
              <button 
                onClick={() => navigate(createPageUrl('CreatePage'))}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
              </button>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 text-blue-600">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Paste HTML/CSS</h1>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-1">Step 2 of 5 · Add your code and see it live</p>
              </div>

              <button 
                onClick={() => navigate(createPageUrl('Pages'))}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Split Layout */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT: CODE EDITOR */}
            <div className="w-1/2 flex flex-col border-r border-slate-200 bg-[#1E293B]">
              
              {/* Editor Toolbar */}
              <div className="flex-none flex items-center justify-between px-4 h-12 border-b border-slate-700/50 bg-[#1E293B]">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveTab('html')}
                    className={`px-4 h-12 border-b-2 text-xs font-semibold flex items-center gap-2 transition-colors ${
                      activeTab === 'html' 
                        ? 'border-blue-500 text-blue-400 bg-slate-800/50' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" /> HTML
                  </button>
                  <button 
                    onClick={() => setActiveTab('css')}
                    className={`px-4 h-12 border-b-2 text-xs font-semibold flex items-center gap-2 transition-colors ${
                      activeTab === 'css' 
                        ? 'border-blue-500 text-blue-400 bg-slate-800/50' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" /> CSS
                  </button>
                  <button 
                    onClick={() => setActiveTab('js')}
                    className={`px-4 h-12 border-b-2 text-xs font-semibold flex items-center gap-2 transition-colors ${
                      activeTab === 'js' 
                        ? 'border-blue-500 text-blue-400 bg-slate-800/50' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <Braces className="w-3.5 h-3.5" /> JS
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
                    <button className="p-1 text-yellow-400 bg-slate-700 rounded shadow-sm">
                      <Moon className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-200">
                      <Sun className="w-3 h-3" />
                    </button>
                  </div>
                  <button className="text-xs font-medium text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors">
                    <Wand2 className="w-3 h-3" /> Format
                  </button>
                  <button className="text-xs font-medium text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <div className="flex-1 overflow-auto relative">
                <textarea
                  value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
                  onChange={(e) => {
                    if (activeTab === 'html') setHtmlCode(e.target.value);
                    else if (activeTab === 'css') setCssCode(e.target.value);
                    else setJsCode(e.target.value);
                  }}
                  className="w-full h-full bg-[#1E293B] text-slate-300 font-mono text-sm p-4 pl-16 resize-none focus:outline-none"
                  spellCheck={false}
                  style={{ lineHeight: '1.5rem' }}
                />
              </div>

              {/* Templates */}
              <div className="flex-none bg-[#1E293B] border-t border-slate-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Start with a Template</span>
                  <button className="text-slate-500 hover:text-slate-300">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {templates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button 
                        key={template.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs font-medium text-slate-300 hover:border-blue-500 hover:text-white hover:bg-slate-700 transition-all whitespace-nowrap"
                      >
                        <Icon className="w-3 h-3" /> {template.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Validation Status */}
              <div className="flex-none bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-green-400 font-medium">
                    <CheckCircle className="w-3 h-3" /> Valid HTML
                  </span>
                  <span className="flex items-center gap-1.5 text-yellow-400 font-medium cursor-pointer hover:underline">
                    <AlertTriangle className="w-3 h-3" /> 1 Warning
                  </span>
                </div>
                <button className="text-slate-500 hover:text-slate-300">View Details</button>
              </div>
            </div>

            {/* RIGHT: LIVE PREVIEW */}
            <div className="w-1/2 flex flex-col bg-slate-100">
              
              {/* Preview Toolbar */}
              <div className="flex-none h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                  {['desktop', 'tablet', 'mobile'].map((device) => {
                    const Icon = device === 'desktop' ? Monitor : device === 'tablet' ? Tablet : Smartphone;
                    return (
                      <button 
                        key={device}
                        onClick={() => setPreviewDevice(device)}
                        className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                          previewDevice === device 
                            ? 'bg-white shadow-sm text-slate-900' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                        title={device}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-mono text-slate-400 px-2">1440px</div>
                  <div className="h-4 w-px bg-slate-200 mx-1"></div>
                  <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded">
                    100% <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded" title="Fullscreen">
                    <Maximize className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Refresh">
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:16px_16px]">
                
                <div className="bg-white w-full h-full shadow-lg border border-slate-200 rounded-lg overflow-hidden relative">
                  {/* URL Bar Mock */}
                  <div className="h-8 bg-slate-50 border-b border-slate-200 flex items-center px-3 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded text-[10px] text-slate-400 px-2 py-0.5 text-center font-mono truncate">
                      localhost:3000/preview/voice-practice
                    </div>
                  </div>

                  {/* Rendered Content */}
                  <div className="p-12 flex flex-col items-center justify-center h-[calc(100%-32px)] bg-blue-600/5">
                    <div className="voice-practice p-8 bg-blue-600 rounded-2xl shadow-xl flex flex-col items-center gap-6 transform hover:scale-[1.02] transition-transform duration-300">
                      <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-5xl shadow-lg cursor-pointer hover:bg-orange-400 active:scale-95 transition-all">
                        🎤
                      </div>
                      <div className="text-center">
                        <div className="h-2 w-16 bg-blue-400/30 rounded mx-auto mb-2"></div>
                        <div className="h-2 w-24 bg-blue-400/30 rounded mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Console */}
              <div className="flex-none bg-white border-t border-slate-200">
                <details className="group" open={showConsole}>
                  <summary 
                    onClick={() => setShowConsole(!showConsole)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border-b border-slate-200 cursor-pointer list-none flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-400" /> Console
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Ready
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="h-32 overflow-y-auto p-3 font-mono text-xs space-y-2 bg-white">
                    <div className="flex gap-2">
                      <span className="text-slate-300 select-none">&gt;</span>
                      <span className="text-slate-600">Voice Practice loaded successfully</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-300 select-none">&gt;</span>
                      <span className="text-blue-600">Recording...</span>
                    </div>
                    <div className="flex gap-2 bg-yellow-50 p-1 -mx-1 rounded">
                      <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5" />
                      <span className="text-yellow-700 text-[11px]">Warning: Viewport meta tag missing 'viewport-fit=cover' for iPhone notch support.</span>
                    </div>
                  </div>
                </details>
              </div>

              {/* Responsive Check */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center gap-4 text-xs font-medium">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Checks</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    <Check className="w-3 h-3" /> Desktop
                  </div>
                  <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    <Check className="w-3 h-3" /> Tablet
                  </div>
                  <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                    <AlertCircle className="w-3 h-3" /> Mobile
                  </div>
                </div>
                <button className="ml-auto text-blue-600 hover:text-blue-700 text-[10px] font-bold">View Report</button>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="flex-none border-t border-slate-200 bg-white z-20">
            <details className="group" open={showSettings}>
              <summary 
                onClick={() => setShowSettings(!showSettings)}
                className="px-6 py-2 bg-slate-50 hover:bg-slate-100 cursor-pointer list-none flex items-center justify-between border-b border-slate-100"
              >
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" /> Advanced Settings & Imports
                </span>
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-6 grid grid-cols-2 gap-8 bg-slate-50/50">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase">External Libraries</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Tailwind CSS', 'Bootstrap', 'Alpine.js'].map((lib) => (
                      <button 
                        key={lib}
                        className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> {lib}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="https://cdn..." 
                      className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <button className="text-xs font-bold text-blue-600 px-2 hover:bg-blue-50 rounded">Add</button>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase">Import Code From</h3>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded shadow-sm hover:border-slate-300 transition-colors">
                      <Code2 className="w-3.5 h-3.5 text-slate-800" />
                      <span className="text-xs font-medium text-slate-700">CodePen</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded shadow-sm hover:border-slate-300 transition-colors">
                      <Github className="w-3.5 h-3.5 text-slate-800" />
                      <span className="text-xs font-medium text-slate-700">Gist</span>
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 p-5 flex items-center justify-between z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => navigate(createPageUrl('CreatePage'))}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              ← Previous: Method
            </button>
            
            <div className="flex items-center gap-3 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Code is valid & ready</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Save as Draft</button>
              <button 
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all text-sm font-bold flex items-center gap-2 transform active:scale-95"
              >
                Next: Page Details →
              </button>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}