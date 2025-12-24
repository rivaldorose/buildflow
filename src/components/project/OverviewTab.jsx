import React, { useState } from 'react';
import { 
  ChevronRight, GripVertical, Pencil, 
  Smartphone, Target, CheckCircle2, Bug, FastForward, Calendar,
  RefreshCw, Plus, Download, Check, Loader2, AlertTriangle
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import ProjectNotes from './ProjectNotes';

export default function OverviewTab({ project, features, pages, creditLogs }) {
  const projectId = project?.id;
  const [platforms, setPlatforms] = useState({
    ios: true,
    android: true,
    web: false
  });

  const completedFeatures = features.filter(f => f.status === 'Done').length;
  const completionPercentage = features.length > 0 ? Math.round((completedFeatures / features.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Content */}
        <main className="lg:col-span-9 max-w-4xl mx-auto w-full">
          
          {/* Page Header */}
          <header className="mb-12 group relative">
            <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
              <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="mt-1 text-4xl">🤝</div>
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                {project.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                {project.status}
              </span>
              <span className="text-gray-500">
                {pages.length} pages • {features.length} features • {completionPercentage}% complete
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-64 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{width: `${completionPercentage}%`}}></div>
            </div>
          </header>

          <hr className="border-gray-100 mb-10" />

          {/* Section: Basic Info */}
          <section className="mb-12 group">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-6 gap-x-4 items-start">
              
              <label className="text-sm font-medium text-gray-400 pt-1">App Name</label>
              <div className="text-gray-900 text-sm font-medium border-b border-gray-100 hover:border-gray-300 pb-1 w-full max-w-xs transition-colors">
                {project.name}
              </div>

              <label className="text-sm font-medium text-gray-400 pt-1">Description</label>
              <div className="text-gray-700 text-sm max-w-2xl">
                {project.description || 'No description provided'}
              </div>

              <label className="text-sm font-medium text-gray-400 pt-1">Target Platforms</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={platforms.ios} onCheckedChange={(checked) => setPlatforms({...platforms, ios: checked})} />
                  <span className="text-sm text-gray-700">iOS (iPhone, iPad)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={platforms.android} onCheckedChange={(checked) => setPlatforms({...platforms, android: checked})} />
                  <span className="text-sm text-gray-700">Android (Phone, Tablet)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={platforms.web} onCheckedChange={(checked) => setPlatforms({...platforms, web: checked})} />
                  <span className="text-sm text-gray-500">Web (Browser)</span>
                </label>
              </div>

              <label className="text-sm font-medium text-gray-400 pt-1">Primary AI Builder</label>
              <div className="relative w-full max-w-xs">
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> {project.ai_builder}
                </span>
              </div>

            </div>
          </section>

          <hr className="border-gray-100 mb-10" />

          {/* Section: Project Vision */}
          <section className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              Project Vision
              <span className="text-xs font-normal text-gray-400 px-1.5 py-0.5 border border-gray-200 rounded">Editable</span>
            </h3>
            
            <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 hover:border-gray-300 hover:bg-white transition-all group cursor-text relative">
              
              <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-white border border-gray-200 rounded-md text-gray-500 hover:text-blue-600 transition-all shadow-sm">
                <Pencil className="w-3.5 h-3.5" />
              </button>

              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p className="mb-4">
                  <span className="font-medium text-gray-800">{project.name}</span> is designed to help users achieve their goals efficiently and effectively through intuitive design and powerful features.
                </p>
                
                <p className="font-medium text-gray-800 mb-2 mt-4">Key differentiators:</p>
                <ul className="list-none space-y-1 pl-0 mb-4">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Modern and intuitive interface</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"></div> AI-powered features</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Real-time collaboration</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Seamless integrations</li>
                </ul>

                <p className="mt-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Launch Goal: Q1 2025</p>
              </div>
            </div>
          </section>

          {/* Section: Quick Stats */}
          <section className="mb-12">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide opacity-80">Quick Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs text-gray-400 mb-1">Pages</div>
                <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" /> {pages.length}
                </div>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs text-gray-400 mb-1">Features</div>
                <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-500" /> {features.length}
                </div>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs text-gray-400 mb-1">Completed</div>
                <div className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {completionPercentage}%
                </div>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs text-gray-400 mb-1">Issues</div>
                <div className="text-sm font-medium text-red-500 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" /> 0 Active
                </div>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs text-gray-400 mb-1">Progress</div>
                <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                  <FastForward className="w-3.5 h-3.5 text-orange-500" /> {project.progress}%
                </div>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs text-gray-400 mb-1">Created</div>
                <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> {format(new Date(project.created_date), 'MMM d')}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Summary */}
          <section className="mb-12 bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">This App Is For...</h3>
              <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-200 rounded shadow-sm">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <div className="text-lg text-gray-800 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
              "{project.description || 'Building innovative solutions for modern challenges.'}"
            </div>
          </section>

          <hr className="border-gray-100 mb-10" />

          {/* Section: Project Notes */}
          <section className="mb-12">
            {projectId && <ProjectNotes projectId={projectId} />}
          </section>

          {/* Section: Quick Links */}
          <section className="mb-16">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">View All Pages</Button>
              <Button variant="outline">Design System</Button>
              <Button variant="outline">Security Requirements</Button>
              <Button variant="outline">Sprint Board</Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4 text-gray-400" /> Export
              </Button>
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 space-y-8">
            
            {/* Project Health */}
            <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-5">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Project Health</h4>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-900">Overall: Good</span>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2.5 text-gray-600">
                  <Check className="w-4 h-4 text-green-500" /> Design: Complete
                </li>
                <li className="flex items-center gap-2.5 text-gray-600">
                  <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" /> Dev: In Progress
                </li>
                <li className="flex items-center gap-2.5 text-gray-600">
                  <Check className="w-4 h-4 text-green-500" /> Testing: On Track
                </li>
                <li className="flex items-center gap-2.5 text-gray-600">
                  <AlertTriangle className="w-4 h-4 text-orange-500" /> Security: Review Needed
                </li>
                <li className="flex items-center gap-2.5 text-gray-600">
                  <Check className="w-4 h-4 text-green-500" /> Docs: Good
                </li>
              </ul>
            </div>

            {/* Team */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Team</h4>
              <div className="flex items-center -space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600" title="You">
                  YO
                </div>
                <button className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-400">You (Owner, Dev, Designer)</div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Activity</h4>
              <div className="relative border-l border-gray-200 ml-1.5 space-y-4 py-1">
                <div className="pl-4 relative">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded-full absolute -left-[6.5px] top-1"></div>
                  <p className="text-sm text-gray-800">Project created</p>
                  <span className="text-xs text-gray-400">{format(new Date(project.created_date), 'MMM d')}</span>
                </div>
                <div className="pl-4 relative">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded-full absolute -left-[6.5px] top-1"></div>
                  <p className="text-sm text-gray-800">{features.length} features added</p>
                  <span className="text-xs text-gray-400">Recently</span>
                </div>
                <div className="pl-4 relative">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded-full absolute -left-[6.5px] top-1"></div>
                  <p className="text-sm text-gray-800">{pages.length} pages created</p>
                  <span className="text-xs text-gray-400">Recently</span>
                </div>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}