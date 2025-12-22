import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, Search, MousePointer2, TextCursorInput, LayoutTemplate, Tag,
  AlertCircle, AppWindow, ChevronDownSquare, CheckSquare, Disc, ToggleLeft,
  Check, Sparkles, MousePointer, ChevronDown, Code, ArrowRight, Mail
} from 'lucide-react';

export default function DesignComponents() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('button');
  const [activeTab, setActiveTab] = useState('primary');
  const [height, setHeight] = useState(44);
  const [paddingX, setPaddingX] = useState(24);
  const [paddingY, setPaddingY] = useState(12);
  const [bgColor, setBgColor] = useState('#2563EB');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [borderRadius, setBorderRadius] = useState('medium');
  const [hoverDarken, setHoverDarken] = useState(10);
  const [enableLift, setEnableLift] = useState(true);
  const [preset, setPreset] = useState('standard');

  const components = [
    { id: 'button', name: 'Button', icon: MousePointer2, active: true },
    { id: 'input', name: 'Input Field', icon: TextCursorInput, completed: true },
    { id: 'card', name: 'Card', icon: LayoutTemplate, completed: true },
    { id: 'badge', name: 'Badge', icon: Tag },
    { id: 'alert', name: 'Alert', icon: AlertCircle },
    { id: 'modal', name: 'Modal', icon: AppWindow },
    { id: 'dropdown', name: 'Dropdown', icon: ChevronDownSquare }
  ];

  const formComponents = [
    { id: 'checkbox', name: 'Checkbox', icon: CheckSquare },
    { id: 'radio', name: 'Radio', icon: Disc },
    { id: 'switch', name: 'Switch', icon: ToggleLeft }
  ];

  const tabs = ['Primary', 'Secondary', 'Outline', 'Ghost'];

  const presets = [
    { id: 'rounded', name: 'Rounded & Bold', desc: 'Full radius, heavy weight', radiusClass: 'rounded-full' },
    { id: 'standard', name: 'Standard Modern', desc: 'Medium radius, balanced', radiusClass: 'rounded-lg' },
    { id: 'sharp', name: 'Sharp & Minimal', desc: 'No radius, flat look', radiusClass: 'rounded-none' }
  ];

  const handleContinue = () => {
    const componentsSetup = {
      button: {
        height,
        paddingX,
        paddingY,
        bgColor,
        textColor,
        borderRadius,
        hoverDarken,
        enableLift
      }
    };
    localStorage.setItem('componentsSetup', JSON.stringify(componentsSetup));
    navigate(createPageUrl('DesignReview'));
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 overflow-hidden">
      
      {/* Main Modal */}
      <main className="w-full max-w-[1200px] h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="flex-none px-6 py-4 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => navigate(createPageUrl('DesignSpacing'))}
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back
            </button>
            <button 
              onClick={() => navigate(createPageUrl('DesignSystems'))}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-end justify-between gap-8">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight mb-0.5">Set Up Components</h1>
              <p className="text-slate-500 text-xs">Define styles for common UI components in your system.</p>
            </div>
            <div className="w-64 pb-0.5">
              <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1.5">
                <span>Step 5 of 6</span>
                <span className="text-blue-600">80%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Columns */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar: Component List */}
          <aside className="w-64 flex-none border-r border-slate-100 bg-slate-50/30 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search components..." 
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {components.map(comp => {
                const Icon = comp.icon;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setActiveComponent(comp.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all relative overflow-hidden group ${
                      activeComponent === comp.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {activeComponent === comp.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-md"></div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      {comp.name}
                    </div>
                    {comp.active && <Check className="w-3.5 h-3.5 text-blue-500" />}
                    {comp.completed && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                );
              })}

              <div className="pt-4 px-2 pb-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Form Elements</div>
                {formComponents.map(comp => {
                  const Icon = comp.icon;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setActiveComponent(comp.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors mb-0.5"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      {comp.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                <span>Configuration</span>
                <span>8/12</span>
              </div>
              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                <div className="h-full w-2/3 bg-slate-400 rounded-full"></div>
              </div>
              <a href="#" className="text-[10px] text-blue-600 hover:underline">Skip remaining</a>
            </div>
          </aside>

          {/* Middle Column: Editor */}
          <section className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-100 px-6">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Main Scrollable Area */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Large Live Preview */}
              <div className="border-b border-slate-100 p-10 flex flex-col items-center justify-center gap-8 min-h-[240px]" style={{
                backgroundImage: 'linear-gradient(to right, #F1F5F9 1px, transparent 1px), linear-gradient(to bottom, #F1F5F9 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="mb-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">Default</div>
                    <button 
                      className="px-6 py-3 text-white rounded-lg shadow-md font-semibold text-base flex items-center gap-2 transition-all"
                      style={{ 
                        backgroundColor: bgColor,
                        borderRadius: borderRadius === 'small' ? '0.375rem' : borderRadius === 'large' ? '0.75rem' : borderRadius === 'full' ? '9999px' : '0.5rem',
                        paddingLeft: `${paddingX}px`,
                        paddingRight: `${paddingX}px`,
                        paddingTop: `${paddingY}px`,
                        paddingBottom: `${paddingY}px`
                      }}
                    >
                      <Sparkles className="w-4 h-4" /> Primary Button
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">Hover</div>
                    <button 
                      className="px-6 py-3 text-white rounded-lg shadow-lg font-semibold text-base flex items-center gap-2"
                      style={{ 
                        backgroundColor: bgColor,
                        filter: `brightness(${1 - hoverDarken / 100})`,
                        borderRadius: borderRadius === 'small' ? '0.375rem' : borderRadius === 'large' ? '0.75rem' : borderRadius === 'full' ? '9999px' : '0.5rem',
                        paddingLeft: `${paddingX}px`,
                        paddingRight: `${paddingX}px`,
                        paddingTop: `${paddingY}px`,
                        paddingBottom: `${paddingY}px`,
                        transform: enableLift ? 'translateY(-1px)' : 'none'
                      }}
                    >
                      <Sparkles className="w-4 h-4" /> Primary Button
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="mb-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">Disabled</div>
                    <button 
                      className="px-6 py-3 bg-slate-100 text-slate-400 font-semibold text-base flex items-center gap-2 cursor-not-allowed border border-slate-200"
                      style={{ 
                        borderRadius: borderRadius === 'small' ? '0.375rem' : borderRadius === 'large' ? '0.75rem' : borderRadius === 'full' ? '9999px' : '0.5rem',
                        paddingLeft: `${paddingX}px`,
                        paddingRight: `${paddingX}px`,
                        paddingTop: `${paddingY}px`,
                        paddingBottom: `${paddingY}px`
                      }}
                    >
                      <Sparkles className="w-4 h-4" /> Primary Button
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Controls */}
              <div className="p-8 space-y-10 max-w-3xl mx-auto">
                
                {/* Presets */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Quick Presets</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {presets.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPreset(p.id)}
                        className={`p-3 rounded-lg border transition-all text-left group relative ${
                          preset === p.id
                            ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                      >
                        {preset === p.id && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <div className={`h-8 bg-blue-600 w-24 mb-2 shadow-sm ${p.radiusClass}`}></div>
                        <div className="text-xs font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Size Properties */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-5">Dimensions</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                      <label className="text-xs font-medium text-slate-600">Height</label>
                      <input 
                        type="range" 
                        min="20" 
                        max="60" 
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="relative">
                        <input 
                          type="number" 
                          value={height}
                          onChange={(e) => setHeight(parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-xs text-center border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                        />
                        <span className="absolute right-1 top-1.5 text-[10px] text-slate-400 pointer-events-none">px</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                      <label className="text-xs font-medium text-slate-600">Padding X</label>
                      <input 
                        type="range" 
                        min="8" 
                        max="60" 
                        value={paddingX}
                        onChange={(e) => setPaddingX(parseInt(e.target.value))}
                        className="h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="relative">
                        <input 
                          type="number" 
                          value={paddingX}
                          onChange={(e) => setPaddingX(parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-xs text-center border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                        />
                        <span className="absolute right-1 top-1.5 text-[10px] text-slate-400 pointer-events-none">px</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                      <label className="text-xs font-medium text-slate-600">Padding Y</label>
                      <input 
                        type="range" 
                        min="4" 
                        max="30" 
                        value={paddingY}
                        onChange={(e) => setPaddingY(parseInt(e.target.value))}
                        className="h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="relative">
                        <input 
                          type="number" 
                          value={paddingY}
                          onChange={(e) => setPaddingY(parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-xs text-center border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                        />
                        <span className="absolute right-1 top-1.5 text-[10px] text-slate-400 pointer-events-none">px</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Properties */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-5">Appearance</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Background Color</label>
                      <div className="flex items-center gap-2 p-1 border border-slate-200 rounded-md w-full">
                        <div 
                          className="w-6 h-6 rounded shadow-sm border border-slate-100"
                          style={{ backgroundColor: bgColor }}
                        ></div>
                        <span className="text-xs text-slate-700 font-mono">{bgColor}</span>
                        <button className="ml-auto text-[10px] text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Text Color</label>
                      <div className="flex items-center gap-2 p-1 border border-slate-200 rounded-md w-full">
                        <div 
                          className="w-6 h-6 rounded shadow-sm border border-slate-200"
                          style={{ backgroundColor: textColor }}
                        ></div>
                        <span className="text-xs text-slate-700 font-mono">{textColor}</span>
                        <button className="ml-auto text-[10px] text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-2">Corner Radius</label>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large', 'full'].map(r => (
                          <label key={r} className="flex-1 cursor-pointer">
                            <input 
                              type="radio" 
                              name="br" 
                              checked={borderRadius === r}
                              onChange={() => setBorderRadius(r)}
                              className="peer sr-only"
                            />
                            <div className={`text-center py-2 border rounded text-xs font-medium transition-all ${
                              borderRadius === r
                                ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}>
                              {r.charAt(0).toUpperCase() + r.slice(1)}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* States */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Interactive States</h3>
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
                    <details className="group" open>
                      <summary className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                          <MousePointer className="w-3.5 h-3.5 text-slate-400" /> Hover State
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 bg-white space-y-4">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <label className="text-xs font-medium text-slate-600">Background</label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">Darken by</span>
                            <input 
                              type="range" 
                              min="0" 
                              max="20" 
                              value={hoverDarken}
                              onChange={(e) => setHoverDarken(parseInt(e.target.value))}
                              className="h-1.5 flex-1 bg-slate-200 rounded-lg"
                            />
                            <span className="text-xs font-mono text-slate-600">{hoverDarken}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="lift"
                            checked={enableLift}
                            onChange={(e) => setEnableLift(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="lift" className="text-xs text-slate-700 select-none">
                            Enable subtle lift (translateY -1px)
                          </label>
                        </div>
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex items-center justify-between p-3 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                          <Disc className="w-3.5 h-3.5 text-slate-400" /> Active/Pressed
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 bg-white">
                        <span className="text-xs text-slate-400">Properties for pressed state...</span>
                      </div>
                    </details>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Right Sidebar: Live Library */}
          <aside className="w-72 flex-none border-l border-slate-100 bg-slate-50 flex flex-col z-10">
            <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
              <h3 className="text-xs font-semibold text-slate-900 mb-1">Live Preview</h3>
              <p className="text-[10px] text-slate-500">Real-time system view</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Actions */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Actions</div>
                <div className="space-y-3">
                  <button 
                    className="w-full text-white rounded-md text-sm font-medium shadow-sm transition-colors"
                    style={{ 
                      backgroundColor: bgColor,
                      paddingTop: `${paddingY}px`,
                      paddingBottom: `${paddingY}px`,
                      borderRadius: borderRadius === 'small' ? '0.375rem' : borderRadius === 'large' ? '0.75rem' : borderRadius === 'full' ? '9999px' : '0.5rem'
                    }}
                  >
                    Primary Action
                  </button>
                  <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
                    Secondary Action
                  </button>
                </div>
              </div>

              {/* Forms */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Forms</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="name@company.com" 
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs shadow-sm"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 border flex items-center justify-center"
                      style={{ 
                        backgroundColor: bgColor,
                        borderColor: bgColor,
                        borderRadius: borderRadius === 'small' ? '0.125rem' : borderRadius === 'large' ? '0.375rem' : borderRadius === 'full' ? '9999px' : '0.25rem'
                      }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-slate-600">Remember me</span>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Containers</div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      JD
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">John Doe</div>
                      <div className="text-[10px] text-slate-400">Admin User</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full w-2/3 rounded-full"
                      style={{ backgroundColor: bgColor }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Feedback</div>
                <div className="space-y-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 ring-1 ring-emerald-500/10">
                    Active
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100 ring-1 ring-amber-500/10">
                    Pending
                  </span>
                </div>
              </div>

            </div>

            {/* Export Bar */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <Code className="w-3.5 h-3.5" /> View Code
              </button>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="flex-none bg-white border-t border-slate-200 px-6 py-4 z-40 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(createPageUrl('DesignSpacing'))}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Previous: Spacing
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-700">Button Component</span>
              <span className="text-[10px] text-slate-400">Last saved 2m ago</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
              Save as Draft
            </button>
            <button 
              onClick={handleContinue}
              className="px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Next: Review & Create <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
}