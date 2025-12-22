import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, Palette, Type, Layout, Box, Check, Monitor, Laptop, Smartphone,
  Activity, AlertTriangle, ArrowRight, FileCode, Wind, Sparkles, Braces,
  CheckCircle
} from 'lucide-react';

export default function DesignReview() {
  const navigate = useNavigate();
  const [systemName, setSystemName] = useState('DealMaker Design System');
  const [description, setDescription] = useState('Professional design system for DealMaker negotiation training app. Modern blue palette with Inter typography.');
  const [applyOption, setApplyOption] = useState('current');
  const [exportOptions, setExportOptions] = useState(['css', 'tailwind', 'aura']);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  const toggleExport = (option) => {
    setExportOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleCreate = () => {
    // Save design system
    const designSystemData = {
      name: systemName,
      description,
      applyOption,
      exportOptions,
      created: new Date().toISOString()
    };
    
    localStorage.setItem('designSystemComplete', JSON.stringify(designSystemData));
    
    // Navigate to design systems page
    navigate(createPageUrl('DesignSystems'));
  };

  const colors = [
    { name: 'Primary', color: '#2563EB' },
    { name: 'Secondary', color: '#F97316' },
    { name: 'Success', color: '#10B981' },
    { name: 'Warning', color: '#F59E0B' },
    { name: 'Error', color: '#EF4444' }
  ];

  const exportOptionsList = [
    { id: 'css', name: 'CSS Variables', icon: FileCode },
    { id: 'tailwind', name: 'Tailwind Config', icon: Wind },
    { id: 'aura', name: 'Aura Prompt', icon: Sparkles },
    { id: 'flutter', name: 'Flutter Theme', icon: Smartphone },
    { id: 'json', name: 'JSON Tokens', icon: Braces }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center overflow-hidden relative p-4">
      
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/50 to-transparent z-0 pointer-events-none"></div>

      {/* Main Modal */}
      <main className="relative z-10 w-full max-w-[1000px] h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex-none px-8 py-5 border-b border-slate-100 bg-white z-30">
          <div className="flex items-center justify-between mb-5">
            <button 
              onClick={() => navigate(createPageUrl('DesignComponents'))}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50 px-2.5 py-1 rounded-md">Step 6 of 6</span>
              <button 
                onClick={() => navigate(createPageUrl('DesignSystems'))}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between gap-8">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">Review & Create</h1>
              <p className="text-slate-500 text-sm">Looks good! Name your design system and apply it.</p>
            </div>
            <div className="w-64 pb-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-2">
                <span>Setup Progress</span>
                <span className="text-emerald-600">100%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500 rounded-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-8 max-w-5xl mx-auto space-y-10">
            
            {/* Name & Description */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-slate-900">Design System Name <span className="text-red-500">*</span></label>
                <span className="text-xs text-slate-400">{systemName.length}/50</span>
              </div>
              <div className="mb-3">
                <input 
                  type="text" 
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  className="w-full text-lg font-medium text-slate-900 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs font-medium text-slate-500 mr-1">Suggestions:</span>
                <button 
                  onClick={() => setSystemName('DealMaker DS')}
                  className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors"
                >
                  DealMaker DS
                </button>
                <button 
                  onClick={() => setSystemName('Negotiation App Theme')}
                  className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors"
                >
                  Negotiation App Theme
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 text-sm text-slate-600 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" 
                  placeholder="Describe your system..."
                />
                <button className="absolute bottom-3 right-3 text-[10px] font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-2 py-1 rounded border border-purple-100 transition-colors">
                  <Sparkles className="w-3 h-3" /> Auto-generate
                </button>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Two Column Layout */}
            <div className="flex gap-8">
              
              {/* Left: Summary */}
              <div className="w-3/5 space-y-8">
                
                {/* Colors */}
                <div className="group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="p-1 bg-blue-100 rounded text-blue-600">
                        <Palette className="w-3.5 h-3.5" />
                      </div>
                      Color Palette
                    </h3>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <div className="flex flex-wrap gap-3 mb-4">
                      {colors.map(color => (
                        <div key={color.name} className="flex flex-col gap-1 items-center">
                          <div 
                            className="w-10 h-10 rounded-full shadow-sm ring-2 ring-white"
                            style={{ backgroundColor: color.color }}
                          ></div>
                          <span className="text-[10px] font-medium text-slate-500">{color.name}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500 mb-4">
                        +4
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-3">
                      <span>Total 9 colors defined</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle className="w-3 h-3" /> All WCAG AA compliant
                      </span>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="p-1 bg-purple-100 rounded text-purple-600">
                        <Type className="w-3.5 h-3.5" />
                      </div>
                      Typography
                    </h3>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Font Families</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs font-semibold text-slate-700">Headings</div>
                          <div className="text-sm text-slate-900 font-medium">Inter <span className="text-slate-400 font-normal">Bold, Semi-bold</span></div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-700">Body</div>
                          <div className="text-sm text-slate-900 font-medium">Inter <span className="text-slate-400 font-normal">Regular, Medium</span></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Scale & Height</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">Type Scale</span>
                          <span className="font-medium text-slate-900">Major Third (1.250)</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">Base Size</span>
                          <span className="font-medium text-slate-900">16px</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">Sizes</span>
                          <span className="font-medium text-slate-900">7 defined (10-48px)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacing & Components */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <div className="p-1 bg-orange-100 rounded text-orange-600">
                          <Layout className="w-3.5 h-3.5" />
                        </div>
                        Spacing
                      </h3>
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </button>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Base Unit</span>
                        <span className="font-mono text-slate-900 bg-white border border-slate-200 px-1.5 rounded">8px</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Border Radius</span>
                        <span className="text-slate-900 font-medium">4px, 8px, 12px</span>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <div className="p-1 bg-pink-100 rounded text-pink-600">
                          <Box className="w-3.5 h-3.5" />
                        </div>
                        Components
                      </h3>
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </button>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Check className="w-3 h-3 text-emerald-500" /> Buttons
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Check className="w-3 h-3 text-emerald-500" /> Cards
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Check className="w-3 h-3 text-emerald-500" /> Inputs
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Check className="w-3 h-3 text-emerald-500" /> Badges
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Check className="w-3 h-3 text-emerald-500" /> Alerts
                        </div>
                        <div className="text-xs text-slate-400 italic">+3 more</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right: Preview */}
              <div className="w-2/5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Design System Preview</h3>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    <button 
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded ${
                        previewDevice === 'desktop' 
                          ? 'text-slate-600 bg-white shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setPreviewDevice('laptop')}
                      className={`p-1.5 ${
                        previewDevice === 'laptop' 
                          ? 'text-slate-600 bg-white rounded shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 ${
                        previewDevice === 'mobile' 
                          ? 'text-slate-600 bg-white rounded shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative group">
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur border border-slate-200 px-2 py-1 rounded text-[10px] font-medium text-slate-500 z-10 shadow-sm">
                    75%
                  </div>

                  {/* Mockup */}
                  <div className="w-full h-full overflow-y-auto p-6 origin-top transform scale-90">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                      {/* Nav */}
                      <div className="border-b border-slate-100 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-blue-600"></div>
                          <div className="h-3 w-20 bg-slate-200 rounded"></div>
                        </div>
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100"></div>
                        </div>
                      </div>
                      
                      {/* Hero */}
                      <div className="p-8">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold border border-blue-100 mb-4">
                          New Feature
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Close deals faster with better data</h1>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">Everything you need to control your pipeline and grow your business.</p>
                        
                        <div className="flex gap-3 mb-8">
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md shadow-sm shadow-blue-200">Get Started</button>
                          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md">Learn More</button>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div className="p-2 bg-emerald-50 rounded-md text-emerald-600">
                                <Activity className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] text-slate-400">Just now</span>
                            </div>
                            <div className="h-2 w-16 bg-slate-200 rounded mb-2"></div>
                            <div className="h-2 w-full bg-slate-100 rounded"></div>
                          </div>
                          
                          <div className="p-3 bg-orange-50 border border-orange-100 rounded-md flex gap-3">
                            <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                            <div>
                              <div className="h-2 w-24 bg-orange-200 rounded mb-1.5"></div>
                              <div className="h-1.5 w-32 bg-orange-200/50 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Apply to Project */}
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-5">Apply to Project</h2>
              
              <div className="space-y-3">
                <label className="cursor-pointer block">
                  <input 
                    type="radio" 
                    name="apply_option"
                    checked={applyOption === 'none'}
                    onChange={() => setApplyOption('none')}
                    className="peer sr-only"
                  />
                  <div className="flex items-start p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-50/20 peer-checked:ring-1 peer-checked:ring-blue-500 transition-all">
                    <div className="mt-0.5 mr-3 w-5 h-5 rounded-full border border-slate-300 peer-checked:border-blue-500 flex items-center justify-center bg-white">
                      {applyOption === 'none' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Create new design system only</div>
                      <div className="text-xs text-slate-500 mt-0.5">Save this system to your library but don't apply it to any project yet.</div>
                    </div>
                  </div>
                </label>

                <label className="cursor-pointer block">
                  <input 
                    type="radio" 
                    name="apply_option"
                    checked={applyOption === 'current'}
                    onChange={() => setApplyOption('current')}
                    className="peer sr-only"
                  />
                  <div className="flex items-start p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-50/20 peer-checked:ring-1 peer-checked:ring-blue-500 transition-all">
                    <div className="mt-0.5 mr-3 w-5 h-5 rounded-full border border-slate-300 peer-checked:border-blue-500 flex items-center justify-center bg-white">
                      {applyOption === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">Apply to current project: DealMaker</div>
                        <button className="text-[10px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          Preview changes <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Apply styles to all 12 pages in DealMaker. This will update existing components.</div>
                      
                      <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100 inline-block w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Warning: 12 pages will be affected</span>
                      </div>
                    </div>
                  </div>
                </label>
                
                <label className="cursor-pointer block">
                  <input 
                    type="radio" 
                    name="apply_option"
                    checked={applyOption === 'selected'}
                    onChange={() => setApplyOption('selected')}
                    className="peer sr-only"
                  />
                  <div className="flex items-start p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-50/20 peer-checked:ring-1 peer-checked:ring-blue-500 transition-all opacity-70 hover:opacity-100">
                    <div className="mt-0.5 mr-3 w-5 h-5 rounded-full border border-slate-300 peer-checked:border-blue-500 flex items-center justify-center bg-white">
                      {applyOption === 'selected' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                    </div>
                    <div className="w-full">
                      <div className="text-sm font-semibold text-slate-900">Apply to selected projects</div>
                      <div className="mt-3 space-y-2 pl-1 border-l-2 border-slate-100 ml-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked disabled className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-xs text-slate-700">DealMaker (12 pages)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-xs text-slate-700">Breathe App (8 pages)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-xs text-slate-700">Konsensi (6 pages)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Export Options */}
            <section className="pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Export Configuration</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setExportOptions(exportOptionsList.map(o => o.id))}
                    className="text-[10px] font-medium text-slate-500 hover:text-slate-800"
                  >
                    Select All
                  </button>
                  <button 
                    onClick={() => setExportOptions([])}
                    className="text-[10px] font-medium text-slate-500 hover:text-slate-800"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {exportOptionsList.map(option => {
                  const Icon = option.icon;
                  return (
                    <label key={option.id} className="cursor-pointer group relative">
                      <input 
                        type="checkbox" 
                        checked={exportOptions.includes(option.id)}
                        onChange={() => toggleExport(option.id)}
                        className="peer sr-only"
                      />
                      <div className={`h-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex flex-col gap-2 items-center text-center ${
                        exportOptions.includes(option.id)
                          ? 'bg-blue-50 border border-blue-500 text-blue-700'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}>
                        <Icon className="w-5 h-5 mb-1" />
                        <span>{option.name}</span>
                        {exportOptions.includes(option.id) && (
                          <Check className="w-4 h-4 absolute top-2 right-2 text-blue-600" strokeWidth={3} />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-none bg-white border-t border-slate-200 px-8 py-4 z-40 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(createPageUrl('DesignComponents'))}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous: Components
            </button>
            <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-800 ml-2">Save as draft</a>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-1 animate-pulse">Draft saved</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-xs font-medium text-slate-900 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
              Ready to create
            </div>
            <div className="text-[10px] text-slate-400">9 colors • 2 fonts • 8 components</div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <button 
              onClick={handleCreate}
              className="px-8 py-2.5 bg-[#10B981] text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:shadow-emerald-300 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Create Design System <Check className="w-4 h-4" strokeWidth={3} />
            </button>
            <span className="text-[10px] text-slate-400">You can edit everything after creation</span>
          </div>
        </footer>

      </main>
    </div>
  );
}