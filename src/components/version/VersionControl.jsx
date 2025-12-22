import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import VersionHistory from './VersionHistory';

export default function VersionControl({ projectId, currentBranch = 'main', onBranchChange }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <GitBranch className="w-4 h-4" />
          <span className="hidden sm:inline">Version Control</span>
          <span className="text-xs text-gray-500 hidden md:inline">({currentBranch})</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Version Control</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <VersionHistory 
            projectId={projectId} 
            currentBranch={currentBranch}
            onBranchChange={(branch) => {
              onBranchChange?.(branch);
              setOpen(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}