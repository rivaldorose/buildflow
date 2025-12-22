import React from 'react';

export default function StatsCard({ icon: Icon, label, value, color = 'violet' }) {
  const colorClasses = {
    violet: 'from-violet-500 to-indigo-600 shadow-violet-200',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-200',
    amber: 'from-amber-500 to-orange-600 shadow-amber-200',
    blue: 'from-blue-500 to-cyan-600 shadow-blue-200'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}