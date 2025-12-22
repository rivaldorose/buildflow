import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, ChevronDown, ChevronRight, Check, Eye, AlertCircle, ArrowRight
} from 'lucide-react';

export default function DesignTypography() {
  const navigate = useNavigate();
  const [selectedPairing, setSelectedPairing] = useState('inter-inter');
  const [headingFont, setHeadingFont] = useState('Inter');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [baseSize, setBaseSize] = useState(16);
  const [scaleRatio, setScaleRatio] = useState('1.250');
  const [headingLineHeight, setHeadingLineHeight] = useState(1.2);
  const [bodyLineHeight, setBodyLineHeight] = useState(1.5);
  const [headingSpacing, setHeadingSpacing] = useState(-0.02);
  const [bodySpacing, setBodySpacing] = useState(0);
  const [selectedWeights, setSelectedWeights] = useState([400, 600, 700]);

  const fontPairings = [
    {
      id: 'inter-inter',
      name: 'Inter + Inter',
      heading: 'Inter',
      body: 'Inter',
      badge: 'Recommended',
      uses: '45k+',
      description: 'Modern Sans-serif'
    },
    {
      id: 'playfair-inter',
      name: 'Playfair Display + Inter',
      heading: 'Playfair Display',
      body: 'Inter',
      uses: '12k+',
      description: 'Serif + Sans'
    },
    {
      id: 'montserrat-opensans',
      name: 'Montserrat + Open Sans',
      heading: 'Montserrat',
      body: 'Open Sans',
      uses: '8k+',
      description: 'Sans + Sans'
    }
  ];

  const typeScale = [
    { label: 'H1', size: Math.round(baseSize * Math.pow(parseFloat(scaleRatio), 3)), text: 'Large Heading' },
    { label: 'H2', size: Math.round(baseSize * Math.pow(parseFloat(scaleRatio), 2)), text: 'Medium Heading' },
    { label: 'H3', size: Math.round(baseSize * Math.pow(parseFloat(scaleRatio), 1)), text: 'Small Heading' },
    { label: 'Body', size: baseSize, text: 'Body text regular' },
    { label: 'Small', size: Math.round(baseSize * 0.875), text: 'Small details text' }
  ];

  const handleContinue = () => {
    const typographySetup = {
      headingFont,
      bodyFont,
      baseSize,
      scaleRatio,
      headingLineHeight,
      bodyLineHeight,
      headingSpacing,
      bodySpacing,
      weights: selectedWeights
    };
    localStorage.setItem('typographySetup', JSON.stringify(typographySetup));
    navigate(createPageUrl('DesignSpacing'));
  };

  const toggleWeight = (weight) => {
    setSelectedWeights(prev => 
      prev.includes(weight) 
        ? prev.filter(w => w !== weight)
        : [...prev, weight]
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center overflow-hidden relative p-4">
      
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/50 to-transparent z-0 pointer-events-none"></div>

      {/* Main Modal */}
      <main className="relative z-10 w-full max-w-[1100px] h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex-none px-8 py-5 border-b border-slate-100 bg-white z-30">
          <div className="flex items-center justify-between mb-5">
            <button 
              onClick={() => navigate(createPageUrl('SelectDesignTemplate'))}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide bg-blue-50 px-2.5 py-1 rounded-md">Step 3 of 6</span>
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
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">Set Up Typography</h1>
              <p className="text-slate-500 text-sm">Choose fonts and text styles for your system.</p>
            </div>
            <div className="w-64 pb-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-2">
                <span>Setup Progress</span>
                <span>60%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-blue-600 rounded-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* LEFT: Font Settings */}
          <div className="w-1/2 overflow-y-auto p-8 border-r border-slate-100 bg-white">
            
            {/* Popular Pairings */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Start with a Popular Pairing</h3>
              </div>

              <div className="space-y-4">
                {fontPairings.map(pairing => (
                  <button
                    key={pairing.id}
                    onClick={() => {
                      setSelectedPairing(pairing.id);
                      setHeadingFont(pairing.heading);
                      setBodyFont(pairing.body);
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedPairing === pairing.id
                        ? 'bg-blue-50/50 border-2 border-blue-500'
                        : 'border border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-slate-900">{pairing.name}</span>
                      {pairing.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded">
                          {pairing.badge}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="text-2xl font-semibold tracking-tight text-slate-900">The Quick Brown Fox</div>
                      <div className="text-sm text-slate-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                      <div className="text-[10px] text-slate-500 font-medium">{pairing.description} • Used by {pairing.uses}</div>
                      {selectedPairing === pairing.id && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                          <Check className="w-4 h-4" /> Selected
                        </div>
                      )}
                    </div>
                  </button>
                ))}
                
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 pl-1">
                  View more pairings <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <hr className="border-slate-100 my-8" />

            {/* Customize Fonts */}
            <div className="mb-8">
              <div className="flex items-center justify-between w-full text-left mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Customize Fonts</h3>
              </div>

              <div className="space-y-6">
                {/* Heading Font */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">Heading Font</label>
                    <button className="text-[10px] font-medium text-blue-600 hover:text-blue-700">Browse Google Fonts</button>
                  </div>
                  <div className="relative mb-3">
                    <select 
                      value={headingFont}
                      onChange={(e) => setHeadingFont(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8"
                    >
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Helvetica Now</option>
                      <option>Montserrat</option>
                      <option>Playfair Display</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 w-4 h-4 text-slate-500" />
                  </div>
                  
                  {/* Weights */}
                  <div className="flex flex-wrap gap-2">
                    {[300, 400, 600, 700].map(weight => (
                      <label key={weight} className="cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedWeights.includes(weight)}
                          onChange={() => toggleWeight(weight)}
                          className="peer sr-only"
                        />
                        <div className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-200">
                          {weight === 300 ? 'Light 300' : weight === 400 ? 'Regular 400' : weight === 600 ? 'Semi 600' : 'Bold 700'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Body Font */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">Body Font</label>
                  </div>
                  <div className="relative mb-3">
                    <select 
                      value={bodyFont}
                      onChange={(e) => setBodyFont(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8"
                    >
                      <option>Inter</option>
                      <option>Open Sans</option>
                      <option>Lato</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 w-4 h-4 text-slate-500" />
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-600">The quick brown fox jumps over the lazy dog.</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100 my-8" />

            {/* Type Scale */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Font Size Scale</h3>
              
              <div className="flex gap-4 mb-4">
                <div className="w-1/3">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Base Size (px)</label>
                  <input 
                    type="number" 
                    value={baseSize}
                    onChange={(e) => setBaseSize(parseInt(e.target.value))}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-2/3">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Scale Ratio</label>
                  <div className="relative">
                    <select 
                      value={scaleRatio}
                      onChange={(e) => setScaleRatio(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-md px-3 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1.200">1.200 - Minor Third</option>
                      <option value="1.250">1.250 - Major Third</option>
                      <option value="1.333">1.333 - Perfect Fourth</option>
                      <option value="1.414">1.414 - Augmented Fourth</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Generated Scale Preview */}
              <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                {typeScale.map(scale => (
                  <div key={scale.label} className="flex items-baseline gap-3 hover:bg-slate-100 p-1 rounded transition-colors">
                    <span className="text-xs font-mono text-slate-400 w-8">{scale.label}</span>
                    <span className="text-[10px] text-slate-400 w-8">{scale.size}px</span>
                    <span className={`font-bold text-slate-900 tracking-tight`} style={{ fontSize: `${Math.min(scale.size, 32)}px` }}>
                      {scale.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100 my-8" />

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Line Height */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Line Height</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <label className="text-[10px] font-medium text-slate-600">Headings</label>
                    <span className="text-[10px] font-mono text-slate-400">{headingLineHeight}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="1.5" 
                    step="0.1" 
                    value={headingLineHeight}
                    onChange={(e) => setHeadingLineHeight(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-[10px] font-medium text-slate-600">Body</label>
                    <span className="text-[10px] font-mono text-slate-400">{bodyLineHeight}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="2" 
                    step="0.1" 
                    value={bodyLineHeight}
                    onChange={(e) => setBodyLineHeight(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Letter Spacing</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <label className="text-[10px] font-medium text-slate-600">Headings</label>
                    <span className="text-[10px] font-mono text-slate-400">{headingSpacing}em</span>
                  </div>
                  <input 
                    type="range" 
                    min="-0.1" 
                    max="0.1" 
                    step="0.01" 
                    value={headingSpacing}
                    onChange={(e) => setHeadingSpacing(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-[10px] font-medium text-slate-600">Body</label>
                    <span className="text-[10px] font-mono text-slate-400">{bodySpacing}em</span>
                  </div>
                  <input 
                    type="range" 
                    min="-0.05" 
                    max="0.1" 
                    step="0.01" 
                    value={bodySpacing}
                    onChange={(e) => setBodySpacing(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Live Preview */}
          <div className="w-1/2 bg-slate-50/50 p-8 flex flex-col relative border-l border-slate-100">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Preview</h2>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-semibold text-slate-600">Updating live</span>
                </div>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 overflow-y-auto pr-2 pb-24">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-10 min-h-[600px]">
                
                <div className="max-w-xl mx-auto space-y-8">
                  
                  {/* Headings Stack */}
                  <div className="space-y-4 border-b border-slate-100 pb-8">
                    <h1 className="font-bold text-slate-900 tracking-tight" style={{ 
                      fontSize: `${typeScale[0].size}px`, 
                      lineHeight: headingLineHeight,
                      letterSpacing: `${headingSpacing}em`
                    }}>
                      Typography that scales with your brand
                    </h1>
                    <p className="text-lg text-slate-500 font-normal" style={{ lineHeight: bodyLineHeight }}>
                      A complete system for building consistent, accessible, and beautiful interfaces. Build faster with confidence.
                    </p>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-4">
                    <h2 className="font-semibold text-slate-900 tracking-tight" style={{ 
                      fontSize: `${typeScale[1].size}px`,
                      lineHeight: headingLineHeight,
                      letterSpacing: `${headingSpacing}em`
                    }}>
                      The Foundation
                    </h2>
                    <p className="text-base text-slate-600" style={{ 
                      lineHeight: bodyLineHeight,
                      letterSpacing: `${bodySpacing}em`
                    }}>
                      Typography is the core of your design system. <strong>Good typography</strong> establishes hierarchy and makes content legible. <a href="#" className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 underline-offset-2">Read our guidelines</a> to learn more about vertical rhythm.
                    </p>
                    <p className="text-base text-slate-600" style={{ 
                      lineHeight: bodyLineHeight,
                      letterSpacing: `${bodySpacing}em`
                    }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>

                  {/* Interactive Elements */}
                  <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Lists</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          Consistent baseline grid
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          Fluid scaling
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          Accessibility verified
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Controls</h4>
                      <div className="space-y-3">
                        <button className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                          Get Started
                        </button>
                        <button className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                          Documentation
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Blockquote & Code */}
                  <div className="space-y-6 border-t border-slate-100 pt-8">
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-1 italic text-slate-700">
                      "Design is not just what it looks like and feels like. Design is how it works."
                    </blockquote>

                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <div className="text-slate-400 mb-1">// typography.config.js</div>
                      <div className="text-purple-400">const <span className="text-blue-400">scale</span> = {'{'}</div>
                      <div className="pl-4 text-slate-200">base: <span className="text-green-400">'16px'</span>,</div>
                      <div className="pl-4 text-slate-200">ratio: <span className="text-green-400">1.25</span></div>
                      <div className="text-purple-400">{'}'};</div>
                    </div>
                    
                    <div className="text-xs text-slate-400 text-center pt-4">
                      Last updated: Dec 19, 2024 • Version 2.0
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Readability Score Card (Sticky) */}
            <div className="absolute bottom-6 left-8 right-8 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xl z-20">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-500" /> Readability Analysis
                  </h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Check className="w-3 h-3 text-emerald-500" /> AAA Contrast
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Check className="w-3 h-3 text-emerald-500" /> Line height
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-600">
                      <AlertCircle className="w-3 h-3" /> Line length ideal max 75ch
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 leading-none">85<span className="text-sm text-slate-400 font-medium">/100</span></div>
                    <div className="text-[10px] text-emerald-600 font-medium">Excellent</div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-blue-500 rotate-45"></div>
                </div>
              </div>
              <button className="w-full mt-3 text-[10px] font-bold text-blue-600 bg-blue-50 py-1.5 rounded hover:bg-blue-100 transition-colors">
                Optimize Settings Automatically
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-none bg-white border-t border-slate-200 px-8 py-4 z-40 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="font-bold">Summary:</span> {headingFont} / {bodyFont}
            </span>
            <span className="h-4 w-px bg-slate-200"></span>
            <span>{typeScale.length} sizes defined</span>
            <span className="h-4 w-px bg-slate-200"></span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <Check className="w-3 h-3" /> Accessible
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-800">Save as draft</a>
            <div className="h-4 w-px bg-slate-200"></div>
            <button 
              onClick={() => navigate(createPageUrl('SelectDesignTemplate'))}
              className="px-5 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              Previous: Colors
            </button>
            <button 
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Next: Spacing <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
}