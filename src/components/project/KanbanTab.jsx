import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from "sonner";

const columns = ['Todo', 'Doing', 'Review', 'Done'];

const columnStyles = {
  Todo: { bg: 'bg-slate-50', border: 'border-slate-200', header: 'text-slate-600' },
  Doing: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'text-blue-600' },
  Review: { bg: 'bg-purple-50', border: 'border-purple-200', header: 'text-purple-600' },
  Done: { bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'text-emerald-600' }
};

const complexityColors = {
  Simple: 'border-l-emerald-500',
  Medium: 'border-l-amber-500',
  Hard: 'border-l-red-500'
};

export default function KanbanTab({ features, projectId }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Feature.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['features', projectId]);
      queryClient.invalidateQueries(['project', projectId]);
    }
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    
    updateMutation.mutate({ id: draggableId, status: newStatus });
    toast.success(`Moved to ${newStatus}`);
  };

  const getColumnFeatures = (status) => 
    features.filter(f => f.status === status).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map(column => {
          const style = columnStyles[column];
          const columnFeatures = getColumnFeatures(column);
          
          return (
            <div key={column} className={`rounded-2xl ${style.bg} border ${style.border} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${style.header}`}>{column}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.header}`}>
                  {columnFeatures.length}
                </span>
              </div>
              
              <Droppable droppableId={column}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] transition-colors rounded-xl ${
                      snapshot.isDraggingOver ? 'bg-white/50' : ''
                    }`}
                  >
                    {columnFeatures.map((feature, index) => (
                      <Draggable key={feature.id} draggableId={feature.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white rounded-xl p-4 border-l-4 ${complexityColors[feature.complexity]} 
                              shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing
                              ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}`}
                          >
                            <h4 className="font-medium text-slate-900 mb-1">{feature.name}</h4>
                            {feature.description && (
                              <p className="text-sm text-slate-500 line-clamp-2 mb-2">{feature.description}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                feature.complexity === 'Simple' ? 'bg-emerald-100 text-emerald-700' :
                                feature.complexity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {feature.complexity}
                              </span>
                              <span className="text-xs text-slate-400">
                                {feature.estimated_credits || 0} cr
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {columnFeatures.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        Drop features here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}