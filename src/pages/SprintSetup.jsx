import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft, X, Calendar, Users, Target, Check, ArrowRight,
  Save, Settings2, ChevronDown, Plus, GripVertical, UserPlus,
  CheckCircle, Clock
} from 'lucide-react';
import { format, addDays, addWeeks } from 'date-fns';

export default function SprintSetup() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();
  
  // Local state for project selection (can be changed in form)
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');

  // Form state
  const [step, setStep] = useState(1);
  const [sprintName, setSprintName] = useState('');
  const [duration, setDuration] = useState('2'); // weeks
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState('');
  const [goal, setGoal] = useState('');
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      title: 'Implement User Authentication Flow',
      description: 'Setup Firebase Auth, Create Login/Signup screens, Handle error states.',
      priority: 'High',
      importance: 'Must Have'
    }
  ]);
  const [enableTasks, setEnableTasks] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate end date based on duration
  useEffect(() => {
    if (startDate && duration && duration !== 'custom') {
      const start = new Date(startDate);
      const weeks = parseInt(duration);
      const end = addWeeks(start, weeks);
      // Subtract 1 day to get the last day of sprint
      const lastDay = addDays(end, -1);
      setEndDate(format(lastDay, 'yyyy-MM-dd'));
    }
  }, [startDate, duration]);

  // Get all projects for dropdown
  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
    enabled: true
  });

  // Sync selectedProjectId with URL projectId
  useEffect(() => {
    if (projectId && projectId !== selectedProjectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId]);

  // Get selected project data
  const effectiveProjectId = selectedProjectId || projectId;
  const { data: project } = useQuery({
    queryKey: ['project', effectiveProjectId],
    queryFn: () => base44.entities.Project.filter({ id: effectiveProjectId }).then(res => res[0]),
    enabled: !!effectiveProjectId
  });

  // Create sprint mutation
  const createSprintMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Creating sprint with data:', data);
      const result = await base44.entities.Sprint.create(data);
      return result;
    },
    onSuccess: (newSprint) => {
      const effectiveProjectId = selectedProjectId || projectId;
      queryClient.invalidateQueries(['sprints']);
      queryClient.invalidateQueries(['sprints', effectiveProjectId]);
      queryClient.invalidateQueries(['project', effectiveProjectId]);
      toast.success('Sprint created successfully');
      if (effectiveProjectId) {
        navigate(createPageUrl('SprintDetail') + `?id=${newSprint.id}`);
      } else {
        navigate(createPageUrl('Home'));
      }
    },
    onError: (error) => {
      console.error('Error creating sprint:', error);
      toast.error('Failed to create sprint: ' + (error.message || 'Unknown error'));
    }
  });

  // Mock team members (replace with actual API call)
  const teamMembers = [
    { id: '1', name: 'John Doe', role: 'Product Owner', initials: 'JD', color: 'bg-blue-500' },
    { id: '2', name: 'Alice Ivy', role: 'Lead Developer', initials: 'AI', color: 'bg-purple-500' },
    { id: '3', name: 'Sarah Kim', role: 'Designer', initials: 'SK', color: 'bg-teal-500' }
  ];

  const handleAddObjective = () => {
    setObjectives([...objectives, {
      id: objectives.length + 1,
      title: '',
      description: '',
      priority: 'Medium',
      importance: 'Should Have'
    }]);
  };

  const handleRemoveObjective = (id) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };

  const handleUpdateObjective = (id, field, value) => {
    setObjectives(objectives.map(obj =>
      obj.id === id ? { ...obj, [field]: value } : obj
    ));
  };

  const handleToggleTeamMember = (memberId) => {
    setSelectedTeamMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const calculateWorkingDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = 0;
    let current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        days++;
      }
      current = addDays(current, 1);
    }
    
    return days;
  };

  const handleCreateSprint = () => {
    if (!sprintName.trim()) {
      toast.error('Please enter a sprint name');
      return;
    }

    const effectiveProjectId = selectedProjectId || projectId;
    if (!effectiveProjectId) {
      toast.error('No project selected. Please select a project first.');
      return;
    }

    const sprintData = {
      project: effectiveProjectId, // This should match the database column name
      name: sprintName,
      duration_weeks: duration === 'custom' ? null : parseInt(duration),
      start_date: startDate || null,
      end_date: endDate || null,
      goal: goal || null,
      objectives: objectives.length > 0 ? objectives : null,
      team_members: selectedTeamMembers.length > 0 ? selectedTeamMembers : null,
      status: 'planning'
    };

    createSprintMutation.mutate(sprintData);
  };

  const formatDatePreview = (dateStr) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'MMM d');
  };

  const workingDays = calculateWorkingDays();
  const canCreate = sprintName.trim().length > 0 && sprintName.length <= 50 && (selectedProjectId || projectId);

  return (
    <div className="bg-[#FAF8F5] min-h-screen flex flex-col">
      {/* TOP NAVIGATION */}
      <nav className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 fixed top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-md hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-5 w-px bg-slate-300"></div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 font-medium">BuildFlow</span>
            {project && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500 font-medium">{project.name}</span>
              </>
            )}
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">New Sprint</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all"
          >
            Cancel
          </button>
            <button 
            onClick={handleCreateSprint}
            disabled={!canCreate || createSprintMutation.isPending}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#6B46C1] hover:bg-[#553C9A] shadow-sm rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {createSprintMutation.isPending ? 'Creating...' : 'Create Sprint'}
            </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto mt-16 pb-24">
        <div className="max-w-[840px] mx-auto px-6 py-10">
          
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create New Sprint</h1>
            <p className="text-slate-500 text-base">Plan your next development cycle to ship features faster.</p>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-6">
              <div className="h-1.5 w-12 rounded-full bg-[#6B46C1]"></div>
              <div className="h-1.5 w-12 rounded-full bg-slate-200"></div>
              <div className="h-1.5 w-12 rounded-full bg-slate-200"></div>
              <span className="ml-2 text-xs font-medium text-slate-500">Step 1 of 3</span>
            </div>
          </div>

          {/* SECTION 1: BASIC INFO */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Sprint Details</h2>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Required</span>
            </div>

            <div className="space-y-8">
              {/* Project Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Project <span className="text-[#6B46C1]">*</span>
                </label>
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => {
                    const newProjectId = e.target.value;
                    setSelectedProjectId(newProjectId);
                    // Update URL without navigation
                    if (newProjectId) {
                      setSearchParams({ projectId: newProjectId });
                    } else {
                      setSearchParams({});
                    }
                  }}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent block p-3 shadow-sm"
                  required
                >
                  <option value="">Select a project...</option>
                  {allProjects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">Select the project this sprint belongs to.</p>
              </div>

              {/* Sprint Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Sprint Name <span className="text-[#6B46C1]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    placeholder="e.g., Sprint 1: User Authentication"
                    maxLength={50}
                    className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent block p-3 pr-16 shadow-sm placeholder:text-slate-400 transition-shadow"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-medium">
                    {sprintName.length}/50
                  </span>
                </div>
                <p className="text-xs text-slate-500">Give your sprint a clear, descriptive name to align the team.</p>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Sprint Duration <span className="text-[#6B46C1]">*</span>
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { value: '1', label: '1 Week' },
                    { value: '2', label: '2 Weeks' },
                    { value: '3', label: '3 Weeks' },
                    { value: '4', label: '4 Weeks' },
                    { value: 'custom', label: 'Custom' }
                  ].map((option) => {
                    const isSelected = duration === option.value;
                return (
                      <label key={option.value} className="cursor-pointer relative">
                    <input 
                      type="radio" 
                          name="duration"
                          value={option.value}
                          checked={isSelected}
                          onChange={(e) => setDuration(e.target.value)}
                      className="sr-only"
                        />
                        <div className={`border rounded-lg p-3 text-center hover:bg-slate-50 transition-all ${
                          isSelected
                            ? 'border-[#6B46C1]/30 bg-purple-50 text-[#6B46C1]'
                            : 'border-slate-200'
                        }`}>
                          <div className={`w-4 h-4 mx-auto mb-2 rounded-full border ${
                            isSelected
                              ? 'border-[#6B46C1] bg-[#6B46C1]'
                              : 'border-slate-300 bg-white'
                          }`}></div>
                          <span className={`text-xs ${isSelected ? 'font-bold' : 'font-medium'} block`}>
                            {option.label}
                          </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Start Date <span className="text-[#6B46C1]">*</span>
            </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-slate-400" />
                    </div>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent block p-2.5 shadow-sm font-medium"
                    />
                  </div>
                  {startDate === format(new Date(), 'yyyy-MM-dd') && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Today</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Timeline Preview</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-center h-[46px]">
                    {startDate && endDate ? (
                      <>
                        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mb-1.5">
                          <span>{formatDatePreview(startDate)}</span>
                          <span>{formatDatePreview(endDate)}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#6B46C1] h-1.5 rounded-full w-full opacity-60"></div>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Select dates to preview</span>
                    )}
                  </div>
                  {workingDays > 0 && (
                    <div className="flex justify-end">
                      <span className="text-[10px] font-medium text-slate-500">{workingDays} working days</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Sprint Goal <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    rows="3"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="What is the main outcome you want to achieve?"
                    maxLength={200}
                    className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent block p-3 shadow-sm resize-none placeholder:text-slate-400"
                  ></textarea>
                  <span className="absolute right-3 bottom-3 text-xs text-slate-400 font-medium">
                    {goal.length}/200
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: OBJECTIVES */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-8 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900">Sprint Objectives</h2>
              <button
                onClick={handleAddObjective}
                className="text-sm font-medium text-[#6B46C1] hover:text-[#553C9A] flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Objective
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-6">Break down what you'll build this sprint into tangible deliverables.</p>

            {/* Objective Cards */}
            <div className="space-y-4 mb-6">
              {objectives.map((objective, index) => (
                <div
                  key={objective.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 relative group hover:border-[#6B46C1]/30 transition-colors shadow-sm"
                >
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemoveObjective(objective.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-2.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-20">
                          Objective {index + 1}
                        </span>
                        <input
                          type="text"
                          value={objective.title}
                          onChange={(e) => handleUpdateObjective(objective.id, 'title', e.target.value)}
                          className="flex-1 text-sm font-semibold text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-400"
                          placeholder="Objective Title"
                        />
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-medium text-slate-400 w-20 pt-2">Description</span>
                        <textarea
                          rows="1"
                          value={objective.description}
                          onChange={(e) => handleUpdateObjective(objective.id, 'description', e.target.value)}
                          className="flex-1 text-sm text-slate-600 border-none p-0 focus:ring-0 resize-none placeholder:text-slate-300 bg-transparent"
                          placeholder="Add details..."
                        ></textarea>
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-100 mt-2">
                        <span className="text-xs font-medium text-slate-400 w-20">Settings</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={objective.priority}
                            onChange={(e) => handleUpdateObjective(objective.id, 'priority', e.target.value)}
                            className={`text-xs border rounded px-2 py-1 font-medium focus:ring-2 cursor-pointer ${
                              objective.priority === 'High'
                                ? 'bg-red-50 text-red-700 border-red-100'
                                : objective.priority === 'Medium'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                : 'bg-green-50 text-green-700 border-green-100'
                            }`}
                          >
                            <option>High Priority</option>
                            <option>Medium Priority</option>
                            <option>Low Priority</option>
                          </select>
                          <select
                            value={objective.importance}
                            onChange={(e) => handleUpdateObjective(objective.id, 'importance', e.target.value)}
                            className="text-xs bg-purple-50 text-[#6B46C1] border-purple-100 border rounded px-2 py-1 font-medium focus:ring-[#6B46C1] cursor-pointer"
                          >
                            <option>Must Have</option>
                            <option>Should Have</option>
                            <option>Nice to Have</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Templates */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-slate-500">Quick Templates:</span>
              <button className="text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-200 transition-colors">
                🔐 Auth Sprint
              </button>
              <button className="text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-200 transition-colors">
                🎨 UI Polish
              </button>
              <button className="text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-200 transition-colors">
                🚀 Launch Prep
              </button>
            </div>
          </div>

          {/* SECTION 3: TASKS (Optional) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Sprint Tasks</h2>
                <p className="text-slate-500 text-sm mt-1">Add specific tasks now or later on the board.</p>
              </div>
              
              {/* Toggle Switch */}
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTasks}
                  onChange={(e) => setEnableTasks(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B46C1] relative"></div>
            </label>
            </div>
          </div>

          {/* SECTION 4: TEAM */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Sprint Team</h2>
              <button className="text-xs font-semibold text-[#6B46C1] hover:underline">Manage Project Team</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {teamMembers.map((member) => {
                const isSelected = selectedTeamMembers.includes(member.id);
                return (
                  <label 
                    key={member.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-[#6B46C1]/40 bg-purple-50/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleTeamMember(member.id)}
                      className="w-4 h-4 text-[#6B46C1] border-slate-300 rounded focus:ring-[#6B46C1]"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${member.color} text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm`}>
                        {member.initials}
                      </div>
                      <div className={!isSelected ? 'opacity-60' : ''}>
                        <div className="text-sm font-semibold text-slate-900">{member.name}</div>
                        <div className="text-[10px] font-medium text-slate-500">{member.role}</div>
                      </div>
                    </div>
                  </label>
                );
              })}

              {/* Invite */}
              <button className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-300 hover:border-[#6B46C1] hover:bg-purple-50 text-slate-500 hover:text-[#6B46C1] rounded-lg transition-all group">
                <UserPlus className="w-4 h-4" />
                <span className="text-sm font-medium">Invite Member</span>
              </button>
            </div>
          </div>

          {/* SECTION 5: ADVANCED */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Advanced Settings</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
            {showAdvanced && (
              <div className="px-6 pb-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mt-4">Advanced settings coming soon...</p>
            </div>
            )}
          </div>

        </div>
      </main>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-[840px] mx-auto flex items-center justify-between">
              <button 
            onClick={() => {
              // Save as draft functionality
              toast.info('Sprint saved as draft');
            }}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save as Draft
              </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center text-xs text-slate-400 mr-4">
              <CheckCircle className="w-3 h-3 mr-1.5 text-green-500" />
              Auto-saved 2m ago
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateSprint}
              disabled={!canCreate || createSprintMutation.isPending}
              className="px-8 py-2.5 text-sm font-bold text-white bg-[#6B46C1] hover:bg-[#553C9A] shadow-md shadow-purple-200 rounded-lg transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createSprintMutation.isPending ? 'Creating...' : 'Create Sprint'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
