import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, CheckCircle2, Flame, Heart, TerminalSquare,
  Sparkles, Settings2, Key, ChevronDown, Lock, AlertCircle,
  Lightbulb, ArrowRight, Check
} from 'lucide-react';

export default function AIBuilderPreferences() {
  const navigate = useNavigate();
  const [primaryBuilder, setPrimaryBuilder] = useState('base44');
  const [designTools, setDesignTools] = useState(['aura']);
  const [apiKeys, setApiKeys] = useState({
    claude: '',
    elevenlabs: '',
    stripe: ''
  });

  const handleNext = () => {
    const existingData = JSON.parse(localStorage.getItem('projectSetup') || '{}');
    localStorage.setItem('projectSetup', JSON.stringify({
      ...existingData,
      aiBuilder: {
        primaryBuilder,
        designTools,
        apiKeys
      }
    }));
    navigate(createPageUrl('DesignSystemSetup'));
  };

  const builders = [
    {
      id: 'base44',
      name: 'Base44',
      logo: <span className="font-bold text-xl tracking-tighter">B44</span>,
      logoBg: 'bg-slate-900',
      badge: { text: 'Recommended', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Flame },
      description: 'Visual development platform. Build production-ready apps directly from designs.',
      features: ['Unlimited credits', 'Supabase integration', 'Real-time preview'],
      footer: { label: 'Best for:', value: 'Full-stack apps' },
      status: { type: 'connected', email: 'rivaldo@base44.com' }
    },
    {
      id: 'lovable',
      name: 'Lovable',
      logo: <Heart className="w-7 h-7 fill-white" />,
      logoBg: 'bg-rose-500',
      badge: { text: 'Popular', color: 'bg-slate-100 text-slate-600 border-slate-200' },
      description: 'AI-powered app builder. Chat to create full-stack applications instantly.',
      features: ['Chat-based building', 'Instant deploys', 'Collaboration'],
      footer: { label: 'Pricing:', value: 'Freemium' },
      status: { type: 'connect' }
    },
    {
      id: 'v0',
      name: 'v0 by Vercel',
      logo: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg"><path d="M24 22.525H0l12-21.05 12 21.05z"></path></svg>,
      logoBg: 'bg-black',
      badge: { text: 'React / Next.js', color: 'bg-slate-100 text-slate-600 border-slate-200' },
      description: 'Generate React components from text prompts. Perfect for Next.js projects.',
      features: ['Shadcn/UI components', 'Tailwind CSS', 'Copy-paste code'],
      footer: { label: 'Best for:', value: 'Components' },
      status: { type: 'connect' }
    },
    {
      id: 'cursor',
      name: 'Cursor',
      logo: <TerminalSquare className="w-7 h-7" />,
      logoBg: 'bg-slate-100 text-slate-800',
      badge: { text: 'Code Editor', color: 'bg-slate-100 text-slate-600 border-slate-200' },
      description: 'AI-powered code editor fork of VS Code. Write and refactor code with AI.',
      features: ['AI code completion', 'Chat with codebase', 'Multi-file editing'],
      footer: { label: 'Price:', value: '$20/mo' },
      status: { type: 'download' }
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="w-full max-w-[850px] bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200 flex flex-col max-h-[92vh] relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100 absolute top-0 left-0 z-20">
          <div className="h-full bg-blue-500 w-[66%] rounded-r-full transition-all duration-500"></div>
        </div>

        {/* Header */}
        <div className="px-8 pt-6 pb-2 flex items-center justify-between shrink-0 bg-white z-10">
          <button 
            onClick={() => navigate(createPageUrl('ProjectTechStack'))}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -ml-1 rounded-md hover:bg-slate-50 group"
          >
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
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

        {/* Scrollable Content */}
        <div className="px-8 py-4 overflow-y-auto flex-1">
          
          {/* Titles */}
          <div className="mb-8 text-center max-w-lg mx-auto">
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight mb-2">AI Builder Preferences</h1>
            <p className="text-slate-500 text-[15px]">Choose your primary tools for building with AI.</p>
          </div>

          {/* Primary AI Builder */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Primary AI Builder</h2>
                <p className="text-xs text-slate-500 mt-0.5">This will be your go-to tool for converting designs to code</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {builders.map(builder => {
                const isSelected = primaryBuilder === builder.id;
                const BadgeIcon = builder.badge.icon;
                return (
                  <label key={builder.id} className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="primary_builder" 
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setPrimaryBuilder(builder.id)}
                    />
                    <div className={`h-full border-2 rounded-xl p-6 transition-all relative ${
                      isSelected ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}>
                      
                      {/* Checkmark */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-blue-500">
                          <CheckCircle2 className="w-6 h-6 fill-blue-50" />
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white shrink-0 ${builder.logoBg}`}>
                          {builder.logo}
                        </div>
                        <div>
                          <h3 className="text-[18px] font-bold text-slate-900 leading-tight">{builder.name}</h3>
                          <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${builder.badge.color}`}>
                            {BadgeIcon && <BadgeIcon className="w-3 h-3 fill-current" />}
                            {builder.badge.text}
                          </span>
                        </div>
                      </div>

                      <p className="text-[14px] text-slate-600 mb-4 leading-relaxed">
                        {builder.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-1.5 mb-5 border-t border-b border-slate-100 py-3">
                        {builder.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[13px] text-slate-600">
                            <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-[12px] font-medium text-slate-500">
                          {builder.footer.label} <span className="text-slate-700">{builder.footer.value}</span>
                        </div>
                        {builder.status.type === 'connected' ? (
                          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md border border-emerald-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-semibold">Connected</span>
                          </div>
                        ) : (
                          <button type="button" className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md shadow-sm transition-colors">
                            {builder.status.type === 'download' ? 'Download' : 'Connect'}
                          </button>
                        )}
                      </div>
                      {builder.status.email && (
                        <div className="mt-2 text-right">
                          <span className="text-[11px] text-slate-400">{builder.status.email}</span>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Design Tools */}
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Design Tool Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Aura AI */}
              <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Aura AI</h4>
                    <p className="text-[11px] text-slate-500">Generative UI Design</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Connected
                  </span>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                    <Settings2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Figma */}
              <div className="flex items-center justify-between p-4 border border-slate-200 bg-white rounded-xl hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                  <img src="https://cdn.simpleicons.org/figma" className="w-10 h-10" alt="Figma" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Figma</h4>
                    <p className="text-[11px] text-slate-500">Import Design Files</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md shadow-sm transition-colors">
                  Connect
                </button>
              </div>

            </div>
          </div>

          {/* Essential APIs */}
          <div className="mb-8 border-t border-slate-100 pt-8">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none select-none text-slate-700 hover:text-blue-600 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-open:bg-blue-100 group-open:text-blue-600 transition-colors">
                    <Key className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-base">Essential APIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 group-open:hidden">Configure now or skip</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </div>
              </summary>
              
              <div className="pt-6">
                <div className="space-y-4">
                  
                  {/* Claude API */}
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 shrink-0">
                        <img src="https://cdn.simpleicons.org/anthropic" className="w-full h-full object-contain opacity-80" alt="Anthropic" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-900">Claude API (Anthropic)</h4>
                          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-medium border border-amber-100">
                            <AlertCircle className="w-3 h-3" /> Not configured
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Required for advanced analysis and code generation features.</p>
                        
                        <div className="flex gap-2 items-center">
                          <div className="relative flex-1 rounded-md transition-all">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <input 
                              type="password" 
                              placeholder="sk-ant-api..."
                              value={apiKeys.claude}
                              onChange={(e) => setApiKeys({ ...apiKeys, claude: e.target.value })}
                              className="w-full text-sm bg-white border border-slate-300 rounded-md pl-9 pr-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <button className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors shadow-sm">
                            Save
                          </button>
                        </div>
                        <div className="mt-2 text-right">
                          <a href="#" className="text-[11px] text-blue-500 hover:text-blue-600 hover:underline">Get API Key →</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ElevenLabs */}
                  <div className="flex items-center justify-between p-4 border border-slate-200 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2">
                        <img src="https://cdn.simpleicons.org/elevenlabs" className="w-full h-full object-contain opacity-80" alt="ElevenLabs" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">ElevenLabs</h4>
                        <p className="text-[11px] text-slate-500">Text-to-speech services</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 px-3 py-1.5 rounded-md transition-all">
                      Add API Key
                    </button>
                  </div>

                  {/* Stripe */}
                  <div className="flex items-center justify-between p-4 border border-slate-200 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center p-2 text-white">
                        <img src="https://cdn.simpleicons.org/stripe/white" className="w-full h-full object-contain" alt="Stripe" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Stripe</h4>
                        <p className="text-[11px] text-slate-500">Payment processing</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md shadow-sm transition-colors">
                      Connect Stripe
                    </button>
                  </div>

                </div>
              </div>
            </details>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4 flex gap-3 items-start mb-24">
            <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-blue-900 leading-relaxed">
              <span className="font-semibold">Tip:</span> You can connect more tools later in <span className="font-medium bg-blue-100 px-1 py-0.5 rounded text-blue-700">Settings &gt; Integrations</span>. At least one primary builder is recommended.
            </p>
          </div>

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
                onClick={() => navigate(createPageUrl('ProjectTechStack'))}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                Previous
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">Auto-saves selections</span>
              <button 
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group active:scale-[0.98]"
              >
                Next: Design System
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}