
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  Layers,
  Plus,
  Bell
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function Layout({ children, currentPageName }) {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  return (
    <div className="bg-[#F8FAFC] text-slate-900 h-full flex flex-col">
      {/* Top Navigation */}
      <nav className="shrink-0 h-16 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 text-lg">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
              <Layers className="text-white w-4 h-4" />
            </div>
            BuildFlow
          </Link>

          {/* Center Tabs */}
          <div className="hidden md:flex items-center h-full gap-1">
            <Link 
              to={createPageUrl('Home')} 
              className={`h-full flex items-center px-4 text-sm font-medium border-b-2 transition-colors ${
                currentPageName === 'Home' 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              Home
            </Link>
            <Link 
              to={createPageUrl('Projects')} 
              className={`h-full flex items-center px-4 text-sm font-medium border-b-2 transition-colors ${
                currentPageName === 'Projects' 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              Projects
            </Link>
            <Link 
              to={createPageUrl('Pages')} 
              className={`h-full flex items-center px-4 text-sm font-medium border-b-2 transition-colors ${
                currentPageName === 'Pages' 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              Pages
            </Link>
            <Link 
              to={createPageUrl('DesignSystems')} 
              className={`h-full flex items-center px-4 text-sm font-medium border-b-2 transition-colors ${
                currentPageName === 'DesignSystems' 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              Design System
            </Link>
            <Link 
              to={createPageUrl('Security')} 
              className={`h-full flex items-center px-4 text-sm font-medium border-b-2 transition-colors ${
                currentPageName === 'Security' 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              Security
            </Link>
            <Link 
              to={createPageUrl('Sprint')} 
              className={`h-full flex items-center px-4 text-sm font-medium border-b-2 transition-colors ${
                currentPageName === 'Sprint' 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              Sprint
            </Link>
            <Link 
              to={createPageUrl('Settings')} 
              className={`h-full flex items-center px-4 text-sm font-medium border-b-2 transition-colors ${
                currentPageName === 'Settings' 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              Settings
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl('ProjectSetup')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                  {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-900">{user?.full_name || user?.email || 'User'}</div>
                  <div className="text-[10px] text-slate-500">{user?.role === 'admin' ? 'Admin' : 'User'}</div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Inloggen
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
