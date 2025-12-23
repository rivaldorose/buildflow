import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { 
  X, Check, Settings2, Smartphone, Layers, Database, Bot, 
  CheckCircle2, Palette, ListTodo, Rocket, LayoutDashboard, 
  Users, LayoutTemplate, PlayCircle, Lightbulb, BookOpen, 
  MessageCircle, ArrowRight
} from 'lucide-react';

export default function ProjectReady() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const createProjectInDatabase = async () => {
      if (isCreating) return;
      
      setIsCreating(true);
      try {
        // Get data from localStorage
        const setupData = JSON.parse(localStorage.getItem('projectSetup') || '{}');
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/0d0ecb30-d292-41a4-8076-aaa48e196c12',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectReady.jsx:22',message:'Starting project creation',data:{hasSetupData:!!setupData,setupDataKeys:setupData?Object.keys(setupData):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        console.log('Creating project with data:', setupData);
        
        // Create project in database
        const project = await base44.entities.Project.create({
          name: setupData.name || 'Untitled Project',
          description: setupData.description || '',
          app_type: setupData.platforms || ['Web'],
          product_type: setupData.appType || 'SaaS',
          ai_builder: setupData.aiBuilder?.primaryBuilder || 'Base44',
          status: 'Planning',
          progress: 0
        });

        console.log('Project created:', project);

        // Create design system for project - always create one
        const paletteData = {
          modern: {
            brand_colors: [
              { name: 'Primary', color: '#3b82f6', description: 'Brand Main' },
              { name: 'Secondary', color: '#1e293b', description: 'Dark' },
              { name: 'Accent', color: '#60a5fa', description: 'Highlights' }
            ]
          },
          purple: {
            brand_colors: [
              { name: 'Primary', color: '#7c3aed', description: 'Brand Main' },
              { name: 'Secondary', color: '#1e1b4b', description: 'Dark' },
              { name: 'Accent', color: '#a78bfa', description: 'Highlights' }
            ]
          },
          green: {
            brand_colors: [
              { name: 'Primary', color: '#10b981', description: 'Brand Main' },
              { name: 'Secondary', color: '#064e3b', description: 'Dark' },
              { name: 'Accent', color: '#6ee7b7', description: 'Highlights' }
            ]
          },
          orange: {
            brand_colors: [
              { name: 'Primary', color: '#f97316', description: 'Brand Main' },
              { name: 'Secondary', color: '#7c2d12', description: 'Dark' },
              { name: 'Accent', color: '#fb923c', description: 'Highlights' }
            ]
          }
        };

        const selectedPalette = paletteData[setupData.designSystem?.palette] || paletteData.modern;
        const fontChoice = setupData.designSystem?.font || 'Inter';

        const designSystem = await base44.entities.DesignSystem.create({
          project: project.id,
          brand_colors: selectedPalette.brand_colors,
          neutral_colors: [
            { name: 'Background', color: '#f5f5f7' },
            { name: 'Surface', color: '#ffffff' },
            { name: 'Border', color: '#e5e7eb' },
            { name: 'Text Main', color: '#18181b' },
            { name: 'Text Sec', color: '#71717a' }
          ],
          semantic_colors: [
            { name: 'Success', color: '#10b981' },
            { name: 'Warning', color: '#f59e0b' },
            { name: 'Error', color: '#ef4444' },
            { name: 'Info', color: '#3b82f6' }
          ],
          typography: {
            heading_font: fontChoice,
            body_font: fontChoice
          },
          spacing: {
            base_unit: 4,
            border_radius: '0.75rem'
          }
        });

        console.log('Design system created:', designSystem);

        // Save project ID
        localStorage.setItem('lastCreatedProjectId', project.id);
        
      } catch (error) {
        console.error('Failed to create project:', error);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/0d0ecb30-d292-41a4-8076-aaa48e196c12',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectReady.jsx:112',message:'Project creation failed',data:{errorMessage:error?.message,errorName:error?.name,errorCode:error?.code,errorString:error?.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Extract user-friendly error message
        let errorMessage = 'Failed to create project';
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.code) {
          errorMessage = `Error ${error.code}: ${error.message || 'Unknown error'}`;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        toast.error(errorMessage, {
          description: error?.hint || error?.details || 'Please check the console for more details',
          duration: 5000,
        });
        setIsCreating(false);
      } finally {
        setIsCreating(false);
      }
    };

    createProjectInDatabase();
  }, [isCreating]);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200 flex flex-col max-h-[90vh] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Progress Bar (100%) */}
        <div className="h-1.5 w-full bg-slate-100 absolute top-0 left-0 z-20">
          <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        </div>

        {/* Header */}
        <div className="px-8 pt-6 pb-2 flex items-center justify-between shrink-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Setup Complete</span>
          </div>
          
          <button 
            onClick={() => navigate(createPageUrl('Home'))}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-10 py-6 overflow-y-auto flex-1">
          
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center mb-10 text-center relative pt-4">
            <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-white shadow-xl shadow-emerald-100 flex items-center justify-center mb-6 relative z-10 animate-in zoom-in-50 duration-700">
              <Check className="w-12 h-12 text-emerald-500 stroke-[3px]" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
              Your Project is Ready!
            </h1>
            <p className="text-slate-500 text-lg animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
              DealMaker is set up and ready to build.
            </p>
          </div>

          {/* Project Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Project Overview</h2>
              <button className="text-xs font-medium text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                <Settings2 className="w-3 h-3" />
                Edit Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Vertical Divider */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100"></div>

              {/* Left Column */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
                    <span className="text-xl font-bold">D</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">DealMaker</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase border border-slate-200">
                        <Smartphone className="w-3 h-3" /> Mobile App
                      </span>
                      <span className="text-[10px] text-slate-400">iOS + Android</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Tech Stack</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500" title="Flutter">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-6 h-6 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500" title="Supabase">
                        <Database className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Design System</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-700 mr-1">Modern Blue</span>
                      <div className="flex -space-x-1">
                        <div className="w-3 h-3 rounded-full bg-[#1e293b] ring-1 ring-white"></div>
                        <div className="w-3 h-3 rounded-full bg-[#3b82f6] ring-1 ring-white"></div>
                        <div className="w-3 h-3 rounded-full bg-[#60a5fa] ring-1 ring-white"></div>
                        <div className="w-3 h-3 rounded-full bg-[#e2e8f0] ring-1 ring-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5 md:pl-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-700">AI Builder</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-slate-50 pt-3">
                  <span className="text-slate-500 font-medium">Sprint Planning</span>
                  <div className="text-right">
                    <span className="block text-slate-900 font-semibold text-xs">4 Sprints Planned</span>
                    <span className="text-[10px] text-slate-400">Sprint 1 starts Dec 23</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-slate-50 pt-3">
                  <span className="text-slate-500 font-medium">Team</span>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-6 h-6 rounded-full ring-2 ring-white bg-slate-100" />
                    </div>
                    <button className="text-[10px] font-semibold text-blue-600 hover:underline">+ Invite</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-5">What's Next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="group relative bg-white border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                <div className="absolute top-3 right-3 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">STEP 1</div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Create First Page</h3>
                <p className="text-xs text-slate-500 mb-4 h-8 leading-relaxed">Design a screen in Aura or use the AI builder.</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-medium text-slate-400">~5 mins</span>
                  <button className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                    Create Page →
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer opacity-90 hover:opacity-100">
                <div className="absolute top-3 right-3 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">STEP 2</div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ListTodo className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Add Features</h3>
                <p className="text-xs text-slate-500 mb-4 h-8 leading-relaxed">Break down your pages into actionable tasks.</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-medium text-slate-400">~10 mins</span>
                  <button className="text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Add Features
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer opacity-90 hover:opacity-100">
                <div className="absolute top-3 right-3 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">STEP 3</div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Start Sprint</h3>
                <p className="text-xs text-slate-500 mb-4 h-8 leading-relaxed">Kick off your first sprint and track progress.</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-medium text-slate-400">~15 mins</span>
                  <button className="text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    View Board
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Help */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-400 mb-2">
            
            {/* Quick Actions */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Or Jump Right In</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => navigate(createPageUrl('Home'))}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  Dashboard
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">
                  <Users className="w-4 h-4 text-slate-400" />
                  Invite Team
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">
                  <LayoutTemplate className="w-4 h-4 text-slate-400" />
                  Browse Templates
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                  <PlayCircle className="w-4 h-4" />
                  Watch Tutorial
                </button>
              </div>
            </div>

            {/* Help Resources */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-blue-500 fill-blue-100" />
                <h4 className="text-xs font-bold text-blue-900">Need Help?</h4>
              </div>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
                    <BookOpen className="w-3 h-3" /> Getting Started Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
                    <MessageCircle className="w-3 h-3" /> Community Forum
                  </a>
                </li>
              </ul>
              <a href="#" className="block mt-3 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Visit Help Center →
              </a>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="shrink-0 bg-white border-t border-slate-100 p-6 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => navigate(createPageUrl('Home'))}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group transform active:scale-[0.99] mb-3"
          >
            Go to Project Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-center text-xs text-slate-400 font-medium">
            You can always change these settings later in project preferences.
          </p>
        </div>

      </div>
    </div>
  );
}