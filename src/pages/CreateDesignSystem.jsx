import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Palette, X, LayoutTemplate, PenTool, Check, ArrowRight, Plus, 
  ClipboardList, ChevronDown
} from 'lucide-react';

export default function CreateDesignSystem() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('template');
  const [importProject, setImportProject] = useState('');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const handleContinue = (option) => {
    if (option === 'import' && !importProject) {
      return;
    }
    // Save selection and navigate to next step
    localStorage.setItem('designSystemSetup', JSON.stringify({ 
      method: option,
      importProjectId: importProject 
    }));
    
    if (option === 'template') {
      navigate(createPageUrl('SelectDesignTemplate'));
    } else if (option === 'scratch') {
      navigate(createPageUrl('DesignTypography'));
    } else {
      navigate(createPageUrl('DesignSystems'));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center overflow-hidden relative p-8">
      
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern z-0" style={{
        backgroundImage: 'linear-gradient(to right, rgba(226, 232, 240, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-200/20 blur-3xl pointer-events-none"></div>
      <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3xl pointer-events-none"></div>

      {/* Main Modal */}
      <main className="relative z-10 w-full max-w-[900px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="relative pt-10 pb-2 px-12 text-center">
          {/* Top Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Step 1 of 6</span>
            <button 
              onClick={() => navigate(createPageUrl('DesignSystems'))}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logo & Title */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-6">
            <Palette className="w-8 h-8" />
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Create Design System</h1>
          <p className="text-slate-500 text-base max-w-md mx-auto">Start with a professionally crafted template or build your unique visual language from scratch.</p>
        </div>

        {/* Scrollable Content */}
        <div className="p-12 pt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            Choose Your Starting Point
          </h2>

          {/* Cards Container */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            
            {/* Option 1: Template (Recommended) */}
            <button
              onClick={() => setSelectedOption('template')}
              className={`group relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-left ${
                selectedOption === 'template' 
                  ? 'border-blue-100 ring-4 ring-blue-50/50' 
                  : 'border-slate-100 hover:border-blue-300'
              }`}
            >
              {/* Badge */}
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
                Recommended
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">Start with a Template</h3>
              <p className="text-[15px] text-slate-500 mb-6 leading-relaxed">Pre-designed color palettes and typography pairings ready for production.</p>

              {/* Benefits */}
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-blue-500" />
                  <span>Professional designs</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-blue-500" />
                  <span>Proven color combinations</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-blue-500" />
                  <span>Ready to use in minutes</span>
                </li>
              </ul>

              {/* Visual Preview of Templates */}
              <div className="bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100 flex gap-3 overflow-hidden">
                <div className="flex-1 bg-white rounded border border-slate-200 shadow-sm p-1.5 space-y-1.5 opacity-100">
                  <div className="h-2 w-full bg-blue-500 rounded-sm"></div>
                  <div className="h-1 w-2/3 bg-slate-200 rounded-sm"></div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded border border-slate-200 shadow-sm p-1.5 space-y-1.5 opacity-60">
                  <div className="h-2 w-full bg-orange-500 rounded-sm"></div>
                  <div className="h-1 w-2/3 bg-slate-200 rounded-sm"></div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded border border-slate-200 shadow-sm p-1.5 space-y-1.5 opacity-60">
                  <div className="h-2 w-full bg-slate-800 rounded-sm"></div>
                  <div className="h-1 w-2/3 bg-slate-200 rounded-sm"></div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  </div>
                </div>
              </div>

              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinue('template');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                Choose Template <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Option 2: From Scratch */}
            <button
              onClick={() => setSelectedOption('scratch')}
              className={`group bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-left ${
                selectedOption === 'scratch' 
                  ? 'border-blue-100 ring-4 ring-blue-50/50' 
                  : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
                  <PenTool className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">Start from Scratch</h3>
              <p className="text-[15px] text-slate-500 mb-6 leading-relaxed">Complete creative control to build your system from the ground up.</p>

              {/* Benefits */}
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-slate-400" />
                  <span>Total customization</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-slate-400" />
                  <span>Unique to your brand</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-slate-400" />
                  <span>Learn as you build</span>
                </li>
              </ul>

              {/* Visual Preview (Empty Canvas) */}
              <div className="bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100 h-[74px] flex items-center justify-center relative">
                <div className="absolute inset-2 border-2 border-dashed border-slate-200 rounded"></div>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10 text-slate-400">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinue('scratch');
                }}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Start Fresh <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative bg-white px-4 text-sm text-slate-400 font-medium">OR</div>
          </div>

          {/* Quick Import */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 shadow-sm shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">Import from Existing Project</div>
              <div className="text-xs text-slate-500">Copy styles from another BuildFlow project</div>
            </div>
            <div className="relative w-64">
              <select 
                value={importProject}
                onChange={(e) => setImportProject(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-sm rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-colors"
              >
                <option value="">Select project to copy...</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <button 
              onClick={() => handleContinue('import')}
              disabled={!importProject}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <button 
              onClick={() => navigate(createPageUrl('DesignSystems'))}
              className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <span className="text-xs text-slate-400 font-medium">You can change these settings later in Design System settings</span>
          </div>
        </div>
      </main>
    </div>
  );
}