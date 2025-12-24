import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, X, Palette, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function DesignSystemSetup() {
  const navigate = useNavigate();
  const [selectedPalette, setSelectedPalette] = useState('modern');
  const [selectedFont, setSelectedFont] = useState('inter');

  const colorPalettes = [
    { id: 'modern', name: 'Modern Blue', colors: ['#1e293b', '#3b82f6', '#60a5fa', '#e2e8f0'] },
    { id: 'purple', name: 'Purple Dream', colors: ['#1e1b4b', '#7c3aed', '#a78bfa', '#e9d5ff'] },
    { id: 'green', name: 'Fresh Green', colors: ['#064e3b', '#10b981', '#6ee7b7', '#d1fae5'] },
    { id: 'orange', name: 'Warm Orange', colors: ['#7c2d12', '#f97316', '#fb923c', '#fed7aa'] }
  ];

  const fontPairs = [
    { id: 'inter', name: 'Inter', heading: 'Inter', body: 'Inter' },
    { id: 'work', name: 'Work Sans', heading: 'Work Sans', body: 'Work Sans' },
    { id: 'roboto', name: 'Roboto', heading: 'Roboto', body: 'Roboto' },
    { id: 'poppins', name: 'Poppins', heading: 'Poppins', body: 'Poppins' }
  ];

  const handleNext = () => {
    const existingData = JSON.parse(localStorage.getItem('projectSetup') || '{}');
    localStorage.setItem('projectSetup', JSON.stringify({
      ...existingData,
      designSystem: { palette: selectedPalette, font: selectedFont }
    }));
    navigate(createPageUrl('SprintSetup'));
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 flex flex-col max-h-[90vh] relative">
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100 absolute top-0 left-0 z-20">
          <div className="h-full bg-blue-500 w-[66%] rounded-r-full transition-all"></div>
        </div>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
          <button 
            onClick={() => navigate(createPageUrl('AIBuilderPreferences'))}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -ml-1 rounded-md hover:bg-slate-50"
          >
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              Back
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Step 4 of 6</span>
            <button 
              onClick={() => navigate(createPageUrl('Home'))}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-10 pb-32 overflow-y-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Design System</h1>
            <p className="text-slate-500 text-[15px]">Choose your colors and typography to get started.</p>
          </div>

          {/* Color Palettes */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-slate-700 block mb-4">
              Color Palette <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              {colorPalettes.map(palette => {
                const isSelected = selectedPalette === palette.id;
                return (
                  <label 
                    key={palette.id}
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="palette" 
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setSelectedPalette(palette.id)}
                    />
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900 text-sm">{palette.name}</span>
                      {isSelected && <Check className="w-5 h-5 text-blue-500" />}
                    </div>
                    
                    <div className="flex gap-2">
                      {palette.colors.map((color, idx) => (
                        <div 
                          key={idx}
                          className="flex-1 h-12 rounded-lg border border-slate-200 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Font Pairing */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-slate-700 block mb-4">
              Font Pairing <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              {fontPairs.map(font => {
                const isSelected = selectedFont === font.id;
                return (
                  <label 
                    key={font.id}
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="font" 
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setSelectedFont(font.id)}
                    />
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900 text-sm">{font.name}</span>
                      {isSelected && <Check className="w-5 h-5 text-blue-500" />}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-slate-800" style={{ fontFamily: font.heading }}>Heading</div>
                      <div className="text-sm text-slate-600" style={{ fontFamily: font.body }}>Body text example</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* AI Generate Option */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900">Let AI suggest based on your app type</p>
              <p className="text-xs text-purple-600 mt-0.5">Generate custom palette and typography</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              Generate
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 p-6 z-20">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(createPageUrl('AIBuilderPreferences'))}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              Previous
            </button>

            <button 
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group active:scale-[0.98]"
            >
              Next: Sprint Setup
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}