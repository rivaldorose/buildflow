import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { ChevronRight, Layers } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const builderColors = {
  Lovable: 'bg-pink-100 text-pink-700 border-pink-200',
  Cursor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Base44: 'bg-violet-100 text-violet-700 border-violet-200',
  v0: 'bg-slate-100 text-slate-700 border-slate-200'
};

const statusColors = {
  Planning: 'bg-amber-500',
  Building: 'bg-blue-500',
  Review: 'bg-purple-500',
  Done: 'bg-emerald-500'
};

export default function ProjectCard({ project, featuresCount, doneCount }) {
  return (
    <Link 
      to={createPageUrl(`ProjectDetail?id=${project.id}`)}
      className="group block"
    >
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border border-slate-200/80">
              <Layers className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${builderColors[project.ai_builder] || builderColors.Base44}`}>
                  {project.ai_builder || 'Base44'}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${statusColors[project.status] || statusColors.Planning}`} />
                  <span className="text-xs text-slate-500">{project.status || 'Planning'}</span>
                </div>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
        </div>
        
        {project.description && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Progress</span>
            <span className="font-medium text-slate-700">{project.progress || 0}%</span>
          </div>
          <Progress value={project.progress || 0} className="h-2 bg-slate-100" />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{doneCount || 0} of {featuresCount || 0} features done</span>
          </div>
        </div>
      </div>
    </Link>
  );
}