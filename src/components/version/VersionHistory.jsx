import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  GitBranch, 
  GitCommit, 
  Clock, 
  RotateCcw,
  Plus,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function VersionHistory({ projectId, currentBranch = 'main', onBranchChange }) {
  const [selectedBranch, setSelectedBranch] = useState(currentBranch);
  const [newBranchName, setNewBranchName] = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: versions = [] } = useQuery({
    queryKey: ['versions', projectId, selectedBranch],
    queryFn: () => base44.entities.Version.filter({ 
      project: projectId,
      branch: selectedBranch 
    }).then(v => v.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))),
    enabled: !!projectId
  });

  const { data: allVersions = [] } = useQuery({
    queryKey: ['allVersions', projectId],
    queryFn: () => base44.entities.Version.filter({ project: projectId }),
    enabled: !!projectId
  });

  const branches = [...new Set(allVersions.map(v => v.branch))];

  const createVersionMutation = useMutation({
    mutationFn: async ({ message, branchName }) => {
      const pages = await base44.entities.Page.filter({ project: projectId });
      const features = await base44.entities.Feature.filter({ project: projectId });
      
      const snapshot = {
        pages: pages.map(p => ({
          id: p.id,
          name: p.name,
          prompt: p.prompt,
          features: p.features,
          frontend_code: p.frontend_code,
          status: p.status
        })),
        features: features.map(f => ({
          id: f.id,
          name: f.name,
          description: f.description,
          complexity: f.complexity,
          status: f.status
        }))
      };

      const lastVersion = versions[0];
      const versionNum = lastVersion 
        ? `v${parseInt(lastVersion.version_number.slice(1).split('.')[0]) + 1}.0.0`
        : 'v1.0.0';

      await base44.entities.Version.bulkCreate([
        {
          project: projectId,
          branch: branchName || selectedBranch,
          version_number: versionNum,
          commit_message: message,
          snapshot_data: snapshot,
          parent_version: lastVersion?.id,
          is_active: true
        }
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['versions']);
      queryClient.invalidateQueries(['allVersions']);
      setCommitMessage('');
      toast.success('Version saved');
    }
  });

  const revertMutation = useMutation({
    mutationFn: async (version) => {
      const snapshot = version.snapshot_data;
      
      if (snapshot.pages) {
        for (const page of snapshot.pages) {
          await base44.entities.Page.update(page.id, {
            name: page.name,
            prompt: page.prompt,
            features: page.features,
            frontend_code: page.frontend_code,
            status: page.status
          });
        }
      }

      await base44.entities.Version.update(version.id, { is_active: true });
      
      versions.forEach(v => {
        if (v.id !== version.id && v.is_active) {
          base44.entities.Version.update(v.id, { is_active: false });
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
      queryClient.invalidateQueries(['features']);
      queryClient.invalidateQueries(['versions']);
      toast.success('Reverted to version');
    }
  });

  const createBranch = () => {
    if (!newBranchName.trim()) return;
    setSelectedBranch(newBranchName);
    onBranchChange?.(newBranchName);
    setShowNewBranch(false);
    setNewBranchName('');
    toast.success(`Switched to branch: ${newBranchName}`);
  };

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    onBranchChange?.(branch);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Branch Selector */}
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-gray-400" />
        <Select value={selectedBranch} onValueChange={handleBranchChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {branches.map(branch => (
              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {showNewBranch ? (
          <div className="flex items-center gap-2">
            <Input
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="feature/new-design"
              className="w-48 h-9"
              onKeyDown={(e) => e.key === 'Enter' && createBranch()}
            />
            <Button size="icon" variant="ghost" onClick={createBranch} className="h-9 w-9">
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowNewBranch(false)} className="h-9 w-9">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setShowNewBranch(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Branch
          </Button>
        )}
      </div>

      {/* Create Snapshot */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-violet-600 hover:bg-violet-700">
            <GitCommit className="w-4 h-4 mr-2" />
            Create Snapshot
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Version Snapshot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Commit Message</label>
              <Textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Describe your changes..."
                className="min-h-[100px]"
              />
            </div>
            <Button 
              onClick={() => createVersionMutation.mutate({ message: commitMessage })}
              disabled={!commitMessage.trim() || createVersionMutation.isPending}
              className="w-full"
            >
              Save Version
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            History ({versions.length})
          </span>
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {versions.map((version, index) => (
            <div 
              key={version.id}
              className={`p-3 rounded-lg border transition-colors ${
                version.is_active 
                  ? 'border-violet-200 bg-violet-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-1.5 rounded-md ${version.is_active ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-600'}`}>
                    <GitCommit className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold text-gray-900">
                        {version.version_number}
                      </span>
                      {version.is_active && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-violet-600 text-white rounded-full font-medium">
                          ACTIVE
                        </span>
                      )}
                      {index === 0 && !version.is_active && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium border border-blue-100">
                          LATEST
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{version.commit_message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(version.created_date)}
                      </span>
                      <span>by {version.created_by}</span>
                    </div>
                  </div>
                </div>
                
                {!version.is_active && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => revertMutation.mutate(version)}
                    disabled={revertMutation.isPending}
                    className="ml-2 text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Revert
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}