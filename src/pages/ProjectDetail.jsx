import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  ChevronRight, ChevronDown, Layers, Smartphone, Settings as SettingsIcon, 
  Trash2, MoreHorizontal, Rocket, Download, Share2, Star, BarChart2, Bug, 
  Zap, GitBranch, GitCommit, Clock, CheckCircle2, Loader, FileText, 
  Lock, ArrowRight, Sparkles, Palette, CheckSquare, History, Check, 
  Plus, Code2, GitMerge, X, Lightbulb, Folder, FolderOpen, File, Pencil,
  Target, Clipboard
} from 'lucide-react';

export default function ProjectDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [expandedFlows, setExpandedFlows] = useState({});
  const [addingPageToFlow, setAddingPageToFlow] = useState(null);
  const [quickPageForm, setQuickPageForm] = useState({ name: '', purpose: '' });
  const [showUnassignedPages, setShowUnassignedPages] = useState(false);
  const [addingUnassignedPage, setAddingUnassignedPage] = useState(false);
  const [addingTodo, setAddingTodo] = useState(false);
  const [newTodoForm, setNewTodoForm] = useState({ title: '', description: '', category: '', due_date: '', priority: 'Medium' });
  const [showNewFlowDialog, setShowNewFlowDialog] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [editingFlowId, setEditingFlowId] = useState(null);
  const [editingFlowName, setEditingFlowName] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiTaskBreakdown, setAiTaskBreakdown] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiRisks, setAiRisks] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [appStructure, setAppStructure] = useState({
    folders: []
  });
  const [editingStructureItem, setEditingStructureItem] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [generatingStructure, setGeneratingStructure] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [scenarios, setScenarios] = useState(() => {
    const saved = localStorage.getItem(`scenarios_${projectId}`);
    return saved ? JSON.parse(saved) : { folders: [] };
  });
  const [showPasteScenariosDialog, setShowPasteScenariosDialog] = useState(false);
  const [scenarioPasteText, setScenarioPasteText] = useState('');
  const [editingScenario, setEditingScenario] = useState(null);
  const [expandedScenarioFolders, setExpandedScenarioFolders] = useState({});
  const [addingAPI, setAddingAPI] = useState(false);
  const [newAPIForm, setNewAPIForm] = useState({ name: '', description: '', type: 'External API' });
  const [addingKnowledge, setAddingKnowledge] = useState(false);
  const [newKnowledgeForm, setNewKnowledgeForm] = useState({ title: '', content: '', category: 'Other', tags: [] });
  const [editingKnowledge, setEditingKnowledge] = useState(null);
  const [showPasteKnowledgeDialog, setShowPasteKnowledgeDialog] = useState(false);
  const [knowledgePasteText, setKnowledgePasteText] = useState('');
  const [importingKnowledge, setImportingKnowledge] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => base44.entities.Project.list().then(projects => 
      projects.find(p => p.id === projectId)
    ),
    enabled: !!projectId
  });

  const { data: features = [] } = useQuery({
    queryKey: ['features', projectId],
    queryFn: () => base44.entities.Feature.filter({ project: projectId }),
    enabled: !!projectId
  });

  const { data: pages = [] } = useQuery({
    queryKey: ['pages', projectId],
    queryFn: () => base44.entities.Page.filter({ project: projectId }),
    enabled: !!projectId
  });

  const { data: flows = [] } = useQuery({
    queryKey: ['flows', projectId],
    queryFn: () => base44.entities.Flow.filter({ project: projectId }),
    enabled: !!projectId
  });

  const { data: designSystem } = useQuery({
    queryKey: ['designSystem', projectId],
    queryFn: () => base44.entities.DesignSystem.filter({ project: projectId }).then(systems => systems[0]),
    enabled: !!projectId
  });

  const { data: projectTodos = [] } = useQuery({
    queryKey: ['projectTodos', projectId],
    queryFn: () => base44.entities.ProjectTodo.filter({ project: projectId }),
    enabled: !!projectId
  });

  const { data: apis = [] } = useQuery({
    queryKey: ['apis', projectId],
    queryFn: () => base44.entities.API.filter({ project: projectId }),
    enabled: !!projectId
  });

  const { data: knowledgeBase = [] } = useQuery({
    queryKey: ['knowledgeBase', projectId],
    queryFn: () => base44.entities.KnowledgeBase.filter({ project: projectId }),
    enabled: !!projectId
  });

  const queryClient = useQueryClient();

  // Load structure from localStorage on mount
  useEffect(() => {
    if (projectId) {
      const saved = localStorage.getItem(`appStructure_${projectId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Check if it's just the default empty folders (components, pages, utils with no children)
          const isDefaultEmpty = parsed && parsed.folders && parsed.folders.length > 0 && 
            parsed.folders.every(folder => 
              (folder.name === 'components' || folder.name === 'pages' || folder.name === 'utils') &&
              (!folder.children || folder.children.length === 0)
            ) && parsed.folders.length === 3;
          
          // Only set if there's actual content (not just default empty folders)
          if (parsed && parsed.folders && parsed.folders.length > 0 && !isDefaultEmpty) {
            setAppStructure(parsed);
          } else {
            // Clear default folders - start fresh
            setAppStructure({ folders: [] });
            localStorage.removeItem(`appStructure_${projectId}`);
          }
        } catch (error) {
          console.error('Failed to load app structure:', error);
          // On error, keep empty structure
          setAppStructure({ folders: [] });
        }
      } else {
        // No saved data, keep empty structure
        setAppStructure({ folders: [] });
      }
    }
  }, [projectId]);

  // Save structure to localStorage
  useEffect(() => {
    if (projectId && appStructure) {
      localStorage.setItem(`appStructure_${projectId}`, JSON.stringify(appStructure));
    }
  }, [appStructure, projectId]);

  // Save scenarios to localStorage
  useEffect(() => {
    if (projectId && scenarios) {
      localStorage.setItem(`scenarios_${projectId}`, JSON.stringify(scenarios));
    }
  }, [scenarios, projectId]);

  const updateProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.update(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
      setIsEditing(false);
      toast.success('Project updated successfully');
    },
    onError: () => {
      toast.error('Failed to update project');
    }
  });

  const createPageMutation = useMutation({
    mutationFn: (data) => base44.entities.Page.create(data),
    onSuccess: (newPage) => {
      queryClient.invalidateQueries(['pages', projectId]);
      
      // If page has a flow, add it to Flow Builder
      if (newPage.flow) {
        const existingNodes = JSON.parse(localStorage.getItem('flowBuilder_nodes') || '[]');
        const newNode = {
          id: `page_${newPage.id}`,
          name: newPage.name,
          type: 'page',
          iconName: 'Layout',
          x: 500 + Math.random() * 200,
          y: 300 + Math.random() * 200,
          status: 'pending',
          flowId: newPage.flow
        };
        existingNodes.push(newNode);
        localStorage.setItem('flowBuilder_nodes', JSON.stringify(existingNodes));
      }
      
      setAddingPageToFlow(null);
      setAddingUnassignedPage(false);
      setQuickPageForm({ name: '', purpose: '' });
      toast.success('Page created');
      navigate(createPageUrl('PageDetail') + '?id=' + newPage.id);
    },
    onError: () => {
      toast.error('Failed to create page');
    }
  });

  const createFlowMutation = useMutation({
    mutationFn: (data) => base44.entities.Flow.create(data),
    onSuccess: (newFlow) => {
      queryClient.invalidateQueries(['flows', projectId]);
      
      // Save flow to Flow Builder localStorage
      const existingFlows = JSON.parse(localStorage.getItem('flowBuilder_flows') || '[]');
      existingFlows.push({
        id: newFlow.id,
        name: newFlow.name,
        projectId: projectId,
        nodes: [],
        connections: []
      });
      localStorage.setItem('flowBuilder_flows', JSON.stringify(existingFlows));
      
      setShowNewFlowDialog(false);
      setNewFlowName('');
      toast.success('Flow created');
    }
  });

  const updateFlowMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Flow.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['flows', projectId]);
      setEditingFlowId(null);
      setEditingFlowName('');
      toast.success('Flow updated');
    }
  });

  const deleteFlowMutation = useMutation({
    mutationFn: (flowId) => base44.entities.Flow.delete(flowId),
    onSuccess: () => {
      queryClient.invalidateQueries(['flows', projectId]);
      toast.success('Flow deleted');
    }
  });

  const createTodoMutation = useMutation({
    mutationFn: (data) => base44.entities.ProjectTodo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectTodos', projectId]);
      setAddingTodo(false);
      setNewTodoForm({ title: '', description: '', category: '', due_date: '', priority: 'Medium' });
      toast.success('Todo added');
    },
    onError: (error) => {
      console.error('Error creating todo:', error);
      toast.error('Failed to add todo: ' + (error.message || 'Unknown error'));
    }
  });

  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }) => base44.entities.ProjectTodo.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectTodos', projectId]);
    }
  });

  const createAPIMutation = useMutation({
    mutationFn: (data) => base44.entities.API.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['apis', projectId]);
      setAddingAPI(false);
      setNewAPIForm({ name: '', description: '', type: 'External API' });
      toast.success('API toegevoegd');
    }
  });

  const deleteAPIMutation = useMutation({
    mutationFn: (id) => base44.entities.API.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['apis', projectId]);
      toast.success('API verwijderd');
    }
  });

  const createKnowledgeMutation = useMutation({
    mutationFn: (data) => base44.entities.KnowledgeBase.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledgeBase', projectId]);
      setAddingKnowledge(false);
      setNewKnowledgeForm({ title: '', content: '', category: 'Other', tags: [] });
      toast.success('Knowledge base item toegevoegd');
    }
  });

  const updateKnowledgeMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.KnowledgeBase.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledgeBase', projectId]);
      setEditingKnowledge(null);
      toast.success('Knowledge base item bijgewerkt');
    }
  });

  const deleteKnowledgeMutation = useMutation({
    mutationFn: (id) => base44.entities.KnowledgeBase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledgeBase', projectId]);
      toast.success('Knowledge base item verwijderd');
    }
  });

  useEffect(() => {
    if (project && isEditing) {
      setEditForm({
        name: project.name,
        description: project.description || '',
        status: project.status,
        ai_builder: project.ai_builder || 'Base44',
        product_type: project.product_type || 'SaaS',
        app_type: Array.isArray(project.app_type) ? project.app_type : (project.app_type ? [project.app_type] : ['Web'])
      });
    }
  }, [isEditing, project]);

  const toggleAppType = (type) => {
    const currentTypes = editForm.app_type || [];
    if (currentTypes.includes(type)) {
      setEditForm({ ...editForm, app_type: currentTypes.filter(t => t !== type) });
    } else {
      setEditForm({ ...editForm, app_type: [...currentTypes, type] });
    }
  };

  const handleSave = () => {
    updateProjectMutation.mutate(editForm);
  };

  const toggleFlow = (flowId) => {
    setExpandedFlows(prev => ({ ...prev, [flowId]: !prev[flowId] }));
  };

  const handleQuickAddPage = (flowId) => {
    if (!quickPageForm.name.trim()) {
      toast.error('Page name is required');
      return;
    }
    createPageMutation.mutate({
      project: projectId,
      flow: flowId || undefined,
      name: quickPageForm.name,
      purpose: quickPageForm.purpose,
      status: 'Todo'
    });
  };

  const getFlowPages = (flowId) => {
    return pages.filter(p => p.flow === flowId);
  };

  const getPagesWithoutFlow = () => {
    return pages.filter(p => !p.flow);
  };

  if (!projectId || !project) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500">Project not found</p>
        <button onClick={() => navigate(createPageUrl('Projects'))} className="mt-4 text-blue-600">
          Back to Projects
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-purple-100 text-purple-700 border-purple-200',
      'Building': 'bg-orange-100 text-orange-700 border-orange-200',
      'Review': 'bg-blue-100 text-blue-700 border-blue-200',
      'Done': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const doneFeatures = features.filter(f => f.status === 'Done').length;
  const totalFeatures = features.length;
  const healthPercentage = totalFeatures > 0 ? Math.round((doneFeatures / totalFeatures) * 100) : 0;

  const generateAITaskBreakdown = async (featureName) => {
    setLoadingAI(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Break down this feature into specific implementation tasks: "${featureName}"
        
Project context:
- Type: ${project.product_type || 'SaaS'}
- Platform: ${Array.isArray(project.app_type) ? project.app_type.join(', ') : 'Web'}
- Current features: ${features.map(f => f.name).join(', ')}

Provide a detailed task breakdown with clear, actionable steps.`,
        response_json_schema: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  task: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string" },
                  estimated_hours: { type: "number" }
                }
              }
            },
            notes: { type: "string" }
          }
        }
      });
      setAiTaskBreakdown(response);
    } catch (error) {
      toast.error('Failed to generate task breakdown');
    } finally {
      setLoadingAI(false);
    }
  };

  const detectProjectRisks = async () => {
    setLoadingAI(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this project for potential risks and issues:

Project: ${project.name}
Status: ${project.status}
Progress: ${healthPercentage}%
Features: ${totalFeatures} total, ${doneFeatures} completed
Pages: ${pages.length} (${pages.filter(p => p.status === 'Done').length} completed)
Active TODOs: ${projectTodos.filter(t => !t.completed).length}

Identify key risks, blockers, or areas of concern.`,
        response_json_schema: {
          type: "object",
          properties: {
            risks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  severity: { type: "string" },
                  description: { type: "string" },
                  recommendation: { type: "string" }
                }
              }
            }
          }
        }
      });
      setAiRisks(response.risks || []);
    } catch (error) {
      toast.error('Failed to detect risks');
    } finally {
      setLoadingAI(false);
    }
  };

  const addStructureItem = (parentId, type) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;
    
    const newItem = {
      id: `${Date.now()}`,
      name,
      type,
      children: type === 'folder' ? [] : undefined
    };

    if (!parentId) {
      setAppStructure({
        ...appStructure,
        folders: [...appStructure.folders, newItem]
      });
    } else {
      const addToParent = (items) => {
        return items.map(item => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newItem]
            };
          }
          if (item.children) {
            return {
              ...item,
              children: addToParent(item.children)
            };
          }
          return item;
        });
      };
      setAppStructure({
        ...appStructure,
        folders: addToParent(appStructure.folders)
      });
    }
  };

  const deleteStructureItem = (itemId) => {
    const deleteFromStructure = (items) => {
      return items.filter(item => item.id !== itemId).map(item => {
        if (item.children) {
          return {
            ...item,
            children: deleteFromStructure(item.children)
          };
        }
        return item;
      });
    };
    setAppStructure({
      ...appStructure,
      folders: deleteFromStructure(appStructure.folders)
    });
  };

  const updateStructureItem = (itemId, newName) => {
    const updateInStructure = (items) => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, name: newName };
        }
        if (item.children) {
          return {
            ...item,
            children: updateInStructure(item.children)
          };
        }
        return item;
      });
    };
    setAppStructure({
      ...appStructure,
      folders: updateInStructure(appStructure.folders)
    });
  };

  const parseTextStructure = (text) => {
    const lines = text.split('\n');
    const items = [];
    
    // Step 1: Parse all lines and extract clean data
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      
      // Skip empty, headers, and features/ line
      if (!trimmed || 
          trimmed.includes('STRUCTURE') || 
          trimmed === 'features/' || 
          trimmed.includes('DEALMAKER')) {
        return;
      }
      
      // Count indentation (spaces before any content)
      let indent = 0;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === ' ') indent++;
        else break;
      }
      
      // Get name (remove tree chars: ├, └, ─, │)
      let name = trimmed.replace(/^[├└─│\s]+/, '').trim();
      if (!name) return;
      
      // Determine type
      const endsWithSlash = name.endsWith('/');
      const isAllCaps = /^[A-Z_]+\/$/.test(name) || /^[A-Z_]+$/.test(name);
      const isFolder = endsWithSlash || isAllCaps;
      
      // Clean name
      if (endsWithSlash) name = name.slice(0, -1);
      
      items.push({
        name,
        indent,
        isFolder,
        originalIndex: idx
      });
    });
    
    // Step 2: Build hierarchy
    const structure = [];
    const stack = [{ children: structure, indent: -1 }];
    
    items.forEach((item) => {
      const newItem = {
        id: `${Date.now()}_${item.originalIndex}_${Math.random()}`,
        name: item.name,
        type: item.isFolder ? 'folder' : 'file',
        children: item.isFolder ? [] : undefined
      };
      
      // Find correct parent based on indentation
      while (stack.length > 1 && stack[stack.length - 1].indent >= item.indent) {
        stack.pop();
      }
      
      // Add to parent
      const parent = stack[stack.length - 1];
      parent.children.push(newItem);
      
      // Add folder to stack
      if (item.isFolder) {
        stack.push({ ...newItem, indent: item.indent });
      }
    });
    
    return { folders: structure };
  };

  const handlePasteStructure = () => {
    if (!pasteText.trim()) {
      toast.error('Please paste a structure first');
      return;
    }

    try {
      const parsed = parseTextStructure(pasteText);
      setAppStructure(parsed);
      setShowPasteDialog(false);
      setPasteText('');
      toast.success('Structure imported successfully');
    } catch (error) {
      toast.error('Failed to parse structure');
    }
  };

  const handlePasteScenarios = () => {
    if (!scenarioPasteText.trim()) {
      toast.error('Please paste scenarios first');
      return;
    }
    
    try {
      const parsed = parseTextStructure(scenarioPasteText);
      setScenarios(parsed);
      setShowPasteScenariosDialog(false);
      setScenarioPasteText('');
      toast.success('Scenarios imported successfully');
    } catch (error) {
      toast.error('Failed to parse scenarios');
    }
  };

  const handlePasteKnowledge = async () => {
    if (!knowledgePasteText.trim()) {
      toast.error('Plak eerst knowledge items');
      return;
    }
    
    setImportingKnowledge(true);
    
    try {
      const lines = knowledgePasteText.split('\n').filter(line => line.trim());
      const items = [];
      
      for (const line of lines) {
        const trimmed = line.trim();
        // Skip headers and empty lines
        if (!trimmed || trimmed.includes('Knowledge Base') || trimmed === '│') continue;
        
        // Remove tree characters
        let text = trimmed.replace(/^[├└─│\s]+/, '').trim();
        if (!text) continue;
        
        // Determine category from prefix or treat as title
        let category = 'Other';
        let title = text;
        
        if (text.includes(':')) {
          const parts = text.split(':');
          const possibleCategory = parts[0].trim();
          if (['Architecture', 'Best Practices', 'API Documentation', 'Design Guidelines', 'Tech Stack', 'Security'].includes(possibleCategory)) {
            category = possibleCategory;
            title = parts.slice(1).join(':').trim();
          }
        }
        
        items.push({
          project: projectId,
          title: title,
          content: '',
          category: category
        });
      }
      
      // Bulk create
      for (const item of items) {
        await base44.entities.KnowledgeBase.create(item);
      }
      
      queryClient.invalidateQueries(['knowledgeBase', projectId]);
      setShowPasteKnowledgeDialog(false);
      setKnowledgePasteText('');
      toast.success(`${items.length} knowledge base items geïmporteerd`);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import mislukt: ' + error.message);
    } finally {
      setImportingKnowledge(false);
    }
  };

  const addScenarioItem = (parentId, type) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;
    
    const newItem = {
      id: `scenario_${Date.now()}`,
      name,
      type,
      children: type === 'folder' ? [] : undefined
    };

    if (!parentId) {
      setScenarios({
        ...scenarios,
        folders: [...(scenarios.folders || []), newItem]
      });
    } else {
      const addToParent = (items) => {
        return items.map(item => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newItem]
            };
          }
          if (item.children) {
            return {
              ...item,
              children: addToParent(item.children)
            };
          }
          return item;
        });
      };
      setScenarios({
        ...scenarios,
        folders: addToParent(scenarios.folders || [])
      });
    }
  };

  const deleteScenarioItem = (itemId) => {
    const deleteFromStructure = (items) => {
      return items.filter(item => item.id !== itemId).map(item => {
        if (item.children) {
          return {
            ...item,
            children: deleteFromStructure(item.children)
          };
        }
        return item;
      });
    };
    setScenarios({
      ...scenarios,
      folders: deleteFromStructure(scenarios.folders || [])
    });
  };

  const updateScenarioItem = (itemId, newName) => {
    const updateInStructure = (items) => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, name: newName };
        }
        if (item.children) {
          return {
            ...item,
            children: updateInStructure(item.children)
          };
        }
        return item;
      });
    };
    setScenarios({
      ...scenarios,
      folders: updateInStructure(scenarios.folders || [])
    });
  };

  // Sync flows from appStructure to Flow entity
  const syncFlowsFromStructure = async () => {
    try {
      const structureFolders = appStructure.folders || [];
      const flowFolders = structureFolders.filter(f => 
        f.type === 'folder' && (f.name.includes('FLOW') || f.name.toUpperCase() === f.name)
      );

      // Collect all flow names and page names from structure
      const structureFlowNames = new Set(flowFolders.map(f => f.name));
      const structurePagesByFlow = new Map();
      
      flowFolders.forEach(folder => {
        const pageNames = (folder.children || [])
          .filter(child => child.type === 'file')
          .map(child => child.name);
        structurePagesByFlow.set(folder.name, new Set(pageNames));
      });

      // Delete flows that no longer exist in structure
      for (const flow of flows) {
        if (!structureFlowNames.has(flow.name)) {
          await base44.entities.Flow.delete(flow.id);
        }
      }

      // Delete ALL pages first to avoid conflicts
      for (const page of pages) {
        await base44.entities.Page.delete(page.id);
      }

      // Create or update flows and their pages
      for (const folder of flowFolders) {
        let flow = flows.find(f => f.name === folder.name);
        
        // Create flow if doesn't exist
        if (!flow) {
          flow = await base44.entities.Flow.create({
            project: projectId,
            name: folder.name,
            order: flowFolders.indexOf(folder)
          });
        }

        // Create all pages for this flow
        if (folder.children) {
          for (const child of folder.children) {
            if (child.type === 'file') {
              await base44.entities.Page.create({
                project: projectId,
                flow: flow.id,
                name: child.name,
                status: 'Todo'
              });
            }
          }
        }
      }

      await queryClient.invalidateQueries(['flows', projectId]);
      await queryClient.invalidateQueries(['pages', projectId]);
      toast.success('Flows en pages gesynchroniseerd');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Synchronisatie mislukt');
    }
  };

  const generateAIStructure = async () => {
    setGeneratingStructure(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a recommended app folder structure for this project:

Project: ${project.name}
Type: ${project.product_type}
Platform: ${Array.isArray(project.app_type) ? project.app_type.join(', ') : 'Web'}
Pages: ${pages.map(p => p.name).join(', ')}

Create a modern, scalable folder structure. Return JSON format with folders and files.`,
        response_json_schema: {
          type: "object",
          properties: {
            folders: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  children: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      // Add IDs to generated structure
      const addIds = (items) => {
        return items.map((item, idx) => ({
          ...item,
          id: `ai_${Date.now()}_${idx}`,
          children: item.children ? addIds(item.children) : undefined
        }));
      };
      
      setAppStructure({
        folders: addIds(response.folders || [])
      });
      toast.success('AI structure generated');
    } catch (error) {
      toast.error('Failed to generate structure');
    } finally {
      setGeneratingStructure(false);
    }
  };

  const generateProjectSummary = async () => {
    setLoadingAI(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a concise project status summary:

Project: ${project.name}
Description: ${project.description || 'N/A'}
Status: ${project.status}
Progress: ${healthPercentage}%

Metrics:
- Features: ${totalFeatures} (${doneFeatures} done, ${features.filter(f => f.status === 'Doing').length} in progress)
- Pages: ${pages.length} (${pages.filter(p => p.status === 'Done').length} completed)
- TODOs: ${projectTodos.length} (${projectTodos.filter(t => t.completed).length} completed)

Recent activity: ${pages.length + features.length} total items created

Provide a brief executive summary with key insights and next steps.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_achievements: {
              type: "array",
              items: { type: "string" }
            },
            next_steps: {
              type: "array",
              items: { type: "string" }
            },
            overall_health: { type: "string" }
          }
        }
      });
      setAiSummary(response);
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-12 py-4 bg-[#EBF5FF]/30 border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => navigate(createPageUrl('Projects'))} className="hover:text-slate-900">Projects</button>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-900">{project.name}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span>Overview</span>
        </div>
      </div>

      {/* Page Header */}
      <header className="bg-gradient-to-b from-[#EBF5FF] to-white border-b border-slate-200 px-12 py-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-6">
              {/* Project Image */}
              <div className="relative group">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg flex items-center justify-center text-white">
                    <Layers className="w-10 h-10" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const { file_url } = await base44.integrations.Core.UploadFile({ file });
                          setEditForm({ ...editForm, image_url: file_url });
                        }
                      }}
                    />
                    <span className="text-white text-xs font-medium">Change</span>
                  </label>
                )}
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-[40px] font-bold tracking-tight text-slate-900 leading-none bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <h1 className="text-[40px] font-bold tracking-tight text-slate-900 leading-none">{project.name}</h1>
                  )}
                  {isEditing ? (
                    <select
                      value={editForm.status || ''}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className={`px-2.5 py-1 rounded-full text-sm font-semibold border ${getStatusColor(editForm.status || project.status)}`}
                    >
                      <option value="Planning">Planning</option>
                      <option value="Building">Building</option>
                      <option value="Review">Review</option>
                      <option value="Done">Done</option>
                    </select>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full text-sm font-semibold border ${getStatusColor(project.status)}`}>
                      {project.status === 'Building' ? 'In Development' : project.status}
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="text-lg text-slate-500 font-medium bg-transparent border-b border-slate-300 focus:outline-none focus:border-blue-500 w-full"
                    placeholder="Project description"
                  />
                ) : (
                  <p className="text-lg text-slate-500 font-medium">{project.description || 'AI-powered project management'}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Project
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={updateProjectMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
              <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium text-slate-700 flex items-center gap-1">
                  <Smartphone className="w-3 h-3" /> {project.ai_builder || 'Base44'}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span>Created {new Date(project.created_date).toLocaleDateString()}</span>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span>Last updated {new Date(project.updated_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-12 py-10 pb-24">
        
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Health Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-slate-900">Project Health</span>
              <BarChart2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-slate-900">{healthPercentage}%</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+{healthPercentage}%</span>
            </div>
            <div className="text-xs text-slate-500 mb-4">Progress tracking</div>
            
            <div className="h-1.5 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${healthPercentage}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Design
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Loader className="w-3 h-3 text-amber-500" /> Dev
              </div>
            </div>
          </div>

          {/* AI Insights Card */}
          <div 
            onClick={() => {
              setShowAIPanel(true);
              if (!aiSummary) generateProjectSummary();
            }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-lg cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-slate-900">AI Insights</span>
              <Sparkles className="w-5 h-5 text-purple-600 group-hover:animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-slate-900">{aiRisks.length}</span>
            </div>
            <div className="text-xs text-purple-700 mb-4 font-medium">Click for AI analysis</div>
          </div>

          {/* Velocity Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-slate-900">Features</span>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-slate-900">{totalFeatures}</span>
            </div>
            <div className="text-xs text-slate-500 mb-4">{doneFeatures} completed</div>
          </div>

          {/* Pages Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className="font-semibold text-slate-900">Pages</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] uppercase font-bold tracking-wide rounded border border-blue-100">
                {pages.length} Total
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> {pages.filter(p => p.status === 'Done').length} Complete
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {pages.filter(p => p.status === 'Doing').length} In Progress
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* App Information Card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900">Project Information</h2>
                </div>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={updateProjectMutation.isPending}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                    >
                      {updateProjectMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Project Name</div>
                      <div className="font-medium text-slate-900">{project.name}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status</div>
                      <div className="font-medium text-slate-900">{project.status}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">AI Builder</div>
                      <div className="font-medium text-slate-900">{project.ai_builder || 'Base44'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Product Type</div>
                      <div className="font-medium text-slate-900">{project.product_type || 'SaaS'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">App Type</div>
                      <div className="font-medium text-slate-900">
                        {Array.isArray(project.app_type) 
                          ? project.app_type.join(', ') 
                          : (project.app_type || 'Web')}
                      </div>
                    </div>
                    </div>

                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-900">Project Vision</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {project.description || 'Build amazing applications with AI-powered tools and modern development workflow.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Project Name</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                      <select
                        value={editForm.status || ''}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Planning">Planning</option>
                        <option value="Building">Building</option>
                        <option value="Review">Review</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">AI Builder</label>
                      <select
                        value={editForm.ai_builder || ''}
                        onChange={(e) => setEditForm({ ...editForm, ai_builder: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Base44">Base44</option>
                        <option value="Lovable">Lovable</option>
                        <option value="Cursor">Cursor</option>
                        <option value="v0">v0</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Product Type</label>
                      <select
                        value={editForm.product_type || ''}
                        onChange={(e) => setEditForm({ ...editForm, product_type: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SaaS">SaaS</option>
                        <option value="CRM">CRM</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Dashboard">Dashboard</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">App Type (Multiple)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Web', 'iOS', 'Android', 'Desktop', 'Hybrid', 'PWA'].map(type => (
                          <label key={type} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(editForm.app_type || []).includes(type)}
                              onChange={() => toggleAppType(type)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-900">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Project Vision</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={8}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Describe your project vision..."
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Flows & Pages Card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                    <GitMerge className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Flows & Pages</h2>
                    <div className="text-sm text-slate-500 mt-0.5">{flows.length} flows • {pages.length} pages</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={syncFlowsFromStructure}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4" /> Sync from Structure
                  </button>
                  <button 
                    onClick={() => setShowNewFlowDialog(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> New Flow
                  </button>
                  <button 
                    onClick={() => navigate(createPageUrl('FlowBuilder'))}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900"
                  >
                    Flow Builder
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {flows.map((flow) => {
                  const flowPages = getFlowPages(flow.id);
                  const isExpanded = expandedFlows[flow.id];
                  const isAdding = addingPageToFlow === flow.id;

                  return (
                    <div key={flow.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div 
                          onClick={() => toggleFlow(flow.id)}
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                        >
                          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          <GitMerge className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            {editingFlowId === flow.id ? (
                              <input
                                type="text"
                                value={editingFlowName}
                                onChange={(e) => setEditingFlowName(e.target.value)}
                                onBlur={() => {
                                  if (editingFlowName.trim() && editingFlowName !== flow.name) {
                                    updateFlowMutation.mutate({ id: flow.id, data: { name: editingFlowName } });
                                  } else {
                                    setEditingFlowId(null);
                                    setEditingFlowName('');
                                  }
                                }}
                                onKeyDown={(e) => {
                                  e.stopPropagation();
                                  if (e.key === 'Enter' && editingFlowName.trim()) {
                                    updateFlowMutation.mutate({ id: flow.id, data: { name: editingFlowName } });
                                  } else if (e.key === 'Escape') {
                                    setEditingFlowId(null);
                                    setEditingFlowName('');
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="font-semibold text-slate-900 bg-white px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                            ) : (
                              <>
                                <div className="font-semibold text-slate-900">{flow.name}</div>
                                <div className="text-xs text-slate-500">{flowPages.length} pages</div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {editingFlowId !== flow.id && (
                            <>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingFlowId(flow.id);
                                  setEditingFlowName(flow.name);
                                }}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Rename flow"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete flow "${flow.name}"? Pages will remain but be unassigned.`)) {
                                    deleteFlowMutation.mutate(flow.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Delete flow"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddingPageToFlow(flow.id);
                              setQuickPageForm({ name: '', purpose: '' });
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add Page
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-white p-4 space-y-2">
                          {isAdding && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3 mb-3">
                              <input
                                type="text"
                                placeholder="Page name"
                                value={quickPageForm.name}
                                onChange={(e) => setQuickPageForm({ ...quickPageForm, name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                              <input
                                type="text"
                                placeholder="Purpose (optional)"
                                value={quickPageForm.purpose}
                                onChange={(e) => setQuickPageForm({ ...quickPageForm, purpose: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleQuickAddPage(flow.id)}
                                  disabled={createPageMutation.isPending}
                                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {createPageMutation.isPending ? 'Creating...' : 'Create & Edit'}
                                </button>
                                <button
                                  onClick={() => setAddingPageToFlow(null)}
                                  className="px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {flowPages.length === 0 && !isAdding ? (
                            <div className="text-center py-4 text-slate-400 text-sm">
                              No pages in this flow yet
                            </div>
                          ) : (
                            flowPages.map((page) => (
                              <div key={page.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-white border border-slate-200 rounded shadow-sm flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900 text-sm">{page.name}</div>
                                    <div className="text-xs text-slate-500">{page.purpose || page.status}</div>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => navigate(createPageUrl('PageDetail') + '?id=' + page.id)}
                                  className="text-xs font-medium text-blue-600 hover:underline"
                                >
                                  Edit →
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div 
                    onClick={() => setShowUnassignedPages(!showUnassignedPages)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showUnassignedPages ? 'rotate-90' : ''}`} />
                      <FileText className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Pages without flow</div>
                        <div className="text-xs text-slate-500">{getPagesWithoutFlow().length} pages</div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddingUnassignedPage(true);
                        setQuickPageForm({ name: '', purpose: '' });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Create Page
                    </button>
                  </div>

                  {showUnassignedPages && (
                    <div className="bg-white p-4 space-y-2">
                      {addingUnassignedPage && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3 mb-3">
                          <input
                            type="text"
                            placeholder="Page name"
                            value={quickPageForm.name}
                            onChange={(e) => setQuickPageForm({ ...quickPageForm, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <input
                            type="text"
                            placeholder="Purpose (optional)"
                            value={quickPageForm.purpose}
                            onChange={(e) => setQuickPageForm({ ...quickPageForm, purpose: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleQuickAddPage(null)}
                              disabled={createPageMutation.isPending}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                              {createPageMutation.isPending ? 'Creating...' : 'Create & Edit'}
                            </button>
                            <button
                              onClick={() => setAddingUnassignedPage(false)}
                              className="px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {getPagesWithoutFlow().length === 0 && !addingUnassignedPage ? (
                        <div className="text-center py-4 text-slate-400 text-sm">
                          No unassigned pages yet
                        </div>
                      ) : (
                        getPagesWithoutFlow().map((page) => (
                          <div key={page.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white border border-slate-200 rounded shadow-sm flex items-center justify-center">
                                <FileText className="w-4 h-4 text-slate-400" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">{page.name}</div>
                                <div className="text-xs text-slate-500">{page.purpose || page.status}</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => navigate(createPageUrl('PageDetail') + '?id=' + page.id)}
                              className="text-xs font-medium text-blue-600 hover:underline"
                            >
                              Edit →
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {flows.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <GitMerge className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm mb-4">No flows yet. Create your first flow to organize pages.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Scenarios Section */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Practice Scenarios</h2>
                    <div className="text-sm text-slate-500 mt-0.5">{scenarios.length} scenarios</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowPasteScenariosDialog(true)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Clipboard className="w-3 h-3" /> Paste Scenarios
                  </button>
                  <button 
                    onClick={() => addScenarioItem(null, 'folder')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Folder
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 max-h-[400px] overflow-y-auto">
                {(() => {
                  const renderScenarioItem = (item, depth = 0) => {
                    const isFolder = item.type === 'folder';
                    const isExpanded = expandedScenarioFolders[item.id];
                    const Icon = isFolder ? (isExpanded ? FolderOpen : Folder) : Target;

                    return (
                      <div key={item.id} style={{ marginLeft: `${depth * 16}px` }}>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors group">
                          <div className="flex items-center gap-2 flex-1">
                            {isFolder && (
                              <button
                                onClick={() => setExpandedScenarioFolders({ ...expandedScenarioFolders, [item.id]: !isExpanded })}
                                className="p-0.5 hover:bg-slate-200 rounded"
                              >
                                <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>
                            )}
                            {editingScenario === item.id ? (
                              <input
                                type="text"
                                defaultValue={item.name}
                                onBlur={(e) => {
                                  if (e.target.value.trim()) {
                                    updateScenarioItem(item.id, e.target.value);
                                  }
                                  setEditingScenario(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.target.value.trim()) {
                                    updateScenarioItem(item.id, e.target.value);
                                    setEditingScenario(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingScenario(null);
                                  }
                                }}
                                className="px-2 py-1 border border-blue-500 rounded text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                            ) : (
                              <>
                                <Icon className={`w-4 h-4 ${isFolder ? 'text-purple-500' : 'text-slate-400'}`} />
                                <span className="text-sm font-medium text-slate-900">{item.name}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isFolder && (
                              <>
                                <button
                                  onClick={() => addScenarioItem(item.id, 'folder')}
                                  className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                                  title="Add subfolder"
                                >
                                  <Folder className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => addScenarioItem(item.id, 'file')}
                                  className="p-1 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded"
                                  title="Add scenario"
                                >
                                  <Target className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setEditingScenario(item.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                              title="Rename"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${item.name}?`)) {
                                  deleteScenarioItem(item.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {isFolder && isExpanded && item.children && item.children.length > 0 && (
                          <div className="mt-1">
                            {item.children.map(child => renderScenarioItem(child, depth + 1))}
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <>
                      {(scenarios.folders || []).map(folder => renderScenarioItem(folder))}
                      {(!scenarios.folders || scenarios.folders.length === 0) && (
                        <div className="text-center py-8 text-slate-400 text-sm">
                          <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="mb-4">No scenarios defined yet</p>
                          <button
                            onClick={() => addScenarioItem(null, 'folder')}
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Add Folder
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </section>

            {/* Knowledge Base Card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Knowledge Base</h2>
                    <div className="text-sm text-slate-500 mt-0.5">Project documentatie en best practices • {knowledgeBase.length} items</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowPasteKnowledgeDialog(true)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Clipboard className="w-3 h-3" /> Plak Items
                  </button>
                  <button 
                    onClick={() => setAddingKnowledge(true)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Voeg item toe
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {addingKnowledge && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="Titel (bijv. Authentication Flow, Database Schema)"
                      value={newKnowledgeForm.title}
                      onChange={(e) => setNewKnowledgeForm({ ...newKnowledgeForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      autoFocus
                    />
                    <textarea
                      placeholder="Beschrijving of documentatie..."
                      value={newKnowledgeForm.content}
                      onChange={(e) => setNewKnowledgeForm({ ...newKnowledgeForm, content: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      rows={4}
                    />
                    <select
                      value={newKnowledgeForm.category}
                      onChange={(e) => setNewKnowledgeForm({ ...newKnowledgeForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Architecture">Architecture</option>
                      <option value="Best Practices">Best Practices</option>
                      <option value="API Documentation">API Documentation</option>
                      <option value="Design Guidelines">Design Guidelines</option>
                      <option value="Tech Stack">Tech Stack</option>
                      <option value="Security">Security</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (newKnowledgeForm.title.trim() && newKnowledgeForm.content.trim()) {
                            createKnowledgeMutation.mutate({ ...newKnowledgeForm, project: projectId });
                          }
                        }}
                        disabled={!newKnowledgeForm.title.trim() || !newKnowledgeForm.content.trim() || createKnowledgeMutation.isPending}
                        className="flex-1 px-3 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50"
                      >
                        Toevoegen
                      </button>
                      <button
                        onClick={() => {
                          setAddingKnowledge(false);
                          setNewKnowledgeForm({ title: '', content: '', category: 'Other', tags: [] });
                        }}
                        className="px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200"
                      >
                        Annuleren
                      </button>
                    </div>
                  </div>
                )}

                {knowledgeBase.length > 0 ? (
                  knowledgeBase.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-amber-200 transition-colors">
                      <div className="flex-1">
                        {editingKnowledge === item.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              defaultValue={item.title}
                              onBlur={(e) => {
                                if (e.target.value.trim() && e.target.value !== item.title) {
                                  updateKnowledgeMutation.mutate({ id: item.id, data: { title: e.target.value } });
                                } else {
                                  setEditingKnowledge(null);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  updateKnowledgeMutation.mutate({ id: item.id, data: { title: e.target.value } });
                                } else if (e.key === 'Escape') {
                                  setEditingKnowledge(null);
                                }
                              }}
                              className="w-full px-2 py-1 border border-amber-500 rounded text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                {item.category}
                              </span>
                            </div>
                            {item.content && (
                              <div className="text-xs text-slate-600 line-clamp-2">{item.content}</div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        {editingKnowledge !== item.id && (
                          <button
                            onClick={() => setEditingKnowledge(item.id)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Knowledge base item "${item.title}" verwijderen?`)) {
                              deleteKnowledgeMutation.mutate(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : !addingKnowledge ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="mb-4">Nog geen knowledge base items toegevoegd</p>
                    <button
                      onClick={() => setAddingKnowledge(true)}
                      className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Voeg eerste item toe
                    </button>
                  </div>
                ) : null}
              </div>
            </section>

            {/* API Integraties Card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">API Integraties</h2>
                    <div className="text-sm text-slate-500 mt-0.5">Gekoppelde API's en services • {apis.length} API's</div>
                  </div>
                </div>
                <button 
                  onClick={() => setAddingAPI(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" /> Voeg API toe
                </button>
              </div>

              <div className="space-y-3">
                {addingAPI && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="API naam (bijv. Stripe, OpenAI, Firebase)"
                      value={newAPIForm.name}
                      onChange={(e) => setNewAPIForm({ ...newAPIForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <textarea
                      placeholder="Wat doet deze API? (bijv. Betalingen verwerken, AI tekst genereren)"
                      value={newAPIForm.description}
                      onChange={(e) => setNewAPIForm({ ...newAPIForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                    />
                    <select
                      value={newAPIForm.type}
                      onChange={(e) => setNewAPIForm({ ...newAPIForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="External API">External API</option>
                      <option value="Backend Function">Backend Function</option>
                      <option value="Integration">Integration</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (newAPIForm.name.trim()) {
                            createAPIMutation.mutate({ ...newAPIForm, project: projectId, status: 'Active' });
                          }
                        }}
                        disabled={!newAPIForm.name.trim() || createAPIMutation.isPending}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Toevoegen
                      </button>
                      <button
                        onClick={() => {
                          setAddingAPI(false);
                          setNewAPIForm({ name: '', description: '', type: 'External API' });
                        }}
                        className="px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200"
                      >
                        Annuleren
                      </button>
                    </div>
                  </div>
                )}

                {apis.length > 0 ? (
                  apis.map((api) => (
                    <div key={api.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-sm font-semibold text-slate-900">{api.name}</div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            {api.type}
                          </span>
                        </div>
                        {api.description && (
                          <div className="text-xs text-slate-600">{api.description}</div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`API "${api.name}" verwijderen?`)) {
                            deleteAPIMutation.mutate(api.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : !addingAPI ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    <Code2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="mb-4">Nog geen API's toegevoegd</p>
                    <button
                      onClick={() => setAddingAPI(true)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Voeg eerste API toe
                    </button>
                  </div>
                ) : null}
              </div>
            </section>

            {/* App Structure Card */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">App Structure</h2>
                    <div className="text-sm text-slate-500 mt-0.5">Project file organization</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowPasteDialog(true)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <FileText className="w-3 h-3" /> Paste Structure
                  </button>
                  <button 
                    onClick={generateAIStructure}
                    disabled={generatingStructure}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" /> {generatingStructure ? 'Generating...' : 'AI Generate'}
                  </button>
                  <button 
                    onClick={() => addStructureItem(null, 'folder')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" /> New Folder
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 max-h-[400px] overflow-y-auto">
                {(() => {
                  const renderStructureItem = (item, depth = 0) => {
                    const isFolder = item.type === 'folder';
                    const isExpanded = expandedFolders[item.id];
                    const Icon = isFolder ? (isExpanded ? FolderOpen : Folder) : File;

                    return (
                      <div key={item.id} style={{ marginLeft: `${depth * 16}px` }}>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors group">
                          <div className="flex items-center gap-2 flex-1">
                            {isFolder && (
                              <button
                                onClick={() => setExpandedFolders({ ...expandedFolders, [item.id]: !isExpanded })}
                                className="p-0.5 hover:bg-slate-200 rounded"
                              >
                                <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>
                            )}
                            {editingStructureItem === item.id ? (
                              <input
                                type="text"
                                defaultValue={item.name}
                                onBlur={(e) => {
                                  if (e.target.value.trim()) {
                                    updateStructureItem(item.id, e.target.value);
                                  }
                                  setEditingStructureItem(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.target.value.trim()) {
                                    updateStructureItem(item.id, e.target.value);
                                    setEditingStructureItem(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingStructureItem(null);
                                  }
                                }}
                                className="px-2 py-1 border border-blue-500 rounded text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                            ) : (
                              <>
                                <Icon className={`w-4 h-4 ${isFolder ? 'text-blue-500' : 'text-slate-400'}`} />
                                <span className="text-sm font-medium text-slate-900">{item.name}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isFolder && (
                              <>
                                <button
                                  onClick={() => addStructureItem(item.id, 'folder')}
                                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Add subfolder"
                                >
                                  <Folder className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => addStructureItem(item.id, 'file')}
                                  className="p-1 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded"
                                  title="Add file"
                                >
                                  <File className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setEditingStructureItem(item.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                              title="Rename"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${item.name}?`)) {
                                  deleteStructureItem(item.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {isFolder && isExpanded && item.children && item.children.length > 0 && (
                          <div className="mt-1">
                            {item.children.map(child => renderStructureItem(child, depth + 1))}
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <>
                      {appStructure.folders.map(folder => renderStructureItem(folder))}
                      {appStructure.folders.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-sm">
                          <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="mb-4">No structure defined yet</p>
                          <button
                            onClick={generateAIStructure}
                            disabled={generatingStructure}
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            {generatingStructure ? 'Generating...' : 'Generate with AI'}
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </section>

            {/* Design System & TODOs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Design System Card */}
              {designSystem ? (
                <div 
                  onClick={() => navigate(createPageUrl('DesignSystemTab') + '?id=' + projectId)}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Palette className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Design System</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border bg-green-50 text-green-700 border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Recently
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-8 flex-1 bg-[#FAFAFA]">
                    {/* Colors */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Color Palette</h4>
                      <div className="flex gap-4">
                        {(designSystem.brand_colors || []).slice(0, 5).map((colorObj, idx) => (
                          <div key={idx} className="group/c relative">
                            <div 
                              className="w-12 h-12 rounded-full shadow-sm ring-2 ring-white cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: colorObj.color }}
                            ></div>
                            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 opacity-0 group-hover/c:opacity-100 transition-opacity">
                              {colorObj.color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Typography & Spacing */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Typography</h4>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-2">
                          <div className="text-xl font-semibold text-slate-900 leading-tight">
                            {project?.name?.slice(0, 12) || 'Preview'}
                          </div>
                          <div className="text-xs text-slate-500 leading-relaxed">
                            {project?.description?.slice(0, 25) || 'Sample text...'}
                          </div>
                          <div className="pt-1 border-t border-slate-100 mt-2 text-[10px] text-slate-400 font-medium">
                            {designSystem.typography?.heading_font || 'Inter'} + {designSystem.typography?.body_font || 'Inter'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Spacing</h4>
                        <div className="flex items-end gap-1 h-[88px] pt-4">
                          <div className="h-6 w-2 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">8</span>
                          </div>
                          <div className="h-6 w-4 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">16</span>
                          </div>
                          <div className="h-6 w-6 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">24</span>
                          </div>
                          <div className="h-6 w-8 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">32</span>
                          </div>
                          <div className="h-6 w-12 bg-slate-200 rounded relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono">48</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        {pages.length} pages
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Code2 className="w-3.5 h-3.5 text-slate-400" />
                        8 Components
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-white border-t border-slate-100">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ) : (
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                  <div className="text-center py-8">
                    <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 mb-4">No design system yet</p>
                    <button 
                      onClick={() => navigate(createPageUrl('CreateDesignSystem'))}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Design System
                    </button>
                  </div>
                </section>
              )}

              {/* Project TODOs Card */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-semibold text-slate-900">Project TODOs</h2>
                  </div>
                  <button 
                    onClick={() => setAddingTodo(true)}
                    className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable todo list - fixed height container */}
                <div className="relative max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar" style={{ maxHeight: '600px' }}>
                  <div className="space-y-3 pb-2">
                  {addingTodo && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3 mb-4">
                      <input
                        type="text"
                        placeholder="Todo title"
                        value={newTodoForm.title}
                        onChange={(e) => setNewTodoForm({ ...newTodoForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <textarea
                        placeholder="Beschrijving (optioneel)"
                        value={newTodoForm.description}
                        onChange={(e) => setNewTodoForm({ ...newTodoForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Category"
                          value={newTodoForm.category}
                          onChange={(e) => setNewTodoForm({ ...newTodoForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="date"
                          value={newTodoForm.due_date}
                          onChange={(e) => setNewTodoForm({ ...newTodoForm, due_date: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <select
                        value={newTodoForm.priority}
                        onChange={(e) => setNewTodoForm({ ...newTodoForm, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => createTodoMutation.mutate({ 
                            task: newTodoForm.title, // Map title to task (database field)
                            description: newTodoForm.description || null,
                            project: projectId,
                            completed: false
                          })}
                          disabled={!newTodoForm.title.trim() || createTodoMutation.isPending}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Add Todo
                        </button>
                        <button
                          onClick={() => setAddingTodo(false)}
                          className="px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sort todos: incomplete first, completed last */}
                  {[...projectTodos]
                    .sort((a, b) => {
                      // Completed todos go to bottom
                      if (a.completed && !b.completed) return 1;
                      if (!a.completed && b.completed) return -1;
                      // Within same completion status, sort by created_date (newest first for incomplete, oldest first for completed)
                      const dateA = new Date(a.created_date || 0);
                      const dateB = new Date(b.created_date || 0);
                      return a.completed ? dateA - dateB : dateB - dateA;
                    })
                    .map((todo) => {
                    const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed;
                    const dueDate = todo.due_date ? new Date(todo.due_date) : null;
                    const isToday = dueDate && dueDate.toDateString() === new Date().toDateString();

                    return (
                      <div key={todo.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={(e) => toggleTodoMutation.mutate({ id: todo.id, completed: e.target.checked })}
                          className="w-4 h-4 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {todo.task}
                          </div>
                          {todo.description && (
                            <div className={`text-xs mt-1 ${todo.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                              {todo.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            {todo.due_date && (
                              <span className={`${isOverdue ? 'text-red-600 font-semibold' : isToday ? 'text-orange-600 font-semibold' : ''}`}>
                                {isToday ? 'Today' : isOverdue ? `Dec ${dueDate.getDate()}` : `Dec ${dueDate.getDate()}`}
                              </span>
                            )}
                            {todo.category && (
                              <>
                                <span>•</span>
                                <span>{todo.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {todo.priority === 'High' && !todo.completed && (
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        )}
                      </div>
                    );
                  })}

                  {projectTodos.length === 0 && !addingTodo && (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      No todos yet
                    </div>
                  )}
                  </div>
                </div>
              </section>

            </div>

            {/* Recent Activity */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                </div>
              </div>

              <div className="relative space-y-8 pl-2">
                <div className="absolute left-[9px] top-2 bottom-4 w-[1px] bg-slate-100"></div>

                {(() => {
                  const activities = [];

                  // Add pages activities
                  pages.forEach(page => {
                    activities.push({
                      id: `page-${page.id}`,
                      icon: page.status === 'Done' ? CheckCircle2 : FileText,
                      color: page.status === 'Done' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600',
                      title: page.status === 'Done' ? 'Page Completed' : 'Page Updated',
                      description: page.name,
                      timestamp: new Date(page.updated_date)
                    });
                  });

                  // Add features activities
                  features.forEach(feature => {
                    activities.push({
                      id: `feature-${feature.id}`,
                      icon: feature.status === 'Done' ? CheckCircle2 : Sparkles,
                      color: feature.status === 'Done' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600',
                      title: feature.status === 'Done' ? 'Feature Completed' : 'Feature Updated',
                      description: feature.name,
                      timestamp: new Date(feature.updated_date)
                    });
                  });

                  // Add flows activities
                  flows.forEach(flow => {
                    activities.push({
                      id: `flow-${flow.id}`,
                      icon: GitMerge,
                      color: 'bg-indigo-100 text-indigo-600',
                      title: 'Flow Created',
                      description: flow.name,
                      timestamp: new Date(flow.created_date)
                    });
                  });

                  // Add todos activities
                  projectTodos.filter(t => t.completed).forEach(todo => {
                    activities.push({
                      id: `todo-${todo.id}`,
                      icon: Check,
                      color: 'bg-green-100 text-green-600',
                      title: 'Todo Completed',
                      description: todo.task,
                      timestamp: new Date(todo.updated_date)
                    });
                  });

                  // Add project creation
                  activities.push({
                    id: 'project-created',
                    icon: Check,
                    color: 'bg-emerald-100 text-emerald-600',
                    title: 'Project Created',
                    description: `${project.name} was initialized`,
                    timestamp: new Date(project.created_date)
                  });

                  // Sort by timestamp and take top 5
                  const sortedActivities = activities
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 5);

                  const getRelativeTime = (date) => {
                    const now = new Date();
                    const diff = now - date;
                    const minutes = Math.floor(diff / 60000);
                    const hours = Math.floor(diff / 3600000);
                    const days = Math.floor(diff / 86400000);

                    if (minutes < 1) return 'just now';
                    if (minutes < 60) return `${minutes}m ago`;
                    if (hours < 24) return `${hours}h ago`;
                    return `${days}d ago`;
                  };

                  return sortedActivities.map(activity => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="relative flex gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center z-10 ring-1 ring-slate-100 ${activity.color}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-900"><span className="font-semibold">{activity.title}</span></div>
                          <div className="text-sm text-slate-500">{activity.description}</div>
                          <div className="text-xs text-slate-400 mt-1">{getRelativeTime(activity.timestamp)}</div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AI Assistant */}
            <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-900">AI Assistant</h2>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={generateProjectSummary}
                  disabled={loadingAI}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white border border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">Project Summary</div>
                    <div className="text-xs text-slate-500">AI-powered status overview</div>
                  </div>
                </button>
                <button 
                  onClick={detectProjectRisks}
                  disabled={loadingAI}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white border border-orange-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all text-left group disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Bug className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">Detect Risks</div>
                    <div className="text-xs text-slate-500">Find potential issues</div>
                  </div>
                </button>
                {loadingAI && (
                  <div className="text-xs text-center text-purple-600 py-2 flex items-center justify-center gap-2">
                    <Loader className="w-3 h-3 animate-spin" />
                    AI analyzing...
                  </div>
                )}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate(createPageUrl('CreatePage'))}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Design in Aura</div>
                    <div className="text-xs text-slate-500">Create new page design</div>
                  </div>
                </button>
                <button 
                  onClick={() => navigate(createPageUrl('CreatePage'))}
                  className="w-full py-2.5 mt-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  + Create New Page
                </button>
              </div>
            </section>

            {/* Project Pages */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Project Pages</h2>
                <span className="text-xs font-medium text-slate-500">{pages.length} total</span>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {pages.length > 0 ? (
                  pages.map(page => (
                    <Link
                      key={page.id}
                      to={createPageUrl('PageDetail') + '?id=' + page.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-white transition-colors">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{page.name}</div>
                          <div className="text-xs text-slate-500">{page.status}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    No pages yet
                  </div>
                )}
              </div>
            </section>

            {/* Design System */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900">Design System</h2>
                </div>
                <button 
                  onClick={() => navigate(createPageUrl('DesignSystems'))}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  View
                </button>
              </div>
              <button 
                onClick={() => navigate(createPageUrl('CreateDesignSystem'))}
                className="w-full py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Create Design System
              </button>
            </section>

          </div>
        </div>

      </div>

      {/* AI Panel */}
      {showAIPanel && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAIPanel(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">AI Project Assistant</h2>
                    <p className="text-purple-100 text-sm">Insights and recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Project Summary */}
              {aiSummary && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Project Summary</h3>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">{aiSummary.summary}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Achievements</div>
                      <ul className="space-y-1">
                        {aiSummary.key_achievements?.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <Check className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Next Steps</div>
                      <ul className="space-y-1">
                        {aiSummary.next_steps?.map((step, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-blue-600 mt-0.5 shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Overall Health</div>
                    <div className="text-sm font-semibold text-blue-700">{aiSummary.overall_health}</div>
                  </div>
                </div>
              )}

              {/* Risks */}
              {aiRisks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bug className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-slate-900">Detected Risks</h3>
                  </div>
                  <div className="space-y-3">
                    {aiRisks.map((risk, idx) => (
                      <div key={idx} className={`border-l-4 rounded-lg p-4 ${
                        risk.severity === 'High' ? 'bg-red-50 border-red-500' :
                        risk.severity === 'Medium' ? 'bg-orange-50 border-orange-500' :
                        'bg-yellow-50 border-yellow-500'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900 text-sm">{risk.title}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            risk.severity === 'High' ? 'bg-red-200 text-red-800' :
                            risk.severity === 'Medium' ? 'bg-orange-200 text-orange-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{risk.description}</p>
                        <div className="bg-white/60 rounded-lg p-2 border border-slate-200">
                          <div className="text-xs font-bold text-slate-500 mb-1">Recommendation:</div>
                          <p className="text-xs text-slate-700">{risk.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Task Breakdown */}
              {aiTaskBreakdown && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckSquare className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-slate-900">Task Breakdown</h3>
                  </div>
                  <div className="space-y-2">
                    {aiTaskBreakdown.tasks?.map((task, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-slate-900 text-sm">{task.task}</h4>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              task.priority === 'High' ? 'bg-red-100 text-red-700' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-slate-500">{task.estimated_hours}h</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600">{task.description}</p>
                      </div>
                    ))}
                  </div>
                  {aiTaskBreakdown.notes && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-xs font-bold text-blue-900 mb-1">Notes:</div>
                      <p className="text-xs text-blue-800">{aiTaskBreakdown.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    generateProjectSummary();
                    detectProjectRisks();
                  }}
                  disabled={loadingAI}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingAI ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Refresh Analysis
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Paste Structure Dialog */}
      {showPasteDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowPasteDialog(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Paste Structure</h2>
                    <p className="text-green-100 text-sm">Import your app structure from text</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasteDialog(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Paste your structure here
                </label>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`Example format:
DealMaker App
│
├─ 🔐 AUTHENTICATION FLOW
│  ├─ Splash Screen
│  ├─ Login
│  └─ Signup
│
├─ 🏠 MAIN APP FLOW
│  ├─ Dashboard
│  └─ Profile`}
                  className="w-full h-[300px] px-4 py-3 border-2 border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  autoFocus
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-green-900">
                    <strong className="font-semibold">Tip:</strong> Items with "FLOW" or ALL CAPS will be treated as folders. Other items will be files.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPasteDialog(false);
                    setPasteText('');
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasteStructure}
                  disabled={!pasteText.trim()}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Import Structure
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Paste Knowledge Dialog */}
      {showPasteKnowledgeDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowPasteKnowledgeDialog(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Plak Knowledge Base Items</h2>
                    <p className="text-amber-100 text-sm">Importeer je knowledge base items</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasteKnowledgeDialog(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Knowledge Base Items
                </label>
                <textarea
                  value={knowledgePasteText}
                  onChange={(e) => setKnowledgePasteText(e.target.value)}
                  placeholder={`Bijvoorbeeld:
      Architecture: Microservices setup
      Best Practices: Code review guidelines
      API Documentation: REST API endpoints
      Security: Authentication flow
      Tech Stack: React + Node.js setup`}
                  className="w-full h-[300px] px-4 py-3 border-2 border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  autoFocus
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <strong className="font-semibold">Tip:</strong> Voeg "Category: " voor elke regel toe om automatisch te categoriseren (Architecture, Best Practices, API Documentation, Design Guidelines, Tech Stack, Security).
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPasteKnowledgeDialog(false);
                    setKnowledgePasteText('');
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handlePasteKnowledge}
                  disabled={!knowledgePasteText.trim() || importingKnowledge}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg text-sm font-bold hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {importingKnowledge ? 'Importeren...' : 'Importeer Items'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Paste Scenarios Dialog */}
      {showPasteScenariosDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowPasteScenariosDialog(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Paste Scenarios</h2>
                    <p className="text-purple-100 text-sm">Import your list of scenarios</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasteScenariosDialog(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Scenarios List
                </label>
                <textarea
                  value={scenarioPasteText}
                  onChange={(e) => setScenarioPasteText(e.target.value)}
                  placeholder={`Example format:
Practice Scenarios
│
├─ NEGOTIATION SCENARIOS
│  ├─ Salary increase discussion
│  ├─ Contract negotiation
│  └─ Price reduction request
│
├─ SALES SCENARIOS
│  ├─ Cold call pitch
│  └─ Closing techniques`}
                  className="w-full h-[300px] px-4 py-3 border-2 border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  autoFocus
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-purple-900">
                    <strong className="font-semibold">Tip:</strong> Use the same tree format as App Structure. Items with "SCENARIOS" or ALL CAPS will be folders.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPasteScenariosDialog(false);
                    setScenarioPasteText('');
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasteScenarios}
                  disabled={!scenarioPasteText.trim()}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-bold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Import Scenarios
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Flow Dialog */}
      {showNewFlowDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowNewFlowDialog(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <GitMerge className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Create New Flow</h2>
                    <p className="text-blue-100 text-sm">Organize your pages into a flow</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewFlowDialog(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Flow Name
                </label>
                <input
                  type="text"
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  placeholder="e.g., User Onboarding, Checkout Process"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFlowName.trim()) {
                      createFlowMutation.mutate({ 
                        project: projectId, 
                        name: newFlowName, 
                        order: flows.length 
                      });
                    }
                  }}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900">
                    <strong className="font-semibold">Tip:</strong> Name your flow based on the user journey or feature set it represents.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowNewFlowDialog(false);
                    setNewFlowName('');
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newFlowName.trim()) {
                      createFlowMutation.mutate({ 
                        project: projectId, 
                        name: newFlowName, 
                        order: flows.length 
                      });
                    }
                  }}
                  disabled={!newFlowName.trim() || createFlowMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {createFlowMutation.isPending ? 'Creating...' : 'Create Flow'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}