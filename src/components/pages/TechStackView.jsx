import React, { useState } from 'react';
import {
  Bot, RefreshCw, Search, Smartphone, Zap, BarChart3, Laptop, Settings, 
  Database, Plug, Rocket, Wrench, Trophy, CheckCircle2, ThumbsUp, 
  AlertTriangle, Minus, Check, PenTool, Terminal, Atom, Code2, ChevronRight,
  Star, CreditCard, Cpu, BrainCircuit
} from 'lucide-react';

export default function TechStackView() {
  const [activeTab, setActiveTab] = useState('frontend');

  const tabs = [
    { id: 'frontend', label: 'Frontend', icon: Laptop },
    { id: 'backend', label: 'Backend', icon: Settings },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'apis', label: 'APIs', icon: Plug },
    { id: 'deployment', label: 'Deployment', icon: Rocket },
    { id: 'tools', label: 'Tools', icon: Wrench }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-blue-600 to-blue-500 px-12 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400 opacity-10 rounded-full blur-2xl -ml-10 -mb-10"></div>

        <div className="max-w-[1440px] mx-auto flex items-start justify-between relative z-10">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <Bot className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">AI Tech Stack Advisor</h1>
              <p className="text-blue-50/90 text-lg font-medium">Get personalized technology recommendations based on your app requirements</p>
              
              <div className="flex items-center gap-3 mt-4">
                <span className="bg-green-500/20 text-green-100 border border-green-400/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Recommendations Ready
                </span>
                <span className="text-white/60 text-xs">Analysis complete in 2.4s</span>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold border border-white/20 transition-all">
            <RefreshCw className="w-4 h-4" />
            Refresh Recommendations
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto p-12 grid grid-cols-12 gap-10">
        
        {/* Left Column */}
        <div className="col-span-8 space-y-10">

          {/* App Analysis Summary */}
          <section className="bg-blue-50/40 rounded-2xl border-2 border-blue-500 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Search className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">AI Analysis of Your Project</h2>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  App Type
                </div>
                <ul className="space-y-2">
                  <li className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="block w-1 h-1 bg-slate-400 rounded-full mt-2"></span>
                    Mobile App (iOS + Android)
                  </li>
                  <li className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="block w-1 h-1 bg-slate-400 rounded-full mt-2"></span>
                    Target: End Consumers
                  </li>
                  <li className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="block w-1 h-1 bg-slate-400 rounded-full mt-2"></span>
                    Scale: 1k-10k Users
                  </li>
                </ul>
              </div>

              <div className="space-y-3 border-l border-blue-200 pl-8">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Critical Features
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white text-slate-600 border border-blue-100 px-2 py-1 rounded text-xs font-medium">Voice Recording</span>
                  <span className="bg-white text-slate-600 border border-blue-100 px-2 py-1 rounded text-xs font-medium">Real-time AI</span>
                  <span className="bg-white text-slate-600 border border-blue-100 px-2 py-1 rounded text-xs font-medium">Payments</span>
                </div>
              </div>

              <div className="space-y-3 border-l border-blue-200 pl-8">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  Complexity
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-slate-900">7/10</span>
                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">ADVANCED</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Requires real-time audio processing and low-latency AI responses.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* AI Recommendations */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recommended Tech Stack</h2>
                <p className="text-slate-500 text-sm mt-1">Based on your features, team size, and experience level.</p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                <span className="text-xs font-bold text-green-700 uppercase">Confidence Score</span>
                <div className="flex text-green-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="text-sm font-bold text-green-700 ml-1">92%</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-8 overflow-x-auto">
              <div className="flex gap-8 min-w-max">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-blue-600'
                          : 'text-slate-500 hover:text-slate-900 border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'frontend' && (
              <div className="space-y-8">
                {/* Primary Recommendation */}
                <div className="bg-white rounded-xl border-[3px] border-green-500 p-8 relative shadow-lg">
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> BEST MATCH
                  </div>

                  <div className="flex items-start justify-between mb-8">
                    <div className="flex gap-6">
                      <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-blue-500"><path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900">Flutter</h3>
                        <p className="text-slate-500 font-medium mt-1">Cross-Platform Mobile Framework</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex text-green-500 text-xs">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                          </div>
                          <span className="text-xs font-semibold text-slate-400">95% Confidence</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Est. Dev Time</div>
                      <div className="text-lg font-bold text-slate-900">8-12 Weeks</div>
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-green-50/50 rounded-lg p-5 border border-green-100">
                      <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" /> Why we recommend this
                      </h4>
                      <ul className="space-y-2.5">
                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          Single codebase for iOS + Android
                        </li>
                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          Native performance (60fps)
                        </li>
                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          Works with Base44 & Aura
                        </li>
                      </ul>
                    </div>

                    <div className="bg-orange-50/50 rounded-lg p-5 border border-orange-100">
                      <h4 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Trade-offs
                      </h4>
                      <ul className="space-y-2.5">
                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Minus className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                          Learning curve (Dart language)
                        </li>
                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Minus className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                          Larger app size than native
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Compatibility */}
                  <div className="border-t border-slate-100 pt-6 mb-8">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Compatibility with your tools</h4>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold">B</div>
                        <span className="text-sm font-medium text-slate-700">Base44</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                          <PenTool className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Aura AI</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white">
                          <Terminal className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Cursor</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all">
                      Select Flutter Stack
                    </button>
                    <button className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 px-6 py-3 rounded-lg font-semibold transition-colors">
                      View Documentation
                    </button>
                  </div>
                </div>

                {/* Alternatives */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">Other Options to Consider</h3>
                  <div className="grid grid-cols-1 gap-4">
                    
                    <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                          <Atom className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">React Native</h4>
                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">78% Match</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Great ecosystem, but slightly lower audio performance.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                          <Code2 className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">Native (Swift / Kotlin)</h4>
                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">65% Match</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Best performance, but requires 2x development time.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== 'frontend' && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {tabs.find(t => t.id === activeTab)?.icon && 
                    React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "w-8 h-8 text-slate-400" })
                  }
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{tabs.find(t => t.id === activeTab)?.label} Recommendations</h3>
                <p className="text-slate-500 text-sm">Coming soon - comprehensive recommendations for {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}.</p>
              </div>
            )}

            {/* Complete Stack Summary */}
            <div className="mt-12 bg-slate-900 rounded-xl p-8 text-white shadow-xl">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-2">Complete Stack Overview</h3>
                  <p className="text-slate-400 text-sm">Your full end-to-end configuration based on selected options.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg transition-all">
                  Save Configuration
                </button>
              </div>

              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Frontend</div>
                  <div className="font-bold text-green-400 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Flutter
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Backend</div>
                  <div className="font-bold text-blue-400 flex items-center gap-2">
                    <Database className="w-4 h-4" /> Supabase
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">AI APIs</div>
                  <div className="font-bold text-purple-400 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Whisper + Claude
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Payments</div>
                  <div className="font-bold text-indigo-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Stripe
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs text-slate-500">Est. Monthly Cost</div>
                    <div className="text-sm font-bold text-white">~$200-300<span className="text-slate-500 font-normal">/mo</span></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Setup Cost</div>
                    <div className="text-sm font-bold text-white">~$150 <span className="text-slate-500 font-normal">(one-time)</span></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="text-sm text-slate-300 hover:text-white underline">Generate Setup PDF</button>
                  <button className="text-sm text-slate-300 hover:text-white underline">Export to Cursor</button>
                </div>
              </div>
            </div>

          </section>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4">
          <div className="sticky top-20 space-y-6">
            
            {/* Decision Factors */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" /> Why this stack?
              </h3>
              
              <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-slate-100">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                  <h4 className="text-xs font-bold text-slate-700">App Type Matches</h4>
                  <p className="text-xs text-slate-500 mt-1">Cross-platform (Flutter) is optimal for Mobile iOS + Android distribution.</p>
                </div>
                
                <div className="relative pl-4 border-l-2 border-slate-100">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white"></div>
                  <h4 className="text-xs font-bold text-slate-700">Feature Requirements</h4>
                  <p className="text-xs text-slate-500 mt-1">Native audio libraries in Flutter handle Voice Recording better than PWAs.</p>
                </div>

                <div className="relative pl-4 border-l-2 border-slate-100">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-white"></div>
                  <h4 className="text-xs font-bold text-slate-700">Team Size (Solo)</h4>
                  <p className="text-xs text-slate-500 mt-1">Supabase + Flutter minimizes context switching for single developers.</p>
                </div>
              </div>
            </div>

            {/* Setup Checklist */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Setup Checklist</h3>
                <span className="text-xs font-bold text-slate-400">0/4</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs text-slate-600 group-hover:text-slate-900">Install Flutter SDK</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs text-slate-600 group-hover:text-slate-900">Create Supabase Project</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs text-slate-600 group-hover:text-slate-900">Get OpenAI Whisper API Key</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs text-slate-600 group-hover:text-slate-900">Set up GitHub Repository</span>
                </label>
              </div>

              <button className="w-full mt-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50 transition-colors">
                Generate Full Guide
              </button>
            </div>

            {/* Learning Resources */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
              <h3 className="text-sm font-bold text-blue-900 mb-3">Quick Start Resources</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-2 bg-white rounded border border-blue-100 hover:border-blue-300 transition-colors group">
                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">Fl</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Flutter Crash Course</div>
                    <div className="text-[10px] text-slate-500">Video • 45 mins</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 p-2 bg-white rounded border border-blue-100 hover:border-blue-300 transition-colors group">
                  <div className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center font-bold text-xs">Sb</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-green-600">Supabase Auth Guide</div>
                    <div className="text-[10px] text-slate-500">Doc • 10 mins</div>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}