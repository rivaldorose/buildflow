import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, CheckCircle2, Smartphone, Globe, Laptop, 
  Sparkles, Camera, Wand2, Check, ArrowRight 
} from 'lucide-react';

export default function NewProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    company: '',
    appType: 'mobile',
    platforms: ['ios', 'android'],
    description: ''
  });

  const appTypes = [
    { id: 'mobile', icon: Smartphone, label: 'Mobile App', desc: 'iOS and Android' },
    { id: 'web', icon: Globe, label: 'Web App', desc: 'Browser-based SAAS' },
    { id: 'desktop', icon: Laptop, label: 'Desktop App', desc: 'Mac, Windows, Linux' },
    { id: 'all', icon: Sparkles, label: 'All Platforms', desc: 'Universal Codebase' }
  ];

  const platformOptions = [
    { id: 'ios', label: 'iOS (iPhone)' },
    { id: 'ipad', label: 'iPad' },
    { id: 'android', label: 'Android Phone' },
    { id: 'android_tablet', label: 'Android Tablet' }
  ];

  const togglePlatform = (platform) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleNext = () => {
    // Save form data to localStorage
    localStorage.setItem('projectSetup', JSON.stringify({
      ...form,
      step: 'basic'
    }));
    navigate(createPageUrl('ProjectTechStack'));
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 flex flex-col max-h-[90vh] relative animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100 absolute top-0 left-0 z-20">
          <div className="h-full bg-blue-500 w-[16%] rounded-r-full transition-all"></div>
        </div>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0 bg-white z-10">
          <button 
            onClick={() => navigate(createPageUrl('ProjectSetup'))}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -ml-1 rounded-md hover:bg-slate-50"
          >
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              Back
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Step 1 of 6</span>
            <button 
              onClick={() => navigate(createPageUrl('Home'))}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-10 pb-32 overflow-y-auto">
          
          {/* Titles */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Project Basics</h1>
            <p className="text-slate-500 text-[15px]">Let's start with the essentials to get your workspace ready.</p>
          </div>

          <form className="space-y-8">
            
            {/* Project Name */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-400 font-medium">{form.name.length}/50</span>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="e.g., DealMaker, Breathe, My Awesome App"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value.slice(0, 50) })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-[15px] shadow-sm"
                />
                {form.name && (
                  <div className="absolute right-3 top-3.5 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">Choose a unique, memorable name for your app workspace.</p>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">
                  Bedrijf / Company
                </label>
                <span className="text-xs text-slate-400 font-medium">Optioneel</span>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="e.g., Konsensi, Acme Corp"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value.slice(0, 50) })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-[15px] shadow-sm"
                />
              </div>
              <p className="text-xs text-slate-500">Filter projecten op bedrijf (bijv. alle apps van Konsensi).</p>
            </div>

            {/* App Icon */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">App Icon</label>
                <span className="text-xs text-slate-400 font-medium">Optional</span>
              </div>
              
              <div className="flex gap-5">
                {/* Upload Area */}
                <div className="w-32 h-32 shrink-0 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col items-center justify-center gap-2 relative bg-slate-50/50">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600">Upload Icon</span>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                {/* OR Divider */}
                <div className="flex flex-col items-center justify-center gap-2 px-2">
                  <div className="h-full w-px bg-slate-100"></div>
                </div>

                {/* AI Generator */}
                <div className="flex-1 flex flex-col justify-center gap-3">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Don't have a logo yet? We can generate a temporary icon based on your project name.
                  </p>
                  <button 
                    type="button"
                    className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <Wand2 className="w-4 h-4 text-purple-500" />
                    Generate with AI
                  </button>
                  <p className="text-xs text-slate-400">Supported formats: PNG, JPG (max 2MB)</p>
                </div>
              </div>
            </div>

            {/* App Type */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 block">
                What type of app are you building? <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                {appTypes.map(type => {
                  const Icon = type.icon;
                  const isSelected = form.appType === type.id;
                  return (
                    <label 
                      key={type.id}
                      className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="app_type" 
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => setForm({ ...form, appType: type.id })}
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-slate-900 text-[15px]">{type.label}</span>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{type.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Target Platforms */}
            {form.appType === 'mobile' && (
              <div className="space-y-3 pt-2 pl-2 border-l-2 border-blue-100 ml-5 animate-in fade-in slide-in-from-left-2 duration-300">
                <label className="text-sm font-semibold text-slate-700 block pl-2">Target Platforms</label>
                <div className="flex flex-wrap gap-3 pl-2">
                  {platformOptions.map(platform => (
                    <label key={platform.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={form.platforms.includes(platform.id)}
                        onChange={() => togglePlatform(platform.id)}
                      />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center text-white transition-all ${
                        form.platforms.includes(platform.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-300 bg-white group-hover:border-blue-400'
                      }`}>
                        {form.platforms.includes(platform.id) && (
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        )}
                      </div>
                      <span className="text-sm text-slate-700 font-medium select-none">{platform.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Project Description</label>
                <span className="text-xs text-slate-400 font-medium">{form.description.length}/200</span>
              </div>
              <textarea 
                rows="3"
                placeholder="Briefly describe what your app does (you can change this later)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, 200) })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-[15px] resize-none shadow-sm"
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 p-6 z-20">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate(createPageUrl('Home'))}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Skip for Now
              </button>
              <button 
                onClick={() => navigate(createPageUrl('ProjectSetup'))}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                Previous
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs text-slate-400 font-medium">Press Enter to continue</span>
              <button 
                disabled={!form.name}
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group active:scale-[0.98]"
              >
                Next: Tech Stack
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}