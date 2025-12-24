import React, { useState } from 'react';
import { 
  Search, ChevronDown, Lock, UserPlus, HelpCircle, Mail, Star, Play,
  Edit2, Home, LayoutDashboard, ShoppingCart, CreditCard, Heart,
  Check, Bell, MessageSquare, Calendar, Image, Video, Mic, Settings,
  TrendingUp, BookOpen, Award, Camera, User, FileText, MapPin,
  DollarSign, Headphones, Sparkles, ShieldCheck, Package, CheckCircle2
} from 'lucide-react';

export default function TemplateLibrary({ onSelectTemplate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('auth');

  const templates = [
    {
      category: 'auth',
      categoryName: 'Authentication & Onboarding',
      icon: Lock,
      templates: [
        {
          id: 'login',
          name: 'Login Screen',
          icon: Lock,
          description: 'Email/password login with social auth',
          components: ['Email input', 'Password input', 'Login button', 'Social login'],
          popular: true
        },
        {
          id: 'signup',
          name: 'Signup Screen',
          icon: UserPlus,
          description: 'User registration with validation',
          components: ['Name inputs', 'Email', 'Password', 'Terms checkbox'],
          popular: true
        },
        {
          id: 'forgot-password',
          name: 'Forgot Password',
          icon: HelpCircle,
          description: 'Password reset flow',
          components: ['Email input', 'Send reset link button']
        },
        {
          id: 'email-verification',
          name: 'Email Verification',
          icon: Mail,
          description: 'Verify email after signup',
          components: ['Verification message', 'Resend button']
        },
        {
          id: 'onboarding-welcome',
          name: 'Welcome Screen',
          icon: Star,
          description: 'First-time user welcome',
          components: ['Hero image', 'Welcome message', 'Next button']
        },
        {
          id: '2fa',
          name: 'Two-Factor Auth',
          icon: ShieldCheck,
          description: '6-digit verification code',
          components: ['Code input', 'Verify button', 'Resend code']
        }
      ]
    },
    {
      category: 'main',
      categoryName: 'Main App Screens',
      icon: LayoutDashboard,
      templates: [
        {
          id: 'dashboard',
          name: 'Dashboard',
          icon: LayoutDashboard,
          description: 'App home with stats and actions',
          components: ['Stats cards', 'Quick actions', 'Recent activity'],
          popular: true
        },
        {
          id: 'feed',
          name: 'Feed / Timeline',
          icon: Image,
          description: 'Social feed with posts',
          components: ['Feed items', 'Like/comment', 'Create post button'],
          popular: true
        },
        {
          id: 'search',
          name: 'Search Screen',
          icon: Search,
          description: 'Search with filters',
          components: ['Search bar', 'Filters', 'Results list']
        },
        {
          id: 'profile',
          name: 'Profile Screen',
          icon: User,
          description: 'User profile with info and content',
          components: ['Avatar', 'Bio', 'Stats', 'Content tabs'],
          popular: true
        },
        {
          id: 'settings',
          name: 'Settings',
          icon: Settings,
          description: 'App settings and preferences',
          components: ['Setting groups', 'Toggles', 'Links']
        },
        {
          id: 'notifications',
          name: 'Notifications',
          icon: Bell,
          description: 'Activity notifications',
          components: ['Notification list', 'Mark read', 'Filters']
        },
        {
          id: 'messages',
          name: 'Messages Inbox',
          icon: MessageSquare,
          description: 'Conversation list',
          components: ['Conversation cards', 'Search', 'Compose button']
        },
        {
          id: 'chat',
          name: 'Chat Detail',
          icon: MessageSquare,
          description: 'One-on-one conversation',
          components: ['Message bubbles', 'Input', 'Send button']
        }
      ]
    },
    {
      category: 'ecommerce',
      categoryName: 'E-Commerce',
      icon: ShoppingCart,
      templates: [
        {
          id: 'shop',
          name: 'Product Catalog',
          icon: ShoppingCart,
          description: 'Browse products with filters',
          components: ['Product grid', 'Filters', 'Sort', 'Cart icon'],
          popular: true
        },
        {
          id: 'product-detail',
          name: 'Product Detail',
          icon: Package,
          description: 'Full product information',
          components: ['Image carousel', 'Variants', 'Add to cart', 'Reviews']
        },
        {
          id: 'cart',
          name: 'Shopping Cart',
          icon: ShoppingCart,
          description: 'Cart with totals',
          components: ['Cart items', 'Quantity controls', 'Totals', 'Checkout button']
        },
        {
          id: 'checkout',
          name: 'Checkout',
          icon: CreditCard,
          description: 'Multi-step checkout flow',
          components: ['Shipping', 'Payment', 'Review', 'Place order']
        },
        {
          id: 'order-confirmation',
          name: 'Order Confirmation',
          icon: Check,
          description: 'Successful order screen',
          components: ['Order number', 'Delivery info', 'Track button']
        }
      ]
    },
    {
      category: 'productivity',
      categoryName: 'Productivity',
      icon: Edit2,
      templates: [
        {
          id: 'todo-list',
          name: 'To-Do List',
          icon: CheckCircle2,
          description: 'Task management',
          components: ['Task items', 'Checkboxes', 'Add task', 'Filters'],
          popular: true
        },
        {
          id: 'calendar',
          name: 'Calendar View',
          icon: Calendar,
          description: 'Event calendar',
          components: ['Calendar grid', 'Event list', 'Add event']
        },
        {
          id: 'notes',
          name: 'Notes Editor',
          icon: FileText,
          description: 'Rich text editor',
          components: ['Title input', 'Text editor', 'Formatting toolbar']
        },
        {
          id: 'kanban',
          name: 'Kanban Board',
          icon: LayoutDashboard,
          description: 'Drag-and-drop task board',
          components: ['Columns', 'Draggable cards', 'Add card']
        }
      ]
    },
    {
      category: 'content',
      categoryName: 'Content & Media',
      icon: Video,
      templates: [
        {
          id: 'video-player',
          name: 'Video Player',
          icon: Video,
          description: 'Full-screen video playback',
          components: ['Video', 'Controls', 'Quality selector', 'Related videos']
        },
        {
          id: 'audio-player',
          name: 'Audio Player',
          icon: Headphones,
          description: 'Podcast/music player',
          components: ['Artwork', 'Controls', 'Progress bar', 'Speed control']
        },
        {
          id: 'photo-gallery',
          name: 'Photo Gallery',
          icon: Image,
          description: 'Grid of photos/albums',
          components: ['Photo grid', 'Albums', 'Multi-select']
        },
        {
          id: 'camera',
          name: 'Camera',
          icon: Camera,
          description: 'Take photos/videos',
          components: ['Camera preview', 'Shutter', 'Filters', 'Flash toggle']
        }
      ]
    },
    {
      category: 'booking',
      categoryName: 'Booking & Reservations',
      icon: Calendar,
      templates: [
        {
          id: 'listing-detail',
          name: 'Listing Detail',
          icon: Home,
          description: 'Property/service detail',
          components: ['Gallery', 'Info', 'Calendar', 'Reserve button']
        },
        {
          id: 'booking-form',
          name: 'Booking Screen',
          icon: Calendar,
          description: 'Make reservation',
          components: ['Guest details', 'Date picker', 'Payment', 'Confirm']
        },
        {
          id: 'my-bookings',
          name: 'My Bookings',
          icon: FileText,
          description: 'View reservations',
          components: ['Upcoming/past tabs', 'Booking cards', 'Cancel option']
        }
      ]
    },
    {
      category: 'finance',
      categoryName: 'Finance & Payments',
      icon: CreditCard,
      templates: [
        {
          id: 'wallet',
          name: 'Wallet / Balance',
          icon: CreditCard,
          description: 'View balance and cards',
          components: ['Balance card', 'Quick actions', 'Transactions']
        },
        {
          id: 'send-money',
          name: 'Send Money',
          icon: DollarSign,
          description: 'Transfer funds',
          components: ['Recipient selector', 'Amount input', 'Confirm']
        },
        {
          id: 'transactions',
          name: 'Transaction History',
          icon: FileText,
          description: 'Past transactions',
          components: ['Transaction list', 'Filters', 'Export']
        }
      ]
    }
  ];

  const filteredTemplates = templates.map(cat => ({
    ...cat,
    templates: cat.templates.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.templates.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTemplates.map(category => {
          const CategoryIcon = category.icon;
          const isExpanded = expandedCategory === category.category;
          
          return (
            <div key={category.category}>
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.category)}
                className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">{category.categoryName}</span>
                  <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {category.templates.length}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {category.templates.map(template => {
                    const TemplateIcon = template.icon;
                    return (
                      <div
                        key={template.id}
                        onClick={() => onSelectTemplate(template)}
                        className="ml-2 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                            <TemplateIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                                {template.name}
                              </h4>
                              {template.popular && (
                                <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded uppercase">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mb-2">{template.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {template.components.slice(0, 3).map((comp, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                  {comp}
                                </span>
                              ))}
                              {template.components.length > 3 && (
                                <span className="text-[10px] text-slate-400">
                                  +{template.components.length - 3}
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

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            Geen templates gevonden voor "{searchQuery}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-500 text-center">
          {templates.reduce((sum, cat) => sum + cat.templates.length, 0)} templates beschikbaar
        </div>
      </div>
    </div>
  );
}