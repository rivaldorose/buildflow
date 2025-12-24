import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  FilePlus, X, Sparkles, UploadCloud, Code2, Pencil, Check, ArrowRight,
  Image, Copy, Package, Info, ChevronDown
} from 'lucide-react';

export default function CreatePage() {
  const navigate = useNavigate();
  const [selectedProject] = useState('DealMaker');

  const methods = [
    {
      id: 'aura',
      name: 'Design in Aura',
      subtitle: 'Generate with AI',
      description: 'Create designs using Aura AI. Describe what you want and get professional UI designs in seconds.',
      icon: Sparkles,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'Recommended',
      badgeColor: 'bg-blue-600 text-white shadow-blue-500/30',
      time: '~5 min',
      features: ['Fast and easy', 'Professional', 'Multiple variations', 'Fully editable'],
      buttonText: 'Create with Aura',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      note: 'Popular for Landing pages & Dashboards',
      preview: (
        <div className="w-full h-24 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden relative group-hover:bg-blue-50/30 transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-200/50 border-r border-slate-200"></div>
          <div className="absolute left-8 top-0 right-0 h-6 bg-white border-b border-slate-200 flex items-center px-2 gap-1">
            <div className="w-8 h-1.5 bg-slate-200 rounded-full"></div>
          </div>
          <div className="absolute left-12 top-10 right-4 h-8 bg-blue-100/50 rounded border border-blue-200/50 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-blue-400" />
          </div>
          <div className="absolute left-12 top-20 right-12 h-2 bg-slate-200 rounded"></div>
        </div>
      )
    },
    {
      id: 'upload',
      name: 'Upload Design',
      subtitle: 'Import existing design',
      description: 'Upload a design mockup (PNG, JPG) from Figma, Photoshop, or any design tool.',
      icon: UploadCloud,
      iconBg: 'bg-slate-50 border border-slate-200',
      iconColor: 'text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200',
      time: '~2 min',
      features: ['Figma exports', 'Keep workflow', 'PNG, JPG', 'Quick setup'],
      buttonText: 'Upload Design',
      buttonStyle: 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50',
      note: 'Supports files up to 10MB',
      preview: (
        <div className="w-full h-24 bg-slate-50 rounded-lg overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-2 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center gap-1 group-hover:border-blue-300 transition-colors">
            <Image className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
            <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      )
    },
    {
      id: 'code',
      name: 'Paste HTML/CSS',
      subtitle: 'Use custom code',
      description: 'Already have working HTML/CSS? Paste it in and see it live with responsive preview.',
      icon: Code2,
      iconBg: 'bg-slate-800',
      iconColor: 'text-slate-200',
      badge: 'For Developers',
      badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
      time: '~3 min',
      features: ['Full control', 'Responsive test', 'Use existing', 'Interactive'],
      buttonText: 'Paste Code',
      buttonStyle: 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50',
      note: 'HTML, CSS, JS Supported',
      preview: (
        <div className="w-full h-24 bg-[#1E293B] rounded-lg overflow-hidden relative p-3 font-mono">
          <div className="flex gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="space-y-1.5 opacity-80">
            <div className="flex gap-2">
              <span className="w-6 h-1 bg-pink-500/50 rounded"></span>
              <span className="w-12 h-1 bg-blue-400/50 rounded"></span>
            </div>
            <div className="flex gap-2 ml-4">
              <span className="w-8 h-1 bg-violet-400/50 rounded"></span>
              <span className="w-16 h-1 bg-slate-500/50 rounded"></span>
            </div>
            <div className="flex gap-2 ml-4">
              <span className="w-10 h-1 bg-emerald-400/50 rounded"></span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'blank',
      name: 'Start Blank',
      subtitle: 'Build from scratch',
      description: 'Create a blank page and add features manually. Build your way.',
      icon: Pencil,
      iconBg: 'bg-slate-50 border border-slate-200',
      iconColor: 'text-slate-500 group-hover:text-blue-600',
      time: '~1 min',
      features: ['Max flexibility', 'Feature-first', 'Your workflow', 'Design later'],
      buttonText: 'Create Blank',
      buttonStyle: 'bg-transparent border border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900',
      note: 'Best for planning mode',
      preview: (
        <div className="w-full h-24 bg-white rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center" style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}>
          <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-400">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden relative">
      
      {/* Background Context (Blurred) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="h-16 bg-white border-b border-slate-200 w-full"></div>
        <div className="p-8 opacity-40 blur-[2px]">
          <div className="flex justify-between mb-8">
            <div className="h-8 w-48 bg-slate-300 rounded"></div>
            <div className="h-8 w-32 bg-slate-300 rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
            <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
            <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm z-10"></div>
      </div>

      {/* Main Modal */}
      <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
        <main className="w-full max-w-[960px] bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200 flex flex-col overflow-hidden max-h-[95vh]">
          
          {/* Scrollable Content */}
          <div className="overflow-y-auto">
            
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur px-10 pt-8 pb-4 flex justify-between items-start">
              <div className="w-8"></div>
              
              <div className="flex flex-col items-center gap-1.5 mt-2">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-blue-100 text-blue-600">
                  <FilePlus className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight text-center">Create New Page</h1>
                <p className="text-slate-500 text-base text-center font-medium">How do you want to create this page?</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">
                  <span className="text-slate-400">Project:</span> {selectedProject}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => navigate(createPageUrl('Pages'))}
                  className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-2">Step 1 of 5</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-12 pb-12">
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Choose Creation Method</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              {/* Method Grid */}
              <div className="grid grid-cols-2 gap-6">
                {methods.map(method => {
                  const Icon = method.icon;
                  return (
                    <div 
                      key={method.id}
                      className="group relative bg-white border-2 border-slate-100 rounded-xl p-6 cursor-pointer hover:border-blue-500/50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {method.badge && (
                        <div className={`absolute -top-3 right-6 ${method.badgeColor} text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wide`}>
                          {method.badge}
                        </div>
                      )}

                      <div className="flex gap-5 h-full flex-col">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                              method.gradient 
                                ? `bg-gradient-to-br ${method.gradient} shadow-lg shadow-blue-200 text-white` 
                                : `${method.iconBg} ${method.iconColor} transition-colors`
                            }`}>
                              <Icon className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">{method.name}</h3>
                              <p className="text-sm text-slate-500 font-medium">{method.subtitle}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {method.time}
                          </span>
                        </div>
                        
                        <p className="text-[14px] leading-relaxed text-slate-600">
                          {method.description}
                        </p>

                        {/* Preview */}
                        {method.preview}

                        <div className="space-y-2 mt-auto">
                          <div className="grid grid-cols-2 gap-y-1.5">
                            {method.features.map(feature => (
                              <div key={feature} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        <button className={`w-full py-2.5 mt-2 text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 ${method.buttonStyle}`}>
                          {method.buttonText} <ArrowRight className="w-4 h-4" />
                        </button>
                        
                        <div className="text-[10px] text-slate-400 text-center">{method.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="relative py-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Or</span>
                </div>
              </div>

              {/* Alternative Actions */}
              <div className="flex items-center justify-center gap-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Copy className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer hover:text-blue-600 transition-colors">
                      <option>Duplicate Existing Page</option>
                      <option>Home</option>
                      <option>About Us</option>
                      <option>Pricing</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                <div className="w-px h-6 bg-slate-200"></div>

                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <Package className="w-4 h-4" />
                  </div>
                  <a href="#" className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                    Browse Templates →
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <footer className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-between">
            <button 
              onClick={() => navigate(createPageUrl('Pages'))}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              You can change the design later at any time
            </span>
            <div className="w-12"></div>
          </footer>

        </main>
      </div>
    </div>
  );
}