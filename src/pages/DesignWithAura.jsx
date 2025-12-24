import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, Palette, Sparkles, Wand2, Smartphone, Monitor, 
  LayoutGrid, Brush, Upload, ChevronDown
} from 'lucide-react';

export default function DesignWithAura() {
  const navigate = useNavigate();
  const [pageType, setPageType] = useState('onboarding');
  const [prompt, setPrompt] = useState('');
  const [device, setDevice] = useState('mobile');
  const [orientation, setOrientation] = useState('landscape');
  const [useDesignSystem, setUseDesignSystem] = useState(true);
  const [stylePreferences, setStylePreferences] = useState({
    modern: true,
    playful: false,
    professional: true,
    bold: false
  });

  const pageTypes = [
    { id: 'onboarding', icon: '🎉', label: 'Onboarding' },
    { id: 'home', icon: '🏠', label: 'Home Screen' },
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'form', icon: '📝', label: 'Form' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'mobile', icon: '📱', label: 'Mobile' },
    { id: 'checkout', icon: '💳', label: 'Checkout' }
  ];

  const examplePrompts = [
    {
      icon: '🏠',
      title: 'Home Screen',
      description: 'Create a modern home screen with welcome message, quick stats cards, and recent activity timeline...'
    },
    {
      icon: '📊',
      title: 'Dashboard',
      description: 'Design a data dashboard with key metrics at top, chart section, and sidebar navigation...'
    },
    {
      icon: '📝',
      title: 'Form Screen',
      description: 'Build a multi-step form with progress indicator, input fields, and primary submit button...'
    }
  ];

  const handleGenerate = () => {
    // Save data and proceed to next step
    localStorage.setItem('auraDesign', JSON.stringify({
      pageType,
      prompt,
      device,
      orientation,
      useDesignSystem,
      stylePreferences
    }));
    // Navigate to preview/generation page
    navigate(createPageUrl('Pages'));
  };

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden relative">
      
      {/* Background Context (Blurred) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="h-16 bg-white border-b border-slate-200 w-full"></div>
        <div className="p-8 opacity-40 blur-[2px]">
          <div className="flex justify-between mb-8">
            <div className="h-8 w-48 bg-slate-300 rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
            <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
            <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-10"></div>
      </div>

      {/* Main Modal */}
      <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
        <main className="w-full max-w-[1000px] bg-white rounded-2xl shadow-2xl shadow-slate-900/30 border border-slate-200 flex flex-col overflow-hidden max-h-[92vh]">
          
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white border-b border-slate-100">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-slate-100">
              <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 w-[40%] rounded-r-full"></div>
            </div>

            <div className="px-8 py-5 flex justify-between items-start">
              {/* Left: Back */}
              <button 
                onClick={() => navigate(createPageUrl('CreatePage'))}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {/* Center: Title */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl flex items-center justify-center mb-3 shadow-sm border border-blue-100">
                  <Palette className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Design with Aura AI</h1>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Describe your page and we'll generate it</p>
              </div>

              {/* Right: Close & Step */}
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={() => navigate(createPageUrl('Pages'))}
                  className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">Step 2 of 5</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            <div className="p-8 max-w-4xl mx-auto space-y-10">
              
              {/* 1. Page Type Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  What type of page?
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1">
                    {pageTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setPageType(type.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          pageType === type.id
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500 ring-2 ring-blue-100'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        <span className="text-lg">{type.icon}</span> {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Prompt Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    Describe Your Page
                    <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  </label>
                  <span className="text-xs font-medium text-slate-400">{prompt.length}/2000</span>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur-[2px]"></div>
                  <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={8}
                      maxLength={2000}
                      className="w-full p-4 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none leading-relaxed"
                      placeholder="Example: Create a voice practice screen for a negotiation training app. Include a large mic button in the center, waveform visualization below, and conversation history at the top. Use blue (#2563EB) as primary color with orange (#F97316) accents. Modern, Duolingo-inspired style."
                    />
                    
                    <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 flex justify-between items-center">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-colors shadow-sm text-xs font-semibold">
                        <Wand2 className="w-3.5 h-3.5" />
                        Improve with AI
                      </button>
                      <div className="text-[10px] text-slate-400 font-medium">
                        💡 Be specific about: layout, colors, components, style
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Context Inputs (Accordions) */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px bg-slate-100 flex-1"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Add Context</span>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                {/* Device & Dimensions */}
                <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden" open>
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none list-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Device & Dimensions</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
                    <div className="grid grid-cols-2 gap-8 mt-4">
                      <div className="space-y-3">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Device Type</span>
                        <div className="space-y-2">
                          {[
                            { id: 'mobile', label: 'Mobile', size: '393x852px' },
                            { id: 'tablet', label: 'Tablet', size: '768x1024px' },
                            { id: 'desktop', label: 'Desktop', size: '1440x900px' }
                          ].map((d) => (
                            <label key={d.id} className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                              <input
                                type="radio"
                                name="device"
                                checked={device === d.id}
                                onChange={() => setDevice(d.id)}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-900">{d.label}</span>
                                <span className="text-[10px] text-slate-400">{d.size}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Orientation</span>
                        <div className="flex gap-3">
                          <label className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                            orientation === 'portrait'
                              ? 'bg-blue-50 border border-blue-500 shadow-sm'
                              : 'bg-white border border-slate-200 hover:border-blue-400'
                          }`}>
                            <Smartphone className={`w-5 h-5 mb-1 ${orientation === 'portrait' ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className={`text-xs font-medium ${orientation === 'portrait' ? 'text-blue-700' : 'text-slate-600'}`}>Portrait</span>
                            <input
                              type="radio"
                              name="orientation"
                              checked={orientation === 'portrait'}
                              onChange={() => setOrientation('portrait')}
                              className="hidden"
                            />
                          </label>
                          <label className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                            orientation === 'landscape'
                              ? 'bg-blue-50 border border-blue-500 shadow-sm'
                              : 'bg-white border border-slate-200 hover:border-blue-400'
                          }`}>
                            <Monitor className={`w-5 h-5 mb-1 ${orientation === 'landscape' ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className={`text-xs font-medium ${orientation === 'landscape' ? 'text-blue-700' : 'text-slate-600'}`}>Landscape</span>
                            <input
                              type="radio"
                              name="orientation"
                              checked={orientation === 'landscape'}
                              onChange={() => setOrientation('landscape')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Design System */}
                <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none list-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Design System</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">DealMaker DS</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
                    <div className="mt-4 flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={useDesignSystem}
                        onChange={(e) => setUseDesignSystem(e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Apply DealMaker Design System</p>
                        <p className="text-xs text-slate-500 mt-0.5">Will automatically use project colors, typography (Inter), and component styles.</p>
                      </div>
                      <a href="#" className="ml-auto text-xs font-semibold text-blue-600 hover:underline">Edit System →</a>
                    </div>
                  </div>
                </details>

                {/* Brand & Style */}
                <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none list-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                        <Brush className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Brand & Style</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
                    <div className="mt-4 space-y-4">
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-blue-400 transition-colors">
                          <Upload className="w-3 h-3" /> Upload Logo
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-blue-400 transition-colors">
                          <Palette className="w-3 h-3" /> Brand Colors
                        </button>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Style Preferences</span>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries({
                            modern: 'Modern & minimal',
                            playful: 'Playful & fun',
                            professional: 'Professional',
                            bold: 'Bold & vibrant'
                          }).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={stylePreferences[key]}
                                onChange={(e) => setStylePreferences({ ...stylePreferences, [key]: e.target.checked })}
                                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                              />
                              <span className="text-sm text-slate-700">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              {/* 4. Example Prompts */}
              <div className="space-y-4 pb-4">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Need Inspiration?
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {examplePrompts.map((example, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{example.icon}</span>
                        <h4 className="text-sm font-bold text-slate-900">{example.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-3">
                        {example.description}
                      </p>
                      <button className="w-full py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100">
                        Use This
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-100 p-6 flex items-center justify-between z-30">
            <button 
              onClick={() => navigate(createPageUrl('Pages'))}
              className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Skip for now
            </button>
            <button 
              onClick={handleGenerate}
              className="relative overflow-hidden group px-8 py-3 rounded-xl text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600"></div>
              <div className="relative flex items-center gap-2 text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                Generate Designs
              </div>
            </button>
          </footer>

        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
      `}</style>
    </div>
  );
}