import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, CheckCircle2, Star, Zap, Smartphone, Database,
  Layout, Rocket, Cloud, Search, Server, TrendingUp, Layers,
  ChevronDown, Info, ArrowRight
} from 'lucide-react';

export default function ProjectTechStack() {
  const navigate = useNavigate();
  const [selectedStack, setSelectedStack] = useState('flutter-supabase');
  const [customStack, setCustomStack] = useState({
    frontend: '',
    backend: '',
    database: ''
  });
  const [integrations, setIntegrations] = useState([]);
  const [hosting, setHosting] = useState('not-sure');

  const popularStacks = [
    {
      id: 'flutter-supabase',
      name: 'Flutter + Supabase',
      badge: 'Most Popular',
      badgeColor: 'bg-blue-500 text-white',
      icons: [
        { src: 'https://cdn.simpleicons.org/flutter/02569B', alt: 'Flutter' },
        { src: 'https://cdn.simpleicons.org/supabase/3ECF8E', alt: 'Supabase' }
      ],
      description: 'Cross-platform mobile with powerful backend',
      features: [
        { icon: Zap, label: 'Native performance' },
        { icon: Smartphone, label: 'Single codebase' },
        { icon: Database, label: 'Real-time DB' }
      ],
      tag: 'Best for Mobile Apps',
      tagColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'react-firebase',
      name: 'React + Firebase',
      badge: 'Fast Setup',
      badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
      icons: [
        { src: 'https://cdn.simpleicons.org/react/61DAFB', alt: 'React' },
        { src: 'https://cdn.simpleicons.org/firebase/FFCA28', alt: 'Firebase' }
      ],
      description: 'Modern web with instant backend services',
      features: [
        { icon: Layout, label: 'Component-based' },
        { icon: Rocket, label: 'Easy deployment' },
        { icon: Cloud, label: 'Serverless' }
      ],
      tag: 'Best for Web Apps',
      tagColor: 'bg-slate-100 text-slate-500'
    },
    {
      id: 'nextjs-postgres',
      name: 'Next.js + Postgres',
      badge: 'Enterprise',
      badgeColor: 'bg-slate-800 text-white',
      icons: [
        { src: 'https://cdn.simpleicons.org/nextdotjs/000000', alt: 'Next.js' },
        { src: 'https://cdn.simpleicons.org/postgresql/4169E1', alt: 'PostgreSQL' }
      ],
      description: 'Full-stack control with relational data',
      features: [
        { icon: Search, label: 'SEO-friendly' },
        { icon: Server, label: 'Server-side Render' },
        { icon: TrendingUp, label: 'Scalable' }
      ],
      tag: 'Best for Complex Web',
      tagColor: 'bg-slate-100 text-slate-500'
    }
  ];

  const apiOptions = [
    { id: 'stripe', label: 'Stripe', desc: 'Payments' },
    { id: 'twilio', label: 'Twilio', desc: 'SMS' },
    { id: 'sendgrid', label: 'SendGrid', desc: 'Email' },
    { id: 'aws-s3', label: 'AWS S3', desc: 'Storage' }
  ];

  const hostingOptions = [
    { id: 'vercel', label: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel' },
    { id: 'netlify', label: 'Netlify', icon: 'https://cdn.simpleicons.org/netlify' },
    { id: 'aws', label: 'AWS', icon: 'https://cdn.simpleicons.org/amazonwebservices' },
    { id: 'app-stores', label: 'App Stores', icon: 'https://cdn.simpleicons.org/appstore' },
    { id: 'not-sure', label: 'Not sure yet', icon: null }
  ];

  const toggleIntegration = (id) => {
    setIntegrations(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    const existingData = JSON.parse(localStorage.getItem('projectSetup') || '{}');
    localStorage.setItem('projectSetup', JSON.stringify({
      ...existingData,
      techStack: {
        selectedStack,
        customStack,
        integrations,
        hosting
      }
    }));
    navigate(createPageUrl('AIBuilderPreferences'));
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="w-full max-w-[850px] bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200 flex flex-col max-h-[92vh] relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100 absolute top-0 left-0 z-20">
          <div className="h-full bg-blue-500 w-[33%] rounded-r-full transition-all duration-500"></div>
        </div>

        {/* Header */}
        <div className="px-8 pt-6 pb-2 flex items-center justify-between shrink-0 bg-white z-10">
          <button 
            onClick={() => navigate(createPageUrl('NewProject'))}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -ml-1 rounded-md hover:bg-slate-50 group"
          >
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
              Back
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Step 2 of 6</span>
            <button 
              onClick={() => navigate(createPageUrl('Home'))}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-10 py-4 overflow-y-auto flex-1">
          
          {/* Titles */}
          <div className="mb-8 text-center max-w-lg mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Choose Your Tech Stack</h1>
            <p className="text-slate-500 text-[15px]">Select the technologies needed for your project. Don't worry, you can easily change these settings later.</p>
          </div>

          {/* Popular Stacks */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Popular Stacks</h2>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Recommended
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {popularStacks.map(stack => {
                const isSelected = selectedStack === stack.id;
                return (
                  <label key={stack.id} className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="stack_preset" 
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setSelectedStack(stack.id)}
                    />
                    <div className={`h-full border-2 rounded-xl p-5 transition-all relative hover:shadow-md ${
                      isSelected ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                      {/* Badge */}
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide uppercase ${stack.badgeColor}`}>
                        {stack.badge}
                      </div>
                      
                      {/* Checkmark */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-blue-500">
                          <CheckCircle2 className="w-5 h-5 fill-blue-100" />
                        </div>
                      )}

                      {/* Icons */}
                      <div className="flex items-center justify-center gap-3 mb-4 mt-2">
                        <img src={stack.icons[0].src} className="w-8 h-8" alt={stack.icons[0].alt} />
                        <span className="text-slate-300 text-lg">+</span>
                        <img src={stack.icons[1].src} className="w-8 h-8" alt={stack.icons[1].alt} />
                      </div>

                      {/* Content */}
                      <div className="text-center mb-4">
                        <h3 className="text-[17px] font-bold text-slate-900 mb-1">{stack.name}</h3>
                        <p className="text-[13px] text-slate-500 leading-snug">{stack.description}</p>
                      </div>

                      {/* Features */}
                      <div className={`rounded-lg p-3 border mb-3 ${
                        isSelected ? 'bg-white/60 border-blue-100/50' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Features</p>
                        <ul className="space-y-1.5">
                          {stack.features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                              <li key={idx} className={`text-[13px] flex items-center gap-2 ${
                                isSelected ? 'text-slate-700' : 'text-slate-600'
                              }`}>
                                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                                {feature.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      
                      <div className="text-center">
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded ${stack.tagColor}`}>
                          {stack.tag}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Custom Stack */}
          <div className="mb-10 border-t border-slate-100 pt-8">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none select-none text-slate-700 hover:text-blue-600 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-open:bg-blue-100 group-open:text-blue-600 transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-base">Or Build Your Own Stack</span>
                </div>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
              </summary>
              
              <div className="pt-6 pl-2 pr-2 pb-2">
                {/* Dropdowns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Frontend Framework</label>
                    <div className="relative">
                      <select 
                        value={customStack.frontend}
                        onChange={(e) => setCustomStack({ ...customStack, frontend: e.target.value })}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      >
                        <option value="">Select Framework</option>
                        <option>Flutter</option>
                        <option>React</option>
                        <option>React Native</option>
                        <option>Vue.js</option>
                        <option>Next.js</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Backend Logic</label>
                    <div className="relative">
                      <select 
                        value={customStack.backend}
                        onChange={(e) => setCustomStack({ ...customStack, backend: e.target.value })}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      >
                        <option value="">Select Backend</option>
                        <option>Supabase</option>
                        <option>Firebase</option>
                        <option>Node.js + Express</option>
                        <option>Python + Django</option>
                        <option>Ruby on Rails</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Database</label>
                    <div className="relative">
                      <select 
                        value={customStack.database}
                        onChange={(e) => setCustomStack({ ...customStack, database: e.target.value })}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      >
                        <option value="">Select Database</option>
                        <option>PostgreSQL</option>
                        <option>Firestore</option>
                        <option>MongoDB</option>
                        <option>MySQL</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* APIs & Integrations */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">APIs & Integrations</label>
                  <div className="flex flex-wrap gap-3">
                    {apiOptions.map(api => (
                      <label 
                        key={api.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
                      >
                        <input 
                          type="checkbox" 
                          checked={integrations.includes(api.id)}
                          onChange={() => toggleIntegration(api.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {api.label} <span className="text-slate-400 font-normal">({api.desc})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Deployment */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-slate-900 block mb-3">Where will you host?</label>
            <div className="flex flex-wrap gap-3">
              {hostingOptions.map(option => (
                <label key={option.id} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="hosting" 
                    className="peer sr-only"
                    checked={hosting === option.id}
                    onChange={() => setHosting(option.id)}
                  />
                  <div className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-600 peer-checked:border-blue-500 peer-checked:text-blue-600 peer-checked:bg-blue-50/30 transition-all flex items-center gap-2">
                    {option.icon && <img src={option.icon} className="w-3.5 h-3.5 opacity-60" alt={option.label} />}
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4 flex gap-3 items-start mb-24">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-blue-900 leading-relaxed">
              <span className="font-semibold">Note:</span> You can add or change technologies anytime in your project settings. We'll set up the initial boilerplate based on these choices.
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
                onClick={() => navigate(createPageUrl('NewProject'))}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                Previous
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group active:scale-[0.98]"
              >
                Next: AI Builder
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}