import React, { useState } from 'react';
import {
  Search, Key, UserPlus, LayoutDashboard, Mic, Plus, Eye, Image,
  MousePointerClick, List, ArrowRight, GripVertical, Mail, Lock,
  AlertCircle, CheckCircle2, Type, CheckSquare, CreditCard, PlayCircle,
  Waves, MessageSquare, Database, Server, Code, Sparkles, MoreHorizontal,
  TextCursorInput, ChevronRight, Wand2, Layout as LayoutIcon, Lightbulb, X, Send, Loader2,
  HelpCircle, ShieldCheck, RefreshCw, Star, Settings, Bell, ShoppingCart, 
  Package, FileText, Calendar, Heart, TrendingUp, Award, Home, BookOpen, 
  Video, Camera, Users, ChevronDown, User, Filter
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WireframesView() {
  const [selectedPage, setSelectedPage] = useState('login');
  const [selectedComponent, setSelectedComponent] = useState('loginButton');
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [expandedTemplateCategory, setExpandedTemplateCategory] = useState(null);

  const pages = [
    { id: 'login', name: 'Login Screen', icon: Key, path: '/auth/login', status: 'complete', color: 'blue' },
    { id: 'signup', name: 'Signup Screen', icon: UserPlus, path: '/auth/register', status: 'complete', color: 'green' },
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/app/home', status: 'progress', color: 'orange' },
    { id: 'practice', name: 'Voice Practice', icon: Mic, path: '/app/practice', status: 'pending', color: 'slate' }
  ];

  const handleGenerateWireframe = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a wireframe structure for: ${aiPrompt}. 
        
Return a JSON structure with:
- name: page name
- path: route path
- components: array of components, each with:
  - type: input/button/text/image/list
  - label: component label
  - required: boolean
  - action: optional action description
  
Example format:
{
  "name": "Login Screen",
  "path": "/auth/login",
  "components": [
    {"type": "input", "label": "Email", "required": true},
    {"type": "button", "label": "Login", "action": "Submit form"}
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            path: { type: "string" },
            components: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  label: { type: "string" },
                  required: { type: "boolean" },
                  action: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      console.log('Generated wireframe:', response);
      setShowAIPrompt(false);
      setAiPrompt('');
    } catch (error) {
      console.error('Failed to generate wireframe:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetSuggestions = async () => {
    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this wireframe and provide 3-5 UX/UI improvement suggestions:
        
Page: Login Screen
Components: Email Input, Password Input, Login Button

Provide actionable suggestions for better user experience, accessibility, and modern design patterns.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setSuggestions(response.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const wireframeTemplates = [
    {
      id: 'auth',
      name: 'Authentication',
      icon: Lock,
      templates: [
        { name: 'Login Simple', icon: Lock, components: ['Email input', 'Password input', 'Login button', 'Social login'] },
        { name: 'Login w/ Illustration', icon: Key, components: ['Hero image', 'Email', 'Password', 'Remember me'] },
        { name: 'Signup Multi-Step', icon: UserPlus, components: ['Progress bar', 'Step 1-3', 'Validation'] },
        { name: 'Forgot Password', icon: HelpCircle, components: ['Email input', 'Send reset link', 'Back to login'] },
        { name: 'Email Verification', icon: Mail, components: ['Icon', 'Message', 'Resend button', 'Change email'] },
        { name: 'Onboarding Welcome', icon: Star, components: ['Illustration', 'Title', 'Description', 'Next'] },
        { name: 'Onboarding Features', icon: Sparkles, components: ['Icon', 'Screenshot', 'Description', 'Progress dots'] },
        { name: 'Onboarding Permissions', icon: ShieldCheck, components: ['Icon', 'Benefits', 'Enable/Skip'] },
        { name: 'Profile Setup', icon: User, components: ['Photo upload', 'Name', 'Username', 'Bio'] },
        { name: '2FA Setup', icon: ShieldCheck, components: ['6-digit code', 'Verify', 'Resend', 'Backup'] },
        { name: 'Biometric Setup', icon: ShieldCheck, components: ['Icon', 'Benefits', 'Enable', 'Privacy note'] },
        { name: 'Subscription Prompt', icon: CreditCard, components: ['Features', 'Pricing', 'Start trial', 'Continue free'] }
      ]
    },
    {
      id: 'main',
      name: 'Main Screens',
      icon: LayoutDashboard,
      templates: [
        { name: 'Dashboard Stats', icon: LayoutDashboard, components: ['Welcome', 'Stats grid', 'Chart', 'Quick actions'] },
        { name: 'Feed Timeline', icon: List, components: ['Pull refresh', 'Post cards', 'Like/comment', 'Load more'] },
        { name: 'Search Screen', icon: Search, components: ['Search bar', 'Recent', 'Trending', 'Results'] },
        { name: 'Profile Own', icon: User, components: ['Cover', 'Avatar', 'Bio', 'Stats', 'Content tabs'] },
        { name: 'Settings Screen', icon: Settings, components: ['Grouped list', 'Toggles', 'Dropdowns', 'Logout'] },
        { name: 'Notifications List', icon: Bell, components: ['Tabs', 'Notification cards', 'Mark read'] },
        { name: 'Messages Chat List', icon: MessageSquare, components: ['Search', 'Conversations', 'Compose'] },
        { name: 'Chat Conversation', icon: MessageSquare, components: ['Header', 'Messages', 'Input', 'Typing'] },
        { name: 'List View Generic', icon: List, components: ['Search', 'Filters', 'List items', 'Empty state'] },
        { name: 'Grid View Cards', icon: LayoutIcon, components: ['Search', 'Categories', 'Card grid', 'Load more'] },
        { name: 'Map View', icon: Home, components: ['Map', 'Markers', 'Bottom sheet', 'Location button'] },
        { name: 'Detail View', icon: FileText, components: ['Hero', 'Title', 'Meta', 'Content', 'Related'] },
        { name: 'Comments Section', icon: MessageSquare, components: ['Sort', 'Comment cards', 'Nested replies', 'Input'] },
        { name: 'Bottom Navigation', icon: LayoutIcon, components: ['5 nav items', 'Icons', 'Labels', 'Badges'] },
        { name: 'Tab Navigation', icon: LayoutIcon, components: ['Tabs', 'Underline', 'Swipeable content'] }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce',
      icon: ShoppingCart,
      templates: [
        { name: 'Product Catalog', icon: ShoppingCart, components: ['Search', 'Filters', 'Product grid', 'Cart badge'] },
        { name: 'Product Detail', icon: Package, components: ['Carousel', 'Name', 'Price', 'Variants', 'Add to cart'] },
        { name: 'Shopping Cart', icon: ShoppingCart, components: ['Cart items', 'Quantity', 'Promo', 'Summary'] },
        { name: 'Checkout Multi-Step', icon: CreditCard, components: ['Progress', 'Shipping', 'Payment', 'Review'] },
        { name: 'Order Confirmation', icon: CheckCircle2, components: ['Success icon', 'Order #', 'Tracking', 'Next steps'] },
        { name: 'Order Tracking', icon: Package, components: ['Map', 'Timeline', 'Driver info', 'Items'] },
        { name: 'Reviews List', icon: Star, components: ['Average', 'Bars', 'Sort', 'Review cards'] },
        { name: 'Write Review', icon: Star, components: ['Rating stars', 'Title', 'Text', 'Photos', 'Submit'] },
        { name: 'Wishlist', icon: Heart, components: ['Grid', 'Remove heart', 'Add to cart', 'Share'] },
        { name: 'Filter Screen', icon: Filter, components: ['Categories', 'Price range', 'Brand', 'Size', 'Color'] }
      ]
    },
    {
      id: 'productivity',
      name: 'Productivity',
      icon: CheckCircle2,
      templates: [
        { name: 'Todo List', icon: CheckCircle2, components: ['Tabs', 'Task items', 'Checkbox', 'Priority', 'Swipe actions', 'Quick add'] },
        { name: 'Task Detail', icon: FileText, components: ['Checkbox', 'Title', 'Description', 'Due date', 'Reminder', 'Tags', 'Subtasks'] },
        { name: 'Calendar Month', icon: Calendar, components: ['Month grid', 'Day headers', 'Event dots', 'Selected day', 'Event list'] },
        { name: 'Calendar Week', icon: Calendar, components: ['Week view', 'Time slots', 'Events', 'Drag drop'] },
        { name: 'Kanban Board', icon: LayoutIcon, components: ['Columns', 'Draggable cards', 'Add card', 'Horizontal scroll'] },
        { name: 'Notes Editor', icon: FileText, components: ['Title input', 'Body textarea', 'Formatting toolbar', 'Auto-save'] },
        { name: 'Pomodoro Timer', icon: Calendar, components: ['Circular timer', 'Presets', 'Play/pause', 'Task', 'Session counter'] },
        { name: 'Habit Tracker', icon: CheckCircle2, components: ['Week selector', 'Habit rows', 'Checkboxes', 'Streaks', 'Stats'] },
        { name: 'Time Tracker', icon: Calendar, components: ['Active timer', 'Quick start', 'Time entries', 'Daily total'] },
        { name: 'Expense Tracker', icon: TrendingUp, components: ['Month card', 'Income/expense', 'Transaction list', 'Categories', 'Chart'] },
        { name: 'Project Dashboard', icon: Star, components: ['Header', 'Progress', 'Tasks', 'Files', 'Team'] },
        { name: 'File Manager', icon: FileText, components: ['Folder tree', 'Files grid', 'Upload', 'Actions'] }
      ]
    },
    {
      id: 'content',
      name: 'Content & Media',
      icon: Video,
      templates: [
        { name: 'Video Player', icon: Video, components: ['Video', 'Controls', 'Quality', 'Related'] },
        { name: 'Audio Player', icon: Mic, components: ['Artwork', 'Progress', 'Controls', 'Playlist'] },
        { name: 'Photo Gallery Grid', icon: Image, components: ['Photo grid', 'Albums', 'Multi-select', 'Share'] },
        { name: 'Photo Viewer', icon: Image, components: ['Full image', 'Zoom', 'Swipe', 'Info', 'Share'] },
        { name: 'Camera Screen', icon: Camera, components: ['Preview', 'Shutter', 'Flash', 'Filters', 'Grid'] },
        { name: 'Blog Post', icon: BookOpen, components: ['Hero', 'Title', 'Content', 'Images', 'Comments'] },
        { name: 'News Feed', icon: FileText, components: ['Article cards', 'Categories', 'Read more'] },
        { name: 'Podcast Player', icon: Mic, components: ['Episodes', 'Player', 'Subscribe', 'Speed'] },
        { name: 'Live Stream', icon: Video, components: ['Stream', 'Chat', 'Viewers', 'Reactions'] },
        { name: 'Article Reader', icon: BookOpen, components: ['Text', 'Images', 'Highlight', 'Bookmark'] }
      ]
    },
    {
      id: 'booking',
      name: 'Booking',
      icon: Calendar,
      templates: [
        { name: 'Listing Grid', icon: Home, components: ['Search', 'Filters', 'Listing cards', 'Map toggle'] },
        { name: 'Listing Detail', icon: Home, components: ['Gallery', 'Info', 'Amenities', 'Calendar', 'Reserve'] },
        { name: 'Booking Form', icon: Calendar, components: ['Dates', 'Guests', 'Special requests', 'Payment'] },
        { name: 'My Bookings', icon: FileText, components: ['Tabs', 'Booking cards', 'Cancel', 'Modify'] },
        { name: 'Availability Calendar', icon: Calendar, components: ['Calendar', 'Available slots', 'Booked dates'] },
        { name: 'Appointment Scheduler', icon: Calendar, components: ['Service', 'Provider', 'Time slots', 'Book'] },
        { name: 'Table Reservation', icon: Calendar, components: ['Restaurant', 'Party size', 'Date/time', 'Confirm'] }
      ]
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: CreditCard,
      templates: [
        { name: 'Wallet Home', icon: CreditCard, components: ['Balance card', 'Cards list', 'Transactions', 'Actions'] },
        { name: 'Send Money', icon: TrendingUp, components: ['Recipient', 'Amount', 'Note', 'Confirm'] },
        { name: 'Transaction History', icon: FileText, components: ['Date filters', 'Transaction list', 'Export'] },
        { name: 'Payment Method', icon: CreditCard, components: ['Card list', 'Add card', 'Set default', 'Remove'] },
        { name: 'Bill Payment', icon: FileText, components: ['Bill list', 'Pay bill', 'Schedule', 'History'] },
        { name: 'Budget Tracker', icon: TrendingUp, components: ['Overview', 'Categories', 'Progress bars', 'Insights'] },
        { name: 'Investment Portfolio', icon: TrendingUp, components: ['Holdings', 'Performance chart', 'Buy/sell'] }
      ]
    },
    {
      id: 'social',
      name: 'Social Media',
      icon: Users,
      templates: [
        { name: 'Create Post', icon: Plus, components: ['User info', 'Text input', 'Media preview', 'Tags', 'Location', 'Post button'] },
        { name: 'Stories Viewer', icon: Camera, components: ['Progress bars', 'Full screen', 'Tap zones', 'Reply input', 'Swipe gestures'] },
        { name: 'Stories Creator', icon: Camera, components: ['Camera preview', 'Tools', 'Capture button', 'Filters', 'Share options'] },
        { name: 'Followers List', icon: Users, components: ['Tabs', 'Search', 'User items', 'Follow buttons', 'Mutual badges'] },
        { name: 'Explore Page', icon: Search, components: ['Search', 'Category chips', 'Masonry grid', 'Tap to view'] },
        { name: 'Hashtag Page', icon: Search, components: ['Hashtag header', 'Post count', 'Follow', 'Related tags', 'Post grid'] },
        { name: 'Mentions', icon: Bell, components: ['Filter tabs', 'Mention cards', 'Preview', 'Tap to view'] },
        { name: 'Saved Posts', icon: Heart, components: ['Collections', 'Collection cards', 'Post grid', 'Move to collection'] },
        { name: 'Live Stream Viewer', icon: Video, components: ['Live video', 'Viewer count', 'Comments stream', 'Input', 'Hearts'] },
        { name: 'Reels Feed', icon: Video, components: ['Full screen video', 'Right sidebar', 'Caption', 'Audio', 'Swipe gestures'] },
        { name: 'Reels Comments', icon: MessageSquare, components: ['Bottom sheet', 'Comment cards', 'Input', 'Swipe to close'] },
        { name: 'Go Live Setup', icon: Video, components: ['Camera preview', 'Title input', 'Audience', 'Settings', 'Go live button'] }
      ]
    },
    {
      id: 'health',
      name: 'Health & Fitness',
      icon: Heart,
      templates: [
        { name: 'Workout Tracker', icon: TrendingUp, components: ['Exercise list', 'Sets/reps', 'Timer', 'Log'] },
        { name: 'Nutrition Log', icon: Calendar, components: ['Meal entries', 'Calories', 'Macros', 'Add food'] },
        { name: 'Sleep Tracker', icon: Calendar, components: ['Sleep graph', 'Duration', 'Quality', 'Insights'] },
        { name: 'Step Counter', icon: TrendingUp, components: ['Step count', 'Goal ring', 'History', 'Challenges'] },
        { name: 'Water Intake', icon: Calendar, components: ['Glass icons', 'Goal', 'Log', 'Reminders'] },
        { name: 'Meditation Timer', icon: Calendar, components: ['Duration picker', 'Sounds', 'Start', 'History'] },
        { name: 'Health Dashboard', icon: Heart, components: ['Metrics grid', 'Charts', 'Goals', 'Trends'] },
        { name: 'Weight Tracker', icon: TrendingUp, components: ['Weight graph', 'Log entry', 'Goal', 'BMI'] }
      ]
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: Camera,
      templates: [
        { name: 'Flight Search', icon: Star, components: ['Origin/dest', 'Dates', 'Class', 'Search', 'Results'] },
        { name: 'Hotel Listing', icon: Home, components: ['Hotel cards', 'Price', 'Rating', 'Filters', 'Map'] },
        { name: 'Trip Planner', icon: Calendar, components: ['Itinerary', 'Day selector', 'Activities', 'Notes'] },
        { name: 'Travel Checklist', icon: CheckCircle2, components: ['Categories', 'Items', 'Check off', 'Add'] },
        { name: 'Currency Converter', icon: CreditCard, components: ['From/to', 'Amount', 'Rates', 'History'] },
        { name: 'Location Guide', icon: Home, components: ['Places', 'Categories', 'Tips', 'Photos', 'Map'] },
        { name: 'Itinerary Detail', icon: Calendar, components: ['Timeline', 'Stops', 'Duration', 'Notes'] }
      ]
    },
    {
      id: 'education',
      name: 'Education',
      icon: BookOpen,
      templates: [
        { name: 'Course Catalog', icon: BookOpen, components: ['Course cards', 'Categories', 'Search', 'Enroll'] },
        { name: 'Lesson Player', icon: Video, components: ['Video', 'Notes', 'Resources', 'Next lesson'] },
        { name: 'Quiz Screen', icon: HelpCircle, components: ['Question', 'Options', 'Timer', 'Submit'] },
        { name: 'Quiz Results', icon: CheckCircle2, components: ['Score', 'Correct/wrong', 'Review', 'Retake'] },
        { name: 'Progress Tracker', icon: TrendingUp, components: ['Completion %', 'Badges', 'Streak', 'Goals'] },
        { name: 'Study Flashcards', icon: FileText, components: ['Card front/back', 'Flip', 'Next/prev', 'Deck'] },
        { name: 'Assignment List', icon: CheckCircle2, components: ['Assignment cards', 'Due dates', 'Submit'] },
        { name: 'Class Schedule', icon: Calendar, components: ['Weekly grid', 'Classes', 'Room', 'Reminders'] },
        { name: 'Gradebook', icon: Star, components: ['Grades list', 'GPA', 'Charts', 'Assignments'] }
      ]
    },
    {
      id: 'realEstate',
      name: 'Real Estate',
      icon: Home,
      templates: [
        { name: 'Property Listing', icon: Home, components: ['Property cards', 'Filters', 'Sort', 'Map view'] },
        { name: 'Property Detail', icon: Image, components: ['Gallery', 'Details', 'Amenities', 'Tour', 'Agent'] },
        { name: 'Mortgage Calculator', icon: CreditCard, components: ['Price', 'Down payment', 'Rate', 'Result'] },
        { name: 'Agent Profile', icon: User, components: ['Photo', 'Bio', 'Listings', 'Contact', 'Reviews'] },
        { name: 'Saved Properties', icon: Heart, components: ['Saved list', 'Compare', 'Notes', 'Share'] },
        { name: 'Schedule Tour', icon: Calendar, components: ['Property', 'Date/time picker', 'Notes', 'Confirm'] },
        { name: 'Neighborhood Info', icon: Home, components: ['Map', 'Schools', 'Amenities', 'Demographics'] }
      ]
    },
    {
      id: 'food',
      name: 'Food & Dining',
      icon: ShoppingCart,
      templates: [
        { name: 'Restaurant Menu', icon: FileText, components: ['Categories', 'Menu items', 'Add to order', 'Cart'] },
        { name: 'Recipe Detail', icon: BookOpen, components: ['Photo', 'Ingredients', 'Steps', 'Timer', 'Save'] },
        { name: 'Food Delivery', icon: ShoppingCart, components: ['Restaurants', 'Menu', 'Customize', 'Checkout'] },
        { name: 'Grocery List', icon: CheckCircle2, components: ['Items', 'Categories', 'Check off', 'Share'] },
        { name: 'Meal Planner', icon: Calendar, components: ['Weekly grid', 'Recipes', 'Shopping list'] },
        { name: 'Nutrition Info', icon: FileText, components: ['Calories', 'Macros', 'Vitamins', 'Ingredients'] },
        { name: 'Restaurant Detail', icon: Home, components: ['Photos', 'Menu', 'Reviews', 'Reserve', 'Directions'] }
      ]
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: PlayCircle,
      templates: [
        { name: 'Game Lobby', icon: Users, components: ['Players', 'Ready status', 'Start game', 'Settings'] },
        { name: 'Leaderboard', icon: Award, components: ['Rankings', 'Scores', 'Filters', 'Timeframe'] },
        { name: 'Player Profile', icon: User, components: ['Avatar', 'Stats', 'Achievements', 'Match history'] },
        { name: 'Achievements', icon: Award, components: ['Achievement grid', 'Progress', 'Locked/unlocked'] },
        { name: 'Game Store', icon: ShoppingCart, components: ['Game cards', 'Categories', 'Sale', 'Purchase'] },
        { name: 'Live Match', icon: PlayCircle, components: ['Match view', 'Scores', 'Timer', 'Chat'] },
        { name: 'Inventory', icon: Package, components: ['Item grid', 'Equipped', 'Stats', 'Sell/use'] }
      ]
    }
  ];

  const handleSelectTemplate = (template) => {
    console.log('Selected wireframe template:', template);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-30">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Find page..."
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Wireframe Templates</div>
          
          {/* Template Categories */}
          {wireframeTemplates.map((category) => {
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
        </div>
      </aside>

      {/* Canvas */}
      <main className="flex-1 bg-slate-50 overflow-auto relative p-10" style={{
        backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}>
        <div className="relative w-[1800px] h-[1200px] scale-90 origin-top-left">
          
          {/* SVG Connections */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
              </marker>
              <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
              </marker>
            </defs>
            
            <path d="M 400 350 C 450 350, 550 200, 600 200" fill="none" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
            <rect x="470" y="260" width="70" height="20" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="1" />
            <text x="505" y="274" fontFamily="Inter" fontSize="10" fill="#3B82F6" textAnchor="middle" fontWeight="600">Success</text>
            
            <path d="M 400 700 C 500 700, 500 250, 600 250" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
            <path d="M 950 200 C 1000 200, 1000 200, 1050 200" fill="none" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
          </svg>

          {/* Login Screen Node */}
          <div className="absolute top-[100px] left-[50px] w-[350px] bg-white rounded-xl shadow-lg ring-2 ring-blue-500 z-20">
            <div className="absolute -right-1.5 top-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-crosshair z-30"></div>
            <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 bg-slate-300 rounded-full border-2 border-white cursor-crosshair hover:bg-blue-500 z-30"></div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-sm">
                  <Key className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">Login Screen</h3>
                  <div className="text-blue-100 text-[10px] font-medium opacity-90">/auth/login</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-green-400 w-2 h-2 rounded-full shadow-sm"></div>
                <MoreHorizontal className="w-4 h-4 text-white/80 cursor-pointer hover:text-white" />
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Components</span>
                  <span className="text-blue-600">7 items</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2 group/item cursor-pointer">
                    <div className="mt-1 text-slate-300 group-hover/item:text-slate-400">
                      <GripVertical className="w-3 h-3" />
                    </div>
                    <div className="flex-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded p-2 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-700">Email Input</span>
                        </div>
                        <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">REQ</span>
                      </div>
                      <div className="text-[10px] text-slate-500 pl-4 border-l-2 border-slate-200">
                        Validates format • Auto-focus
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 group/item cursor-pointer">
                    <div className="mt-1 text-slate-300 group-hover/item:text-slate-400">
                      <GripVertical className="w-3 h-3" />
                    </div>
                    <div className="flex-1 bg-white border-2 border-blue-500 shadow-sm rounded p-2 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MousePointerClick className="w-3 h-3 text-blue-500" />
                          <span className="text-xs font-bold text-slate-900">Login Button</span>
                        </div>
                      </div>
                      <div className="mt-1 text-[10px] text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                        on_click → Dashboard
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-2 py-1.5 text-[10px] text-slate-400 hover:text-blue-600 border border-dashed border-slate-200 hover:border-blue-300 rounded flex items-center justify-center gap-1 transition-colors">
                  <Plus className="w-3 h-3" /> Add Component
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Logic</div>
                <div className="space-y-1">
                  <div className="flex items-start gap-2 text-[10px] text-slate-600 bg-yellow-50/50 p-1.5 rounded border border-yellow-100">
                    <AlertCircle className="w-3 h-3 text-yellow-600 shrink-0 mt-0.5" />
                    <span>If <strong>auth_error</strong> show toast "Invalid Credentials"</span>
                  </div>
                  <div className="flex items-start gap-2 text-[10px] text-slate-600 bg-green-50/50 p-1.5 rounded border border-green-100">
                    <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
                    <span>If <strong>success</strong> redirect to Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Node */}
          <div className="absolute top-[100px] left-[600px] w-[350px] bg-white rounded-xl shadow-md border border-slate-200 z-10 hover:shadow-lg transition-shadow">
            <div className="absolute -left-1.5 top-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-crosshair z-30"></div>
            <div className="absolute -right-1.5 top-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-crosshair z-30"></div>

            <div className="bg-slate-50 p-4 rounded-t-xl flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white border border-slate-200 rounded-md">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-sm">Dashboard</h3>
                  <div className="text-slate-400 text-[10px] font-medium">/app/home</div>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                <div className="bg-blue-50 border border-blue-200 rounded p-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-bold text-blue-900">Start Practice Btn</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Voice Practice Node */}
          <div className="absolute top-[100px] left-[1050px] w-[350px] bg-white rounded-xl shadow-md border border-slate-200 z-10">
            <div className="absolute -left-1.5 top-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-crosshair z-30"></div>

            <div className="bg-slate-50 p-4 rounded-t-xl flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white border border-slate-200 rounded-md">
                  <Mic className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-sm">Voice Practice</h3>
                  <div className="text-slate-400 text-[10px] font-medium">/app/practice</div>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-30">
        <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 bg-slate-50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Properties</span>
          <span className="text-[10px] text-slate-400 font-mono">ID: login_v1</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Login Screen</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Defined</span>
                <span className="text-xs text-slate-500">7 Components</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">Page Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-500 uppercase">Route Path</label>
                <input type="text" defaultValue="/auth/login" className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-700" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-500 uppercase">Type</label>
                <select className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-700">
                  <option>Full Screen</option>
                  <option>Modal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>AI Suggestions</span>
              <button
                onClick={handleGetSuggestions}
                disabled={isGenerating}
                className="text-[10px] text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3" />
                {isGenerating ? 'Loading...' : 'Get Ideas'}
              </button>
            </h3>
            {showSuggestions && suggestions.length > 0 ? (
              <div className="space-y-2">
                {suggestions.map((sug, idx) => (
                  <div key={idx} className="bg-purple-50 border border-purple-100 rounded-lg p-2.5">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-bold text-purple-900">{sug.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        sug.priority === 'high' ? 'bg-red-100 text-red-600' :
                        sug.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>{sug.priority}</span>
                    </div>
                    <p className="text-[10px] text-purple-700 leading-relaxed">{sug.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-slate-100">
                Click "Get Ideas" for AI-powered UX suggestions
              </div>
            )}
          </div>

          <div className="pt-4 mt-8 border-t border-slate-200 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors">
              <Code className="w-3.5 h-3.5" /> Generate React Code
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 py-2 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors">
              <Wand2 className="w-3.5 h-3.5 text-purple-500" /> Auto-Arrange Layout
            </button>
          </div>
        </div>
      </aside>

      {/* AI Prompt Dialog */}
      {showAIPrompt && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAIPrompt(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Generate Wireframe with AI</h2>
                  <p className="text-purple-100 text-xs">Describe your screen and let AI create it</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIPrompt(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  What screen do you want to create?
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g., 'Create a profile settings screen with name, email, password change, and notification preferences'"
                  className="w-full h-32 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  autoFocus
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900">
                    <strong className="font-semibold">Tip:</strong> Be specific about components, layouts, and interactions for best results.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAIPrompt(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateWireframe}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Generate Wireframe
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}