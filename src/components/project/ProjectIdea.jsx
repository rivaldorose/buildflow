import React, { useState, useEffect } from 'react';
import { ProjectIdea as ProjectIdeaEntity } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X, Loader2, Lightbulb } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { format } from 'date-fns';
import { toast } from 'sonner';
import TipTapEditor from './TipTapEditor';

export default function ProjectIdea({ projectId }) {
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    loadIdea();
  }, [projectId]);

  const loadIdea = async () => {
    setIsLoading(true);
    try {
      const data = await ProjectIdeaEntity.get(projectId);
      setIdea(data);
      setContent(data?.content || null);
    } catch (error) {
      console.error('Error loading project idea:', error);
      toast.error('Failed to load idea');
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (idea) {
        // Update existing
        await ProjectIdeaEntity.update(projectId, { content });
      } else {
        // Create new
        await ProjectIdeaEntity.create({
          project: projectId,
          content: content || { type: 'doc', content: [] },
        });
      }
      
      setIsEditing(false);
      toast.success('Idea opgeslagen');
      loadIdea();
    } catch (error) {
      console.error('Error saving idea:', error);
      toast.error('Failed to save idea: ' + error.message);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent(idea?.content || null);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-slate-900">Project Idea</h2>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {idea ? 'Bewerken' : 'Nieuwe Idea'}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <TipTapEditor
            content={content}
            onChange={(newContent) => setContent(newContent)}
            placeholder="Schrijf je project idea hier... Gebruik voice input voor spraak-naar-tekst!"
          />
          
          <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Annuleren
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Opslaan
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {idea?.content ? (
            <div>
              <TipTapViewer content={idea.content} />
              {idea.updated_date && (
                <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                  Laatst bijgewerkt: {format(new Date(idea.updated_date), 'd MMM yyyy, HH:mm')}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm mb-4">Nog geen idea opgeslagen</p>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Voeg idea toe
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// Component to display TipTap content (read-only)
function TipTapViewer({ content }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || { type: 'doc', content: [] },
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="text-slate-700">
      <EditorContent editor={editor} />
      <style>{`
        .ProseMirror {
          outline: none;
          color: #1e293b;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1em;
          margin: 0.5em 0;
          font-style: italic;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .ProseMirror table {
          border-collapse: collapse;
          margin: 0.5em 0;
          table-layout: fixed;
          width: 100%;
          overflow: hidden;
        }
        .ProseMirror td,
        .ProseMirror th {
          min-width: 1em;
          border: 1px solid #cbd5e1;
          padding: 6px 8px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f1f5f9;
        }
        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(59, 130, 246, 0.1);
          pointer-events: none;
        }
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #3b82f6;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

