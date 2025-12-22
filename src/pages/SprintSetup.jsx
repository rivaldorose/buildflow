import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, X, Calendar, Users, Target, Check, ArrowRight } from 'lucide-react';

export default function SprintSetup() {
  const navigate = useNavigate();
  const [sprintLength, setSprintLength] = useState('2');
  const [startDate, setStartDate] = useState('');
  const [teamSize, setTeamSize] = useState('solo');

  const handleNext = () => {
    const existingData = JSON.parse(localStorage.getItem('projectSetup') || '{}');
    localStorage.setItem('projectSetup', JSON.stringify({
      ...existingData,
      sprint: { length: sprintLength, startDate, teamSize }
    }));
    navigate(createPageUrl('ProjectReady'));
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 flex flex-col max-h-[90vh] relative">
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100 absolute top-0 left-0 z-20">
          <div className="h-full bg-blue-500 w-[83%] rounded-r-full transition-all"></div>
        </div>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
          <button 
            onClick={() => navigate(createPageUrl('DesignSystemSetup'))}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -ml-1 rounded-md hover:bg-slate-50"
          >
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              Back
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Step 5 of 6</span>
            <button 
              onClick={() => navigate(createPageUrl('Home'))}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-10 pb-32 overflow-y-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Sprint Planning</h1>
            <p className="text-slate-500 text-[15px]">Set up your first sprint to start building.</p>
          </div>

          {/* Sprint Length */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-slate-700 block mb-4">
              Sprint Length <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '1', label: '1 Week', desc: 'Fast iterations' },
                { value: '2', label: '2 Weeks', desc: 'Recommended' },
                { value: '4', label: '4 Weeks', desc: 'More flexibility' }
              ].map(option => {
                const isSelected = sprintLength === option.value;
                return (
                  <label 
                    key={option.value}
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="sprint_length" 
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setSprintLength(option.value)}
                    />
                    
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      {isSelected && <Check className="w-5 h-5 text-blue-500" />}
                    </div>
                    
                    <div className="font-bold text-slate-900 text-sm mb-1">{option.label}</div>
                    <div className="text-xs text-slate-500">{option.desc}</div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Start Date */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-slate-700 block mb-3">
              Sprint Start Date
            </label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-[15px] shadow-sm"
            />
          </div>

          {/* Team Size */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-slate-700 block mb-4">
              Team Size
            </label>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'solo', label: 'Solo', desc: 'Just me', icon: '👤' },
                { value: 'small', label: 'Small Team', desc: '2-5 people', icon: '👥' },
                { value: 'large', label: 'Large Team', desc: '6+ people', icon: '👨‍👩‍👧‍👦' }
              ].map(option => {
                const isSelected = teamSize === option.value;
                return (
                  <label 
                    key={option.value}
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="team_size" 
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setTeamSize(option.value)}
                    />
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{option.icon}</span>
                      {isSelected && <Check className="w-5 h-5 text-blue-500" />}
                    </div>
                    
                    <div className="font-bold text-slate-900 text-sm mb-1">{option.label}</div>
                    <div className="text-xs text-slate-500">{option.desc}</div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sprint Goals */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-2">Sprint Goals</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    Complete design system setup
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    Build 2-3 core pages
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    Integrate authentication
                  </li>
                </ul>
              </div>
            </div>
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
                onClick={() => navigate(createPageUrl('DesignSystemSetup'))}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                Previous
              </button>
            </div>

            <button 
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group active:scale-[0.98]"
            >
              Finish Setup
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}