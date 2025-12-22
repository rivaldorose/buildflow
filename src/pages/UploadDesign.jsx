import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, X, UploadCloud, Crop, RotateCw, Scaling, Zap, 
  Undo2, Redo2, Monitor, Tablet, Smartphone, FileText, 
  ChevronDown, Link as LinkIcon, HardDrive, Box
} from 'lucide-react';

export default function UploadDesign() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('crop');
  const [aspectRatio, setAspectRatio] = useState('original');
  const [width, setWidth] = useState(1440);
  const [height, setHeight] = useState(900);
  const [designTool, setDesignTool] = useState('Figma');
  const [version, setVersion] = useState('v2.0');
  const [altText, setAltText] = useState('Voice practice screen with mic button and waveform');
  const [tags, setTags] = useState(['Mobile', 'Voice']);

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleNext = () => {
    localStorage.setItem('uploadedDesign', JSON.stringify({
      width, height, designTool, version, altText, tags
    }));
    navigate(createPageUrl('Pages'));
  };

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden relative">
      
      {/* Background Context */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="h-16 bg-white border-b border-slate-200 w-full flex items-center px-6 justify-between">
          <div className="flex items-center gap-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-slate-100 rounded"></div>
              <div className="h-4 w-24 bg-slate-100 rounded"></div>
            </div>
          </div>
        </div>
        <div className="p-8 opacity-30 blur-[4px]">
          <div className="flex justify-between mb-8">
            <div className="h-8 w-64 bg-slate-300 rounded"></div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
            <div className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
            <div className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
            <div className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] z-10"></div>
      </div>

      {/* Main Modal */}
      <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
        <main className="w-full max-w-[900px] bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200 flex flex-col overflow-hidden max-h-[92vh]">
          
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white border-b border-slate-100">
            <div className="w-full h-1 bg-slate-100">
              <div className="h-full bg-blue-600 w-[40%] rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>

            <div className="px-8 py-5 flex justify-between items-center">
              <button 
                onClick={() => navigate(createPageUrl('CreatePage'))}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
              </button>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 text-blue-600">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Upload Design</h1>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-1">Step 2 of 5 · Import your design mockup</p>
              </div>

              <button 
                onClick={() => navigate(createPageUrl('Pages'))}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 bg-slate-50/50">
            <div className="p-8 space-y-8">
              
              {/* File Preview & Editor */}
              <div className="bg-white rounded-xl border border-blue-200 shadow-sm ring-4 ring-blue-50 transition-all">
                
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                      <span className="text-xs font-bold uppercase">PNG</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">voice_practice_screen.png</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>1440 x 900 px</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>2.3 MB</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          Uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                    <RotateCw className="w-3.5 h-3.5" />
                    Replace Image
                  </button>
                </div>

                <div className="p-6 bg-slate-50/50">
                  {/* Tool Tabs */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <button 
                        onClick={() => setActiveTab('crop')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          activeTab === 'crop' 
                            ? 'bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-900/5' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Crop className="w-3.5 h-3.5" /> Crop
                      </button>
                      <button 
                        onClick={() => setActiveTab('rotate')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          activeTab === 'rotate' 
                            ? 'bg-slate-100 text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <RotateCw className="w-3.5 h-3.5" /> Rotate
                      </button>
                      <button 
                        onClick={() => setActiveTab('resize')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          activeTab === 'resize' 
                            ? 'bg-slate-100 text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Scaling className="w-3.5 h-3.5" /> Resize
                      </button>
                      <button 
                        onClick={() => setActiveTab('optimize')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          activeTab === 'optimize' 
                            ? 'bg-slate-100 text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" /> Optimize
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors" title="Undo">
                        <Undo2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors" title="Redo">
                        <Redo2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex gap-6">
                    {/* Preview Canvas */}
                    <div className="flex-1 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] rounded-lg border border-slate-200 overflow-hidden relative group h-[340px] flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop" 
                        alt="Voice practice screen design" 
                        className="max-w-full max-h-full object-contain shadow-lg rounded-sm"
                      />
                      
                      {/* Crop Overlay */}
                      <div className="absolute inset-0 m-8 border-2 border-white/50 shadow-[0_0_0_999px_rgba(0,0,0,0.5)] pointer-events-none">
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-slate-400"></div>
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-slate-400"></div>
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-slate-400"></div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-slate-400"></div>
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30"></div>
                        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30"></div>
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30"></div>
                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30"></div>
                      </div>
                      
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-mono px-2 py-1 rounded">
                        100%
                      </div>
                    </div>

                    {/* Side Controls */}
                    <div className="w-60 flex flex-col gap-5">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Aspect Ratio</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'original', label: 'Original', aspect: '6/4' },
                            { id: '16:9', label: '16:9', aspect: '6/3.5' },
                            { id: '4:3', label: '4:3', aspect: '5/4' },
                            { id: 'square', label: 'Square', aspect: '4/4' }
                          ].map((ratio) => (
                            <label key={ratio.id} className="cursor-pointer group">
                              <input 
                                type="radio" 
                                name="ratio" 
                                checked={aspectRatio === ratio.id}
                                onChange={() => setAspectRatio(ratio.id)}
                                className="peer hidden" 
                              />
                              <div className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                aspectRatio === ratio.id
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                              }`}>
                                <div className={`border-2 border-current rounded-sm mb-1 opacity-80`} style={{ width: ratio.aspect.split('/')[0] * 4 + 'px', height: ratio.aspect.split('/')[1] * 4 + 'px' }}></div>
                                <span className="text-[10px] font-semibold">{ratio.label}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-slate-200 w-full"></div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Dimensions</label>
                          <button 
                            onClick={() => { setWidth(1440); setHeight(900); }}
                            className="text-[10px] text-blue-600 font-medium hover:underline"
                          >
                            Reset
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input 
                              type="number" 
                              value={width}
                              onChange={(e) => setWidth(e.target.value)}
                              className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                            <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-medium">W</span>
                          </div>
                          <LinkIcon className="w-3 h-3 text-slate-400" />
                          <div className="relative flex-1">
                            <input 
                              type="number" 
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                            <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-medium">H</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-md">
                          Apply Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Preview & Metadata Grid */}
              <div className="grid grid-cols-12 gap-8">
                
                {/* Device Preview */}
                <div className="col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-slate-400" />
                      Device Preview
                    </h2>
                    <div className="bg-slate-100 p-0.5 rounded-lg flex">
                      <button className="px-2 py-1 bg-white shadow-sm rounded-md text-[10px] font-semibold text-slate-900">All Devices</button>
                      <button className="px-2 py-1 text-[10px] font-medium text-slate-500 hover:text-slate-900">Selected</button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors cursor-pointer">
                      <div className="aspect-[16/10] bg-slate-50 flex items-center justify-center relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" alt="Desktop preview" />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors"></div>
                      </div>
                      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Desktop</span>
                        <Monitor className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors cursor-pointer">
                      <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center relative overflow-hidden p-4">
                        <div className="w-full h-full bg-white shadow-md rounded overflow-hidden relative">
                          <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover" alt="Tablet preview" />
                        </div>
                      </div>
                      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Tablet</span>
                        <Tablet className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors cursor-pointer">
                      <div className="aspect-[9/16] bg-slate-50 flex items-center justify-center relative overflow-hidden p-6">
                        <div className="w-full h-full bg-white shadow-md rounded-[4px] overflow-hidden relative border-x-[1px] border-slate-200">
                          <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover" alt="Mobile preview" />
                        </div>
                      </div>
                      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Mobile</span>
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="col-span-4 space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Image Details
                  </h2>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Design Tool</label>
                      <div className="relative">
                        <select 
                          value={designTool}
                          onChange={(e) => setDesignTool(e.target.value)}
                          className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        >
                          <option>Figma</option>
                          <option>Sketch</option>
                          <option>Adobe XD</option>
                          <option>Photoshop</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Version</label>
                      <input 
                        type="text" 
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Alt Text</label>
                      <textarea 
                        rows={3}
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder-slate-400" 
                        placeholder="Describe image..."
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                          <span key={idx} className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${
                            idx === 0 ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {tag}
                            {idx === 0 && (
                              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-blue-900">
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                        <button className="inline-flex items-center px-2 py-1 rounded border border-dashed border-slate-300 text-slate-400 text-xs font-medium hover:border-blue-400 hover:text-blue-600 transition-colors">
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Import Sources */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-400 font-medium mb-3">Or import a different version from:</p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-colors group">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-[#F24E1E] transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"/></svg>
                    <span className="text-xs font-semibold text-slate-600">Figma</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-colors group">
                    <HardDrive className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs font-semibold text-slate-600">Drive</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-colors group">
                    <Box className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="text-xs font-semibold text-slate-600">Dropbox</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-100 p-6 flex items-center justify-between z-30">
            <button 
              onClick={() => navigate(createPageUrl('CreatePage'))}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              ← Previous: Method
            </button>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 font-medium">Auto-saved</span>
              <button 
                onClick={handleNext}
                className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all text-sm font-bold flex items-center gap-2 transform active:scale-95"
              >
                Next: Page Details →
              </button>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}