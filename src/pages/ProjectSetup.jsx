import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  Layers, Rocket, Palette, Bot, KanbanSquare, 
  ArrowRight, Clock 
} from 'lucide-react';

export default function ProjectSetup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundSize: '40px 40px',
        backgroundImage: 'linear-gradient(to right, rgba(226, 232, 240, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.5) 1px, transparent 1px)',
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
      }}></div>
      
      {/* Radial Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Modal */}
      <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Progress Indicator */}
        <div className="absolute top-8 right-8 text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          Step 1 of 6
        </div>

        <div className="p-12">
          
          {/* Header / Logo Section */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
              <Layers className="w-8 h-8" />
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Rocket className="w-20 h-20 text-blue-600 relative z-10 fill-blue-50" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">Let's Build Something Amazing</h1>
            <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed">We'll help you set up your project structure and tools in just a few minutes.</p>
          </div>

          {/* Features List */}
          <div className="space-y-6 mb-10 max-w-md mx-auto">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                <Palette className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-[15px] mb-0.5">Design System Ready</h3>
                <p className="text-sm text-slate-500">Start with professional colors and typography automatically configured.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-[15px] mb-0.5">AI Builder Integration</h3>
                <p className="text-sm text-slate-500">Connect Aura, Base44, or your preferred AI tools instantly.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <KanbanSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-[15px] mb-0.5">Sprint Planning Built-in</h3>
                <p className="text-sm text-slate-500">Organize your backlog and milestones from day one.</p>
              </div>
            </div>

          </div>

          {/* Bottom Actions */}
          <div className="space-y-4">
            <button 
              onClick={() => navigate(createPageUrl('NewProject'))}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-center">
              <button 
                onClick={() => navigate(createPageUrl('Home'))}
                className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip setup, go to dashboard
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <Clock className="w-3 h-3" />
            Takes about 3 minutes
          </div>

        </div>
      </div>
    </div>
  );
}