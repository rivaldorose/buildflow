import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Palette, Type, Ruler, Box, Code, Wand2, Upload, MoreHorizontal,
  Edit2, Smartphone, Monitor, Menu, Bell, AlertCircle, FileText,
  Image, Home, Search, Plus, MessageSquare, User, Signal, Wifi,
  Figma, Download, Save, Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import VersionControl from '../version/VersionControl';

export default function DesignSystemTab({ projectId }) {
  const [activeTab, setActiveTab] = useState('colors');
  const [currentBranch, setCurrentBranch] = useState('main');
  const queryClient = useQueryClient();

  const tabs = [
    { id: 'colors', icon: Palette, label: 'Colors' },
    { id: 'typography', icon: Type, label: 'Typography' },
    { id: 'spacing', icon: Ruler, label: 'Spacing' },
    { id: 'components', icon: Box, label: 'Components' },
    { id: 'export', icon: Code, label: 'Export' }
  ];

  const { data: designSystem, isLoading } = useQuery({
    queryKey: ['designSystem', projectId],
    queryFn: async () => {
      const systems = await base44.entities.DesignSystem.filter({ project: projectId });
      if (systems.length > 0) return systems[0];
      
      const newSystem = await base44.entities.DesignSystem.create({
        project: projectId,
        brand_colors: [
          { name: 'Primary', color: '#7c3aed', description: 'Brand Main' },
          { name: 'Secondary', color: '#3b82f6', description: 'Action items' },
          { name: 'Accent', color: '#10b981', description: 'Highlights' }
        ],
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
          heading_font: 'Inter',
          body_font: 'Inter'
        },
        spacing: {
          base_unit: 4,
          border_radius: '0.75rem'
        }
      });
      return newSystem;
    },
    enabled: !!projectId
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.DesignSystem.update(designSystem.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['designSystem', projectId]);
      toast.success('Design system updated');
    }
  });

  const updateBrandColor = (index, field, value) => {
    const updated = [...(designSystem?.brand_colors || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateMutation.mutate({ brand_colors: updated });
  };

  const addBrandColor = () => {
    const updated = [...(designSystem?.brand_colors || []), { name: 'New Color', color: '#000000', description: '' }];
    updateMutation.mutate({ brand_colors: updated });
  };

  const removeBrandColor = (index) => {
    const updated = designSystem?.brand_colors.filter((_, i) => i !== index);
    updateMutation.mutate({ brand_colors: updated });
  };

  const updateNeutralColor = (index, field, value) => {
    const updated = [...(designSystem?.neutral_colors || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateMutation.mutate({ neutral_colors: updated });
  };

  const updateSemanticColor = (index, field, value) => {
    const updated = [...(designSystem?.semantic_colors || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateMutation.mutate({ semantic_colors: updated });
  };

  const updateTypography = (field, value) => {
    updateMutation.mutate({ 
      typography: { ...designSystem?.typography, [field]: value }
    });
  };

  const updateSpacing = (field, value) => {
    updateMutation.mutate({ 
      spacing: { ...designSystem?.spacing, [field]: value }
    });
  };

  if (isLoading) return <div className="p-6">Loading design system...</div>;

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="px-6 border-b border-gray-100 bg-white flex items-center justify-between">
          <nav className="flex space-x-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
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
          <div className="py-2">
            <VersionControl 
              projectId={projectId}
              currentBranch={currentBranch}
              onBranchChange={setCurrentBranch}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f5f5f7]">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {activeTab === 'colors' && (
              <>
            
            {/* Auto Generate Section */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Magic Generation</h3>
                  <p className="text-sm text-gray-500 mt-1">Generate a compliant accessible palette from a single color or logo.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100">
                    <Wand2 className="w-3.5 h-3.5 mr-2" />
                    Generate
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
                <Button size="sm" variant="outline" onClick={addBrandColor}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add Color
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {designSystem?.brand_colors?.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm group hover:border-violet-200 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <Input
                        value={item.name}
                        onChange={(e) => updateBrandColor(index, 'name', e.target.value)}
                        className="text-xs font-semibold text-gray-700 uppercase tracking-wide border-none h-auto p-0 bg-transparent"
                      />
                      <button 
                        onClick={() => removeBrandColor(index)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg shadow-inner ring-1 ring-black/5 overflow-hidden">
                        <input 
                          type="color" 
                          value={item.color} 
                          onChange={(e) => updateBrandColor(index, 'color', e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-full h-full" style={{backgroundColor: item.color}}></div>
                      </div>
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={item.color}
                          onChange={(e) => updateBrandColor(index, 'color', e.target.value)}
                          className="w-full text-sm font-mono bg-gray-50 border-none rounded-md py-1.5 px-2 text-gray-600 uppercase h-auto"
                        />
                        <Input
                          value={item.description || ''}
                          onChange={(e) => updateBrandColor(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="text-[10px] text-gray-400 mt-1 border-none h-auto p-0 bg-transparent"
                        />
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
                  {designSystem?.neutral_colors?.map((item, index) => (
                    <div key={index} className="p-4 flex flex-col items-center gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="w-full aspect-video rounded-lg border border-gray-200 relative" style={{backgroundColor: item.color}}>
                        <input 
                          type="color" 
                          value={item.color}
                          onChange={(e) => updateNeutralColor(index, 'color', e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                      </div>
                      <div className="text-center w-full">
                        <Input
                          value={item.name}
                          onChange={(e) => updateNeutralColor(index, 'name', e.target.value)}
                          className="text-xs font-medium text-gray-900 block mb-1 border-none h-auto p-0 bg-transparent text-center"
                        />
                        <Input
                          type="text" 
                          value={item.color}
                          onChange={(e) => updateNeutralColor(index, 'color', e.target.value)}
                          className="w-full text-center text-[11px] font-mono text-gray-500 bg-transparent border-none p-0 h-auto"
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {designSystem?.semantic_colors?.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full ring-1 ring-inset ring-black/5 relative shrink-0" style={{backgroundColor: item.color}}>
                      <input 
                        type="color" 
                        value={item.color}
                        onChange={(e) => updateSemanticColor(index, 'color', e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Input
                        value={item.name}
                        onChange={(e) => updateSemanticColor(index, 'name', e.target.value)}
                        className="text-xs font-medium text-gray-900 border-none h-auto p-0 bg-transparent mb-0.5"
                      />
                      <Input
                        value={item.color}
                        onChange={(e) => updateSemanticColor(index, 'color', e.target.value)}
                        className="text-[10px] font-mono text-gray-500 truncate border-none h-auto p-0 bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

              </>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <>
                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-3 block">Heading Font Family</label>
                    <Input
                      value={designSystem?.typography?.heading_font || 'Inter'}
                      onChange={(e) => updateTypography('heading_font', e.target.value)}
                      placeholder="Inter, SF Pro, Helvetica"
                      className="mb-3"
                    />
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h1 style={{ fontFamily: designSystem?.typography?.heading_font }} className="text-4xl font-bold text-gray-900 mb-2">
                        The quick brown fox
                      </h1>
                      <h2 style={{ fontFamily: designSystem?.typography?.heading_font }} className="text-3xl font-semibold text-gray-900 mb-2">
                        jumps over the lazy dog
                      </h2>
                      <h3 style={{ fontFamily: designSystem?.typography?.heading_font }} className="text-2xl font-medium text-gray-900">
                        Typography Preview
                      </h3>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-3 block">Body Font Family</label>
                    <Input
                      value={designSystem?.typography?.body_font || 'Inter'}
                      onChange={(e) => updateTypography('body_font', e.target.value)}
                      placeholder="Inter, SF Pro, Helvetica"
                      className="mb-3"
                    />
                    <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                      <p style={{ fontFamily: designSystem?.typography?.body_font }} className="text-base text-gray-700">
                        The quick brown fox jumps over the lazy dog. This is a preview of your body text font in regular weight.
                      </p>
                      <p style={{ fontFamily: designSystem?.typography?.body_font }} className="text-sm text-gray-600">
                        Smaller body text for captions and secondary information. Perfect for subtle UI elements.
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Spacing Tab */}
            {activeTab === 'spacing' && (
              <>
                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-medium text-gray-900 mb-4">Base Unit</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Base spacing unit (px)</label>
                      <Input
                        type="number"
                        value={designSystem?.spacing?.base_unit || 4}
                        onChange={(e) => updateSpacing('base_unit', parseInt(e.target.value))}
                        className="w-32"
                      />
                      <p className="text-xs text-gray-500 mt-1">All spacing will be multiples of this value</p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Spacing Scale</div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 6, 8, 12, 16, 24].map(multiplier => {
                          const value = (designSystem?.spacing?.base_unit || 4) * multiplier;
                          return (
                            <div key={multiplier} className="flex items-center gap-4">
                              <span className="text-sm font-mono text-gray-600 w-16">{multiplier}x</span>
                              <div className="h-8 bg-violet-500 rounded" style={{ width: `${value}px` }}></div>
                              <span className="text-sm text-gray-500">{value}px</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-medium text-gray-900 mb-4">Border Radius</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Default border radius</label>
                      <Input
                        value={designSystem?.spacing?.border_radius || '0.75rem'}
                        onChange={(e) => updateSpacing('border_radius', e.target.value)}
                        placeholder="0.75rem, 12px, 1rem"
                        className="w-48"
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Preview</div>
                      <div className="grid grid-cols-3 gap-4">
                        <div 
                          className="h-24 bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-medium"
                          style={{ borderRadius: designSystem?.spacing?.border_radius }}
                        >
                          Button
                        </div>
                        <div 
                          className="h-24 border-2 border-gray-300 flex items-center justify-center text-gray-600"
                          style={{ borderRadius: designSystem?.spacing?.border_radius }}
                        >
                          Card
                        </div>
                        <div 
                          className="h-24 bg-gray-200 flex items-center justify-center text-gray-600"
                          style={{ borderRadius: designSystem?.spacing?.border_radius }}
                        >
                          Input
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Components Tab */}
            {activeTab === 'components' && (
              <>
                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-medium text-gray-900 mb-4">Button Styles</h2>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <button 
                        className="px-6 py-2.5 text-white font-medium shadow-lg"
                        style={{ 
                          backgroundColor: designSystem?.brand_colors?.[0]?.color,
                          borderRadius: designSystem?.spacing?.border_radius,
                          fontFamily: designSystem?.typography?.body_font
                        }}
                      >
                        Primary Button
                      </button>
                      <button 
                        className="px-6 py-2.5 bg-white border-2 font-medium"
                        style={{ 
                          borderColor: designSystem?.brand_colors?.[0]?.color,
                          color: designSystem?.brand_colors?.[0]?.color,
                          borderRadius: designSystem?.spacing?.border_radius,
                          fontFamily: designSystem?.typography?.body_font
                        }}
                      >
                        Secondary Button
                      </button>
                      <button 
                        className="px-6 py-2.5 font-medium"
                        style={{ 
                          backgroundColor: designSystem?.neutral_colors?.[0]?.color,
                          color: designSystem?.neutral_colors?.[3]?.color,
                          borderRadius: designSystem?.spacing?.border_radius,
                          fontFamily: designSystem?.typography?.body_font
                        }}
                      >
                        Tertiary Button
                      </button>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-medium text-gray-900 mb-4">Card Styles</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div 
                      className="p-6 bg-white border shadow-sm"
                      style={{ 
                        borderColor: designSystem?.neutral_colors?.[2]?.color,
                        borderRadius: designSystem?.spacing?.border_radius,
                        fontFamily: designSystem?.typography?.body_font
                      }}
                    >
                      <h3 
                        className="text-xl font-semibold mb-2"
                        style={{ 
                          color: designSystem?.neutral_colors?.[3]?.color,
                          fontFamily: designSystem?.typography?.heading_font
                        }}
                      >
                        Card Title
                      </h3>
                      <p style={{ color: designSystem?.neutral_colors?.[4]?.color }}>
                        This is a preview of how your cards will look with the current design system settings.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-medium text-gray-900 mb-4">Input Fields</h2>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <input
                      type="text"
                      placeholder="Enter your text..."
                      className="w-full px-4 py-2.5 border bg-white"
                      style={{ 
                        borderColor: designSystem?.neutral_colors?.[2]?.color,
                        borderRadius: designSystem?.spacing?.border_radius,
                        fontFamily: designSystem?.typography?.body_font
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Focused state"
                      className="w-full px-4 py-2.5 border-2 bg-white"
                      style={{ 
                        borderColor: designSystem?.brand_colors?.[0]?.color,
                        borderRadius: designSystem?.spacing?.border_radius,
                        fontFamily: designSystem?.typography?.body_font
                      }}
                    />
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-medium text-gray-900 mb-4">Alert Styles</h2>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                    {designSystem?.semantic_colors?.map((item, index) => (
                      <div 
                        key={index}
                        className="p-4 border-l-4 flex items-start gap-3"
                        style={{ 
                          backgroundColor: `${item.color}10`,
                          borderColor: item.color,
                          borderRadius: designSystem?.spacing?.border_radius
                        }}
                      >
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: item.color }} />
                        <div style={{ fontFamily: designSystem?.typography?.body_font }}>
                          <div className="font-semibold text-sm" style={{ color: item.color }}>
                            {item.name} Alert
                          </div>
                          <div className="text-sm mt-1" style={{ color: designSystem?.neutral_colors?.[4]?.color }}>
                            This is a {item.name.toLowerCase()} message with your design system colors.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && (
              <>
                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-medium text-gray-900 mb-4">Export Design Tokens</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Export your design system as code snippets for different platforms
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">CSS Variables</span>
                        <Button size="sm" variant="outline">
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Copy
                        </Button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`:root {
  /* Brand Colors */
${designSystem?.brand_colors?.map(c => `  --color-${c.name.toLowerCase()}: ${c.color};`).join('\n')}
  
  /* Typography */
  --font-heading: ${designSystem?.typography?.heading_font};
  --font-body: ${designSystem?.typography?.body_font};
  
  /* Spacing */
  --spacing-unit: ${designSystem?.spacing?.base_unit}px;
  --radius: ${designSystem?.spacing?.border_radius};
}`}
                      </pre>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Tailwind Config</span>
                        <Button size="sm" variant="outline">
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Copy
                        </Button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`module.exports = {
  theme: {
    extend: {
      colors: {
${designSystem?.brand_colors?.map(c => `        ${c.name.toLowerCase()}: '${c.color}',`).join('\n')}
      },
      fontFamily: {
        heading: ['${designSystem?.typography?.heading_font}'],
        body: ['${designSystem?.typography?.body_font}'],
      },
      borderRadius: {
        DEFAULT: '${designSystem?.spacing?.border_radius}',
      }
    }
  }
}`}
                      </pre>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Live Preview */}
      <aside className="w-96 bg-white border-l border-gray-100 flex flex-col shrink-0 hidden xl:flex">
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
          <div className="w-[280px] h-[520px] bg-white rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] ring-8 ring-gray-900 overflow-hidden relative flex flex-col">
            {/* Status Bar */}
            <div className="h-8 bg-white flex items-center justify-between px-5 pt-2 shrink-0">
              <span className="text-[9px] font-semibold text-gray-900">9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="w-2.5 h-2.5 text-gray-900" />
                <Wifi className="w-2.5 h-2.5 text-gray-900" />
                <div className="w-3.5 h-2.5 bg-gray-900 rounded-[2px] opacity-80"></div>
              </div>
            </div>

            {/* App Content */}
            <div className="flex-1 bg-[#f5f5f7] overflow-y-auto">
              {/* App Header */}
              <div className="bg-white p-4 pb-5 rounded-b-2xl shadow-sm border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                    <Menu className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-[#18181b] tracking-tight mb-1">Hello, Alex</h2>
                <p className="text-xs text-[#71717a]">Here is your daily overview</p>
                
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-[#7c3aed] text-white py-2 rounded-lg text-xs font-medium shadow-lg shadow-violet-200">
                    New Task
                  </button>
                  <button className="flex-1 bg-[#f5f5f7] text-[#18181b] py-2 rounded-lg text-xs font-medium border border-gray-200">
                    Analytics
                  </button>
                </div>
              </div>

              {/* App Widgets */}
              <div className="p-4 space-y-3">
                {/* Warning Card */}
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#18181b]">Subscription Expiring</h4>
                    <p className="text-[10px] text-[#71717a] mt-0.5 leading-relaxed">Your Pro plan ends in 2 days.</p>
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Storage</span>
                    <span className="text-[9px] font-medium text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded-full">Healthy</span>
                  </div>
                  <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 mb-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] h-1.5 rounded-full" style={{width: '66%'}}></div>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#18181b] font-medium">65% Used</span>
                    <span className="text-[#71717a]">120GB</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Nav */}
            <div className="h-12 bg-white border-t border-gray-100 flex items-center justify-around px-2 shrink-0">
              <button className="p-1.5 text-[#7c3aed]"><Home className="w-4 h-4" /></button>
              <button className="p-1.5 text-gray-300"><Search className="w-4 h-4" /></button>
              <button className="w-10 h-10 -mt-6 bg-[#18181b] rounded-full text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-1.5 text-gray-300"><MessageSquare className="w-4 h-4" /></button>
              <button className="p-1.5 text-gray-300"><User className="w-4 h-4" /></button>
            </div>
            
            {/* Home Indicator */}
            <div className="bg-white h-4 flex justify-center pb-1">
              <div className="w-24 h-1 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}