import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ChevronRight, Mic, Image as ImageIcon, Code2, Minus, Plus, Maximize,
  Calendar, Pencil, Trash2, CheckCircle2, AlertCircle, FileImage, FileCode, Link as LinkIcon,
  ChevronDown, Check, Square, CheckSquare, Sparkles, Copy, PencilLine,
  Activity, StickyNote, Settings as SettingsIcon, Smartphone, Tablet, Monitor,
  Filter, ArrowUpDown, Download, Clock, Palette, Database, Layout, FileCode as FileCodeIcon,
  Beaker, X, FileText
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function PageDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const pageId = urlParams.get('id');
  
  const [activeTab, setActiveTab] = useState('preview');
  const [promptTab, setPromptTab] = useState('design');
  const [previewMode, setPreviewMode] = useState('image');
  const [deviceView, setDeviceView] = useState('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [htmlCode, setHtmlCode] = useState('');
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    complexity: 'Medium',
    status: 'Todo'
  });
  const [addingTodoToFeature, setAddingTodoToFeature] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');
  const [assigningTodoToFeature, setAssigningTodoToFeature] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [editFeatureForm, setEditFeatureForm] = useState({});
  const [generatingFeatures, setGeneratingFeatures] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [generatingCodePrompts, setGeneratingCodePrompts] = useState({});
  const [generatedCodePrompts, setGeneratedCodePrompts] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState({});
  const [showTestingModule, setShowTestingModule] = useState({});
  const [addingTestCase, setAddingTestCase] = useState(null);
  const [newTestCase, setNewTestCase] = useState({
    title: '',
    description: '',
    steps: [''],
    expected_result: '',
    priority: 'Medium'
  });
  const [generatingTestCases, setGeneratingTestCases] = useState(null);
  const [aiGeneratedTestCases, setAiGeneratedTestCases] = useState([]);
  const [reviewingAiTests, setReviewingAiTests] = useState(null);
  const [addingNote, setAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 'blue' });
  const [editingPageInfo, setEditingPageInfo] = useState(false);
  const [pageInfoForm, setPageInfoForm] = useState({});
  const [form, setForm] = useState({
    prompt: '',
    features: '',
    frontend_code: ''
  });

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ['page', pageId],
    queryFn: () => base44.entities.Page.list().then(pages => 
      pages.find(p => p.id === pageId)
    ),
    enabled: !!pageId
  });

  const { data: project } = useQuery({
    queryKey: ['project', page?.project],
    queryFn: () => base44.entities.Project.list().then(projects => 
      projects.find(p => p.id === page.project)
    ),
    enabled: !!page?.project
  });

  const { data: todos = [] } = useQuery({
    queryKey: ['todos', pageId],
    queryFn: () => base44.entities.Todo.filter({ page: pageId }),
    enabled: !!pageId
  });

  const { data: features = [] } = useQuery({
    queryKey: ['features'],
    queryFn: () => base44.entities.Feature.list()
  });

  const { data: testCases = [] } = useQuery({
    queryKey: ['testCases', pageId],
    queryFn: () => base44.entities.TestCase.filter({ page: pageId }),
    enabled: !!pageId
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['notes', pageId],
    queryFn: () => base44.entities.Note.filter({ page: pageId }),
    enabled: !!pageId
  });

  const { data: subpages = [] } = useQuery({
    queryKey: ['subpages', pageId],
    queryFn: () => base44.entities.Page.list().then(pages => 
      pages.filter(p => p.parent_page === pageId)
    ),
    enabled: !!pageId
  });

  const [showAddSubpage, setShowAddSubpage] = useState(false);
  const [newSubpage, setNewSubpage] = useState({ name: '', description: '', path: '' });

  const { data: allPages = [] } = useQuery({
    queryKey: ['allPages'],
    queryFn: () => base44.entities.Page.list()
  });

  useEffect(() => {
    if (page) {
      setForm({
        prompt: page.prompt || '',
        features: page.features || '',
        frontend_code: page.frontend_code || ''
      });
      setHtmlCode(page.frontend_code || '');
      setPageInfoForm({
        purpose: page.purpose || '',
        description: page.description || '',
        sub_pages: page.sub_pages || []
      });
    }
  }, [page]);

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, completed }) => base44.entities.Todo.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', pageId]);
    }
  });

  const saveHtmlMutation = useMutation({
    mutationFn: (html) => base44.entities.Page.update(pageId, { frontend_code: html }),
    onSuccess: () => {
      queryClient.invalidateQueries(['page', pageId]);
      toast.success('HTML saved successfully!');
      setPreviewMode('image');
    },
    onError: () => {
      toast.error('Failed to save HTML');
    }
  });

  const createFeatureMutation = useMutation({
    mutationFn: (data) => base44.entities.Feature.create(data),
    onSuccess: async (newFeature) => {
      // Update page to link the new feature
      const currentLinkedFeatures = page.linked_features || [];
      await base44.entities.Page.update(pageId, {
        linked_features: [...currentLinkedFeatures, newFeature.id]
      });
      
      queryClient.invalidateQueries(['features']);
      queryClient.invalidateQueries(['page', pageId]);
      toast.success('Feature added!');
      setShowAddFeature(false);
      setNewFeature({ name: '', description: '', complexity: 'Medium', status: 'Todo' });
    },
    onError: () => {
      toast.error('Failed to add feature');
    }
  });

  const updateFeatureMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Feature.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['features']);
      toast.success('Feature updated!');
      setEditingFeature(null);
    },
    onError: () => {
      toast.error('Failed to update feature');
    }
  });

  const createTodoMutation = useMutation({
    mutationFn: (data) => base44.entities.Todo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', pageId]);
      toast.success('Todo added!');
      setAddingTodoToFeature(null);
      setNewTodo('');
    },
    onError: () => {
      toast.error('Failed to add todo');
    }
  });

  const updateTodoTextMutation = useMutation({
    mutationFn: ({ id, task }) => base44.entities.Todo.update(id, { task }),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', pageId]);
      toast.success('Todo updated!');
      setEditingTodo(null);
      setEditTodoText('');
    },
    onError: () => {
      toast.error('Failed to update todo');
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id) => base44.entities.Todo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', pageId]);
      toast.success('Todo deleted!');
    },
    onError: () => {
      toast.error('Failed to delete todo');
    }
  });

  const createTestCaseMutation = useMutation({
    mutationFn: (data) => base44.entities.TestCase.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['testCases', pageId]);
      toast.success('Test case added!');
      setAddingTestCase(null);
      setNewTestCase({ title: '', description: '', steps: [''], expected_result: '', priority: 'Medium' });
    },
    onError: () => {
      toast.error('Failed to add test case');
    }
  });

  const updateTestCaseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TestCase.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['testCases', pageId]);
      toast.success('Test case updated!');
    },
    onError: () => {
      toast.error('Failed to update test case');
    }
  });

  const deleteTestCaseMutation = useMutation({
    mutationFn: (id) => base44.entities.TestCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['testCases', pageId]);
      toast.success('Test case deleted!');
    },
    onError: () => {
      toast.error('Failed to delete test case');
    }
  });

  const handleGenerateAiTestCases = async (feature) => {
    setGeneratingTestCases(feature.id);
    try {
      const featureTodos = todos.filter(t => t.task.startsWith(`[${feature.name}]`));
      
      const prompt = `Generate comprehensive test cases for the following feature:

Feature Name: ${feature.name}
Description: ${feature.description || 'No description provided'}
Complexity: ${feature.complexity}

Implementation TODOs:
${featureTodos.map(t => `- ${t.task.replace(/^\[.*?\]\s*/, '')}`).join('\n')}

Page Context:
- Page: ${page.name}
- Purpose: ${page.purpose || page.features || 'Not specified'}

Generate 3-5 detailed test cases that cover:
1. Happy path scenarios
2. Edge cases
3. Error handling
4. User input validation
5. Integration points

For each test case provide:
- title: Clear, descriptive test case title
- description: Brief description of what is being tested
- steps: Array of step-by-step instructions (3-6 steps)
- expected_result: Clear expected outcome
- priority: Low, Medium, High, or Critical based on importance

Return as JSON array of test cases.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            test_cases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  steps: { type: "array", items: { type: "string" } },
                  expected_result: { type: "string" },
                  priority: { type: "string", enum: ["Low", "Medium", "High", "Critical"] }
                }
              }
            }
          }
        }
      });

      if (result.test_cases && result.test_cases.length > 0) {
        setAiGeneratedTestCases(result.test_cases);
        setReviewingAiTests(feature.id);
        toast.success(`${result.test_cases.length} test cases generated!`);
      } else {
        toast.error('No test cases generated');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate test cases');
    } finally {
      setGeneratingTestCases(null);
    }
  };

  const handleSaveAiTestCases = async (featureId) => {
    try {
      for (const testCase of aiGeneratedTestCases) {
        await base44.entities.TestCase.create({
          feature: featureId,
          page: pageId,
          title: testCase.title,
          description: testCase.description,
          steps: testCase.steps,
          expected_result: testCase.expected_result,
          priority: testCase.priority,
          status: 'Not Run',
          order: testCases.length
        });
      }
      queryClient.invalidateQueries(['testCases', pageId]);
      toast.success(`${aiGeneratedTestCases.length} test cases saved!`);
      setReviewingAiTests(null);
      setAiGeneratedTestCases([]);
    } catch (error) {
      toast.error('Failed to save test cases');
    }
  };

  const deleteFeatureMutation = useMutation({
    mutationFn: async (featureId) => {
      // Remove feature from page's linked_features
      const currentLinkedFeatures = page.linked_features || [];
      await base44.entities.Page.update(pageId, {
        linked_features: currentLinkedFeatures.filter(id => id !== featureId)
      });
      // Delete the feature
      await base44.entities.Feature.delete(featureId);
      // Delete all todos linked to this feature
      const featureTodos = todos.filter(t => t.task.startsWith(`[${features.find(f => f.id === featureId)?.name}]`));
      for (const todo of featureTodos) {
        await base44.entities.Todo.delete(todo.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['features']);
      queryClient.invalidateQueries(['page', pageId]);
      queryClient.invalidateQueries(['todos', pageId]);
      toast.success('Feature deleted!');
    },
    onError: () => {
      toast.error('Failed to delete feature');
    }
  });

  const createNoteMutation = useMutation({
    mutationFn: (data) => base44.entities.Note.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes', pageId]);
      toast.success('Note added!');
      setAddingNote(false);
      setNewNote({ title: '', content: '', color: 'blue' });
    },
    onError: () => {
      toast.error('Failed to add note');
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Note.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes', pageId]);
      toast.success('Note updated!');
      setEditingNote(null);
    },
    onError: () => {
      toast.error('Failed to update note');
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id) => base44.entities.Note.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes', pageId]);
      toast.success('Note deleted!');
    },
    onError: () => {
      toast.error('Failed to delete note');
    }
  });

  const createSubpageMutation = useMutation({
    mutationFn: (data) => base44.entities.Page.create({
      ...data,
      parent_page: pageId,
      project: page?.project,
      status: 'Todo'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['subpages', pageId]);
      queryClient.invalidateQueries(['pages', page?.project]);
      toast.success('Subpagina aangemaakt!');
      setShowAddSubpage(false);
      setNewSubpage({ name: '', description: '', path: '' });
    },
    onError: () => {
      toast.error('Failed to create subpagina');
    }
  });

  const deleteSubpageMutation = useMutation({
    mutationFn: (id) => base44.entities.Page.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['subpages', pageId]);
      queryClient.invalidateQueries(['pages', page?.project]);
      toast.success('Subpagina verwijderd!');
    },
    onError: () => {
      toast.error('Failed to delete subpagina');
    }
  });

  const updatePageInfoMutation = useMutation({
    mutationFn: (data) => base44.entities.Page.update(pageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['page', pageId]);
      toast.success('Page info updated!');
      setEditingPageInfo(false);
    },
    onError: () => {
      toast.error('Failed to update page info');
    }
  });

  const handleGenerateFeatures = async () => {
    setGeneratingFeatures(true);
    try {
      const prompt = `Analyze this page and suggest 3-5 features to implement:

Page Name: ${page.name}
Purpose: ${page.purpose || page.features || 'Not specified'}
Frontend Code: ${page.frontend_code ? 'Available' : 'Not yet implemented'}

Based on the page information, suggest concrete features that should be built. For each feature, provide:
- name (short, clear feature name)
- description (brief description)
- complexity (Simple, Medium, or Hard)
- todos (array of 3-5 specific implementation tasks for this feature)

Return as JSON array.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            features: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  complexity: { type: "string", enum: ["Simple", "Medium", "Hard"] },
                  todos: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      const suggestedFeatures = result.features || [];
      
      if (suggestedFeatures.length === 0) {
        toast.error('No features generated');
        return;
      }

      // Create all features and link them to the page
      const currentLinkedFeatures = page.linked_features || [];
      let totalTodos = 0;
      
      for (const feature of suggestedFeatures) {
        const newFeature = await base44.entities.Feature.create({
          project: page.project,
          name: feature.name,
          description: feature.description,
          complexity: feature.complexity,
          status: 'Todo',
          order: features.length
        });
        currentLinkedFeatures.push(newFeature.id);

        // Create TODOs for this feature
        if (feature.todos && feature.todos.length > 0) {
          for (const todoText of feature.todos) {
            await base44.entities.Todo.create({
              page: pageId,
              task: `[${feature.name}] ${todoText}`,
              completed: false,
              order: todos.length + totalTodos
            });
            totalTodos++;
          }
        }
      }

      // Update page with all new features
      await base44.entities.Page.update(pageId, {
        linked_features: currentLinkedFeatures
      });

      queryClient.invalidateQueries(['features']);
      queryClient.invalidateQueries(['page', pageId]);
      queryClient.invalidateQueries(['todos', pageId]);
      toast.success(`${suggestedFeatures.length} features en ${totalTodos} todos gegenereerd!`);
    } catch (error) {
      toast.error('Failed to generate features');
      console.error(error);
    } finally {
      setGeneratingFeatures(false);
    }
  };

  const handleGenerateCodePrompt = async (feature) => {
    setGeneratingCodePrompts(prev => ({ ...prev, [feature.id]: true }));
    
    try {
      const platform = selectedPlatforms[feature.id] || 'Base44 (Flutter)';
      const featureTodos = todos.filter(t => t.task.startsWith(`[${feature.name}]`));
      
      const prompt = `Generate a complete implementation prompt for:

Feature: ${feature.name}
Description: ${feature.description || 'No description'}
Complexity: ${feature.complexity}
Platform: ${platform}

TODOs to implement:
${featureTodos.map(t => `- ${t.task.replace(/^\[.*?\]\s*/, '')}`).join('\n')}

Page context:
- Page Name: ${page.name}
- Purpose: ${page.purpose || page.features || 'Not specified'}

Generate a developer-ready implementation prompt that includes:
1. All required dependencies/packages
2. Required permissions (iOS/Android if mobile)
3. Complete code implementation
4. Error handling
5. Testing checklist based on the TODOs
6. Integration points with other features
7. Next steps

Format the response as structured markdown with code blocks.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            dependencies: { type: "string" },
            permissions: { type: "string" },
            implementation: { type: "string" },
            testing_checklist: { type: "array", items: { type: "string" } },
            next_steps: { type: "array", items: { type: "string" } },
            integration_points: { type: "array", items: { type: "string" } }
          }
        }
      });

      setGeneratedCodePrompts(prev => ({
        ...prev,
        [feature.id]: result
      }));
      
      toast.success('Implementation prompt generated!');
    } catch (error) {
      toast.error('Failed to generate prompt');
      console.error(error);
    } finally {
      setGeneratingCodePrompts(prev => ({ ...prev, [feature.id]: false }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Todo': 'bg-purple-50 border-purple-200 text-purple-600',
      'Doing': 'bg-orange-50 border-orange-200 text-orange-600',
      'Done': 'bg-green-50 border-green-200 text-green-600'
    };
    return colors[status] || 'bg-slate-100 border-slate-200 text-slate-600';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Todo': 'Design',
      'Doing': 'Testing',
      'Done': 'Complete'
    };
    return labels[status] || status;
  };

  const pageProgress = todos.length > 0 
    ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) 
    : 0;

  const pageFeatures = features.filter(f => page?.linked_features?.includes(f.id));
  const testedFeatures = pageFeatures.filter(f => f.status === 'Done').length;

  if (!pageId) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">No page selected</p>
      </div>
    );
  }

  if (pageLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Page not found</p>
      </div>
    );
  }

  const tabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'features', label: 'Features & TODOs' },
    { id: 'subpages', label: 'Subpagina\'s' },
    { id: 'prompts', label: 'AI Prompts' },
    { id: 'code', label: 'Code' },
    { id: 'notes', label: 'Notes' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header & Controls */}
      <div className="bg-white border-b border-slate-200 pb-0 pt-6 px-8 shadow-sm z-20">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-5 font-medium">
            <Link to={createPageUrl('Projects')} className="hover:text-slate-900 cursor-pointer">
              Projects
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link to={createPageUrl('ProjectDetail') + '?id=' + page.project} className="hover:text-slate-900 cursor-pointer">
              {project?.name || 'Project'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link to={createPageUrl('Pages')} className="hover:text-slate-900 cursor-pointer">
              Pages
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900">{page.name}</span>
          </div>

          {/* Page Title Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                <Mic className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">{page.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold uppercase tracking-wide ${getStatusColor(page.status)}`}>
                    {getStatusLabel(page.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="font-medium text-slate-700 flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all" style={{ width: `${pageProgress}%` }}></div>
                    </div>
                    {pageProgress}% complete
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{pageFeatures.length} features</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{testedFeatures}/{pageFeatures.length} tested</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5" /> Sprint 2
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                Duplicate
              </button>
              <button className="px-3 py-2 bg-blue-600 border border-blue-700 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5" />
                Edit Page
              </button>
              <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Page Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-[1600px] mx-auto w-full p-8">
          
          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 xl:col-span-9 flex flex-col gap-6">
                {/* Preview Canvas */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[720px]">
                  <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button 
                          onClick={() => setPreviewMode('image')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                            previewMode === 'image' 
                              ? 'bg-white shadow-sm text-slate-900' 
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> Image
                        </button>
                        <button 
                          onClick={() => setPreviewMode('html')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                            previewMode === 'html' 
                              ? 'bg-white shadow-sm text-slate-900' 
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" /> HTML
                        </button>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button 
                          onClick={() => setDeviceView('mobile')}
                          className={`p-1.5 rounded-md transition-all ${
                            deviceView === 'mobile' 
                              ? 'bg-white text-slate-900 shadow-sm' 
                              : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeviceView('tablet')}
                          className={`p-1.5 rounded-md transition-all ${
                            deviceView === 'tablet' 
                              ? 'bg-white text-slate-900 shadow-sm' 
                              : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                          }`}
                        >
                          <Tablet className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeviceView('desktop')}
                          className={`p-1.5 rounded-md transition-all ${
                            deviceView === 'desktop' 
                              ? 'bg-white text-slate-900 shadow-sm' 
                              : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="h-4 w-[1px] bg-slate-200"></div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setZoomLevel(prev => Math.max(25, prev - 25))}
                          disabled={zoomLevel <= 25}
                          className="p-1.5 hover:bg-slate-50 rounded text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-medium text-slate-600 w-10 text-center">{zoomLevel}%</span>
                        <button 
                          onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                          disabled={zoomLevel >= 200}
                          className="p-1.5 hover:bg-slate-50 rounded text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button 
                        onClick={() => setZoomLevel(100)}
                        className="p-1.5 hover:bg-slate-50 rounded text-slate-500 transition-colors"
                        title="Reset zoom"
                      >
                        <Maximize className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Viewport */}
                  <div className="flex-1 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 flex items-center justify-center p-8 overflow-auto">
                    {previewMode === 'image' ? (
                      <div 
                        className={`bg-white shadow-2xl overflow-hidden flex flex-col mx-auto transition-all duration-300 ${
                          deviceView === 'mobile' ? 'w-[375px] h-[667px] rounded-[40px] border-[12px] border-slate-800' :
                          deviceView === 'tablet' ? 'w-[768px] h-[1024px] rounded-[32px] border-[14px] border-slate-800' :
                          'w-full max-w-[1200px] h-[600px] rounded-xl border border-slate-300'
                        }`}
                        style={{ transform: `scale(${zoomLevel / 100})` }}
                      >
                        {deviceView !== 'desktop' && (
                          <div className="h-8 bg-slate-900 flex justify-between px-8 items-center shrink-0">
                            <span className="text-[11px] text-white/90 font-semibold">9:41</span>
                            <div className="w-20 h-5 bg-slate-900 rounded-full border-2 border-slate-800"></div>
                            <div className="flex gap-1 items-center">
                              <div className="flex gap-0.5">
                                <div className="w-0.5 h-2.5 bg-white/70 rounded-full"></div>
                                <div className="w-0.5 h-3 bg-white/70 rounded-full"></div>
                                <div className="w-0.5 h-3.5 bg-white/70 rounded-full"></div>
                                <div className="w-0.5 h-4 bg-white/90 rounded-full"></div>
                              </div>
                              <div className="ml-1 text-white/90 text-[10px] font-semibold">100%</div>
                            </div>
                          </div>
                        )}
                        <div className="flex-1 bg-white overflow-auto">
                          {page.frontend_code ? (
                            <div dangerouslySetInnerHTML={{ __html: page.frontend_code }} />
                          ) : (
                            <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
                              <div className="text-center space-y-6 max-w-md">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                                  <ImageIcon className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg mb-4">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    {page.name}
                                  </div>
                                  <h2 className="text-3xl font-bold text-slate-900 mb-3">No Preview Yet</h2>
                                  <p className="text-slate-500 text-sm leading-relaxed">Switch to HTML mode to add your code and see it come to life</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col gap-4">
                        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                              Paste HTML Code
                            </label>
                            <button
                              onClick={() => saveHtmlMutation.mutate(htmlCode)}
                              disabled={saveHtmlMutation.isPending || !htmlCode.trim()}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {saveHtmlMutation.isPending ? 'Saving...' : 'Save & Preview'}
                            </button>
                          </div>
                          <Textarea
                            value={htmlCode}
                            onChange={(e) => setHtmlCode(e.target.value)}
                            placeholder="<div>Your HTML here...</div>"
                            className="font-mono text-sm h-32 resize-none"
                          />
                        </div>
                        
                        <div 
                          className={`bg-white shadow-2xl overflow-hidden flex flex-col mx-auto transition-all duration-300 ${
                            deviceView === 'mobile' ? 'w-[375px] h-[667px] rounded-[40px] border-[12px] border-slate-800' :
                            deviceView === 'tablet' ? 'w-[768px] h-[1024px] rounded-[32px] border-[14px] border-slate-800' :
                            'w-full max-w-[1200px] h-[500px] rounded-xl border border-slate-300'
                          }`}
                          style={{ transform: `scale(${zoomLevel / 100})` }}
                        >
                          {deviceView !== 'desktop' && (
                            <div className="h-8 bg-slate-900 flex justify-between px-8 items-center shrink-0">
                              <span className="text-[11px] text-white/90 font-semibold">9:41</span>
                              <div className="w-20 h-5 bg-slate-900 rounded-full border-2 border-slate-800"></div>
                              <div className="flex gap-1 items-center">
                                <div className="flex gap-0.5">
                                  <div className="w-0.5 h-2.5 bg-white/70 rounded-full"></div>
                                  <div className="w-0.5 h-3 bg-white/70 rounded-full"></div>
                                  <div className="w-0.5 h-3.5 bg-white/70 rounded-full"></div>
                                  <div className="w-0.5 h-4 bg-white/90 rounded-full"></div>
                                </div>
                                <div className="ml-1 text-white/90 text-[10px] font-semibold">100%</div>
                              </div>
                            </div>
                          )}
                          <div className="flex-1 bg-white overflow-auto">
                            {htmlCode ? (
                              <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
                            ) : (
                              <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                                <div className="text-center space-y-4">
                                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Code2 className="w-8 h-8 text-white" />
                                  </div>
                                  <p className="text-slate-500 text-sm font-medium">Paste HTML code above to preview</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Design Info Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Design Source</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{page.name.toLowerCase().replace(/\s+/g, '_')}.png</p>
                        <p className="text-xs text-slate-500 mt-1">Updated recently</p>
                        <div className="flex gap-3 mt-2">
                          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Replace Image</button>
                          <button className="text-xs font-semibold text-slate-500 hover:text-slate-700">View History</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Design System Compliance</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Colors
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Typography
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Spacing
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Components
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Linked Assets</h3>
                    <div className="space-y-2">
                      <a href="#" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 group">
                        <FileImage className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" /> Design assets
                      </a>
                      <a href="#" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 group">
                        <FileCode className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" /> Source code
                      </a>
                      <a href="#" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 group">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" /> Documentation
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-12 xl:col-span-3 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Page Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Assignee</span>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {page.created_by?.split('@')[0]?.slice(0, 2).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-slate-900">You</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Updated</span>
                      <span className="font-medium text-slate-900">
                        {new Date(page.updated_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-slate-500">Progress</span>
                        <span className="text-xs font-bold text-blue-600">{pageProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pageProgress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Page Info</h3>
                    <button 
                      onClick={() => setEditingPageInfo(!editingPageInfo)}
                      className="text-slate-400 hover:text-blue-600"
                    >
                      <PencilLine className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {editingPageInfo ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose</label>
                        <input
                          type="text"
                          defaultValue={page.purpose || ''}
                          onBlur={(e) => {
                            if (e.target.value !== page.purpose) {
                              base44.entities.Page.update(pageId, { purpose: e.target.value });
                              queryClient.invalidateQueries(['page', pageId]);
                            }
                          }}
                          placeholder="Main purpose of this page..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                        <Textarea
                          defaultValue={page.description || ''}
                          onBlur={(e) => {
                            if (e.target.value !== page.description) {
                              base44.entities.Page.update(pageId, { description: e.target.value });
                              queryClient.invalidateQueries(['page', pageId]);
                            }
                          }}
                          placeholder="Detailed description..."
                          className="h-24 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-pages</label>
                        <div className="space-y-2 mb-2">
                          {page.sub_pages?.map((subPageId, idx) => {
                            const subPage = allPages.find(p => p.id === subPageId);
                            return (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                                <span className="flex-1 text-xs text-slate-700">{subPage?.name || 'Unknown page'}</span>
                                <button
                                  onClick={() => {
                                    const updated = page.sub_pages.filter((_, i) => i !== idx);
                                    base44.entities.Page.update(pageId, { sub_pages: updated });
                                    queryClient.invalidateQueries(['page', pageId]);
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <select
                          onChange={(e) => {
                            if (e.target.value && !(page.sub_pages || []).includes(e.target.value)) {
                              const updated = [...(page.sub_pages || []), e.target.value];
                              base44.entities.Page.update(pageId, { sub_pages: updated });
                              queryClient.invalidateQueries(['page', pageId]);
                            }
                            e.target.value = '';
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Add sub-page...</option>
                          {allPages
                            .filter(p => p.id !== pageId && p.project === page.project && !(page.sub_pages || []).includes(p.id))
                            .map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      <button
                        onClick={() => setEditingPageInfo(false)}
                        className="w-full px-3 py-2 bg-slate-700 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Done Editing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {page.purpose && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Purpose</div>
                          <p className="text-sm text-slate-700 leading-relaxed">{page.purpose}</p>
                        </div>
                      )}
                      {page.description && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Description</div>
                          <p className="text-sm text-slate-600 leading-relaxed">{page.description}</p>
                        </div>
                      )}
                      {page.sub_pages && page.sub_pages.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Sub-pages ({page.sub_pages.length})</div>
                          <div className="space-y-1">
                            {page.sub_pages.map((subPageId) => {
                              const subPage = allPages.find(p => p.id === subPageId);
                              return subPage ? (
                                <Link
                                  key={subPageId}
                                  to={createPageUrl('PageDetail') + '?id=' + subPageId}
                                  className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                  {subPage.name}
                                </Link>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      {!page.purpose && !page.description && !page.sub_pages?.length && (
                        <p className="text-sm text-slate-400 italic">No page info yet. Click edit to add.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Dependencies</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block mb-2">Designer</span>
                      <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-700">
                        {page.frontend_designer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-9 space-y-8">
                {/* Section Header */}
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Features & Implementation</h2>
                    <p className="text-slate-500 mt-2">Track development progress for this specific page.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedFeatures.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${selectedFeatures.length} selected feature(s)? All related todos will also be deleted.`)) {
                            selectedFeatures.forEach(featureId => {
                              deleteFeatureMutation.mutate(featureId);
                            });
                            setSelectedFeatures([]);
                          }
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedFeatures.length})
                      </button>
                    )}
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                      <span className="font-bold text-slate-700">{pageFeatures.length}</span> features • <span className="font-bold text-slate-700">{todos.length}</span> todos
                    </span>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                      <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                      <ArrowUpDown className="w-3.5 h-3.5" /> Sort
                    </button>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-6">
                  {pageFeatures.map((feature) => {
                    const featureTodos = todos.filter(t => t.task.startsWith(`[${feature.name}]`));
                    const completedCount = featureTodos.filter(t => t.completed).length;
                    const progress = featureTodos.length > 0 ? Math.round((completedCount / featureTodos.length) * 100) : 0;
                    const isExpanded = expandedFeatures[feature.id];
                    const borderColor = progress === 100 ? 'border-l-green-500' : progress > 0 ? 'border-l-orange-500' : 'border-l-slate-300';

                    return (
                      <div key={feature.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm border-l-[4px] ${borderColor} relative group transition-all hover:shadow-md`}>
                        <div className="p-6">
                          {editingFeature === feature.id ? (
                            <div className="space-y-4 pb-4 border-b border-slate-200">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Feature Name</label>
                                <input
                                  type="text"
                                  value={editFeatureForm.name || ''}
                                  onChange={(e) => setEditFeatureForm({ ...editFeatureForm, name: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <Textarea
                                  value={editFeatureForm.description || ''}
                                  onChange={(e) => setEditFeatureForm({ ...editFeatureForm, description: e.target.value })}
                                  className="h-20 resize-none"
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Complexity</label>
                                  <select
                                    value={editFeatureForm.complexity || 'Medium'}
                                    onChange={(e) => setEditFeatureForm({ ...editFeatureForm, complexity: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="Simple">Simple</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                  <select
                                    value={editFeatureForm.status || 'Todo'}
                                    onChange={(e) => setEditFeatureForm({ ...editFeatureForm, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="Todo">Todo</option>
                                    <option value="Doing">Doing</option>
                                    <option value="Review">Review</option>
                                    <option value="Done">Done</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Blocked</label>
                                  <label className="flex items-center gap-2 mt-3">
                                    <input
                                      type="checkbox"
                                      checked={editFeatureForm.blocked || false}
                                      onChange={(e) => setEditFeatureForm({ ...editFeatureForm, blocked: e.target.checked })}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700">Is blocked</span>
                                  </label>
                                </div>
                              </div>
                              {editFeatureForm.blocked && (
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Blocked by</label>
                                  <input
                                    type="text"
                                    value={editFeatureForm.blocked_by || ''}
                                    onChange={(e) => setEditFeatureForm({ ...editFeatureForm, blocked_by: e.target.value })}
                                    placeholder="e.g., Missing API access, Backend not ready..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              )}
                              <div className="flex gap-3 pt-2">
                                <button
                                  onClick={() => {
                                    updateFeatureMutation.mutate({ id: feature.id, data: editFeatureForm });
                                  }}
                                  disabled={updateFeatureMutation.isPending}
                                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {updateFeatureMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                  onClick={() => setEditingFeature(null)}
                                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-5 flex-1">
                                <div className="pt-1">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedFeatures.includes(feature.id)}
                                    onChange={() => {
                                      setSelectedFeatures(prev => 
                                        prev.includes(feature.id) 
                                          ? prev.filter(id => id !== feature.id)
                                          : [...prev, feature.id]
                                      );
                                    }}
                                    className="w-5 h-5 rounded border-2 bg-white border-slate-300 checked:bg-blue-500 checked:border-blue-500 cursor-pointer"
                                    style={{ 
                                      appearance: 'none',
                                      display: 'grid',
                                      placeContent: 'center'
                                    }}
                                  />
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-lg">
                                      <Activity className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">{feature.name}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                                      feature.complexity === 'Hard' ? 'bg-red-50 text-red-700 border border-red-100' :
                                      feature.complexity === 'Medium' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                      'bg-blue-50 text-blue-700 border border-blue-100'
                                    }`}>
                                      {feature.complexity}
                                    </span>
                                    {feature.blocked && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Blocked
                                      </span>
                                    )}
                                  </div>

                                  {feature.description && (
                                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{feature.description}</p>
                                  )}

                                  {feature.blocked && feature.blocked_by && (
                                    <div className="mt-2 flex items-start gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded border border-red-100">
                                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                      <span><span className="font-semibold">Blocked by:</span> {feature.blocked_by}</span>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
                                    <span className={`font-semibold ${progress === 100 ? 'text-green-600' : progress > 0 ? 'text-orange-600' : 'text-slate-400'}`}>
                                      {completedCount}/{featureTodos.length} todos complete ({progress}%)
                                    </span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>Added {new Date(feature.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>Sprint 2</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                                  feature.status === 'Done' ? 'bg-green-50 text-green-700 border border-green-100' :
                                  feature.status === 'Review' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                  feature.status === 'Doing' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                  'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}>
                                  {feature.status}
                                </span>
                                <button 
                                  onClick={() => setExpandedFeatures(prev => ({ ...prev, [feature.id]: !prev[feature.id] }))}
                                  className="text-slate-300 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                >
                                  <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Progress Bar */}
                          <div className="mt-5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-orange-500' : 'bg-slate-300'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>

                          {/* Todo List & Testing Module Toggle */}
                          {isExpanded && (
                            <div className="mt-6">
                              <div className="flex items-center gap-4 mb-4">
                                <button
                                  onClick={() => setShowTestingModule(prev => ({ ...prev, [feature.id]: false }))}
                                  className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                    !showTestingModule[feature.id] 
                                      ? 'text-blue-600 bg-blue-50' 
                                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                  }`}
                                >
                                  <CheckSquare className="w-4 h-4" /> Todos ({featureTodos.length})
                                </button>
                                <button
                                  onClick={() => setShowTestingModule(prev => ({ ...prev, [feature.id]: true }))}
                                  className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                    showTestingModule[feature.id] 
                                      ? 'text-purple-600 bg-purple-50' 
                                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                  }`}
                                >
                                  <Beaker className="w-4 h-4" /> Tests ({testCases.filter(tc => tc.feature === feature.id).length})
                                </button>
                              </div>

                              {!showTestingModule[feature.id] ? (
                                <div className="space-y-3 pl-1">
                                {featureTodos.map((todo) => (
                                  <div key={todo.id} className="flex items-start gap-3 group/todo p-2 -ml-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div className="pt-0.5">
                                      <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => updateTodoMutation.mutate({ id: todo.id, completed: !todo.completed })}
                                        className={`w-5 h-5 rounded border-2 cursor-pointer ${
                                          todo.completed ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'
                                        }`}
                                        style={{ 
                                          appearance: 'none',
                                          display: 'grid',
                                          placeContent: 'center'
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <span className={`text-[15px] ${
                                          todo.completed 
                                            ? 'text-slate-400 line-through decoration-slate-400' 
                                            : 'text-slate-900 font-medium'
                                        }`}>
                                          {todo.task.replace(/^\[.*?\]\s*/, '')}
                                        </span>
                                        {todo.completed && (
                                          <span className="text-[11px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                                            Completed
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 opacity-0 group-hover/todo:opacity-100 transition-opacity">
                                      <button className="hover:text-blue-600" title="Edit">
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button className="hover:text-red-600" title="Delete">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                {addingTodoToFeature === feature.id ? (
                                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                                    <input
                                      type="text"
                                      placeholder="Todo description..."
                                      value={newTodo}
                                      onChange={(e) => setNewTodo(e.target.value)}
                                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          if (!newTodo.trim()) {
                                            toast.error('Todo description is required');
                                            return;
                                          }
                                          createTodoMutation.mutate({
                                            page: pageId,
                                            task: `[${feature.name}] ${newTodo}`,
                                            completed: false,
                                            order: todos.length
                                          });
                                        }}
                                        disabled={createTodoMutation.isPending || !newTodo.trim()}
                                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {createTodoMutation.isPending ? 'Adding...' : 'Add Todo'}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setAddingTodoToFeature(null);
                                          setNewTodo('');
                                        }}
                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setAddingTodoToFeature(feature.id)}
                                    className="w-full mt-2 py-2 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add Todo
                                  </button>
                                )}
                              </div>
                              ) : (
                                <div className="space-y-3">
                                  {/* AI Review Panel */}
                                  {reviewingAiTests === feature.id && (
                                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-5 mb-4">
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-white" />
                                          </div>
                                          <div>
                                            <h4 className="text-base font-bold text-slate-900">AI Generated Test Cases</h4>
                                            <p className="text-xs text-slate-600">Review and edit before saving</p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => {
                                            setReviewingAiTests(null);
                                            setAiGeneratedTestCases([]);
                                          }}
                                          className="text-slate-400 hover:text-slate-600"
                                        >
                                          <X className="w-5 h-5" />
                                        </button>
                                      </div>

                                      <div className="space-y-3 mb-4">
                                        {aiGeneratedTestCases.map((testCase, idx) => (
                                          <div key={idx} className="bg-white rounded-lg border border-purple-200 p-4">
                                            <div className="space-y-3">
                                              <input
                                                type="text"
                                                value={testCase.title}
                                                onChange={(e) => {
                                                  const updated = [...aiGeneratedTestCases];
                                                  updated[idx].title = e.target.value;
                                                  setAiGeneratedTestCases(updated);
                                                }}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                                              />
                                              <Textarea
                                                value={testCase.description}
                                                onChange={(e) => {
                                                  const updated = [...aiGeneratedTestCases];
                                                  updated[idx].description = e.target.value;
                                                  setAiGeneratedTestCases(updated);
                                                }}
                                                className="h-20 resize-none text-xs"
                                              />
                                              <div>
                                                <label className="text-xs font-semibold text-slate-700 mb-1 block">Steps:</label>
                                                {testCase.steps.map((step, stepIdx) => (
                                                  <input
                                                    key={stepIdx}
                                                    type="text"
                                                    value={step}
                                                    onChange={(e) => {
                                                      const updated = [...aiGeneratedTestCases];
                                                      updated[idx].steps[stepIdx] = e.target.value;
                                                      setAiGeneratedTestCases(updated);
                                                    }}
                                                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                  />
                                                ))}
                                              </div>
                                              <input
                                                type="text"
                                                value={testCase.expected_result}
                                                onChange={(e) => {
                                                  const updated = [...aiGeneratedTestCases];
                                                  updated[idx].expected_result = e.target.value;
                                                  setAiGeneratedTestCases(updated);
                                                }}
                                                placeholder="Expected result..."
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                                              />
                                              <div className="flex items-center justify-between">
                                                <select
                                                  value={testCase.priority}
                                                  onChange={(e) => {
                                                    const updated = [...aiGeneratedTestCases];
                                                    updated[idx].priority = e.target.value;
                                                    setAiGeneratedTestCases(updated);
                                                  }}
                                                  className="px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                >
                                                  <option value="Low">Low</option>
                                                  <option value="Medium">Medium</option>
                                                  <option value="High">High</option>
                                                  <option value="Critical">Critical</option>
                                                </select>
                                                <button
                                                  onClick={() => {
                                                    const updated = aiGeneratedTestCases.filter((_, i) => i !== idx);
                                                    setAiGeneratedTestCases(updated);
                                                  }}
                                                  className="text-red-600 hover:text-red-700 text-xs font-semibold"
                                                >
                                                  Remove
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="flex gap-3">
                                        <button
                                          onClick={() => handleSaveAiTestCases(feature.id)}
                                          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                          <Check className="w-4 h-4" /> Save All Test Cases
                                        </button>
                                        <button
                                          onClick={() => {
                                            setReviewingAiTests(null);
                                            setAiGeneratedTestCases([]);
                                          }}
                                          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {testCases.filter(tc => tc.feature === feature.id).map((testCase) => {
                                    const statusColors = {
                                      'Not Run': 'bg-slate-100 text-slate-600 border-slate-200',
                                      'Passed': 'bg-green-100 text-green-700 border-green-200',
                                      'Failed': 'bg-red-100 text-red-700 border-red-200',
                                      'Blocked': 'bg-orange-100 text-orange-700 border-orange-200'
                                    };

                                    return (
                                      <div key={testCase.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-200 transition-colors group">
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Beaker className="w-4 h-4 text-purple-600" />
                                              <h4 className="text-sm font-semibold text-slate-900">{testCase.title}</h4>
                                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${statusColors[testCase.status]}`}>
                                                {testCase.status}
                                              </span>
                                              {testCase.priority === 'Critical' && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-200">
                                                  Critical
                                                </span>
                                              )}
                                            </div>
                                            {testCase.description && (
                                              <p className="text-xs text-slate-600 mb-2">{testCase.description}</p>
                                            )}
                                            {testCase.steps && testCase.steps.length > 0 && (
                                              <div className="mt-2 space-y-1">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Steps:</div>
                                                {testCase.steps.map((step, idx) => (
                                                  <div key={idx} className="text-xs text-slate-600 pl-3">
                                                    {idx + 1}. {step}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                            {testCase.expected_result && (
                                              <div className="mt-2">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Expected:</div>
                                                <div className="text-xs text-slate-600 pl-3">{testCase.expected_result}</div>
                                              </div>
                                            )}
                                          </div>
                                          <button
                                            onClick={() => {
                                              if (confirm('Delete this test case?')) {
                                                deleteTestCaseMutation.mutate(testCase.id);
                                              }
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-all"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                                          {['Not Run', 'Passed', 'Failed', 'Blocked'].map(status => (
                                            <button
                                              key={status}
                                              onClick={() => updateTestCaseMutation.mutate({ id: testCase.id, data: { status } })}
                                              className={`text-[10px] px-2 py-1 rounded font-semibold transition-all ${
                                                testCase.status === status
                                                  ? statusColors[status]
                                                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                              }`}
                                            >
                                              {status}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {addingTestCase === feature.id ? (
                                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
                                      <input
                                        type="text"
                                        placeholder="Test case title..."
                                        value={newTestCase.title}
                                        onChange={(e) => setNewTestCase({ ...newTestCase, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        autoFocus
                                      />
                                      <Textarea
                                        placeholder="Description (optional)..."
                                        value={newTestCase.description}
                                        onChange={(e) => setNewTestCase({ ...newTestCase, description: e.target.value })}
                                        className="h-16 resize-none"
                                      />
                                      <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Test Steps</label>
                                        {newTestCase.steps.map((step, idx) => (
                                          <div key={idx} className="flex gap-2 mb-2">
                                            <input
                                              type="text"
                                              placeholder={`Step ${idx + 1}...`}
                                              value={step}
                                              onChange={(e) => {
                                                const updatedSteps = [...newTestCase.steps];
                                                updatedSteps[idx] = e.target.value;
                                                setNewTestCase({ ...newTestCase, steps: updatedSteps });
                                              }}
                                              className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            {idx === newTestCase.steps.length - 1 && (
                                              <button
                                                onClick={() => setNewTestCase({ ...newTestCase, steps: [...newTestCase.steps, ''] })}
                                                className="px-2 text-purple-600 hover:text-purple-700"
                                              >
                                                <Plus className="w-4 h-4" />
                                              </button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Expected result..."
                                        value={newTestCase.expected_result}
                                        onChange={(e) => setNewTestCase({ ...newTestCase, expected_result: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      />
                                      <select
                                        value={newTestCase.priority}
                                        onChange={(e) => setNewTestCase({ ...newTestCase, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      >
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                        <option value="Critical">Critical Priority</option>
                                      </select>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            if (!newTestCase.title.trim()) {
                                              toast.error('Test case title is required');
                                              return;
                                            }
                                            createTestCaseMutation.mutate({
                                              feature: feature.id,
                                              page: pageId,
                                              title: newTestCase.title,
                                              description: newTestCase.description,
                                              steps: newTestCase.steps.filter(s => s.trim()),
                                              expected_result: newTestCase.expected_result,
                                              priority: newTestCase.priority,
                                              status: 'Not Run',
                                              order: testCases.length
                                            });
                                          }}
                                          disabled={createTestCaseMutation.isPending || !newTestCase.title.trim()}
                                          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {createTestCaseMutation.isPending ? 'Adding...' : 'Add Test Case'}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setAddingTestCase(null);
                                            setNewTestCase({ title: '', description: '', steps: [''], expected_result: '', priority: 'Medium' });
                                          }}
                                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleGenerateAiTestCases(feature)}
                                        disabled={generatingTestCases === feature.id}
                                        className="flex-1 mt-2 py-2 border border-dashed border-purple-400 rounded-lg text-xs font-semibold text-purple-600 hover:text-purple-700 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                      >
                                        <Sparkles className={`w-3.5 h-3.5 ${generatingTestCases === feature.id ? 'animate-spin' : ''}`} />
                                        {generatingTestCases === feature.id ? 'Generating...' : 'Generate with AI'}
                                      </button>
                                      <button 
                                        onClick={() => setAddingTestCase(feature.id)}
                                        className="flex-1 mt-2 py-2 border border-dashed border-purple-300 rounded-lg text-xs font-semibold text-purple-600 hover:text-purple-700 hover:border-purple-400 hover:bg-purple-50/50 transition-all flex items-center justify-center gap-2"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> Add Manually
                                      </button>
                                    </div>
                                  )}
                                  </div>
                                  )}
                                  </div>
                                  )}
                                  </div>

                        {/* Footer */}
                        <div className="bg-slate-50 rounded-b-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center text-[11px] font-medium text-slate-400">
                          <div className="flex gap-3">
                            <span>Last updated: {new Date(feature.updated_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                            {feature.blocked && feature.blocked_by && (
                              <>
                                <span>•</span>
                                <span className="text-red-600 font-semibold">Blocked by: {feature.blocked_by}</span>
                              </>
                            )}
                          </div>
                          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingFeature(feature.id);
                                setEditFeatureForm({
                                  name: feature.name,
                                  description: feature.description || '',
                                  complexity: feature.complexity,
                                  status: feature.status,
                                  blocked: feature.blocked || false,
                                  blocked_by: feature.blocked_by || ''
                                });
                              }}
                              className="hover:text-blue-600"
                            >
                              Edit Feature
                            </button>
                            <button className="hover:text-blue-600">Duplicate</button>
                            <button 
                              onClick={() => {
                                if (confirm(`Delete feature "${feature.name}"? All related todos will also be deleted.`)) {
                                  deleteFeatureMutation.mutate(feature.id);
                                }
                              }}
                              disabled={deleteFeatureMutation.isPending}
                              className="hover:text-red-600 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {showAddFeature ? (
                    <div className="bg-white rounded-xl border border-blue-200 shadow-md p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Feature</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Feature Name</label>
                          <input
                            type="text"
                            value={newFeature.name}
                            onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                            placeholder="e.g., User Authentication"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
                          <Textarea
                            value={newFeature.description}
                            onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                            placeholder="Brief description of the feature..."
                            className="h-20 resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Complexity</label>
                            <select
                              value={newFeature.complexity}
                              onChange={(e) => setNewFeature({ ...newFeature, complexity: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Simple">Simple</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                              value={newFeature.status}
                              onChange={(e) => setNewFeature({ ...newFeature, status: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Todo">Todo</option>
                              <option value="Doing">Doing</option>
                              <option value="Review">Review</option>
                              <option value="Done">Done</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => {
                              if (!newFeature.name.trim()) {
                                toast.error('Feature name is required');
                                return;
                              }
                              createFeatureMutation.mutate({
                                ...newFeature,
                                project: page.project,
                                linked_features: page.linked_features || []
                              });
                            }}
                            disabled={createFeatureMutation.isPending || !newFeature.name.trim()}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {createFeatureMutation.isPending ? 'Adding...' : 'Add Feature'}
                          </button>
                          <button
                            onClick={() => {
                              setShowAddFeature(false);
                              setNewFeature({ name: '', description: '', complexity: 'Medium', status: 'Todo' });
                            }}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAddFeature(true)}
                      className="w-full py-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/20 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-100 group-hover:border-blue-200 transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm">Add Another Feature</span>
                    </button>
                  )}

                  {/* Unassigned TODOs */}
                  {todos.filter(t => !t.task.match(/^\[.*?\]\s*/)).length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Unassigned TODOs</h3>
                      <div className="space-y-3">
                        {todos.filter(t => !t.task.match(/^\[.*?\]\s*/)).map((todo) => (
                          <div key={todo.id}>
                            {editingTodo === todo.id ? (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                                <input
                                  type="text"
                                  value={editTodoText}
                                  onChange={(e) => setEditTodoText(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      if (!editTodoText.trim()) {
                                        toast.error('Todo text is required');
                                        return;
                                      }
                                      updateTodoTextMutation.mutate({ id: todo.id, task: editTodoText });
                                    }}
                                    disabled={updateTodoTextMutation.isPending}
                                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingTodo(null);
                                      setEditTodoText('');
                                    }}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-3 group/todo p-2 -ml-2 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="pt-0.5">
                                  <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => updateTodoMutation.mutate({ id: todo.id, completed: !todo.completed })}
                                    className={`w-5 h-5 rounded border-2 cursor-pointer ${
                                      todo.completed ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'
                                    }`}
                                    style={{ 
                                      appearance: 'none',
                                      display: 'grid',
                                      placeContent: 'center'
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <span className={`text-[15px] ${
                                      todo.completed 
                                        ? 'text-slate-400 line-through decoration-slate-400' 
                                        : 'text-slate-900 font-medium'
                                    }`}>
                                      {todo.task}
                                    </span>
                                    {todo.completed && (
                                      <span className="text-[11px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                                        Completed
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 opacity-0 group-hover/todo:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => setAssigningTodoToFeature(todo.id)}
                                    className="hover:text-purple-600" 
                                    title="Assign to feature"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setEditingTodo(todo.id);
                                      setEditTodoText(todo.task);
                                    }}
                                    className="hover:text-blue-600" 
                                    title="Edit"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (confirm('Delete this todo?')) {
                                        deleteTodoMutation.mutate(todo.id);
                                      }
                                    }}
                                    className="hover:text-red-600" 
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {assigningTodoToFeature === todo.id && (
                              <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="text-xs font-semibold text-slate-700 mb-2">Assign to feature:</div>
                                <div className="space-y-2">
                                  {pageFeatures.map((feature) => (
                                    <button
                                      key={feature.id}
                                      onClick={() => {
                                        updateTodoTextMutation.mutate({ 
                                          id: todo.id, 
                                          task: `[${feature.name}] ${todo.task}` 
                                        });
                                        setAssigningTodoToFeature(null);
                                      }}
                                      className="w-full text-left px-3 py-2 bg-white hover:bg-purple-50 border border-slate-200 rounded-lg text-sm transition-colors"
                                    >
                                      {feature.name}
                                    </button>
                                  ))}
                                  <button
                                    onClick={() => setAssigningTodoToFeature(null)}
                                    className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <aside className="col-span-3 space-y-8">
                <div className="sticky top-32 space-y-8">
                  {/* Progress Overview */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Progress Overview</h3>

                    <div className="flex flex-col items-center justify-center mb-8 relative">
                      <div className="relative w-[140px] h-[140px]">
                        <svg className="w-full h-full" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="8"></circle>
                          <circle 
                            cx="60" cy="60" r="54" 
                            fill="none" 
                            stroke="#3B82F6" 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            strokeDasharray="339.292" 
                            strokeDashoffset={339.292 - (339.292 * pageProgress / 100)}
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-slate-900">{pageProgress}%</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Complete</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Total Features</span>
                        <span className="font-bold text-slate-900">{pageFeatures.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Total TODOs</span>
                        <span className="font-bold text-slate-900">{todos.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Remaining</span>
                        <span className="font-bold text-orange-500">{todos.filter(t => !t.completed).length}</span>
                      </div>

                      <div className="h-px bg-slate-100 my-4"></div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-2 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span> In Progress
                          </span>
                          <span className="font-mono font-medium text-slate-400">
                            {pageFeatures.filter(f => f.status === 'Doing').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-2 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span> Not Started
                          </span>
                          <span className="font-mono font-medium text-slate-400">
                            {pageFeatures.filter(f => f.status === 'Todo').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-2 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Done
                          </span>
                          <span className="font-mono font-medium text-slate-400">
                            {pageFeatures.filter(f => f.status === 'Done').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testing Summary */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Beaker className="w-4 h-4" /> Testing Status
                    </h3>

                    <div className="space-y-4 mb-5">
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-slate-500">Total Test Cases</span>
                        <span className="text-sm font-bold text-slate-900">{testCases.length}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-100">
                          <span className="text-green-700 font-medium">Passed</span>
                          <span className="font-bold text-green-900">{testCases.filter(tc => tc.status === 'Passed').length}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                          <span className="text-red-700 font-medium">Failed</span>
                          <span className="font-bold text-red-900">{testCases.filter(tc => tc.status === 'Failed').length}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-100">
                          <span className="text-orange-700 font-medium">Blocked</span>
                          <span className="font-bold text-orange-900">{testCases.filter(tc => tc.status === 'Blocked').length}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                          <span className="text-slate-700 font-medium">Not Run</span>
                          <span className="font-bold text-slate-900">{testCases.filter(tc => tc.status === 'Not Run').length}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500">Pass Rate</span>
                          <span className="text-xs font-bold text-slate-900">
                            {testCases.length > 0 ? Math.round((testCases.filter(tc => tc.status === 'Passed').length / testCases.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all" 
                            style={{ width: `${testCases.length > 0 ? (testCases.filter(tc => tc.status === 'Passed').length / testCases.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        const report = `# Testing Report - ${page.name}\nGenerated: ${new Date().toLocaleString()}\n\n## Summary\n- Total Tests: ${testCases.length}\n- Passed: ${testCases.filter(tc => tc.status === 'Passed').length}\n- Failed: ${testCases.filter(tc => tc.status === 'Failed').length}\n- Blocked: ${testCases.filter(tc => tc.status === 'Blocked').length}\n- Not Run: ${testCases.filter(tc => tc.status === 'Not Run').length}\n- Pass Rate: ${testCases.length > 0 ? Math.round((testCases.filter(tc => tc.status === 'Passed').length / testCases.length) * 100) : 0}%\n\n## Test Cases by Feature\n${pageFeatures.map(f => {
                          const featureTests = testCases.filter(tc => tc.feature === f.id);
                          return `\n### ${f.name}\n${featureTests.map(tc => `- [${tc.status}] ${tc.title}\n  ${tc.description ? `  Description: ${tc.description}\n` : ''}  Priority: ${tc.priority}`).join('\n')}`;
                        }).join('\n')}`;
                        navigator.clipboard.writeText(report);
                        toast.success('Testing report copied to clipboard!');
                      }}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> Generate Report
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={handleGenerateFeatures}
                        disabled={generatingFeatures}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                          <Sparkles className={`w-4 h-4 ${generatingFeatures ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-slate-900">
                            {generatingFeatures ? 'Generating...' : 'AI Suggestions'}
                          </span>
                          <span className="block text-[10px] text-slate-500">Generate based on design</span>
                        </div>
                      </button>

                      <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group text-left">
                        <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform">
                          <Download className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-slate-900">Export Checklist</span>
                          <span className="block text-[10px] text-slate-500">Download as Markdown</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* AI Prompts Tab */}
          {activeTab === 'prompts' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-white rounded-xl flex items-center justify-center shadow-sm border border-purple-200">
                      <Sparkles className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI-Powered Design Prompts</h2>
                      <p className="text-slate-600 mt-1.5 text-sm">Automatically generated prompts for {page.frontend_designer || 'design tools'} based on your page features.</p>

                      <div className="flex items-center gap-6 mt-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          <span>3 prompt types</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Last: {new Date(page.updated_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-purple-500/20">
                    <Activity className="w-4 h-4" />
                    Regenerate All
                  </button>
                </div>
              </div>

              {/* Prompt Type Tabs */}
              <div>
                <div className="flex items-center gap-2 border-b border-slate-200 pb-px mb-6">
                  <button 
                    onClick={() => setPromptTab('design')}
                    className={`px-5 py-2.5 rounded-t-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                      promptTab === 'design' 
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'bg-transparent hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Palette className="w-4 h-4" /> Design Prompts
                  </button>
                  <button 
                    onClick={() => setPromptTab('feature')}
                    className={`px-5 py-2.5 rounded-t-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                      promptTab === 'feature' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-transparent hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Activity className="w-4 h-4" /> Feature Prompts
                  </button>
                  <button 
                    onClick={() => setPromptTab('fullpage')}
                    className={`px-5 py-2.5 rounded-t-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                      promptTab === 'fullpage' 
                        ? 'bg-slate-600 text-white shadow-sm' 
                        : 'bg-transparent hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <FileCode className="w-4 h-4" /> Full Page
                  </button>
                </div>
                <div className="bg-purple-50/50 px-5 py-3 rounded-lg border border-purple-100 mb-8">
                  <p className="text-xs text-purple-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {promptTab === 'design' && `Prompts focused on visual design and UI layout for ${page.frontend_designer || 'design tools'}.`}
                    {promptTab === 'feature' && 'Implementation prompts for each feature - ready for Base44, Cursor, or manual coding.'}
                    {promptTab === 'fullpage' && 'Complete implementation combining all features into one comprehensive prompt.'}
                  </p>
                </div>
              </div>

              {/* Design Prompts Content */}
              {promptTab === 'design' && (
                <div className="grid grid-cols-12 gap-10">

                {/* Left Column */}
                <div className="col-span-7 space-y-8">

                  {/* AI Generator Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border-2 border-purple-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-purple-100 shadow-sm flex items-center justify-center text-purple-600">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">AI Prompt Generator</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ready</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Design Target</label>
                          <select className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                            <option>Full Page Design</option>
                            <option>Single Component</option>
                            <option>Mobile Version</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Style Variant</label>
                          <select className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                            <option>Light Mode</option>
                            <option>Dark Mode</option>
                            <option>High Contrast</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Target Tool</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tool" className="text-purple-600" defaultChecked />
                            <span className="text-sm text-slate-700 font-medium">Aura AI</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tool" className="text-purple-600" />
                            <span className="text-sm text-slate-600">v0.dev</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tool" className="text-purple-600" />
                            <span className="text-sm text-slate-600">Other</span>
                          </label>
                        </div>
                      </div>

                      <div className="bg-purple-100/50 rounded-lg p-3 border border-purple-100">
                        <p className="text-[11px] font-bold text-purple-700 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                          <Activity className="w-3 h-3" /> Including features
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pageFeatures.slice(0, 5).map(f => (
                            <span key={f.id} className="bg-white text-slate-600 border border-purple-100 text-[10px] font-semibold px-2 py-1 rounded-md">
                              {f.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" /> Generate Design Prompt
                      </button>
                    </div>
                  </div>

                  {/* Generated Result */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Palette className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-900">{page.frontend_designer} Design Prompt</h3>
                              <span className="bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Auto-Generated</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Generated {new Date(page.updated_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {form.prompt?.slice(0, 150) || `Create ${page.name} for your app. Modern, clean design focused on ${page.purpose || 'functionality'}...`}
                      </div>
                    </div>

                    <details open className="group/prompt">
                      <summary className="flex items-center justify-between px-6 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                          <ChevronDown className="w-4 h-4 transition-transform group-open/prompt:rotate-0 -rotate-90" />
                          Full Prompt Code
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              navigator.clipboard.writeText(form.prompt || '');
                              toast.success('Copied!');
                            }}
                            className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </summary>

                      <div className="bg-[#1E293B] p-6 overflow-x-auto max-h-[500px] overflow-y-auto">
                        <pre className="text-xs font-mono text-slate-300 leading-6 whitespace-pre-wrap">
                          {form.prompt || `Create ${page.name}\n\nDEVICE: Desktop/Mobile\n\nVISUAL STYLE:\n- Modern, clean design\n- Primary colors from design system\n- Typography: Inter\n\nLAYOUT STRUCTURE:\n${page.features || 'Page features and layout here...'}\n\nINTERACTIVE ELEMENTS:\n- User interactions\n- Animations\n- State changes`}
                        </pre>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-span-5 space-y-6">

                  {/* Context Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Database className="w-3.5 h-3.5" /> Prompt Context
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">Data injected into prompts for design consistency.</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                            <Layout className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900">Design System</div>
                            <div className="text-[10px] text-slate-500">{project?.name || 'Active'}</div>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900">Active Features</div>
                            <div className="text-[10px] text-slate-500">{pageFeatures.length} Features</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* History */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Generations</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3 relative pb-4 border-l border-slate-200 pl-4">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white"></div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{page.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{page.frontend_designer} • Recently</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-blue-900">Pro Tip</h4>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                          Select specific features to include in your design prompt for more focused results.
                        </p>
                      </div>
                    </div>
                    </div>

                    </div>
                    </div>
                    )}

                {/* Feature Prompts Content */}
                {promptTab === 'feature' && (
                <div className="space-y-6">
                 {pageFeatures.map((feature) => {
                   const featureTodos = todos.filter(t => t.task.startsWith(`[${feature.name}]`));
                   const isGenerating = generatingCodePrompts[feature.id];
                   const generatedPrompt = generatedCodePrompts[feature.id];
                   const selectedPlatform = selectedPlatforms[feature.id] || 'Base44 (Flutter)';

                   return (
                     <div key={feature.id} className="bg-white rounded-xl border border-slate-200 shadow-sm">
                       <div className="p-6 border-b border-slate-100">
                         <div className="flex items-start justify-between mb-4">
                           <div className="flex items-start gap-4">
                             <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                               <Activity className="w-6 h-6 text-blue-600" />
                             </div>
                             <div>
                               <h3 className="text-lg font-bold text-slate-900">{feature.name}</h3>
                               <p className="text-sm text-slate-600 mt-1">{feature.description || 'No description'}</p>
                             </div>
                           </div>
                         </div>

                         <div className="space-y-4">
                           <div>
                             <label className="block text-xs font-semibold text-slate-700 mb-2">Implementation Target</label>
                             <div className="flex gap-3">
                               {['Base44 (Flutter)', 'Cursor (Any)', 'v0.dev (React)', 'Manual'].map(platform => (
                                 <label key={platform} className="flex items-center gap-2 cursor-pointer">
                                   <input
                                     type="radio"
                                     name={`platform-${feature.id}`}
                                     checked={selectedPlatform === platform}
                                     onChange={() => setSelectedPlatforms(prev => ({ ...prev, [feature.id]: platform }))}
                                     className="text-blue-600 focus:ring-blue-500"
                                   />
                                   <span className="text-sm text-slate-700">{platform}</span>
                                 </label>
                               ))}
                             </div>
                           </div>

                           <button
                             onClick={() => handleGenerateCodePrompt(feature)}
                             disabled={isGenerating}
                             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                           >
                             <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                             {isGenerating ? 'Generating...' : 'Generate Implementation Prompt'}
                           </button>
                         </div>
                       </div>

                       {generatedPrompt && (
                         <div className="p-6 bg-slate-50">
                           <div className="flex items-center justify-between mb-4">
                             <h4 className="text-sm font-bold text-slate-900">Generated Implementation Prompt</h4>
                             <button
                               onClick={() => {
                                 const fullPrompt = `# ${feature.name} Implementation\n\n## Dependencies\n${generatedPrompt.dependencies}\n\n## Implementation\n${generatedPrompt.implementation}`;
                                 navigator.clipboard.writeText(fullPrompt);
                                 toast.success('Prompt copied!');
                               }}
                               className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded text-xs font-medium transition-colors"
                             >
                               <Copy className="w-3.5 h-3.5" /> Copy
                             </button>
                           </div>
                         </div>
                       )}
                     </div>
                   );
                 })}
                </div>
                )}

                {/* Full Page Content */}
                {promptTab === 'fullpage' && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                 <FileCodeIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <p className="text-slate-500">Full page implementation prompt coming soon.</p>
                </div>
                )}
                </div>
                )}

                {/* Code Tab */}
          {activeTab === 'code' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Source Code</h3>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(form.frontend_code);
                    toast.success('Code copied!');
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Copy Code
                </button>
              </div>
              <div className="p-6 bg-[#0d1117]">
                <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[500px]">
                  {form.frontend_code || '// Generated code will appear here...'}
                </pre>
              </div>
            </div>
          )}

          {/* Subpagina's Tab */}
          {activeTab === 'subpages' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Subpagina's</h2>
                  <p className="text-slate-500 mt-2">Beheer subpagina's onder deze pagina. Subpagina's hebben dezelfde functionaliteit als hoofdpagina's.</p>
                </div>
                <button
                  onClick={() => setShowAddSubpage(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Nieuwe Subpagina
                </button>
              </div>

              {showAddSubpage && (
                <div className="bg-white rounded-xl border-2 border-slate-200 p-6 mb-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Maak Subpagina</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Naam *</label>
                      <input
                        type="text"
                        placeholder="Bijv. Login Form, Dashboard Widget"
                        value={newSubpage.name}
                        onChange={(e) => setNewSubpage({ ...newSubpage, name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Beschrijving (optioneel)</label>
                      <Textarea
                        placeholder="Beschrijf wat deze subpagina doet..."
                        value={newSubpage.description}
                        onChange={(e) => setNewSubpage({ ...newSubpage, description: e.target.value })}
                        className="h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Path (optioneel)</label>
                      <input
                        type="text"
                        placeholder="Bijv. /login, /widget"
                        value={newSubpage.path}
                        onChange={(e) => setNewSubpage({ ...newSubpage, path: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          if (!newSubpage.name.trim()) {
                            toast.error('Naam is verplicht');
                            return;
                          }
                          createSubpageMutation.mutate({
                            name: newSubpage.name,
                            description: newSubpage.description || null,
                            path: newSubpage.path || null
                          });
                        }}
                        disabled={createSubpageMutation.isPending || !newSubpage.name.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        {createSubpageMutation.isPending ? 'Aanmaken...' : 'Subpagina Aanmaken'}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddSubpage(false);
                          setNewSubpage({ name: '', description: '', path: '' });
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                      >
                        Annuleren
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {subpages.length === 0 && !showAddSubpage ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-xl border border-slate-200">
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-sm mb-2">Geen subpagina's</p>
                  <p className="text-xs text-slate-400">Maak een subpagina om onder deze pagina te bouwen</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subpages.map((subpage) => (
                    <Link
                      key={subpage.id}
                      to={createPageUrl('PageDetail') + '?id=' + subpage.id}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {subpage.name}
                            </h3>
                            {subpage.path && (
                              <p className="text-xs text-slate-400 font-mono">{subpage.path}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm('Weet je zeker dat je deze subpagina wilt verwijderen?')) {
                              deleteSubpageMutation.mutate(subpage.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {subpage.description && (
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {subpage.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className={`px-2 py-1 rounded-full ${
                          subpage.status === 'Done' ? 'bg-green-100 text-green-700' :
                          subpage.status === 'Doing' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {subpage.status}
                        </span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Page Notes</h2>
                  <p className="text-slate-500 mt-2">Collaborate with your team using notes and ideas.</p>
                </div>
                <button
                  onClick={() => setAddingNote(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Note
                </button>
              </div>

              {addingNote && (
                <div className="bg-white rounded-xl border-2 border-slate-200 p-6 mb-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Note</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Note title (optional)"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Textarea
                      placeholder="Write your note..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      className="h-32 resize-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-slate-700">Color:</label>
                      {['blue', 'green', 'purple', 'pink', 'orange'].map(color => (
                        <button
                          key={color}
                          onClick={() => setNewNote({ ...newNote, color })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            newNote.color === color ? 'border-slate-900 scale-110' : 'border-slate-300'
                          } ${
                            color === 'blue' ? 'bg-blue-200' :
                            color === 'green' ? 'bg-green-200' :
                            color === 'purple' ? 'bg-purple-200' :
                            color === 'pink' ? 'bg-pink-200' :
                            'bg-orange-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          if (!newNote.content.trim()) {
                            toast.error('Note content is required');
                            return;
                          }
                          createNoteMutation.mutate({
                            page: pageId,
                            title: newNote.title,
                            content: newNote.content,
                            color: newNote.color,
                            order: notes.length
                          });
                        }}
                        disabled={createNoteMutation.isPending || !newNote.content.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        {createNoteMutation.isPending ? 'Creating...' : 'Create Note'}
                      </button>
                      <button
                        onClick={() => {
                          setAddingNote(false);
                          setNewNote({ title: '', content: '', color: 'blue' });
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {notes.length === 0 && !addingNote ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <StickyNote className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-sm">No notes yet. Create your first note to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.map((note) => {
                    const isEditing = editingNote === note.id;
                    const bgColors = {
                      blue: 'bg-blue-100 border-blue-300',
                      green: 'bg-green-100 border-green-300',
                      purple: 'bg-purple-100 border-purple-300',
                      pink: 'bg-pink-100 border-pink-300',
                      orange: 'bg-orange-100 border-orange-300'
                    };

                    return (
                      <div
                        key={note.id}
                        className={`${bgColors[note.color]} rounded-xl border-2 p-5 shadow-md hover:shadow-lg transition-all group relative`}
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              defaultValue={note.title}
                              placeholder="Note title"
                              onBlur={(e) => {
                                if (e.target.value !== note.title) {
                                  updateNoteMutation.mutate({ id: note.id, data: { title: e.target.value } });
                                }
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Textarea
                              defaultValue={note.content}
                              onBlur={(e) => {
                                if (e.target.value !== note.content) {
                                  updateNoteMutation.mutate({ id: note.id, data: { content: e.target.value } });
                                }
                              }}
                              className="h-32 resize-none"
                            />
                            <button
                              onClick={() => setEditingNote(null)}
                              className="w-full px-3 py-2 bg-slate-700 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                              Done Editing
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <button
                                onClick={() => setEditingNote(note.id)}
                                className="p-1.5 bg-white rounded hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Delete this note?')) {
                                    deleteNoteMutation.mutate(note.id);
                                  }
                                }}
                                className="p-1.5 bg-white rounded hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {note.title && (
                              <h3 className="text-base font-bold text-slate-900 mb-2 pr-16">{note.title}</h3>
                            )}
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                            <div className="mt-4 pt-3 border-t border-slate-300/50 flex items-center justify-between text-xs text-slate-600">
                              <span>{note.created_by?.split('@')[0] || 'You'}</span>
                              <span>{new Date(note.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}