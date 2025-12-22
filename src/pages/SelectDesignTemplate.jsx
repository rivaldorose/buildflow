import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, Check, Eye, ChevronDown, Search, LayoutTemplate
} from 'lucide-react';

export default function SelectDesignTemplate() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('modern-blue');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    {
      id: 'modern-blue',
      name: 'Modern Blue',
      category: 'SaaS',
      badge: 'Most Popular',
      badgeColor: 'bg-blue-100 text-blue-700',
      uses: '2,847',
      colors: ['#2563EB', '#F97316', '#10B981', '#F59E0B', '#EF4444'],
      colorClasses: ['bg-blue-600', 'bg-orange-500', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500'],
      font: 'Inter',
      features: ['High contrast', 'Accessible', 'Corporate'],
      featureColor: 'text-blue-500'
    },
    {
      id: 'vibrant-orange',
      name: 'Vibrant Orange',
      category: 'Consumer',
      badge: 'Trending',
      badgeColor: 'bg-orange-100 text-orange-700',
      uses: '1,234',
      colors: ['#F97316', '#7C3AED', '#10B981', '#F59E0B', '#DC2626'],
      colorClasses: ['bg-orange-500', 'bg-violet-600', 'bg-emerald-500', 'bg-amber-500', 'bg-red-600'],
      font: 'Montserrat',
      features: ['Energetic', 'Bold', 'Modern'],
      featureColor: 'text-orange-500'
    },
    {
      id: 'minimal-gray',
      name: 'Minimal Gray',
      category: 'Professional',
      badge: "Editor's Choice",
      badgeColor: 'bg-yellow-100 text-yellow-700',
      uses: '987',
      colors: ['#64748B', '#3B82F6', '#10B981', '#E2E8F0', '#EF4444'],
      colorClasses: ['bg-slate-500', 'bg-blue-500', 'bg-emerald-500', 'bg-slate-200', 'bg-red-500'],
      font: 'Playfair',
      features: ['Sophisticated', 'Timeless', 'Clean'],
      featureColor: 'text-slate-400'
    },
    {
      id: 'playful-purple',
      name: 'Playful Purple',
      category: 'Creative',
      badge: null,
      badgeColor: '',
      uses: '1,567',
      colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#F5F3FF'],
      colorClasses: ['bg-purple-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-50'],
      font: 'Poppins',
      features: ['Youthful', 'Creative', 'Friendly'],
      featureColor: 'text-purple-400'
    }
  ];

  const categories = ['All', 'SaaS', 'Consumer', 'Professional', 'Creative'];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = filterCategory === 'all' || template.category.toLowerCase() === filterCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContinue = () => {
    localStorage.setItem('selectedTemplate', selectedTemplate);
    navigate(createPageUrl('DesignTypography'));
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center overflow-hidden relative p-4">
      
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/80 to-transparent z-0 pointer-events-none"></div>

      {/* Main Modal */}
      <main className="relative z-10 w-full max-w-[1000px] h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex-none px-8 py-6 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate(createPageUrl('CreateDesignSystem'))}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-1 rounded">Step 2 of 6</span>
              <button 
                onClick={() => navigate(createPageUrl('DesignSystems'))}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title & Progress */}
          <div className="flex items-end justify-between gap-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Choose a Template</h1>
              <p className="text-slate-500 text-sm">Pick a starting point for your system. You can customize every token later.</p>
            </div>
            {/* Progress Bar */}
            <div className="w-48 pb-1.5">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-2">
                <span>Progress</span>
                <span>40%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[40%] bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="flex-none px-8 py-3 bg-white border-b border-slate-100 flex items-center justify-between gap-4 z-10 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category.toLowerCase())}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  filterCategory === category.toLowerCase()
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="relative w-64 shrink-0">
            <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Scrollable Template Grid */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
            
            {filteredTemplates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`relative bg-white rounded-xl border-2 p-5 cursor-pointer group transition-all hover:shadow-lg hover:-translate-y-0.5 text-left ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 ring-2 ring-blue-500/10'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Selected Check */}
                {selectedTemplate === template.id && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white z-20 animate-in zoom-in duration-200">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                {/* Visual Preview */}
                <div className="bg-slate-50 rounded-lg h-[240px] mb-5 border border-slate-100 overflow-hidden relative group-hover:border-slate-200 transition-colors">
                  {/* Mock UI based on template */}
                  {template.id === 'modern-blue' && (
                    <div className="absolute inset-4 bg-white rounded shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                      <div className="h-10 border-b border-slate-100 flex items-center px-4 gap-3 bg-white">
                        <div className="w-6 h-6 rounded bg-blue-600"></div>
                        <div className="w-16 h-2 bg-slate-200 rounded-full"></div>
                        <div className="ml-auto flex gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
                          <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                        </div>
                      </div>
                      <div className="p-6 flex-1 bg-white">
                        <div className="w-32 h-6 bg-slate-800 rounded mb-3"></div>
                        <div className="w-full h-2 bg-slate-100 rounded mb-2"></div>
                        <div className="w-2/3 h-2 bg-slate-100 rounded mb-6"></div>
                        <div className="flex gap-2">
                          <div className="px-4 py-1.5 bg-blue-600 rounded text-[10px] text-white font-medium">Get Started</div>
                          <div className="px-4 py-1.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-medium">Learn More</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {template.id === 'vibrant-orange' && (
                    <div className="absolute inset-4 bg-white rounded shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                      <div className="h-32 bg-gradient-to-br from-orange-500 to-purple-600 p-4 flex flex-col justify-end text-white">
                        <div className="text-xs font-medium opacity-80 mb-1">NEW FEATURE</div>
                        <div className="text-lg font-bold leading-tight">Analytics Dashboard</div>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex gap-2 mb-3">
                          <div className="h-2 w-full bg-slate-100 rounded"></div>
                          <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                        </div>
                        <div className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded shadow-sm inline-block">Explore Now</div>
                      </div>
                    </div>
                  )}

                  {template.id === 'minimal-gray' && (
                    <div className="absolute inset-4 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                      <div className="p-8 flex items-center justify-center flex-col text-center border-b border-slate-100">
                        <div className="text-2xl font-semibold text-slate-800 mb-2 italic">Elegant</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">Collection 2024</div>
                      </div>
                      <div className="flex-1 bg-slate-50 p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="w-8 h-8 rounded-full border border-slate-300 bg-white"></div>
                          <div className="w-24 h-2 bg-slate-200 rounded"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-12 bg-white border border-slate-200"></div>
                          <div className="h-12 bg-white border border-slate-200"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {template.id === 'playful-purple' && (
                    <div className="absolute inset-4 bg-violet-50 rounded shadow-sm border border-violet-100 flex flex-col overflow-hidden">
                      <div className="p-6">
                        <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center mb-3 shadow-md text-xs">✨</div>
                        <div className="text-lg font-bold text-slate-800 leading-tight mb-2">Hello there!</div>
                        <div className="text-xs text-slate-500 mb-4">Welcome to the fun side.</div>
                        <div className="flex gap-2">
                          <div className="h-8 px-4 bg-purple-500 rounded-full text-white text-xs font-semibold flex items-center">Join</div>
                          <div className="h-8 px-4 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold flex items-center">Log In</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-slate-900 border border-slate-200 shadow-xl px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 hover:scale-105 transition-all">
                      <Eye className="w-4 h-4" /> Preview Details
                    </button>
                  </div>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex gap-2">
                    {template.colorClasses.map((colorClass, idx) => (
                      <div 
                        key={idx}
                        className={`w-10 h-10 rounded-full ${colorClass} shadow-sm ring-1 ring-inset ring-black/5 ${
                          colorClass.includes('slate-200') ? 'border border-slate-300' : ''
                        } ${colorClass.includes('violet-50') ? 'border border-slate-200' : ''}`}
                        title={template.colors[idx]}
                      ></div>
                    ))}
                  </div>
                  <div className="h-8 w-px bg-slate-200 mx-1"></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xl font-bold text-slate-900 leading-none mb-1 tracking-tight">Aa</span>
                    <span className="text-[10px] text-slate-500 font-medium">{template.font}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{template.name}</h3>
                      {template.badge && (
                        <span className={`px-2 py-0.5 ${template.badgeColor} text-[10px] font-bold uppercase rounded-full tracking-wide`}>
                          {template.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{template.category} • Used by {template.uses} projects</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex gap-3 text-xs text-slate-600 font-medium">
                  {template.features.map((feature, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <Check className={`w-3 h-3 ${template.featureColor}`} /> {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}

          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500">No templates found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <footer className="flex-none bg-white border-t border-slate-200 p-6 z-20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {templates.find(t => t.id === selectedTemplate)?.name || 'No template'} 
                <span className="text-slate-400 font-normal"> selected</span>
              </div>
              <button 
                onClick={() => setSelectedTemplate('')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Change selection
              </button>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 text-xs text-slate-400 font-medium hidden md:block">
            You can mix and match elements later
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(createPageUrl('CreateDesignSystem'))}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={handleContinue}
              disabled={!selectedTemplate}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next: Typography <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
}