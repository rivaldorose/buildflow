import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, Ruler, Maximize, Layers, Plus, Check, Sparkles, ArrowRight,
  Monitor, Tablet, Smartphone, Zap
} from 'lucide-react';

export default function DesignSpacing() {
  const navigate = useNavigate();
  const [baseUnit, setBaseUnit] = useState(8);
  const [borderRadius, setBorderRadius] = useState('medium');
  const [shadowLevel, setShadowLevel] = useState('medium');
  const [showGuides, setShowGuides] = useState(false);
  const [device, setDevice] = useState('desktop');

  const baseUnitOptions = [
    { value: 4, label: 'Tight', dots: 1 },
    { value: 8, label: 'Standard', dots: 2, recommended: true },
    { value: 12, label: 'Relaxed', dots: 3 },
    { value: 0, label: 'Custom', custom: true }
  ];

  const radiusOptions = [
    { value: 'none', label: 'None', px: '0px', class: 'rounded-none' },
    { value: 'small', label: 'Small', px: '4px', class: 'rounded' },
    { value: 'medium', label: 'Medium', px: '8px', class: 'rounded-md' },
    { value: 'large', label: 'Large', px: '12px', class: 'rounded-xl' },
    { value: 'xlarge', label: 'X-Large', px: '16px', class: 'rounded-2xl' },
    { value: 'full', label: 'Full', px: '9999px', class: 'rounded-full' }
  ];

  const shadowOptions = [
    { value: 'none', label: 'None', description: 'No shadow', class: '' },
    { value: 'small', label: 'Small', description: 'Subtle elevation', class: 'shadow-sm' },
    { value: 'medium', label: 'Medium', description: 'Cards, dropdowns', class: 'shadow-md' },
    { value: 'large', label: 'Large', description: 'Modals, popovers', class: 'shadow-lg' },
    { value: 'xlarge', label: 'Extra Large', description: 'Hero sections', class: 'shadow-xl' }
  ];

  const spacingScale = [
    { token: '0', px: 0, description: 'None' },
    { token: '1', px: baseUnit / 2, description: 'Tight gaps' },
    { token: '2', px: baseUnit, description: 'Icon gap' },
    { token: '4', px: baseUnit * 2, description: 'Component padding' },
    { token: '6', px: baseUnit * 3, description: 'Card padding' },
    { token: '8', px: baseUnit * 4, description: 'Section gaps' },
    { token: '12', px: baseUnit * 6, description: 'Section padding' },
    { token: '16', px: baseUnit * 8, description: 'Major sections' }
  ];

  const handleContinue = () => {
    const spacingSetup = {
      baseUnit,
      borderRadius,
      shadowLevel,
      spacingScale
    };
    localStorage.setItem('spacingSetup', JSON.stringify(spacingSetup));
    navigate(createPageUrl('DesignComponents'));
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 overflow-hidden">
      
      {/* Main Modal */}
      <main className="w-full max-w-[1100px] h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="flex-none px-8 py-5 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigate(createPageUrl('DesignTypography'))}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide bg-blue-50 px-2.5 py-1 rounded-md">Step 4 of 6</span>
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
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">Set Up Spacing & Layout</h1>
              <p className="text-slate-500 text-sm">Define your spacing scale, border radius, and layout properties.</p>
            </div>
            <div className="w-64 pb-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-2">
                <span>Setup Progress</span>
                <span className="text-blue-600">60%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Settings */}
          <div className="w-[55%] h-full overflow-y-auto border-r border-slate-100 bg-white">
            <div className="p-8 space-y-10">
              
              {/* Base Unit */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-slate-400" /> Base Unit
                  </h2>
                  <span className="text-xs text-slate-500">Multiples of this value</span>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {baseUnitOptions.map(option => (
                    <label key={option.value} className="cursor-pointer group relative">
                      <input 
                        type="radio" 
                        name="base_unit"
                        checked={baseUnit === option.value}
                        onChange={() => setBaseUnit(option.value)}
                        className="peer sr-only"
                      />
                      {option.recommended && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                          RECOMMENDED
                        </div>
                      )}
                      <div className={`p-3 rounded-xl border transition-all text-center h-full ${
                        baseUnit === option.value
                          ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}>
                        {!option.custom && (
                          <div className="flex justify-center gap-0.5 mb-2">
                            {Array.from({ length: option.dots }).map((_, i) => (
                              <div key={i} className={`w-1 h-1 rounded-sm ${
                                baseUnit === option.value ? 'bg-blue-600' : 'bg-slate-400 group-hover:bg-slate-600'
                              }`}></div>
                            ))}
                          </div>
                        )}
                        <div className="text-lg font-semibold text-slate-900 mb-0.5">
                          {option.custom ? 'Custom' : `${option.value}px`}
                        </div>
                        <div className="text-[10px] text-slate-500">{option.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Spacing Scale */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900">Spacing Scale</h2>
                  <button className="text-[10px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100 transition-colors">
                    <Plus className="w-3 h-3" /> Add Token
                  </button>
                </div>

                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {spacingScale.map(scale => (
                    <div key={scale.token} className="flex items-center gap-4 text-xs group cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
                      <div className="w-8 font-mono text-slate-400 text-[10px]">{scale.token}</div>
                      <div className="w-24 font-medium text-slate-700">{scale.px}px</div>
                      <div className="w-32">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(scale.px, 64)}px` }}
                        ></div>
                      </div>
                      <div className="text-slate-400 text-[10px]">{scale.description}</div>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Border Radius */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Maximize className="w-4 h-4 text-slate-400" /> Border Radius
                  </h2>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {radiusOptions.map(option => (
                    <label key={option.value} className="cursor-pointer group relative">
                      <input 
                        type="radio" 
                        name="radius"
                        checked={borderRadius === option.value}
                        onChange={() => setBorderRadius(option.value)}
                        className="peer sr-only"
                      />
                      {borderRadius === option.value && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <div className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        borderRadius === option.value
                          ? 'border-blue-500 bg-blue-50/30'
                          : 'border-slate-200 hover:border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-50/30'
                      }`}>
                        <div className={`w-12 h-12 border-2 border-slate-800 mb-2 bg-white ${option.class}`}></div>
                        <span className="text-xs font-medium text-slate-700">{option.label}</span>
                        <span className="text-[10px] text-slate-400">{option.px}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Shadows */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400" /> Elevation & Shadows
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {shadowOptions.map(option => (
                    <label 
                      key={option.value}
                      className={`flex items-center p-3 rounded-lg cursor-pointer group transition-all ${
                        shadowLevel === option.value
                          ? 'bg-blue-50/30 border border-blue-500 ring-1 ring-blue-500'
                          : 'bg-white border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="shadow"
                        checked={shadowLevel === option.value}
                        onChange={() => setShadowLevel(option.value)}
                        className="peer sr-only"
                      />
                      <div className={`w-16 h-10 bg-white border border-slate-200 rounded mr-4 ${option.class}`}></div>
                      <div className="flex-1">
                        <div className={`text-xs font-semibold ${
                          shadowLevel === option.value ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-[10px] ${
                          shadowLevel === option.value ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border transition-all ${
                        shadowLevel === option.value
                          ? 'border-blue-500 bg-blue-500 shadow-sm'
                          : 'border-slate-300'
                      }`}>
                        {shadowLevel === option.value && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-1"></div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="w-[45%] h-full bg-slate-50/50 flex flex-col relative" style={{
            backgroundImage: 'linear-gradient(to right, #F1F5F9 1px, transparent 1px), linear-gradient(to bottom, #F1F5F9 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
            {/* Device Toolbar */}
            <div className="flex-none p-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm z-10">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</h3>
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 rounded-md p-0.5 border border-slate-200">
                  <button 
                    onClick={() => setDevice('desktop')}
                    className={`p-1.5 rounded transition-colors ${
                      device === 'desktop' 
                        ? 'text-slate-700 bg-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setDevice('tablet')}
                    className={`p-1.5 transition-colors ${
                      device === 'tablet' 
                        ? 'text-slate-700 bg-white rounded shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setDevice('mobile')}
                    className={`p-1.5 transition-colors ${
                      device === 'mobile' 
                        ? 'text-slate-700 bg-white rounded shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={showGuides}
                    onChange={(e) => setShowGuides(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-200 rounded-full peer-checked:bg-blue-500 relative transition-colors">
                    <div className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                      showGuides ? 'translate-x-4' : ''
                    }`}></div>
                  </div>
                  <span className="text-xs font-medium text-slate-600">Guides</span>
                </label>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              
              {/* Mockup Container */}
              <div className={`bg-white ${radiusOptions.find(r => r.value === borderRadius)?.class} ${shadowOptions.find(s => s.value === shadowLevel)?.class} border border-slate-200 overflow-hidden mx-auto max-w-sm w-full transform transition-all origin-top`}>
                
                {/* Navbar */}
                <div className={`border-b border-slate-100 flex items-center justify-between ${
                  showGuides ? 'bg-pink-50/50 border-dashed border-pink-300' : ''
                }`} style={{ padding: `${baseUnit * 2}px` }}>
                  <div className="flex items-center" style={{ gap: `${baseUnit}px` }}>
                    <div className={`w-8 h-8 bg-blue-600 ${radiusOptions.find(r => r.value === borderRadius)?.class}`}></div>
                    <div className="h-3 w-20 bg-slate-200 rounded"></div>
                  </div>
                  <div className={`h-8 w-8 rounded-full bg-slate-100`}></div>
                </div>

                {/* Hero Section */}
                <div className={`border-b border-slate-50 ${
                  showGuides ? 'bg-pink-50/50 border-dashed border-pink-300 relative' : ''
                }`} style={{ padding: `${baseUnit * 3}px` }}>
                  {showGuides && (
                    <div className="absolute top-2 right-2 text-[9px] text-pink-500 font-mono">
                      p-{baseUnit * 3} ({baseUnit * 3}px)
                    </div>
                  )}
                  
                  <div className={`w-fit px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold ${radiusOptions.find(r => r.value === borderRadius)?.class}`} style={{ marginBottom: `${baseUnit * 2}px` }}>
                    New Feature
                  </div>
                  
                  <div className="space-y-2" style={{ marginBottom: `${baseUnit * 2}px` }}>
                    <div className={`h-6 w-3/4 bg-slate-800 ${radiusOptions.find(r => r.value === borderRadius)?.class}`}></div>
                    <div className={`h-6 w-1/2 bg-slate-800 ${radiusOptions.find(r => r.value === borderRadius)?.class}`}></div>
                  </div>
                  
                  <div className={`h-3 w-full bg-slate-200 ${radiusOptions.find(r => r.value === borderRadius)?.class}`} style={{ marginBottom: `${baseUnit * 3}px` }}></div>
                  
                  <div className="flex" style={{ gap: `${baseUnit}px` }}>
                    <div className={`h-9 w-24 bg-blue-600 ${radiusOptions.find(r => r.value === borderRadius)?.class} shadow-sm`}></div>
                    <div className={`h-9 w-24 bg-white border border-slate-200 ${radiusOptions.find(r => r.value === borderRadius)?.class}`}></div>
                  </div>
                </div>

                {/* Cards Section */}
                <div className="bg-slate-50/50" style={{ padding: `${baseUnit * 3}px` }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: `${baseUnit * 2}px` }}>
                    <div className="h-4 w-24 bg-slate-300 rounded"></div>
                    <div className="h-3 w-12 bg-slate-200 rounded"></div>
                  </div>

                  <div className="space-y-4">
                    {/* Card 1 */}
                    <div className={`bg-white border border-slate-100 ${radiusOptions.find(r => r.value === borderRadius)?.class} ${shadowOptions.find(s => s.value === shadowLevel)?.class} ${
                      showGuides ? 'bg-pink-50/50 border-dashed border-pink-300' : ''
                    }`} style={{ padding: `${baseUnit * 2}px` }}>
                      <div className="flex mb-3" style={{ gap: `${baseUnit}px` }}>
                        <div className={`w-10 h-10 bg-emerald-100 text-emerald-600 ${radiusOptions.find(r => r.value === borderRadius)?.class} flex items-center justify-center`}>
                          <Check className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1.5 pt-0.5">
                          <div className="h-3 w-24 bg-slate-800 rounded"></div>
                          <div className="h-2 w-full bg-slate-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-2 w-16 bg-slate-100 rounded"></div>
                    </div>

                    {/* Card 2 */}
                    <div className={`bg-white border border-slate-100 ${radiusOptions.find(r => r.value === borderRadius)?.class} ${shadowOptions.find(s => s.value === shadowLevel)?.class}`} style={{ padding: `${baseUnit * 2}px` }}>
                      <div className="flex mb-3" style={{ gap: `${baseUnit}px` }}>
                        <div className={`w-10 h-10 bg-orange-100 text-orange-600 ${radiusOptions.find(r => r.value === borderRadius)?.class} flex items-center justify-center`}>
                          <Zap className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1.5 pt-0.5">
                          <div className="h-3 w-28 bg-slate-800 rounded"></div>
                          <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-2 w-20 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Consistency Check */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full border-4 border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-700 bg-white">
                    9.0
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Great Consistency</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Layout uses <span className="font-medium text-slate-700">{baseUnit}px base scale</span> consistently. All paddings match defined tokens.
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  <Sparkles className="w-3 h-3" /> Auto-fix
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-none bg-white border-t border-slate-200 px-8 py-4 z-40 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(createPageUrl('DesignTypography'))}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous: Typography
            </button>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {spacingScale.length} spacing tokens
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {radiusOptions.length} radius options
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
              Save Draft
            </button>
            <button 
              onClick={handleContinue}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Next: Components <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
}