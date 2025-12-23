import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/config/supabase';
import { 
  User, ShieldCheck, CreditCard, Trash2, Settings as SettingsIcon, Bell, 
  Palette, Globe, Zap, Database, Cpu, Mic, Plus, Users, Key, Eye,
  Check, AlertCircle, X, Smartphone, Shield, Laptop, Monitor, LogOut,
  CheckCircle2, AlertTriangle, Circle, ShieldAlert, ChevronDown, Edit2, Loader2
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const passwordStrength = () => {
    if (newPassword.length === 0) return { percent: 0, label: 'None', color: 'bg-slate-300' };
    if (newPassword.length < 8) return { percent: 25, label: 'Weak', color: 'bg-red-500' };
    if (newPassword.length < 12) return { percent: 50, label: 'Medium', color: 'bg-amber-500' };
    return { percent: 75, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = passwordStrength();
  const passwordsMatch = confirmPassword && newPassword === confirmPassword;

  // Get current session info
  const getCurrentSession = () => {
    const userAgent = navigator.userAgent;
    let device = 'Unknown Device';
    let icon = Laptop;
    
    if (userAgent.includes('Mac')) {
      device = 'Mac • ' + (userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Safari') ? 'Safari' : 'Browser');
      icon = Laptop;
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      device = 'iOS • ' + (userAgent.includes('Safari') ? 'Safari' : 'Browser');
      icon = Smartphone;
    } else if (userAgent.includes('Windows')) {
      device = 'Windows • ' + (userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Edge') ? 'Edge' : 'Browser');
      icon = Monitor;
    }
    
    return {
      device,
      icon,
      location: 'Unknown',
      ip: 'N/A',
      lastActive: 'Active now',
      current: true
    };
  };

  const activeSessions = user ? [getCurrentSession()] : [];

  // Login history - simplified version (in production, store this in database)
  const loginHistory = user ? [
    { date: new Date().toLocaleString('nl-NL'), device: '💻 ' + getCurrentSession().device, location: 'Current session', status: 'Success', suspicious: false }
  ] : [];

  const integrations = [
    { name: 'Aura', icon: Zap, connected: true },
    { name: 'Supabase', icon: Database, connected: true },
    { name: 'Claude', icon: Cpu, connected: true },
    { name: 'ElevenLabs', icon: Mic, connected: false },
    { name: 'Stripe', icon: CreditCard, connected: true }
  ];

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className="w-[280px] bg-slate-50 border-r border-slate-200 overflow-y-auto flex-none pb-10">
        <div className="p-4 space-y-8">
          
          {/* Account Section */}
          <div className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Account</h3>
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors group">
              <User className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
              <span className="text-[15px] font-medium">Profile</span>
            </button>

            <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-r-md border-l-[3px] border-blue-600 transition-colors -ml-4 pl-7 w-[calc(100%+16px)]">
              <ShieldCheck className="w-[18px] h-[18px] text-blue-600" />
              <span className="text-[15px] font-semibold">Password & Security</span>
            </div>

            <button className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors group">
              <div className="flex items-center gap-3">
                <CreditCard className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
                <span className="text-[15px] font-medium">Billing</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">PRO</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors group">
              <Trash2 className="w-[18px] h-[18px] opacity-70" />
              <span className="text-[15px] font-medium">Delete Account</span>
            </button>
          </div>

          <div className="h-px bg-slate-200 mx-3"></div>

          {/* Preferences Section */}
          <div className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preferences</h3>
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors group">
              <SettingsIcon className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
              <span className="text-[15px] font-medium">General</span>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors group">
              <div className="flex items-center gap-3">
                <Bell className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
                <span className="text-[15px] font-medium">Notifications</span>
              </div>
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">3</div>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors group">
              <Palette className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
              <span className="text-[15px] font-medium">Appearance</span>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors group">
              <div className="flex items-center gap-3">
                <Globe className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
                <span className="text-[15px] font-medium">Language</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">English</span>
            </button>
          </div>

          <div className="h-px bg-slate-200 mx-3"></div>

          {/* Integrations Section */}
          <div className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Integrations</h3>
            
            {integrations.map((integration, idx) => {
              const Icon = integration.icon;
              return (
                <div key={idx} className="flex items-center justify-between px-3 py-2 text-slate-600 rounded-md group cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-3">
                    <Icon className="w-[18px] h-[18px] text-slate-400" />
                    <span className="text-[15px] font-medium">{integration.name}</span>
                  </div>
                  {integration.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
              );
            })}

            <button className="w-full text-left px-3 py-2 mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-2">
              <Plus className="w-3 h-3" /> Add Integration
            </button>
          </div>

          <div className="h-px bg-slate-200 mx-3"></div>

          {/* Workspace Section */}
          <div className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Workspace</h3>
            <button className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors group">
              <div className="flex items-center gap-3">
                <Users className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
                <span className="text-[15px] font-medium">Team</span>
              </div>
              <span className="text-xs text-slate-400">1 member</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors group">
              <Key className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
              <span className="text-[15px] font-medium">Roles & Permissions</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Right Panel (Content) */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[900px] mx-auto px-16 py-12 pb-24">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Password & Security</h1>
            <p className="text-base text-slate-500 mt-2">Manage your password, 2FA, and security settings.</p>
          </div>

          {/* Section 1: Change Password */}
          <section className="mb-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Change Password</h2>
                <p className="text-sm text-slate-500 mt-1">Update your password regularly for security.</p>
              </div>

              <form className="space-y-5" onSubmit={handlePasswordChange}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                  <div className="relative group">
                    <input 
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-11 px-4 text-base bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                    <div className="relative group">
                      <input 
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-11 px-4 text-base bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Password Strength */}
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">
                          Password strength: <span className={`font-bold ${strength.percent >= 50 ? 'text-emerald-600' : 'text-red-600'}`}>{strength.label}</span>
                        </span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} rounded-full transition-all duration-300`} style={{ width: `${strength.percent}%` }}></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${newPassword.length >= 8 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {newPassword.length >= 8 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} At least 8 characters
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${/[A-Z]/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {/[A-Z]/.test(newPassword) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} One uppercase letter
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${/[0-9]/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {/[0-9]/.test(newPassword) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} One number
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${/[!@#$%^&*]/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {/[!@#$%^&*]/.test(newPassword) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} One special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                  <input 
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 px-4 text-base bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                  />
                  {passwordsMatch && (
                    <p className="text-[13px] text-emerald-600 flex items-center gap-1 mt-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    disabled={isUpdatingPassword}
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdatingPassword || !passwordsMatch || newPassword.length < 8}
                    className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Section 2: 2FA */}
          <section className="mb-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 relative overflow-hidden">
              <div className="absolute top-8 right-8 bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[3px]" /> Enabled
              </div>

              <div className="mb-6 pr-24">
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Two-Factor Authentication (2FA)</h2>
                <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account.</p>
              </div>

              <div className="flex gap-8 border-t border-slate-100 pt-6">
                <div className="w-[70%] space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 font-medium">2FA is currently enabled using authenticator app</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-slate-800">Google Authenticator</span>
                        <span className="text-xs text-slate-400">• Last used: 2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 font-medium">Backup Codes</p>
                      <p className="text-sm text-slate-500 mt-1">You have 8 unused backup codes remaining</p>
                    </div>
                  </div>
                </div>

                <div className="w-[30%] flex flex-col items-end gap-3 pl-8 border-l border-slate-100">
                  <button className="w-full py-2 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-colors">
                    View Backup Codes
                  </button>
                  <button className="w-full py-2 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-colors">
                    Regenerate Codes
                  </button>
                  <button className="w-full py-2 px-4 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors">
                    Disable 2FA
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Active Sessions */}
          <section className="mb-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Active Sessions</h2>
                <p className="text-sm text-slate-500 mt-1">Manage where you're logged in.</p>
              </div>

              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeSessions.map((session, idx) => {
                    const Icon = session.icon;
                    return (
                      <tr key={idx} className={session.current ? 'bg-blue-50/30' : 'hover:bg-slate-50 transition-colors'}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-slate-500" />
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{session.device}</div>
                              {session.current && (
                                <div className="text-[10px] font-bold text-blue-600 bg-blue-100 inline-block px-1.5 rounded mt-0.5 uppercase tracking-wide">
                                  Current Device
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{session.location}</td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-500">{session.ip}</td>
                        <td className={`px-6 py-4 text-sm font-medium ${session.current ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {session.lastActive}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            disabled={session.current}
                            className={`text-sm font-medium ${
                              session.current 
                                ? 'text-slate-400 cursor-not-allowed' 
                                : 'text-blue-600 hover:text-blue-800 hover:underline'
                            }`}
                          >
                            Sign Out
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <button className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-2 hover:bg-red-50 px-3 py-1.5 rounded transition-colors w-fit">
                  <LogOut className="w-4 h-4" /> Sign Out All Other Sessions
                </button>
              </div>
            </div>
          </section>

          {/* Section 4: Login History */}
          <section className="mb-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Login History</h2>
                <p className="text-sm text-slate-500 mt-1">Recent login attempts to your account.</p>
              </div>

              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loginHistory.map((log, idx) => (
                    <tr key={idx} className={log.suspicious ? 'hover:bg-red-50/30' : 'hover:bg-slate-50'}>
                      <td className="px-6 py-3.5 text-sm font-medium text-slate-900">{log.date}</td>
                      <td className="px-6 py-3.5 text-sm text-slate-600">{log.device}</td>
                      <td className="px-6 py-3.5 text-sm text-slate-600">
                        {log.location}
                        {log.suspicious && <span className="text-red-500 text-xs font-bold ml-1">Suspicious</span>}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${
                          log.status === 'Success' 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                            : 'text-red-700 bg-red-50 border-red-100'
                        }`}>
                          {log.status === 'Success' ? '✅' : '❌'} {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Showing {loginHistory.length} of 24 entries</span>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  View Full History
                </button>
              </div>
            </div>
          </section>

          {/* Section 5: Recommendations */}
          <section className="mb-16">
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 flex gap-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600 border border-amber-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Security Recommendations</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Use a strong, unique password
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Enable two-factor authentication
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
                    <AlertTriangle className="w-4 h-4" /> Review login history regularly
                    <button className="text-amber-800 underline hover:no-underline ml-1">Review</button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Circle className="w-4 h-4" /> Add a backup email address
                    <button className="text-blue-600 hover:underline ml-1 font-medium">Add now</button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Circle className="w-4 h-4" /> Set up account recovery options
                    <button className="text-blue-600 hover:underline ml-1 font-medium">Configure</button>
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-lg p-3 border border-amber-100">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Account Security Score</span>
                    <span className="text-xl font-bold text-slate-900">78<span className="text-sm text-slate-400 font-normal">/100</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 w-[78%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}