import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ChevronRight, ChevronDown, GripVertical, Timer, CheckCircle2, 
  AlertCircle, XCircle, Clock, Bug, Plus, PlayCircle, Download,
  Monitor, Smartphone, ChevronLeft, MoreHorizontal, Play, Mic,
  Filter, Send, AlertOctagon, ArrowRight, Check, Signal, Wifi, Battery,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PageTesting() {
  const navigate = useNavigate();
  const [expandedFeatures, setExpandedFeatures] = useState([0, 2]);
  const [activeTab, setActiveTab] = useState('preview');

  const toggleFeature = (index) => {
    setExpandedFeatures(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const features = [
    {
      name: 'Mic Recording',
      status: 'tested',
      priority: 'high',
      subFeatures: [
        { name: 'iOS mic permission request', status: 'done', note: 'Shows native dialog correctly', tested: 'Dec 18, 3:45 PM' },
        { name: 'Android mic permission', status: 'done', tested: 'Dec 18, 3:50 PM' },
        { name: 'Recording starts on tap', status: 'done', note: 'Instant response', tested: 'Dec 18, 4:00 PM' },
        { name: 'Error handling (mic unavailable)', status: 'partial', bug: '#25 - Android crashes', tested: 'Dec 18, 4:15 PM' }
      ]
    },
    {
      name: 'Waveform Display',
      status: 'tested',
      priority: 'medium',
      subFeatures: []
    },
    {
      name: 'Speech-to-Text (Whisper)',
      status: 'partial',
      priority: 'high',
      critical: true,
      subFeatures: [
        { name: 'Audio upload to Whisper API', status: 'done' },
        { name: 'Transcription accuracy', status: 'partial', bug: 'CRITICAL BUG #23 - Cuts off sentences > 30 seconds' },
        { name: 'Handle multiple languages', status: 'blocked', note: 'Blocked by Bug #23' }
      ]
    },
    {
      name: 'AI Response (Claude)',
      status: 'pending',
      priority: 'medium',
      subFeatures: []
    },
    {
      name: 'Voice Playback (ElevenLabs)',
      status: 'pending',
      priority: 'medium',
      subFeatures: []
    }
  ];

  const statusBadge = (status) => {
    const styles = {
      tested: 'bg-green-50 text-green-700 border-green-100',
      partial: 'bg-amber-100 text-amber-700 border-amber-200',
      pending: 'bg-slate-100 text-slate-500 border-slate-200'
    };
    
    const icons = {
      tested: <CheckCircle2 className="w-3 h-3" />,
      partial: <AlertCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[status]}`}>
        {icons[status]} {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Features & Testing */}
        <aside className="col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="shrink-0 p-5 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 font-medium">
              <button onClick={() => navigate(createPageUrl('Home'))} className="hover:text-slate-600">Projects</button>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="hover:text-slate-600 cursor-pointer">DealMaker</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="hover:text-slate-600 cursor-pointer">Pages</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-900">Voice Practice</span>
            </div>

            <div className="flex items-start justify-between mb-3">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="text-xl">🎤</span> Voice Practice Screen
              </h1>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded font-medium bg-orange-100 text-orange-700 border border-orange-200">
                Testing
              </span>
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Timer className="w-3 h-3" /> Sprint 2
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Due Dec 22</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">60% Complete</span>
                <span className="text-slate-400">12/20 Sub-features</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`bg-white border rounded-lg shadow-sm overflow-hidden ${
                  feature.critical ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'
                }`}
              >
                <div className="group/details">
                  <button
                    onClick={() => toggleFeature(idx)}
                    className={`w-full flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors text-left ${
                      feature.critical ? 'bg-amber-50/50' : 'bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {expandedFeatures.includes(idx) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-sm font-semibold text-slate-800">{feature.name}</span>
                    </div>
                    {statusBadge(feature.status)}
                  </button>
                  
                  {expandedFeatures.includes(idx) && feature.subFeatures.length > 0 && (
                    <div className="p-3 pt-0 relative">
                      <div className="absolute left-[23px] top-0 bottom-0 w-px bg-slate-200"></div>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 ml-7 mt-2">
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> 
                          {feature.priority === 'high' ? 'High' : 'Medium'} Priority
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className={feature.status === 'tested' ? 'text-green-600' : 'text-amber-600'}>
                          {feature.status === 'tested' ? '✅ Working' : '🟡 Partial'}
                        </span>
                      </div>

                      <div className="space-y-4 ml-7">
                        {feature.subFeatures.map((sub, subIdx) => (
                          <div key={subIdx} className="relative group/item">
                            <div className="absolute -left-[29px] top-3.5 w-3 h-px bg-slate-200"></div>
                            <div className="flex items-start gap-2">
                              {sub.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />}
                              {sub.status === 'partial' && <AlertCircle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />}
                              {sub.status === 'blocked' && <div className="w-3.5 h-3.5 border border-slate-300 rounded-sm mt-0.5"></div>}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800">{sub.name}</p>
                                {sub.tested && (
                                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                                    <span>Tested: {sub.tested}</span>
                                    {sub.status === 'done' && <span className="text-green-600 font-medium">✅ Works</span>}
                                    {sub.status === 'partial' && <span className="text-yellow-600 font-medium">🟡 Partial</span>}
                                  </div>
                                )}
                                {sub.note && !sub.bug && (
                                  <p className="text-[11px] text-slate-400 mt-0.5 italic">"{sub.note}"</p>
                                )}
                                {sub.bug && (
                                  <div className="mt-1.5 p-2 bg-red-50 rounded border border-red-100 text-[11px] text-red-700">
                                    <div className="font-bold flex items-center gap-1">
                                      <Bug className="w-3 h-3" /> {sub.bug}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="ml-7 mt-4 flex items-center gap-2">
                        <button className="text-[11px] font-medium text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add sub-feature
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {expandedFeatures.includes(idx) && feature.subFeatures.length === 0 && (
                    <div className="p-3 pt-0 ml-7 text-xs text-slate-500">
                      {feature.status === 'tested' ? '5/5 sub-features working...' : '0/6 sub-features ready...'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Testing Summary */}
          <div className="shrink-0 p-4 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">Testing Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="text-slate-600">Major Feat: <span className="font-medium text-slate-900">2 ✅ / 1 🟡 / 2 ☐</span></div>
              <div className="text-slate-600">Sub-Feat: <span className="font-medium text-slate-900">12 ✅ / 2 🟡</span></div>
              <div className="text-slate-600">Open Bugs: <span className="font-medium text-red-600">2 Active</span></div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs shadow-sm">
                <PlayCircle className="w-3.5 h-3.5 mr-2" /> Test All Features
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Design & Preview */}
        <main className="col-span-5 bg-white flex flex-col h-full overflow-hidden">
          
          {/* Tabs */}
          <div className="shrink-0 border-b border-slate-200 px-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === 'preview' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-200'
                }`}
              >
                Preview
              </button>
              <button 
                onClick={() => setActiveTab('prompt')}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === 'prompt' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-200'
                }`}
              >
                Aura Prompt
              </button>
              <button className="px-4 py-3 text-xs font-medium text-slate-500 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-200">Base44</button>
              <button className="px-4 py-3 text-xs font-medium text-slate-500 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-200">v0</button>
              <button className="px-4 py-3 text-xs font-medium text-slate-500 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-200">Code</button>
            </div>
            <div className="flex items-center gap-1 pr-2">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded"><Monitor className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded"><Smartphone className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex items-start justify-center">
            {/* Phone Mockup */}
            <div className="w-[320px] bg-white rounded-3xl shadow-2xl border-[6px] border-slate-900 overflow-hidden">
              {/* Status Bar */}
              <div className="h-6 bg-white flex items-center justify-between px-4 text-[10px] font-medium text-slate-900">
                <span>9:41</span>
                <div className="flex gap-1">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3 h-3" />
                </div>
              </div>

              {/* App Content */}
              <div className="h-[600px] flex flex-col bg-white">
                {/* App Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50">
                  <button className="p-2 -ml-2 text-slate-400"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="text-sm font-semibold text-slate-900">Practice</span>
                  <button className="p-2 -mr-2 text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4 space-y-4 overflow-y-hidden">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs">🤖</div>
                    <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-slate-700 max-w-[85%]">
                      Let's negotiate. Your rate is too high. Can you lower it by 15%?
                    </div>
                  </div>
                  
                  {/* User Audio Waveform */}
                  <div className="flex items-center justify-end gap-2 mt-8">
                    <div className="bg-blue-600 rounded-2xl rounded-tr-none px-4 py-3 text-white max-w-[85%] flex items-center gap-3 shadow-md shadow-blue-200">
                      <button className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                      <div className="flex items-center gap-0.5 h-4">
                        {[2, 3, 4, 3, 2, 2, 3, 2, 2, 4].map((h, i) => (
                          <div key={i} className={`w-0.5 rounded-full ${h === 4 ? 'bg-white h-4' : h === 3 ? 'bg-white/80 h-3' : h === 2 ? 'bg-white/60 h-2' : 'bg-white/40 h-2'}`}></div>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-white/90">0:12</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">YO</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-6 bg-white border-t border-slate-50 flex flex-col items-center gap-4 pb-10">
                  <div className="text-xs text-slate-400 font-medium animate-pulse">Listening...</div>
                  <button className="w-16 h-16 rounded-full bg-red-500 shadow-lg shadow-red-200 flex items-center justify-center hover:scale-105 transition-transform">
                    <Mic className="w-7 h-7 text-white" />
                  </button>
                  <button className="text-xs text-slate-400 font-medium hover:text-slate-600 mt-2">Tap to stop</button>
                </div>
              </div>
            </div>
          </div>

          {/* Design Info Panel */}
          <div className="shrink-0 bg-white border-t border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Design Info</h3>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Source: <span className="text-slate-700 font-medium">Aura AI</span> • Version: <span className="text-slate-700 font-medium">v2.1</span></p>
                  <p>File: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">voice_practice_v2.png</code></p>
                </div>
              </div>
              <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                View in Design System <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="mt-3 flex gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Check className="w-3 h-3 text-green-500" /> Colors Matches
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Check className="w-3 h-3 text-green-500" /> Typography Matches
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Check className="w-3 h-3 text-green-500" /> Spacing Matches
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Activity */}
        <aside className="col-span-3 border-l border-slate-200 bg-white flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Page Activity</h3>
            <button className="text-slate-400 hover:text-slate-600"><Filter className="w-3.5 h-3.5" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Comment */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-[10px] font-bold text-slate-600">
                SA
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-900">Sarah (QA)</span>
                  <span className="text-[10px] text-slate-400">2h ago</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Confirmed mic works on iPhone 13, but the waveform animation lags slightly on older Android devices.
                </p>
                <div className="mt-2">
                  <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] rounded border border-yellow-100">Performance</span>
                </div>
              </div>
            </div>

            {/* System Event */}
            <div className="relative pl-4 ml-3.5 border-l border-slate-100">
              <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-200 border-2 border-white"></div>
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">You</span> updated the design specs
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">Yesterday, 4:20 PM</span>
            </div>

            {/* Bug Alert */}
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertOctagon className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-red-900">Bug #23 Escalated</p>
                  <p className="text-[10px] text-red-700 mt-1">Whisper API timeout issues causing crashes.</p>
                  <button className="mt-2 text-[10px] bg-white border border-red-200 px-2 py-1 rounded text-red-600 hover:bg-red-50">View Details</button>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="shrink-0 p-4 border-t border-slate-200">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Add a comment..." 
                className="w-full pr-8 text-xs bg-slate-50 h-9"
              />
              <button className="absolute right-2 top-2 text-slate-400 hover:text-blue-600">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}