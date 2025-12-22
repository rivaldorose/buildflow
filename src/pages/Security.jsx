import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, ChevronDown, ScanLine, Briefcase, Wind, Users, Layers,
  AlertOctagon, AlertCircle, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown,
  XCircle, ShieldAlert, Lock, FileWarning, ArrowRight, Check, Scan, Calendar,
  BookOpen, FileText, Code, Shield, Database, Smartphone, Sparkles, ArrowUp
} from 'lucide-react';

export default function Security() {
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  // Mock security data
  const projectsSecurityData = [
    {
      id: 1,
      name: 'DealMaker',
      icon: Briefcase,
      color: 'bg-indigo-600',
      platforms: ['iOS', 'Android'],
      score: 78,
      status: 'warning',
      statusLabel: 'Needs Attention',
      lastScan: '2 hours ago',
      critical: 2,
      warnings: 4,
      passed: 32,
      trend: 5,
      trendUp: true,
      categories: {
        apiSecurity: 85,
        dataSecurity: 90,
        platformCompliance: 70,
        legalCompliance: 60
      },
      criticalIssues: [
        {
          title: 'Rate limiting not configured',
          description: 'Risk: API abuse, potential denial of service.',
          action: 'Fix Now'
        },
        {
          title: 'PII handling not documented',
          description: 'Risk: GDPR violations, app store rejection.',
          action: 'Create Policy'
        }
      ]
    },
    {
      id: 2,
      name: 'Breathe',
      icon: Wind,
      color: 'bg-teal-600',
      platforms: ['iOS', 'Web'],
      score: 92,
      status: 'good',
      statusLabel: 'Good Standing',
      lastScan: '1 day ago',
      critical: 0,
      warnings: 2,
      passed: 40,
      trend: 8,
      trendUp: true
    },
    {
      id: 3,
      name: 'Konsensi',
      icon: Users,
      color: 'bg-pink-600',
      platforms: ['Web'],
      score: 45,
      status: 'critical',
      statusLabel: 'Critical',
      lastScan: '3 days ago',
      critical: 3,
      warnings: 8,
      passed: 15,
      trend: -10,
      trendUp: false,
      categories: {
        apiSecurity: 50,
        dataSecurity: 40
      },
      topFixes: [
        'No SSL certificate detected',
        'Passwords stored as plain text'
      ]
    },
    {
      id: 4,
      name: 'BuildFlow',
      icon: Layers,
      color: 'bg-slate-900',
      platforms: ['Web'],
      score: 88,
      status: 'good',
      statusLabel: 'Good',
      lastScan: '5 hours ago',
      critical: 0,
      warnings: 3,
      passed: 38,
      trend: 2,
      trendUp: true
    }
  ];

  const overallScore = Math.round(projectsSecurityData.reduce((sum, p) => sum + p.score, 0) / projectsSecurityData.length);
  const totalCritical = projectsSecurityData.reduce((sum, p) => sum + p.critical, 0);
  const goodCount = projectsSecurityData.filter(p => p.score >= 90).length;
  const warningCount = projectsSecurityData.filter(p => p.score >= 70 && p.score < 90).length;
  const criticalCount = projectsSecurityData.filter(p => p.score < 70).length;

  const issuesByCategory = [
    { name: 'API Security', icon: Shield, issues: 3 },
    { name: 'Data Security', icon: Database, issues: 2 },
    { name: 'Platform', icon: Smartphone, issues: 8 },
    { name: 'Vibe Coding', icon: Sparkles, issues: 4 }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'good': 'border-l-emerald-500',
      'warning': 'border-l-orange-500',
      'critical': 'border-l-red-500'
    };
    return colors[status] || 'border-l-slate-300';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'good': 'bg-emerald-50 text-emerald-600',
      'warning': 'bg-orange-50 text-orange-600',
      'critical': 'bg-red-50 text-red-600 animate-pulse'
    };
    return badges[status] || 'bg-slate-100 text-slate-600';
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1440px] mx-auto p-8 pb-20">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <span className="hover:text-slate-900 cursor-pointer">Dashboard</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-slate-900">Security Overview</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Security & Compliance</h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <span>{projectsSecurityData.length} projects monitored</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-red-600 font-semibold">{totalCritical} critical issues</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Last scan: 2 hours ago</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Overall Score</span>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Needs Attention</span>
              </div>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="26" stroke="#E2E8F0" strokeWidth="4" fill="none"></circle>
                <circle cx="28" cy="28" r="26" stroke="#F97316" strokeWidth="4" fill="none" strokeDasharray="163" strokeDashoffset="35" strokeLinecap="round"></circle>
              </svg>
              <span className="absolute text-sm font-bold text-slate-900">{overallScore}</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Export Report</button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">Run Full Scan</button>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {totalCritical > 0 && (
          <div className="bg-red-600 rounded-lg shadow-sm border border-red-700 p-4 mb-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/20 rounded-lg shrink-0">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{totalCritical} Critical Security Issues Require Immediate Attention</h3>
                <p className="text-red-100 text-sm">Vulnerabilities detected in DealMaker, Konsensi, and Breathe projects. Immediate remediation recommended.</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="flex items-center gap-1.5 bg-red-800/50 px-2 py-1 rounded border border-red-500/30">
                    <XCircle className="w-3 h-3" /> Rate limiting missing
                  </span>
                  <span className="flex items-center gap-1.5 bg-red-800/50 px-2 py-1 rounded border border-red-500/30">
                    <ShieldAlert className="w-3 h-3" /> API Keys Exposed
                  </span>
                  <span className="flex items-center gap-1.5 bg-red-800/50 px-2 py-1 rounded border border-red-500/30">
                    <Lock className="w-3 h-3" /> GDPR Violation
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <button className="text-sm font-medium hover:text-red-100 px-3 py-2 transition-colors">View All Issues</button>
              <button className="bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors w-full md:w-auto text-center">
                Fix Now
              </button>
            </div>
          </div>
        )}

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Projects Security */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-500" />
              Projects Security Status
            </h2>

            {projectsSecurityData.map((project) => {
              const Icon = project.icon;
              const hasCritical = project.critical > 0;

              return (
                <div 
                  key={project.id}
                  className={`bg-white rounded-xl border border-slate-200 border-l-4 ${getStatusColor(project.status)} shadow-sm overflow-hidden`}
                >
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${project.color} flex items-center justify-center text-white shadow-sm`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            {project.platforms.map((platform, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-medium text-slate-600">
                                {platform}
                              </span>
                            ))}
                            <span>• Last scan: {project.lastScan}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-3xl font-bold ${
                          project.status === 'good' ? 'text-emerald-500' :
                          project.status === 'warning' ? 'text-orange-500' :
                          'text-red-500'
                        }`}>
                          {project.score}
                          <span className="text-lg text-slate-300 font-medium">/100</span>
                        </span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded mt-1 ${getStatusBadge(project.status)}`}>
                          {project.statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-100">
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Critical</div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-lg font-bold ${project.critical > 0 ? 'text-red-600' : 'text-slate-300'}`}>
                            {project.critical}
                          </span>
                          {project.critical > 0 && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Warnings</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold text-orange-600">{project.warnings}</span>
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Passed</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold text-emerald-600">{project.passed}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Trend</div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-lg font-bold ${project.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                            {project.trendUp ? '+' : ''}{project.trend}
                          </span>
                          {project.trendUp ? 
                            <TrendingUp className="w-4 h-4 text-emerald-500" /> : 
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          }
                        </div>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    {project.categories && (
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        {Object.entries(project.categories).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-xs font-medium mb-1.5">
                              <span className="text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className={value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-orange-600' : 'text-red-600'}>
                                {value}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-orange-400' : 'bg-red-500'
                                }`}
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Critical Issues */}
                    {project.criticalIssues && (
                      <div className="bg-red-50 rounded-lg border border-red-100 overflow-hidden mb-4">
                        <div className="px-4 py-3 border-b border-red-100 flex items-center justify-between">
                          <span className="text-sm font-bold text-red-800 flex items-center gap-2">
                            <ChevronDown className="w-4 h-4" />
                            {project.critical} Critical Issues
                          </span>
                        </div>
                        <div className="divide-y divide-red-100">
                          {project.criticalIssues.map((issue, idx) => (
                            <div key={idx} className="p-4 flex items-start justify-between group hover:bg-red-100/50 transition-colors">
                              <div className="flex gap-3">
                                <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold text-red-900">{issue.title}</p>
                                  <p className="text-xs text-red-700 mt-0.5">{issue.description}</p>
                                </div>
                              </div>
                              <button className="text-xs font-semibold bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded hover:bg-red-50 transition-colors">
                                {issue.action}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Good Status */}
                    {project.status === 'good' && !project.criticalIssues && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium">No critical issues detected. System is secure.</span>
                      </div>
                    )}

                    {/* Critical Top Fixes */}
                    {project.topFixes && (
                      <div className="bg-red-50 rounded-lg border border-red-100 p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-red-900">Top Priority Fixes</h4>
                          <button className="text-xs text-red-600 underline">View all {project.critical}</button>
                        </div>
                        <div className="space-y-3">
                          {project.topFixes.map((fix, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-sm text-red-800 font-medium">{fix}</span>
                              <button className="text-xs bg-white border border-red-200 text-red-700 px-2 py-1 rounded">
                                {idx === 0 ? 'Configure SSL' : 'Encrypt'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <button className="text-sm font-medium text-slate-500 flex items-center gap-2 hover:text-slate-900">
                        <ChevronRight className="w-4 h-4" /> {project.warnings} Warnings
                      </button>
                      <div className="flex gap-3">
                        {hasCritical ? (
                          <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded shadow-sm transition-colors">
                            Fix Critical Issues
                          </button>
                        ) : (
                          <>
                            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                              Run Scan
                            </button>
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline px-3 py-1.5 flex items-center gap-1">
                              View Details <ArrowRight className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Summary & Actions */}
          <div className="lg:col-span-4 space-y-6">

            {/* Score Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Overall Status</h3>
              
              <div className="flex justify-center mb-6 relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="#F1F5F9" strokeWidth="12" fill="none"></circle>
                  <circle 
                    cx="96" cy="96" r="80" stroke="#F97316" strokeWidth="12" fill="none" 
                    strokeDasharray="502" strokeDashoffset="110" strokeLinecap="round"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900">{overallScore}</span>
                  <span className="text-sm font-medium text-slate-500">Avg. Score</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 bg-emerald-50 py-2 rounded border border-emerald-100 mb-6">
                <ArrowUp className="w-4 h-4" />
                <span className="font-semibold">+13 points this month</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="font-medium text-slate-700">Good (90+)</span>
                  </div>
                  <span className="font-bold text-slate-900">{goodCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="font-medium text-slate-700">Needs Work (70-89)</span>
                  </div>
                  <span className="font-bold text-slate-900">{warningCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="font-medium text-slate-700">Critical (&lt;70)</span>
                  </div>
                  <span className="font-bold text-slate-900">{criticalCount}</span>
                </div>
              </div>
            </div>

            {/* Issues Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Issues by Category</h3>
              </div>
              <div className="p-6 pt-2">
                <div className="divide-y divide-slate-50">
                  {issuesByCategory.map((category, idx) => {
                    const Icon = category.icon;
                    return (
                      <div key={idx} className="py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-6 px-6 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded bg-slate-100 text-slate-500">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{category.name}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          category.issues >= 5 ? 'bg-red-100 text-red-600' :
                          category.issues >= 3 ? 'bg-orange-100 text-orange-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {category.issues} issues
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Compliance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">GDPR Status</span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]" title="Breathe: Compliant">
                      ✓
                    </div>
                    <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-[10px]" title="DealMaker: Partial">
                      !
                    </div>
                    <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-[10px]" title="Konsensi: Non-compliant">
                      ✕
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">App Store Ready</span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                      ✓
                    </div>
                    <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                      !
                    </div>
                  </div>
                </div>
                <button className="w-full text-xs font-medium text-blue-600 hover:text-blue-700 mt-2 text-left">
                  View Compliance Reports →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                <Scan className="w-4 h-4" />
                Scan All Projects
              </button>
              <button className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                Schedule Scans
              </button>
            </div>

            {/* Resources */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Security Resources</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group">
                    <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                    OWASP Top 10 Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                    GDPR Compliance Checklist
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group">
                    <Code className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                    Vibe Coding Best Practices
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}