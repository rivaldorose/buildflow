import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, ChevronDown, MousePointer2, PlusSquare, Zap, Type, Trash2, Menu, Layers, 
  Minus, Plus, Grid, Save, Search, GripVertical, CreditCard, User, Bell, 
  Play, HelpCircle, Check, Lock, UserPlus, RefreshCw, LayoutDashboard, 
  Mail, Lock as LockIcon, Layout, MoreHorizontal, X, Image, RotateCcw,
  ShieldCheck, Keyboard, Edit2, Copy, Home, Settings, ShoppingCart,
  Database, Cloud, Server, Smartphone, Users, FileText, Folder, Calendar,
  MessageSquare, Heart, Star, Upload, Download, Eye, EyeOff,
  Filter, BookOpen, Package, TrendingUp, Award, Briefcase, Camera, Video,
  Sparkles, Loader2, Send, Lightbulb, CheckCircle2, Mic
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import WireframesView from '../components/flowbuilder/WireframesView';

export default function FlowBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flow');
  const [selectedNode, setSelectedNode] = useState('login');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connectionPos, setConnectionPos] = useState({ x: 0, y: 0 });
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSaved, setLastSaved] = useState(new Date());
  const [editingText, setEditingText] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('flowBuilder_templates');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAIFlowDialog, setShowAIFlowDialog] = useState(false);
  const [aiFlowPrompt, setAiFlowPrompt] = useState('');
  const [isGeneratingFlow, setIsGeneratingFlow] = useState(false);
  const [expandedTemplateCategory, setExpandedTemplateCategory] = useState(null);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const iconLibrary = {
    'Auth & Users': [
      { icon: Lock, name: 'Login' },
      { icon: UserPlus, name: 'Signup' },
      { icon: User, name: 'Profile' },
      { icon: Users, name: 'Team' },
      { icon: Eye, name: 'View' },
      { icon: EyeOff, name: 'Hidden' },
      { icon: ShieldCheck, name: 'Security' }
    ],
    'Navigation': [
      { icon: Home, name: 'Home' },
      { icon: LayoutDashboard, name: 'Dashboard' },
      { icon: Settings, name: 'Settings' },
      { icon: Menu, name: 'Menu' },
      { icon: Layout, name: 'Page' },
      { icon: Layers, name: 'Layers' }
    ],
    'Commerce': [
      { icon: ShoppingCart, name: 'Cart' },
      { icon: CreditCard, name: 'Payment' },
      { icon: Package, name: 'Product' },
      { icon: TrendingUp, name: 'Sales' },
      { icon: Award, name: 'Rewards' }
    ],
    'Data & Files': [
      { icon: Database, name: 'Database' },
      { icon: Server, name: 'Server' },
      { icon: Cloud, name: 'Cloud' },
      { icon: FileText, name: 'Document' },
      { icon: Folder, name: 'Folder' },
      { icon: Upload, name: 'Upload' },
      { icon: Download, name: 'Download' }
    ],
    'Communication': [
      { icon: Mail, name: 'Email' },
      { icon: MessageSquare, name: 'Chat' },
      { icon: Bell, name: 'Notifications' },
      { icon: Calendar, name: 'Calendar' },
      { icon: Smartphone, name: 'Mobile' }
    ],
    'Media': [
      { icon: Image, name: 'Image' },
      { icon: Camera, name: 'Camera' },
      { icon: Video, name: 'Video' },
      { icon: BookOpen, name: 'Content' }
    ],
    'Actions': [
      { icon: Play, name: 'Start' },
      { icon: Check, name: 'Complete' },
      { icon: HelpCircle, name: 'Decision' },
      { icon: RefreshCw, name: 'Refresh' },
      { icon: Filter, name: 'Filter' },
      { icon: Heart, name: 'Favorite' },
      { icon: Star, name: 'Featured' },
      { icon: Briefcase, name: 'Business' }
    ]
  };

  const iconMap = { 
    Lock, UserPlus, User, Users, Eye, EyeOff, ShieldCheck, Home, LayoutDashboard, 
    Settings, Menu, Layout, Layers, ShoppingCart, CreditCard, Package, TrendingUp, 
    Award, Database, Server, Cloud, FileText, Folder, Upload, Download, Mail, 
    MessageSquare, Bell, Calendar, Smartphone, Image, Camera, Video, BookOpen, 
    Play, Check, HelpCircle, RefreshCw, Filter, Heart, Star, Briefcase, Type, Edit2 
  };

  const flowNodes = [
    { id: 'start', name: 'Start', type: 'start', x: 150, y: 360, status: 'complete' },
    { id: 'login', name: 'Login Screen', type: 'page', icon: Lock, iconName: 'Lock', x: 310, y: 330, status: 'complete', variants: 4 },
    { id: 'signup', name: 'Signup Screen', type: 'page', icon: UserPlus, iconName: 'UserPlus', x: 650, y: 330, status: 'complete', flows: 2 },
    { id: 'forgot', name: 'Forgot Password', type: 'page', icon: HelpCircle, iconName: 'HelpCircle', x: 550, y: 510, status: 'progress' },
    { id: 'reset', name: 'Reset Password', type: 'page', icon: RefreshCw, iconName: 'RefreshCw', x: 890, y: 510, status: 'designed' },
    { id: 'decision', name: 'Verified?', type: 'decision', icon: ShieldCheck, iconName: 'ShieldCheck', x: 950, y: 350 },
    { id: 'verify', name: 'Verify Email', type: 'page', icon: Mail, iconName: 'Mail', x: 930, y: 520, status: 'pending' },
    { id: 'end', name: 'App', type: 'end', icon: LayoutDashboard, iconName: 'LayoutDashboard', x: 1110, y: 360 }
  ];

  const defaultConnections = [
    { from: 'start', to: 'login' },
    { from: 'login', to: 'signup' },
    { from: 'login', to: 'forgot' },
    { from: 'forgot', to: 'reset' },
    { from: 'signup', to: 'decision' },
    { from: 'decision', to: 'end' },
    { from: 'decision', to: 'verify' }
  ];

  // Load from localStorage or use defaults
  const loadNodesFromStorage = () => {
    const saved = localStorage.getItem('flowBuilder_nodes');
    if (!saved) return flowNodes;
    
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(node => ({
        ...node,
        icon: node.iconName ? iconMap[node.iconName] : (node.icon || Layout)
      }));
    } catch {
      return flowNodes;
    }
  };

  const loadConnectionsFromStorage = () => {
    const saved = localStorage.getItem('flowBuilder_connections');
    if (!saved) return defaultConnections;
    
    try {
      return JSON.parse(saved);
    } catch {
      return defaultConnections;
    }
  };

  const [nodes, setNodes] = useState(loadNodesFromStorage);
  const [connections, setConnections] = useState(loadConnectionsFromStorage);

  const availablePages = [
    { id: 'payment', name: 'Payment Method', icon: CreditCard, flow: 'Checkout Flow' },
    { id: 'profile', name: 'Profile Settings', icon: User, flow: 'Settings Flow' },
    { id: 'notifications', name: 'Notifications', icon: Bell, flow: 'Settings Flow' }
  ];

  const handleDragStart = (e, page) => {
    // Store icon name instead of component reference for serialization
    const serializedPage = {
      ...page,
      iconName: page.icon?.name || 'Layout'
    };
    delete serializedPage.icon;
    e.dataTransfer.setData('pageTemplate', JSON.stringify(serializedPage));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const pageData = e.dataTransfer.getData('pageTemplate');
    if (!pageData) return;
    
    const page = JSON.parse(pageData);
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left - pan.x) / (zoom / 100);
    const y = (e.clientY - canvasRect.top - pan.y) / (zoom / 100);
    
    // Restore icon component from name
    let iconComponent = page.icon;
    if (page.iconName) {
      iconComponent = iconMap[page.iconName] || Layout;
    }
    
    const newNode = {
      id: `node_${Date.now()}`,
      name: page.name,
      type: page.type || 'page',
      icon: iconComponent,
      iconName: iconComponent?.name || 'Layout',
      x: x - 120,
      y: y - 70,
      status: page.status || 'pending',
      fontSize: page.fontSize,
      color: page.color,
      textColor: page.textColor
    };
    
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !spacePressed) {
        e.preventDefault();
        setSpacePressed(true);
      }
      // Delete selected node with Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode && !e.target.matches('input, textarea')) {
        e.preventDefault();
        handleDeleteNode(selectedNode);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(false);
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spacePressed, selectedNode]);

  // Auto-save functionality
  React.useEffect(() => {
    const saveTimer = setTimeout(() => {
      // Serialize nodes with iconName instead of icon component
      const nodesToSave = nodes.map(node => ({
        ...node,
        iconName: node.icon?.name || node.iconName || 'Layout',
        icon: undefined
      }));
      
      localStorage.setItem('flowBuilder_nodes', JSON.stringify(nodesToSave));
      localStorage.setItem('flowBuilder_connections', JSON.stringify(connections));
      setLastSaved(new Date());
    }, 1000);
    return () => clearTimeout(saveTimer);
  }, [nodes, connections]);

  const handleCanvasMouseDown = (e) => {
    if (spacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
    if (draggingNode) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left - pan.x - dragOffset.x) / (zoom / 100);
      const y = (e.clientY - canvasRect.top - pan.y - dragOffset.y) / (zoom / 100);
      setNodes(nodes.map(n => n.id === draggingNode ? { ...n, x, y } : n));
    }
    if (connectingFrom) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      setConnectionPos({
        x: (e.clientX - canvasRect.left - pan.x) / (zoom / 100),
        y: (e.clientY - canvasRect.top - pan.y) / (zoom / 100)
      });
    }
  };

  const handleCanvasMouseUp = (e) => {
    setIsPanning(false);
    setDraggingNode(null);
    if (connectingFrom) {
      setConnectingFrom(null);
    }
  };

  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    if (!spacePressed) {
      const node = nodes.find(n => n.id === nodeId);
      const canvasRect = e.currentTarget.closest('main').getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - canvasRect.left - pan.x) / (zoom / 100) - node.x,
        y: (e.clientY - canvasRect.top - pan.y) / (zoom / 100) - node.y
      });
      setDraggingNode(nodeId);
      setSelectedNode(nodeId);
    }
  };

  const handleConnectionStart = (e, nodeId) => {
    e.stopPropagation();
    setConnectingFrom(nodeId);
  };

  const handleConnectionEnd = (e, targetNodeId) => {
    e.stopPropagation();
    if (connectingFrom && connectingFrom !== targetNodeId) {
      const exists = connections.find(c => c.from === connectingFrom && c.to === targetNodeId);
      if (!exists) {
        setConnections([...connections, { from: connectingFrom, to: targetNodeId }]);
      }
    }
    setConnectingFrom(null);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleDeleteConnection = (from, to) => {
    setConnections(connections.filter(c => !(c.from === from && c.to === to)));
  };

  const handleAddNode = (type, x, y) => {
    const iconForType = type === 'page' ? Layout : 
          type === 'decision' ? HelpCircle : 
          type === 'start' ? Play : 
          type === 'end' ? Check :
          type === 'text' ? Type :
          type === 'note' ? Edit2 : Layout;
    
    const newNode = {
      id: `node_${Date.now()}`,
      name: type === 'page' ? 'New Page' : 
            type === 'decision' ? 'Decision' : 
            type === 'start' ? 'Start' : 
            type === 'end' ? 'End' :
            type === 'text' ? 'Klik om te bewerken' :
            type === 'note' ? 'Nieuwe notitie' : 'New Node',
      type: type,
      x: x || 500 + Math.random() * 200,
      y: y || 300 + Math.random() * 200,
      status: 'pending',
      icon: iconForType,
      iconName: iconForType.name,
      fontSize: type === 'text' ? 16 : 12,
      color: type === 'note' ? '#FEF3C7' : type === 'text' ? '#1E293B' : undefined,
      textColor: type === 'text' ? '#1E293B' : '#374151'
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
    setShowNodeMenu(false);
    if (type === 'text') {
      setEditingText(newNode.id);
    }
  };

  const handleCanvasDoubleClick = (e) => {
    if (spacePressed) return;
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left - pan.x) / (zoom / 100);
    const y = (e.clientY - canvasRect.top - pan.y) / (zoom / 100);
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowNodeMenu(true);
  };

  const handleUpdateNode = (nodeId, updates) => {
    setNodes(nodes.map(n => {
      if (n.id === nodeId) {
        const updated = { ...n, ...updates };
        if (updates.icon) {
          updated.iconName = updates.icon.name;
        }
        return updated;
      }
      return n;
    }));
  };

  const handleSaveAsTemplate = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const templateName = prompt('Template naam:', node.name + ' Template');
    if (!templateName) return;
    
    // Store icon name for serialization
    const nodeForStorage = { 
      ...node, 
      id: undefined, 
      x: undefined, 
      y: undefined,
      iconName: node.icon?.name || 'Layout'
    };
    delete nodeForStorage.icon;
    
    const template = {
      id: `template_${Date.now()}`,
      name: templateName,
      node: nodeForStorage
    };
    
    const newTemplates = [...templates, template];
    setTemplates(newTemplates);
    localStorage.setItem('flowBuilder_templates', JSON.stringify(newTemplates));
  };

  const handleLoadTemplate = (template) => {
    const iconComponent = template.node.iconName ? iconMap[template.node.iconName] : Layout;
    
    const newNode = {
      ...template.node,
      id: `node_${Date.now()}`,
      x: 500 + Math.random() * 200,
      y: 300 + Math.random() * 200,
      icon: iconComponent,
      iconName: iconComponent.name
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  const handleDeleteTemplate = (templateId) => {
    const newTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(newTemplates);
    localStorage.setItem('flowBuilder_templates', JSON.stringify(newTemplates));
  };

  const handleGenerateFlow = async () => {
    if (!aiFlowPrompt.trim()) return;
    
    setIsGeneratingFlow(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a complete user flow for: ${aiFlowPrompt}

Create a logical sequence of nodes representing the user journey. Return a JSON structure with:
- nodes: array of nodes, each with:
  - name: node name (e.g., "Email Input", "Login Button", "Dashboard")
  - type: "start" | "page" | "decision" | "end"
  - iconName: one of: Lock, UserPlus, User, Mail, Check, Play, HelpCircle, Layout, ShieldCheck, CreditCard, Settings, Database, Bell, Calendar
- connections: array of connections, each with:
  - from: index of source node
  - to: index of target node

Example for "User Signup Flow":
{
  "nodes": [
    {"name": "Start", "type": "start", "iconName": "Play"},
    {"name": "Email Input", "type": "page", "iconName": "Mail"},
    {"name": "Password Input", "type": "page", "iconName": "Lock"},
    {"name": "Signup Button", "type": "page", "iconName": "UserPlus"},
    {"name": "Verification Sent", "type": "page", "iconName": "Check"},
    {"name": "Complete", "type": "end", "iconName": "Check"}
  ],
  "connections": [
    {"from": 0, "to": 1},
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 3, "to": 4},
    {"from": 4, "to": 5}
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            nodes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  iconName: { type: "string" }
                }
              }
            },
            connections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  from: { type: "number" },
                  to: { type: "number" }
                }
              }
            }
          }
        }
      });

      // Convert AI response to nodes and connections
      const iconMap = { Lock, UserPlus, User, Users, Eye, EyeOff, ShieldCheck, Home, LayoutDashboard, Settings, Menu, Layout, Layers, ShoppingCart, CreditCard, Package, TrendingUp, Award, Database, Server, Cloud, FileText, Folder, Upload, Download, Mail, MessageSquare, Bell, Calendar, Smartphone, Image, Camera, Video, BookOpen, Play, Check, HelpCircle, RefreshCw, Filter, Heart, Star, Briefcase };
      
      const newNodes = response.nodes.map((aiNode, index) => {
        const iconComponent = iconMap[aiNode.iconName] || Layout;
        return {
          id: `ai_node_${Date.now()}_${index}`,
          name: aiNode.name,
          type: aiNode.type,
          icon: iconComponent,
          iconName: iconComponent.name,
          x: 200 + (index * 250),
          y: 300 + (Math.sin(index) * 100),
          status: aiNode.type === 'start' || aiNode.type === 'end' ? 'complete' : 'pending'
        };
      });

      const nodeIdMapping = newNodes.map(n => n.id);
      const newConnections = response.connections.map(conn => ({
        from: nodeIdMapping[conn.from],
        to: nodeIdMapping[conn.to]
      }));

      setNodes([...nodes, ...newNodes]);
      setConnections([...connections, ...newConnections]);
      setShowAIFlowDialog(false);
      setAiFlowPrompt('');

    } catch (error) {
      console.error('Failed to generate flow:', error);
    } finally {
      setIsGeneratingFlow(false);
    }
  };

  const templateCategories = [
    {
      id: 'auth',
      name: 'Authentication',
      icon: Lock,
      templates: [
        { name: 'Login Screen', icon: Lock, components: ['Email input', 'Password input', 'Login button', 'Social login'] },
        { name: 'Signup Screen', icon: UserPlus, components: ['Name inputs', 'Email', 'Password', 'Terms checkbox'] },
        { name: 'Forgot Password', icon: HelpCircle, components: ['Email input', 'Send reset link'] },
        { name: 'Email Verification', icon: Mail, components: ['Verification message', 'Resend button'] },
        { name: 'Two-Factor Auth', icon: ShieldCheck, components: ['6-digit code', 'Verify button'] },
        { name: 'Reset Password', icon: RefreshCw, components: ['New password', 'Confirm password', 'Submit'] },
        { name: 'Phone Verification', icon: Smartphone, components: ['Phone input', 'OTP code', 'Verify'] },
        { name: 'Social Login', icon: Users, components: ['Google', 'Facebook', 'Apple', 'Twitter'] },
        { name: 'Biometric Auth', icon: ShieldCheck, components: ['Fingerprint', 'Face ID', 'Fallback'] },
        { name: 'Welcome Screen', icon: Star, components: ['Hero image', 'Welcome message', 'Get started'] }
      ]
    },
    {
      id: 'main',
      name: 'Main Screens',
      icon: LayoutDashboard,
      templates: [
        { name: 'Dashboard', icon: LayoutDashboard, components: ['Stats cards', 'Quick actions', 'Activity feed'] },
        { name: 'Feed Timeline', icon: Layout, components: ['Post items', 'Like/comment', 'Create post'] },
        { name: 'Search Screen', icon: Search, components: ['Search bar', 'Filters', 'Results list'] },
        { name: 'Profile Screen', icon: User, components: ['Avatar', 'Bio', 'Stats', 'Content tabs'] },
        { name: 'Settings', icon: Settings, components: ['Setting groups', 'Toggles', 'Links'] },
        { name: 'Notifications', icon: Bell, components: ['Notification list', 'Mark read', 'Filters'] },
        { name: 'Messages Inbox', icon: MessageSquare, components: ['Conversations', 'Search', 'Compose'] },
        { name: 'Chat Detail', icon: MessageSquare, components: ['Message bubbles', 'Input', 'Send'] },
        { name: 'Home Screen', icon: Home, components: ['Hero section', 'Featured items', 'Categories'] },
        { name: 'About Page', icon: BookOpen, components: ['Company info', 'Team', 'Mission'] },
        { name: 'Contact Page', icon: Mail, components: ['Contact form', 'Map', 'Info'] },
        { name: 'FAQ Screen', icon: HelpCircle, components: ['Question list', 'Search', 'Categories'] }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce',
      icon: ShoppingCart,
      templates: [
        { name: 'Product Catalog', icon: ShoppingCart, components: ['Product grid', 'Filters', 'Sort', 'Cart'] },
        { name: 'Product Detail', icon: Package, components: ['Image carousel', 'Variants', 'Add to cart'] },
        { name: 'Shopping Cart', icon: ShoppingCart, components: ['Cart items', 'Quantity', 'Totals'] },
        { name: 'Checkout', icon: CreditCard, components: ['Shipping', 'Payment', 'Review'] },
        { name: 'Order History', icon: FileText, components: ['Order list', 'Track order', 'Reorder'] },
        { name: 'Wishlist', icon: Heart, components: ['Saved items', 'Move to cart', 'Remove'] },
        { name: 'Order Tracking', icon: Package, components: ['Status timeline', 'Map', 'Details'] },
        { name: 'Product Reviews', icon: Star, components: ['Rating', 'Review list', 'Write review'] },
        { name: 'Store Locator', icon: Home, components: ['Map', 'Store list', 'Directions'] },
        { name: 'Loyalty Program', icon: Award, components: ['Points', 'Rewards', 'Redeem'] }
      ]
    },
    {
      id: 'productivity',
      name: 'Productivity',
      icon: CheckCircle2,
      templates: [
        { name: 'To-Do List', icon: CheckCircle2, components: ['Task items', 'Checkboxes', 'Add task'] },
        { name: 'Calendar View', icon: Calendar, components: ['Calendar grid', 'Event list', 'Add event'] },
        { name: 'Notes Editor', icon: FileText, components: ['Title', 'Rich text editor', 'Formatting'] },
        { name: 'Kanban Board', icon: Layers, components: ['Columns', 'Draggable cards', 'Add card'] },
        { name: 'Project Dashboard', icon: Briefcase, components: ['Progress', 'Milestones', 'Team'] },
        { name: 'Time Tracker', icon: Calendar, components: ['Timer', 'Entries', 'Reports'] },
        { name: 'File Manager', icon: Folder, components: ['Folder tree', 'Files', 'Upload'] },
        { name: 'Team Workspace', icon: Users, components: ['Members', 'Projects', 'Activity'] }
      ]
    },
    {
      id: 'content',
      name: 'Content & Media',
      icon: Video,
      templates: [
        { name: 'Video Player', icon: Video, components: ['Video', 'Controls', 'Quality selector'] },
        { name: 'Audio Player', icon: Mic, components: ['Artwork', 'Controls', 'Progress bar'] },
        { name: 'Photo Gallery', icon: Image, components: ['Photo grid', 'Albums', 'Multi-select'] },
        { name: 'Camera', icon: Camera, components: ['Preview', 'Shutter', 'Filters', 'Flash'] },
        { name: 'Blog Post', icon: BookOpen, components: ['Header', 'Content', 'Comments', 'Share'] },
        { name: 'News Feed', icon: FileText, components: ['Article cards', 'Categories', 'Filters'] },
        { name: 'Podcast Player', icon: Mic, components: ['Episodes', 'Player', 'Subscribe'] },
        { name: 'Live Stream', icon: Video, components: ['Stream', 'Chat', 'Viewers'] }
      ]
    },
    {
      id: 'booking',
      name: 'Booking',
      icon: Calendar,
      templates: [
        { name: 'Listing Detail', icon: Home, components: ['Gallery', 'Info', 'Calendar', 'Reserve'] },
        { name: 'Booking Form', icon: Calendar, components: ['Dates', 'Guests', 'Payment', 'Confirm'] },
        { name: 'My Bookings', icon: FileText, components: ['Bookings list', 'Upcoming/past', 'Cancel'] },
        { name: 'Availability Calendar', icon: Calendar, components: ['Calendar', 'Time slots', 'Book'] },
        { name: 'Appointment Scheduler', icon: Calendar, components: ['Service select', 'Time picker', 'Confirm'] },
        { name: 'Venue Booking', icon: Home, components: ['Venue details', 'Amenities', 'Reserve'] },
        { name: 'Table Reservation', icon: Calendar, components: ['Restaurant info', 'Party size', 'Time'] }
      ]
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: CreditCard,
      templates: [
        { name: 'Wallet Balance', icon: CreditCard, components: ['Balance card', 'Quick actions', 'Transactions'] },
        { name: 'Send Money', icon: TrendingUp, components: ['Recipient', 'Amount', 'Confirm'] },
        { name: 'Transaction History', icon: FileText, components: ['Transaction list', 'Filters', 'Export'] },
        { name: 'Payment Method', icon: CreditCard, components: ['Card list', 'Add card', 'Set default'] },
        { name: 'Bill Payment', icon: FileText, components: ['Bill list', 'Pay bill', 'History'] },
        { name: 'Budget Tracker', icon: TrendingUp, components: ['Budget overview', 'Categories', 'Insights'] },
        { name: 'Investment Portfolio', icon: TrendingUp, components: ['Holdings', 'Performance', 'Trade'] }
      ]
    },
    {
      id: 'social',
      name: 'Social',
      icon: Users,
      templates: [
        { name: 'User Profile', icon: User, components: ['Avatar', 'Bio', 'Posts', 'Followers'] },
        { name: 'Friends List', icon: Users, components: ['Friend cards', 'Search', 'Requests'] },
        { name: 'Groups', icon: Users, components: ['Group list', 'Create', 'Join'] },
        { name: 'Events', icon: Calendar, components: ['Event cards', 'RSVP', 'Details'] },
        { name: 'Stories', icon: Camera, components: ['Story carousel', 'Add story', 'View'] },
        { name: 'Mentions & Tags', icon: User, components: ['Mention list', 'Filters', 'Reply'] },
        { name: 'Activity Feed', icon: Bell, components: ['Activity items', 'Filters', 'Mark read'] },
        { name: 'Share Dialog', icon: Send, components: ['Platform icons', 'Copy link', 'Email'] }
      ]
    },
    {
      id: 'health',
      name: 'Health & Fitness',
      icon: Heart,
      templates: [
        { name: 'Workout Tracker', icon: TrendingUp, components: ['Exercise list', 'Timer', 'Log'] },
        { name: 'Nutrition Log', icon: Calendar, components: ['Meal entries', 'Calories', 'Macros'] },
        { name: 'Sleep Tracker', icon: Calendar, components: ['Sleep graph', 'Duration', 'Quality'] },
        { name: 'Step Counter', icon: TrendingUp, components: ['Step count', 'Goals', 'History'] },
        { name: 'Water Intake', icon: Calendar, components: ['Glasses', 'Goal', 'Reminders'] },
        { name: 'Meditation Timer', icon: Calendar, components: ['Duration', 'Ambient sounds', 'Log'] },
        { name: 'Health Dashboard', icon: Heart, components: ['Metrics', 'Charts', 'Goals'] }
      ]
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: Camera,
      templates: [
        { name: 'Flight Search', icon: Smartphone, components: ['Origin/dest', 'Dates', 'Results'] },
        { name: 'Hotel Listing', icon: Home, components: ['Hotel cards', 'Filters', 'Map view'] },
        { name: 'Trip Planner', icon: Calendar, components: ['Itinerary', 'Activities', 'Notes'] },
        { name: 'Travel Checklist', icon: CheckCircle2, components: ['Checklist', 'Categories', 'Pack'] },
        { name: 'Currency Converter', icon: CreditCard, components: ['From/to', 'Amount', 'Rates'] },
        { name: 'Location Guide', icon: Home, components: ['Places', 'Tips', 'Photos'] }
      ]
    },
    {
      id: 'education',
      name: 'Education',
      icon: BookOpen,
      templates: [
        { name: 'Course Catalog', icon: BookOpen, components: ['Course cards', 'Categories', 'Enroll'] },
        { name: 'Lesson Player', icon: Play, components: ['Video', 'Notes', 'Quiz'] },
        { name: 'Quiz Screen', icon: HelpCircle, components: ['Questions', 'Timer', 'Submit'] },
        { name: 'Progress Tracker', icon: TrendingUp, components: ['Completion', 'Badges', 'Goals'] },
        { name: 'Study Flashcards', icon: FileText, components: ['Card', 'Flip', 'Next/prev'] },
        { name: 'Assignment List', icon: CheckCircle2, components: ['Assignments', 'Due dates', 'Submit'] },
        { name: 'Class Schedule', icon: Calendar, components: ['Schedule', 'Classes', 'Reminders'] }
      ]
    },
    {
      id: 'realEstate',
      name: 'Real Estate',
      icon: Home,
      templates: [
        { name: 'Property Listing', icon: Home, components: ['Property cards', 'Filters', 'Map'] },
        { name: 'Property Detail', icon: Image, components: ['Gallery', 'Details', 'Tour', 'Contact'] },
        { name: 'Mortgage Calculator', icon: CreditCard, components: ['Price', 'Down payment', 'Results'] },
        { name: 'Agent Profile', icon: User, components: ['Photo', 'Bio', 'Listings', 'Reviews'] },
        { name: 'Saved Properties', icon: Heart, components: ['Saved list', 'Compare', 'Notes'] },
        { name: 'Schedule Tour', icon: Calendar, components: ['Property', 'Date/time', 'Confirm'] }
      ]
    },
    {
      id: 'food',
      name: 'Food & Dining',
      icon: ShoppingCart,
      templates: [
        { name: 'Restaurant Menu', icon: FileText, components: ['Categories', 'Items', 'Add to order'] },
        { name: 'Recipe Detail', icon: BookOpen, components: ['Photo', 'Ingredients', 'Steps'] },
        { name: 'Food Delivery', icon: ShoppingCart, components: ['Restaurants', 'Menu', 'Checkout'] },
        { name: 'Grocery List', icon: CheckCircle2, components: ['Items', 'Categories', 'Check off'] },
        { name: 'Meal Planner', icon: Calendar, components: ['Weekly plan', 'Recipes', 'Shop list'] },
        { name: 'Nutrition Info', icon: FileText, components: ['Calories', 'Macros', 'Ingredients'] }
      ]
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: Play,
      templates: [
        { name: 'Game Lobby', icon: Users, components: ['Players', 'Start game', 'Settings'] },
        { name: 'Leaderboard', icon: Award, components: ['Rankings', 'Scores', 'Filter'] },
        { name: 'Player Profile', icon: User, components: ['Stats', 'Achievements', 'Friends'] },
        { name: 'Achievements', icon: Award, components: ['Achievement list', 'Progress', 'Rewards'] },
        { name: 'Game Store', icon: ShoppingCart, components: ['Games', 'Categories', 'Purchase'] },
        { name: 'Live Match', icon: Play, components: ['Match view', 'Scores', 'Chat'] }
      ]
    }
  ];

  const handleSelectTemplate = (template) => {
    const iconComponent = template.icon || Layout;
    const newNode = {
      id: `template_${Date.now()}`,
      name: template.name,
      type: 'page',
      icon: iconComponent,
      iconName: iconComponent.name,
      x: 500 + Math.random() * 200,
      y: 300 + Math.random() * 200,
      status: 'pending',
      components: template.components || []
    };
    
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  return (
    <div className="bg-[#F8FAFC] h-screen flex flex-col overflow-hidden select-none">
      
      {/* Top Navigation */}
      <nav className="shrink-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40 relative shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-4 w-[300px]">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Project</span>
            <select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value || null)}
              className="text-sm font-bold text-slate-900 bg-transparent border-none focus:outline-none cursor-pointer hover:text-blue-600 transition-colors appearance-none pr-5"
              style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3E%3Cpath fill=%27%2394a3b8%27 d=%27M1 1l5 5 5-5%27 stroke=%27%2394a3b8%27 stroke-width=%271.5%27 fill=%27none%27/%3E%3C/svg%3E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Center Tools */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center bg-slate-100/50 p-1 rounded-lg border border-slate-200 shadow-sm">
            <button className="p-1.5 rounded-md bg-white text-blue-600 shadow-sm ring-1 ring-slate-900/5" title="Select">
              <MousePointer2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => handleAddNode('page')}
              className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm transition-all" 
              title="Add Node"
            >
              <PlusSquare className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAddNode('text')}
              className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm transition-all" 
              title="Add Text"
            >
              <Type className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAddNode('note')}
              className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm transition-all" 
              title="Add Note"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
            <button className="p-1.5 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-[300px] justify-end">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-0.5">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded">
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-medium text-slate-600 w-8 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50" 
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 gap-1">
        <button
          onClick={() => setActiveTab('flow')}
          className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeTab === 'flow'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Flow Builder
        </button>
        <button
          onClick={() => setActiveTab('wireframes')}
          className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeTab === 'wireframes'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Wireframes
        </button>
      </div>

      {/* Main Workspace */}
      {activeTab === 'wireframes' ? (
        <WireframesView />
      ) : (
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar */}
        <aside className={`bg-white border-r border-slate-200 flex flex-col z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 ${leftSidebarOpen ? 'w-72' : 'w-0'}`}>
          {leftSidebarOpen && (
            <>
          {/* Tabs */}
          <div className="flex items-center px-4 pt-4 pb-2 gap-4 border-b border-slate-100">
            <button className="text-sm font-medium text-slate-900 pb-2 border-b-2 border-slate-900">Templates</button>
          </div>

          {/* Search */}
          <div className="p-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Zoek node..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            
            {/* Search Results */}
            {searchQuery && (
              <div className="px-4 pb-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Zoekresultaten</div>
                {nodes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())).map(node => {
                  const Icon = node.icon || Layout;
                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedNode(node.id);
                        setPan({ x: -node.x * (zoom / 100) + 400, y: -node.y * (zoom / 100) + 300 });
                        setSearchQuery('');
                      }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2 flex items-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">{node.name}</span>
                    </div>
                  );
                })}
                {nodes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="text-xs text-slate-400 text-center py-2">Geen resultaten</div>
                )}
              </div>
            )}
          </div>

          {/* Draggable List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Page Templates</div>
            
            {/* Template Categories */}
            {templateCategories.map((category) => {
              const CategoryIcon = category.icon;
              const isExpanded = expandedTemplateCategory === category.id;
              
              return (
                <div key={category.id}>
                  <button
                    onClick={() => setExpandedTemplateCategory(isExpanded ? null : category.id)}
                    className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                      <span className="text-xs font-bold text-slate-700">{category.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {category.templates.length}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 mb-3 space-y-2">
                      {category.templates.map((template, idx) => {
                        const TemplateIcon = template.icon;
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectTemplate(template)}
                            className="p-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="w-9 h-9 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0 shadow-sm">
                                <TemplateIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 mb-1.5">{template.name}</h4>
                                <div className="flex flex-wrap gap-1">
                                  {template.components.slice(0, 2).map((comp, i) => (
                                    <span key={i} className="text-[9px] bg-white/60 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                      {comp}
                                    </span>
                                  ))}
                                  {template.components.length > 2 && (
                                    <span className="text-[9px] text-blue-600 font-medium">
                                      +{template.components.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Logic Nodes</div>
            
            <div className="flex gap-2">
              <div 
                onClick={() => handleAddNode('start')}
                className="flex-1 bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center gap-1 hover:border-blue-400 hover:shadow-sm cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[10px] font-medium text-slate-600">Start</span>
              </div>
              <div 
                onClick={() => handleAddNode('decision')}
                className="flex-1 bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center gap-1 hover:border-blue-400 hover:shadow-sm cursor-pointer"
              >
                <div className="w-8 h-8 rotate-45 bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 mb-1">
                  <HelpCircle className="w-4 h-4 -rotate-45" />
                </div>
                <span className="text-[10px] font-medium text-slate-600">Decision</span>
              </div>
              <div 
                onClick={() => handleAddNode('end')}
                className="flex-1 bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center gap-1 hover:border-blue-400 hover:shadow-sm cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-slate-600">End</span>
              </div>
            </div>

            {templates.length > 0 && (
              <>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Custom Templates</div>
                
                <div className="space-y-2">
                  {templates.map((template) => {
                    const Icon = template.node.iconName ? iconMap[template.node.iconName] : Layout;
                    return (
                      <div 
                        key={template.id}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-3 hover:border-amber-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all group"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, { name: template.name, icon: template.node.icon, ...template.node })}
                        onClick={() => handleLoadTemplate(template)}
                      >
                        <div className="w-10 h-10 rounded bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{template.name}</div>
                          <div className="text-[10px] text-amber-600 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Custom
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete template?')) {
                              handleDeleteTemplate(template.id);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          
          {/* Quick Info */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span>Drag items to canvas to add</span>
            </div>
            <button 
              onClick={() => handleAddNode('page')}
              className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              + Create New Page
            </button>
            <button
              onClick={() => setShowAIFlowDialog(true)}
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Generate Flow met AI
            </button>
          </div>
          </>
          )}
        </aside>

        {/* Left Sidebar Toggle */}
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-6 h-16 bg-white border border-slate-200 rounded-r-lg shadow-md hover:bg-slate-50 transition-all flex items-center justify-center text-slate-400 hover:text-slate-600"
          style={{ left: leftSidebarOpen ? '288px' : '0px' }}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${leftSidebarOpen ? '-rotate-90' : 'rotate-90'}`} />
        </button>

        {/* Canvas Area */}
        <main 
          className={`flex-1 relative overflow-hidden bg-slate-50 ${showGrid ? 'bg-grid-pattern' : ''} ${spacePressed || isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onDoubleClick={handleCanvasDoubleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          
          {/* Canvas Content */}
          <div className="absolute inset-0 pointer-events-none">
          <div className="absolute pointer-events-auto" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`, transformOrigin: 'top left' }}>
            
            {/* SVG Connectors */}
            <svg className="absolute inset-0 w-[2000px] h-[2000px] pointer-events-none z-0 overflow-visible">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
                </marker>
              </defs>

              {/* Dynamic Connections */}
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                const fromX = fromNode.x + 120;
                const fromY = fromNode.y + 70;
                const toX = toNode.x + 120;
                const toY = toNode.y + 70;
                const midX = (fromX + toX) / 2;
                
                return (
                  <g key={idx}>
                    <path 
                      d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                      fill="none" 
                      stroke="#94A3B8" 
                      strokeWidth="2" 
                      markerEnd="url(#arrowhead)"
                      className="pointer-events-auto cursor-pointer hover:stroke-rose-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this connection?')) {
                          handleDeleteConnection(conn.from, conn.to);
                        }
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {connectingFrom && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-50">
                <path 
                  d={`M ${nodes.find(n => n.id === connectingFrom).x + 120} ${nodes.find(n => n.id === connectingFrom).y + 70} L ${connectionPos.x} ${connectionPos.y}`}
                  stroke="#3B82F6" 
                  strokeWidth="2" 
                  strokeDasharray="5 5"
                  fill="none"
                />
              </svg>
            )}

            {nodes.map(node => {
              if (node.id === 'start') {
                return (
                  <div 
                    key={node.id}
                    className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-500 shadow-sm flex flex-col items-center justify-center z-10 hover:scale-105 transition-transform cursor-move" 
                    style={{ top: `${node.y}px`, left: `${node.x}px` }}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm mb-1">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Start</span>
                    <div 
                      className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-emerald-500 rounded-full cursor-crosshair hover:scale-125 transition-transform z-50"
                      onMouseDown={(e) => handleConnectionStart(e, node.id)}
                      onMouseUp={(e) => handleConnectionEnd(e, node.id)}
                    ></div>
                  </div>
                );
              }
              return null;
            })}

            {nodes.filter(n => n.type === 'page' && n.id === 'login').map(node => {
              const Icon = node.icon;
              return (
                <div 
                  key={node.id}
                  className={`absolute w-[240px] bg-white rounded-xl z-20 group cursor-move ${
                    selectedNode === node.id ? 'shadow-[0_0_0_2px_#3B82F6,0_10px_15px_-3px_rgba(59,130,246,0.2)] border-2 border-blue-500' : 'border border-slate-200 shadow-md hover:border-blue-400'
                  }`}
                  style={{ top: `${node.y}px`, left: `${node.x}px` }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                >
              
              {/* Connection Points */}
              <div 
                className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 rounded-full cursor-crosshair z-50 ${selectedNode === node.id ? 'border-blue-500' : 'border-slate-300'}`}
                onMouseDown={(e) => handleConnectionStart(e, node.id)}
                onMouseUp={(e) => handleConnectionEnd(e, node.id)}
              ></div>
              <div 
                className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 rounded-full cursor-crosshair z-50 ${selectedNode === node.id ? 'border-blue-500' : 'border-slate-300'}`}
                onMouseDown={(e) => handleConnectionStart(e, node.id)}
                onMouseUp={(e) => handleConnectionEnd(e, node.id)}
              ></div>
              <div 
                className={`absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white border-2 rounded-full cursor-crosshair z-50 ${selectedNode === node.id ? 'border-blue-500' : 'border-slate-300'}`}
                onMouseDown={(e) => handleConnectionStart(e, node.id)}
                onMouseUp={(e) => handleConnectionEnd(e, node.id)}
              ></div>
              <div 
                className={`absolute left-1/2 -top-1.5 -translate-x-1/2 w-3 h-3 bg-white border-2 rounded-full cursor-crosshair z-50 ${selectedNode === node.id ? 'border-blue-500' : 'border-slate-300'}`}
                onMouseDown={(e) => handleConnectionStart(e, node.id)}
                onMouseUp={(e) => handleConnectionEnd(e, node.id)}
              ></div>

              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-sm text-slate-900">{node.name}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              
              <div className="p-3 pointer-events-none">
                <div className="w-full h-24 bg-slate-50 border border-slate-100 rounded mb-3 flex flex-col items-center justify-center">
                  <div className="w-3/4 h-2 bg-slate-200 rounded mb-2"></div>
                  <div className="w-3/4 h-8 bg-white border border-slate-200 rounded mb-1"></div>
                  <div className="w-3/4 h-8 bg-white border border-slate-200 rounded mb-2"></div>
                  <div className="w-1/2 h-6 bg-blue-500 rounded"></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Step 1</span>
                  {node.variants && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{node.variants} variants</span>}
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-100 transition-opacity pointer-events-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const newNode = { ...node, id: `node_${Date.now()}`, x: node.x + 50, y: node.y + 50 };
                    setNodes([...nodes, newNode]);
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded shadow-sm text-slate-500 hover:text-blue-600 hover:border-blue-300"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveAsTemplate(node.id);
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded shadow-sm text-slate-500 hover:text-purple-600 hover:border-purple-300"
                  title="Save as Template"
                >
                  <Star className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this node?')) {
                      handleDeleteNode(node.id);
                    }
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded shadow-sm text-slate-500 hover:text-rose-600 hover:border-rose-300"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            );
            })}

            {/* Arrow Label */}
            <div className="absolute bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] text-slate-500 font-medium shadow-sm z-10" style={{ top: '520px', left: '460px' }}>
              Forgot PW
            </div>

            {/* Other Nodes */}
            {nodes.filter(n => n.type === 'page' && n.id !== 'login').map(node => {
              const Icon = node.icon;
              return (
            <div 
              key={node.id}
              className="absolute w-[240px] bg-white rounded-xl border border-slate-200 shadow-md z-10 hover:border-blue-400 transition-colors cursor-move" 
              style={{ top: `${node.y}px`, left: `${node.x}px` }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            >
              <div 
                className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-300 rounded-full cursor-crosshair z-50"
                onMouseDown={(e) => handleConnectionStart(e, node.id)}
                onMouseUp={(e) => handleConnectionEnd(e, node.id)}
              ></div>
              <div 
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-300 rounded-full cursor-crosshair z-50"
                onMouseDown={(e) => handleConnectionStart(e, node.id)}
                onMouseUp={(e) => handleConnectionEnd(e, node.id)}
              ></div>
              
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-sm text-slate-900">{node.name}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${node.status === 'complete' ? 'bg-emerald-500' : node.status === 'progress' ? 'bg-amber-500' : node.status === 'designed' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              </div>
              <div className="p-3 pointer-events-none">
                <div className="w-full h-24 bg-slate-50 border border-slate-100 rounded mb-3 flex items-center justify-center">
                  <Image className="w-6 h-6 text-slate-300" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{node.id}</span>
                  {node.flows && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{node.flows} flows</span>}
                </div>
              </div>
            </div>
            );
            })}

            {/* Loop Label */}
            <div className="absolute bg-purple-50 px-2 py-0.5 rounded border border-purple-100 text-[10px] text-purple-600 font-medium shadow-sm z-10" style={{ top: '280px', left: '700px' }}>
              <RotateCcw className="w-3 h-3 inline mr-1" />Login again
            </div>

            {nodes.filter(n => n.type === 'decision').map(node => {
              const Icon = node.icon;
              return (
                <div key={node.id} className="absolute w-[100px] h-[100px] z-10 cursor-move" style={{ top: `${node.y}px`, left: `${node.x}px` }} onMouseDown={(e) => handleNodeMouseDown(e, node.id)}>
                  <div className="w-[100px] h-[100px] bg-amber-50 border-2 border-amber-300 shadow-sm flex items-center justify-center transform rotate-45 hover:border-amber-400 transition-colors">
                    <div className="-rotate-45 flex flex-col items-center pointer-events-none">
                      <Icon className="w-6 h-6 text-amber-600 mb-1" />
                      <span className="text-[10px] font-bold text-amber-700 text-center leading-tight">{node.name}</span>
                    </div>
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-amber-400 -rotate-45 rounded-full cursor-crosshair z-50" onMouseDown={(e) => handleConnectionStart(e, node.id)} onMouseUp={(e) => handleConnectionEnd(e, node.id)}></div>
                    <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white border-2 border-amber-400 -rotate-45 rounded-full cursor-crosshair z-50" onMouseDown={(e) => handleConnectionStart(e, node.id)} onMouseUp={(e) => handleConnectionEnd(e, node.id)}></div>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-600 bg-white border border-amber-100 px-1 rounded pointer-events-none">NO</div>
                  <div className="absolute top-1/2 -right-6 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-white border border-emerald-100 px-1 rounded pointer-events-none">YES</div>
                </div>
              );
            })}

            {nodes.filter(n => n.status === 'pending').map(node => {
              const Icon = node.icon;
              return (
                <div key={node.id} className="absolute w-[140px] bg-white rounded-xl border border-dashed border-slate-300 p-3 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-move" style={{ top: `${node.y}px`, left: `${node.x}px` }} onMouseDown={(e) => handleNodeMouseDown(e, node.id)}>
                  <Icon className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-medium text-slate-600">{node.name}</span>
                  <span className="text-[9px] text-slate-400 mt-1">Pending Design</span>
                </div>
              );
            })}

            {nodes.filter(n => n.type === 'end').map(node => {
              const Icon = node.icon;
              return (
                <div key={node.id} className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-md flex flex-col items-center justify-center z-10 hover:scale-105 transition-transform cursor-move border-2 border-white ring-2 ring-slate-100" style={{ top: `${node.y}px`, left: `${node.x}px` }} onMouseDown={(e) => handleNodeMouseDown(e, node.id)}>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white mb-1 backdrop-blur-sm pointer-events-none">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 pointer-events-none">{node.name}</span>
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-800 rounded-full cursor-crosshair z-50" onMouseDown={(e) => handleConnectionStart(e, node.id)} onMouseUp={(e) => handleConnectionEnd(e, node.id)}></div>
                </div>
              );
            })}

            {/* Text Nodes */}
            {nodes.filter(n => n.type === 'text').map(node => (
              <div 
                key={node.id}
                className={`absolute z-20 cursor-move ${selectedNode === node.id ? 'ring-2 ring-purple-400 rounded-lg' : ''}`}
                style={{ 
                  top: `${node.y}px`, 
                  left: `${node.x}px`,
                  minWidth: '100px',
                  maxWidth: '500px'
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingText(node.id);
                }}
              >
                {editingText === node.id ? (
                  <div className="pointer-events-auto">
                    <textarea
                      value={node.name}
                      onChange={(e) => handleUpdateNode(node.id, { name: e.target.value })}
                      onBlur={() => setEditingText(null)}
                      className="p-3 bg-white border-2 border-purple-500 rounded-lg focus:outline-none resize-both shadow-xl"
                      style={{ 
                        fontSize: `${node.fontSize}px`,
                        color: node.textColor,
                        minHeight: '50px',
                        minWidth: '150px'
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div 
                    className="p-3 whitespace-pre-wrap bg-white/80 backdrop-blur-sm rounded-lg pointer-events-none shadow-sm"
                    style={{ 
                      fontSize: `${node.fontSize}px`,
                      color: node.textColor,
                      fontWeight: node.fontSize > 24 ? '600' : '400'
                    }}
                  >
                    {node.name}
                  </div>
                )}
                {selectedNode === node.id && editingText !== node.id && (
                  <div className="absolute -top-10 left-0 flex gap-1 bg-white rounded-lg border border-slate-200 shadow-lg p-1 pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateNode(node.id, { fontSize: Math.min(72, node.fontSize + 4) });
                      }}
                      className="px-2 py-1 text-xs font-bold hover:bg-slate-100 rounded"
                    >
                      A+
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateNode(node.id, { fontSize: Math.max(8, node.fontSize - 4) });
                      }}
                      className="px-2 py-1 text-xs hover:bg-slate-100 rounded"
                    >
                      A-
                    </button>
                    <input 
                      type="color" 
                      value={node.textColor}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleUpdateNode(node.id, { textColor: e.target.value });
                      }}
                      className="w-8 h-7 rounded cursor-pointer"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Verwijder tekst?')) handleDeleteNode(node.id);
                      }}
                      className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Note Nodes */}
            {nodes.filter(n => n.type === 'note').map(node => (
              <div 
                key={node.id}
                className={`absolute w-[200px] min-h-[150px] rounded-lg shadow-lg z-20 cursor-move ${selectedNode === node.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                style={{ 
                  top: `${node.y}px`, 
                  left: `${node.x}px`,
                  backgroundColor: node.color
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              >
                <div className="p-4 h-full flex flex-col pointer-events-auto">
                  <textarea
                    value={node.name}
                    onChange={(e) => handleUpdateNode(node.id, { name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent border-none focus:outline-none resize-none text-sm leading-relaxed"
                    style={{ color: node.textColor }}
                    placeholder="Typ notitie..."
                  />
                  <div className="flex gap-1 mt-2 pt-2 border-t border-black/10">
                    {['#FEF3C7', '#DBEAFE', '#DCFCE7', '#FCE7F3', '#E0E7FF', '#FED7AA'].map(color => (
                      <button
                        key={color}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateNode(node.id, { color });
                        }}
                        className="w-5 h-5 rounded border-2 border-white hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                {selectedNode === node.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Verwijder notitie?')) handleDeleteNode(node.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

          </div>
          </div>

          {/* Node Type Menu */}
          {showNodeMenu && (
            <>
              <div className="fixed inset-0 z-50" onClick={() => setShowNodeMenu(false)}></div>
              <div 
                className="fixed z-50 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 min-w-[200px]"
                style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }}
              >
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">Add Node</div>
                <button
                  onClick={() => {
                    const x = (menuPosition.x - pan.x) / (zoom / 100);
                    const y = (menuPosition.y - pan.y) / (zoom / 100);
                    handleAddNode('page', x, y);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded flex items-center justify-center">
                    <Layout className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Page</span>
                </button>
                <button
                  onClick={() => {
                    const x = (menuPosition.x - pan.x) / (zoom / 100);
                    const y = (menuPosition.y - pan.y) / (zoom / 100);
                    handleAddNode('decision', x, y);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-amber-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-amber-100 border border-amber-200 rounded flex items-center justify-center rotate-45">
                    <HelpCircle className="w-4 h-4 text-amber-600 -rotate-45" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Decision</span>
                </button>
                <button
                  onClick={() => {
                    const x = (menuPosition.x - pan.x) / (zoom / 100);
                    const y = (menuPosition.y - pan.y) / (zoom / 100);
                    handleAddNode('start', x, y);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-emerald-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-emerald-600 fill-current" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Start</span>
                </button>
                <button
                  onClick={() => {
                    const x = (menuPosition.x - pan.x) / (zoom / 100);
                    const y = (menuPosition.y - pan.y) / (zoom / 100);
                    handleAddNode('end', x, y);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">End</span>
                </button>
                <div className="h-px bg-slate-200 my-1"></div>
                <button
                  onClick={() => {
                    const x = (menuPosition.x - pan.x) / (zoom / 100);
                    const y = (menuPosition.y - pan.y) / (zoom / 100);
                    handleAddNode('text', x, y);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-purple-100 border border-purple-200 rounded flex items-center justify-center">
                    <Type className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Text</span>
                </button>
                <button
                  onClick={() => {
                    const x = (menuPosition.x - pan.x) / (zoom / 100);
                    const y = (menuPosition.y - pan.y) / (zoom / 100);
                    handleAddNode('note', x, y);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-yellow-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-yellow-100 border border-yellow-200 rounded flex items-center justify-center">
                    <Edit2 className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Note</span>
                </button>
              </div>
            </>
          )}

          {/* Minimap */}
          <div className="absolute bottom-6 right-6 w-[200px] h-[140px] bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-40 opacity-90 hover:opacity-100 transition-opacity">
            <div className="relative w-full h-full bg-slate-50">
              <div className="absolute top-[35%] left-[10%] w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="absolute top-[32%] left-[20%] w-8 h-5 bg-blue-200 rounded-sm border border-blue-400"></div>
              <div className="absolute top-[32%] left-[40%] w-8 h-5 bg-slate-300 rounded-sm"></div>
              <div className="absolute top-[50%] left-[35%] w-8 h-5 bg-slate-300 rounded-sm"></div>
              <div className="absolute top-[50%] left-[55%] w-8 h-5 bg-slate-300 rounded-sm"></div>
              
              <div className="absolute top-[20%] left-[5%] w-[60%] h-[70%] border-2 border-blue-500 bg-blue-500/10 rounded cursor-move"></div>
            </div>
          </div>

        </main>

        {/* Right Sidebar Toggle */}
        <button
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-6 h-16 bg-white border border-slate-200 rounded-l-lg shadow-md hover:bg-slate-50 transition-all flex items-center justify-center text-slate-400 hover:text-slate-600"
          style={{ right: rightSidebarOpen ? '320px' : '0px' }}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${rightSidebarOpen ? 'rotate-90' : '-rotate-90'}`} />
        </button>

        {/* Right Sidebar: Properties */}
        <aside className={`bg-white border-l border-slate-200 flex flex-col z-30 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 ${rightSidebarOpen ? 'w-80' : 'w-0'}`}>
          {rightSidebarOpen && (
          <>
          
          {/* Header */}
          <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties</span>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-6">
              
              {/* Title Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <button className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Lock className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Page Name</label>
                    <input 
                      type="text" 
                      value={selectedNode ? nodes.find(n => n.id === selectedNode)?.name || '' : 'Login Screen'}
                      onChange={(e) => selectedNode && handleUpdateNode(selectedNode, { name: e.target.value })}
                      className="w-full bg-transparent font-semibold text-slate-900 border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none pb-0.5"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Status</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium rounded px-2.5 py-1.5 pr-6 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        <option>Complete</option>
                        <option>In Progress</option>
                        <option>To Do</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-emerald-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Design</label>
                    <button className="w-full flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded px-2 py-1.5 hover:bg-slate-50">
                      <Layout className="w-3 h-3" /> Open UI
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-slate-100"></div>

              {/* Connections */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900">Connections</h3>
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <span className="text-slate-400 w-12">From</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 flex-1">
                      <Play className="w-3 h-3 text-emerald-500 fill-current" />
                      Start
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-slate-400 w-12">To</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 flex-1 group-hover:border-blue-300 transition-colors">
                      <UserPlus className="w-3 h-3 text-slate-500" />
                      Signup
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs group">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <span className="text-slate-400 w-12">Branch</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-amber-800 flex-1">
                      <HelpCircle className="w-3 h-3 text-amber-600" />
                      Forgot PW
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-slate-100"></div>

              {/* Icon Picker */}
              {selectedNode && nodes.find(n => n.id === selectedNode)?.type === 'page' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-900">Icon</h3>
                    <button 
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      {showIconPicker ? 'Sluiten' : 'Wijzigen'}
                    </button>
                  </div>

                  {showIconPicker ? (
                    <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-lg p-2">
                      {Object.entries(iconLibrary).map(([category, icons]) => (
                        <div key={category} className="mb-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                            {category}
                          </div>
                          <div className="grid grid-cols-4 gap-1">
                            {icons.map(({ icon: IconComponent, name }) => (
                              <button
                                key={name}
                                onClick={() => {
                                  handleUpdateNode(selectedNode, { icon: IconComponent });
                                  setShowIconPicker(false);
                                }}
                                className="p-2 flex flex-col items-center gap-1 hover:bg-blue-50 rounded transition-colors group"
                                title={name}
                              >
                                <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                                <span className="text-[9px] text-slate-400 group-hover:text-blue-600 text-center leading-tight">
                                  {name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {(() => {
                        const node = nodes.find(n => n.id === selectedNode);
                        const NodeIcon = node?.icon || Layout;
                        return (
                          <>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center">
                              <NodeIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-sm text-slate-600">Huidige icon</span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              <div className="h-[1px] bg-slate-100"></div>

              {/* Notes */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-2">Implementation Notes</h3>
                <textarea 
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none" 
                  placeholder="Add notes about logic, states, or data requirements..."
                  defaultValue="Auth token should be persisted in secure storage. Remember to handle the 401 redirect loop edge case."
                />
              </div>

              {/* Data Attributes */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-2">Data Requirements</h3>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200">email</span>
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200">password</span>
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200">remember_me</span>
                  <button className="px-2 py-1 rounded border border-dashed border-slate-300 text-slate-400 text-[10px] hover:border-blue-400 hover:text-blue-500">+ Add</button>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button 
              onClick={() => selectedNode && handleDeleteNode(selectedNode)}
              disabled={!selectedNode}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-rose-600 text-xs font-medium rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3 h-3" />
              Remove from Flow
            </button>
          </div>
          </>
          )}
        </aside>

      </div>
      )}

      {/* Status Bar */}
      <footer className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-4 text-[10px] text-slate-500 shrink-0 z-40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> 
            Opgeslagen om {lastSaved.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-slate-300">|</span>
          <span>{nodes.length} Nodes, {connections.length} Connecties</span>
          {selectedNode && (
            <>
              <span className="text-slate-300">|</span>
              <span className="text-blue-600">
                {nodes.find(n => n.id === selectedNode)?.name || 'Geselecteerd'} - Druk Delete om te verwijderen
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600" title="Dubbelklik = Node toevoegen, Delete = Verwijderen, Space = Pan canvas">
            <Keyboard className="w-3 h-3" /> Shortcuts (Space, Delete, Dubbelklik)
          </span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
            <HelpCircle className="w-3 h-3" /> Help
          </span>
        </div>
      </footer>

      {/* AI Flow Generator Dialog */}
      {showAIFlowDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAIFlowDialog(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">AI Flow Generator</h2>
                    <p className="text-purple-100 text-sm">Beschrijf je flow en laat AI het bouwen</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIFlowDialog(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Wat voor flow wil je maken?
                </label>
                <textarea
                  value={aiFlowPrompt}
                  onChange={(e) => setAiFlowPrompt(e.target.value)}
                  placeholder="Bijv: 'User Signup Flow met email verificatie' of 'E-commerce checkout flow met betaling en orderbevestiging'"
                  className="w-full h-40 border-2 border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  autoFocus
                />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <strong className="font-semibold">Voorbeelden:</strong>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• "User onboarding met account setup en voorkeuren"</li>
                      <li>• "Betalingsflow met productoverzicht en confirmatie"</li>
                      <li>• "Password reset flow met email verificatie"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowAIFlowDialog(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleGenerateFlow}
                  disabled={!aiFlowPrompt.trim() || isGeneratingFlow}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isGeneratingFlow ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Genereren...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Genereer Flow
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(#CBD5E1 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}