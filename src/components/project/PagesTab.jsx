import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText, Trash2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const statusColors = {
  Todo: 'bg-slate-100 text-slate-700 border-slate-200',
  Doing: 'bg-blue-100 text-blue-700 border-blue-200',
  Done: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

export default function PagesTab({ pages, projectId }) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (name) => base44.entities.Page.create({
      project: projectId,
      name,
      status: 'Todo',
      order: pages.length,
      frontend_designer: 'None'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['pages', projectId]);
      setIsDialogOpen(false);
      setNewPageName('');
      toast.success('Page created!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Page.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['pages', projectId]);
      toast.success('Page deleted!');
    }
  });

  const handleCreate = () => {
    if (!newPageName.trim()) {
      toast.error('Please enter a page name');
      return;
    }
    createMutation.mutate(newPageName);
  };

  const sortedPages = [...pages].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-900">Pages</h3>
          <p className="text-sm text-slate-500">{pages.length} pages in this project</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      {sortedPages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No pages yet. Add your first page!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedPages.map(page => (
            <div 
              key={page.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{page.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[page.status]}`}>
                      {page.status}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(page.id);
                  }}
                  className="h-8 w-8 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {page.prompt && (
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{page.prompt}</p>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {page.frontend_designer !== 'None' ? page.frontend_designer : 'No designer'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(createPageUrl(`PageDetail?id=${page.id}`))}
                  className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                >
                  Open
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Page</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Page Name</label>
              <Input
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="e.g., Dashboard, Settings, Profile"
                className="mt-1"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={createMutation.isPending}
                className="flex-1 bg-violet-600 hover:bg-violet-700"
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}