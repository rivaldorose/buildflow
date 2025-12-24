import React, { useState } from 'react';
import { 
  Palette, Type, Ruler, Box, Code, Wand2, Upload, MoreHorizontal,
  Edit2, Smartphone, Monitor, Menu, Bell, AlertCircle, FileText,
  Image, Home, Search, Plus, MessageSquare, User, Signal, Wifi,
  Figma, Download, Save
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DesignSystem() {
  const [activeTab, setActiveTab] = useState('colors');

  const tabs = [
    { id: 'colors', icon: Palette, label: 'Colors' },
    { id: 'typography', icon: Type, label: 'Typography' },
    { id: 'spacing', icon: Ruler, label: 'Spacing' },
    { id: 'components', icon: Box, label: 'Components' },
    { id: 'export', icon: Code, label: 'Export' }
  ];

  const brandColors = [
    { name: 'Primary', color: '#7c3aed', description: 'Brand Main', hoverColor: 'violet-200' },
    { name: 'Secondary', color: '#3b82f6', description: 'Action items', hoverColor: 'blue-200' },
    { name: 'Accent', color: '#10b981', description: 'Highlights', hoverColor: 'emerald-200' }
  ];

  const neutralColors = [
    { name: 'Background', color: '#f5f5f7' },
    { name: 'Surface', color: '#ffffff' },
    { name: 'Border', color: '#e5e7eb' },
    { name: 'Text Main', color: '#18181b' },
    { name: 'Text Sec', color: '#71717a' }
  ];

  const semanticColors = [
    { name: 'Success', color: '#10b981' },
    { name: 'Warning', color: '#f59e0b' },
    { name: 'Error', color: '#ef4444' },
    { name: 'Info', color: '#3b82f6' }
  ];

  const gradients = [
    { name: 'Primary Gradient', from: '#7c3aed', to: '#3b82f6', class: 'from-violet-600 to-blue-500' },
    { name: 'Marketing Gradient', from: '#fb923c', to: '#ec4899', class: 'from-orange-400 to-pink-500' }
  ];

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 shrink-0 bg-white">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Design System Manager</h1>
            <p className="text-sm text-gray-500 mt-0.5">Define your app's visual identity once, use everywhere</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-sm font-medium">
              <Figma className="w-4 h-4 mr-2" />
              Import from Figma
            </Button>
            <Button variant="outline" className="text-sm font-medium">
              <Download className="w-4 h-4 mr-2" />
              Export Tokens
            </Button>
            <Button className="bg-gray-900 hover:bg-black text-white text-sm font-medium shadow-sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-8 border-b border-gray-100 bg-white sticky top-0 z-10">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-violet-500 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f5f5f7]">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Auto Generate Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Magic Generation</h3>
                  <p className="text-sm text-gray-500 mt-1">Generate a compliant accessible palette from a single color or logo.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100">
                    <Wand2 className="w-3.5 h-3.5 mr-2" />
                    Generate from Brand
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-gray-900">Brand Colors</h2>
                <span className="text-xs text-gray-400">Primary, Secondary, Accent</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandColors.map(item => (
                  <div key={item.name} className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm group hover:border-${item.hoverColor} transition-all`}>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{item.name}</label>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg shadow-inner ring-1 ring-black/5 overflow-hidden">
                        <input type="color" value={item.color} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full h-full" style={{backgroundColor: item.color}}></div>
                      </div>
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={item.color}
                          className="w-full text-sm font-mono bg-gray-50 border-none rounded-md py-1.5 px-2 text-gray-600 uppercase h-auto"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Neutrals */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-gray-900">Neutral Colors</h2>
                <span className="text-xs text-gray-400">Base UI elements</span>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                <div className="grid grid-cols-5 divide-x divide-gray-50">
                  {neutralColors.map(item => (
                    <div key={item.name} className="p-4 flex flex-col items-center gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="w-full aspect-video rounded-lg border border-gray-200 relative" style={{backgroundColor: item.color}}>
                        <input type="color" value={item.color} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                      <div className="text-center w-full">
                        <span className="text-xs font-medium text-gray-900 block mb-1">{item.name}</span>
                        <input 
                          type="text" 
                          value={item.color} 
                          className="w-full text-center text-[11px] font-mono text-gray-500 bg-transparent border-none p-0 focus:ring-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Semantic Colors */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-gray-900">Semantic Colors</h2>
                <span className="text-xs text-gray-400">Feedback states</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {semanticColors.map(item => (
                  <div key={item.name} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full ring-1 ring-inset ring-black/5 relative shrink-0" style={{backgroundColor: item.color}}>
                      <input type="color" value={item.color} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-900">{item.name}</div>
                      <div className="text-[10px] font-mono text-gray-500 truncate">{item.color}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gradients */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-gray-900">Gradients</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gradients.map(item => (
                  <div key={item.name} className="bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    <div className={`h-20 rounded-lg bg-gradient-to-r ${item.class} mb-3 relative overflow-hidden group`}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white/90 text-gray-900 rounded-md p-1.5 shadow-sm hover:bg-white">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="px-3 pb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-900">{item.name}</span>
                      <div className="flex items-center -space-x-2">
                        <div className="w-4 h-4 rounded-full ring-2 ring-white" style={{backgroundColor: item.from}}></div>
                        <div className="w-4 h-4 rounded-full ring-2 ring-white" style={{backgroundColor: item.to}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-8"></div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Live Preview */}
      <aside className="w-96 bg-white border-l border-gray-100 flex flex-col shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Preview</span>
          <div className="flex gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-50">
              <Smartphone className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-50">
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f5f5f7] p-6 flex items-center justify-center">
          {/* Mobile Preview Frame */}
          <div className="w-[300px] h-[580px] bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] ring-8 ring-gray-900 overflow-hidden relative flex flex-col">
            {/* Status Bar */}
            <div className="h-10 bg-white flex items-center justify-between px-6 pt-2 shrink-0">
              <span className="text-[10px] font-semibold text-gray-900">9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3 text-gray-900" />
                <Wifi className="w-3 h-3 text-gray-900" />
                <div className="w-4 h-3 bg-gray-900 rounded-[2px] opacity-80"></div>
              </div>
            </div>

            {/* App Content */}
            <div className="flex-1 bg-[#f5f5f7] overflow-y-auto">
              {/* App Header */}
              <div className="bg-white p-5 pb-6 rounded-b-3xl shadow-sm border-b border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Menu className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#18181b] tracking-tight mb-1">Hello, Alex</h2>
                <p className="text-sm text-[#71717a]">Here is your daily overview</p>
                
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-[#7c3aed] text-white py-2.5 rounded-xl text-xs font-medium shadow-lg shadow-violet-200">
                    New Task
                  </button>
                  <button className="flex-1 bg-[#f5f5f7] text-[#18181b] py-2.5 rounded-xl text-xs font-medium border border-gray-200">
                    Analytics
                  </button>
                </div>
              </div>

              {/* App Widgets */}
              <div className="p-5 space-y-4">
                {/* Warning Card */}
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181b]">Subscription Expiring</h4>
                    <p className="text-xs text-[#71717a] mt-0.5 leading-relaxed">Your Pro plan ends in 2 days. Renew now to keep features.</p>
                    <button className="mt-2 text-xs font-medium text-[#f59e0b] hover:text-[#f59e0b]/80">Renew Plan →</button>
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">Storage</span>
                    <span className="text-xs font-medium text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full">Healthy</span>
                  </div>
                  <div className="w-full bg-[#f5f5f7] rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] h-2 rounded-full" style={{width: '66%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#18181b] font-medium">65% Used</span>
                    <span className="text-[#71717a]">120GB Free</span>
                  </div>
                </div>

                {/* List Items */}
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-xl flex items-center gap-3 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#18181b]">Project Proposal</p>
                      <p className="text-[10px] text-[#71717a]">Edited 2m ago</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl flex items-center gap-3 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 text-[#10b981] flex items-center justify-center">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#18181b]">Brand Assets</p>
                      <p className="text-[10px] text-[#71717a]">Uploaded 1h ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Nav */}
            <div className="h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 shrink-0">
              <button className="p-2 text-[#7c3aed]"><Home className="w-5 h-5" /></button>
              <button className="p-2 text-gray-300 hover:text-gray-500"><Search className="w-5 h-5" /></button>
              <button className="w-12 h-12 -mt-8 bg-[#18181b] rounded-full text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                <Plus className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-300 hover:text-gray-500"><MessageSquare className="w-5 h-5" /></button>
              <button className="p-2 text-gray-300 hover:text-gray-500"><User className="w-5 h-5" /></button>
            </div>
            
            {/* Home Indicator */}
            <div className="bg-white h-5 flex justify-center pb-1">
              <div className="w-32 h-1 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}