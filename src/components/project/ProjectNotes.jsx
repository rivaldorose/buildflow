import React, { useState, useEffect } from 'react';
import { ProjectNote } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, X, Save, Loader2, FileText, ChevronDown, ChevronRight } from 'lucide-react';
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

export default function ProjectNotes({ projectId }) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({}); // Track which notes are expanded
  const [formData, setFormData] = useState({
    title: '',
    content: null
  });

  useEffect(() => {
    loadNotes();
  }, [projectId]);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const data = await ProjectNote.filter({ project: projectId });
      setNotes(data);
      // Set all notes as expanded by default when loading
      const expanded = {};
      data.forEach(note => {
        expanded[note.id] = true;
      });
      setExpandedNotes(expanded);
    } catch (error) {
      console.error('Error loading project notes:', error);
      toast.error('Failed to load notes');
    }
    setIsLoading(false);
  };

  const toggleNote = (noteId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  const handleCreateNote = async () => {
    if (!formData.title.trim()) {
      toast.error('Titel is verplicht');
      return;
    }

    setIsSaving(true);
    try {
      await ProjectNote.create({
        project: projectId,
        title: formData.title,
        content: formData.content || { type: 'doc', content: [] },
      });
      
      setFormData({ title: '', content: null });
      setShowCreateForm(false);
      toast.success('Note aangemaakt');
      loadNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note: ' + error.message);
    }
    setIsSaving(false);
  };

  const handleUpdateNote = async (noteId) => {
    setIsSaving(true);
    try {
      await ProjectNote.update(noteId, {
        title: formData.title,
        content: formData.content
      });
      
      setEditingNoteId(null);
      setFormData({ title: '', content: null });
      toast.success('Note bijgewerkt');
      loadNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note: ' + error.message);
    }
    setIsSaving(false);
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Weet je zeker dat je deze note wilt verwijderen?')) return;
    
    try {
      await ProjectNote.delete(noteId);
      toast.success('Note verwijderd');
      loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note: ' + error.message);
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setFormData({
      title: note.title,
      content: note.content
    });
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setShowCreateForm(false);
    setFormData({ title: '', content: null });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg">
        <p className="text-slate-500">Notes laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Project Notes</h3>
        {!showCreateForm && (
          <Button
            onClick={() => setShowCreateForm(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Note
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-6 bg-white border border-slate-200 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-gray-900">Nieuwe Note</h4>
            <Button
              onClick={cancelEditing}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <Input
            placeholder="Note titel..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full"
          />
          
          <TipTapEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Begin met schrijven..."
          />
          
          <div className="flex gap-2 justify-end">
            <Button
              onClick={cancelEditing}
              variant="outline"
              disabled={isSaving}
            >
              Annuleren
            </Button>
            <Button
              onClick={handleCreateNote}
              disabled={isSaving || !formData.title.trim()}
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
      )}

      {/* Notes List */}
      {notes.length === 0 && !showCreateForm ? (
        <div className="p-6 bg-white border border-slate-200 rounded-lg text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">
            Nog geen notes. Maak je eerste note aan!
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Note
          </Button>
        </div>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="p-6 bg-white border border-slate-200 rounded-lg">
            {editingNoteId === note.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-gray-900">Note Bewerken</h4>
                  <Button
                    onClick={cancelEditing}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <Input
                  placeholder="Note titel..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full"
                />
                
                <TipTapEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Begin met schrijven..."
                />
                
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={cancelEditing}
                    variant="outline"
                    disabled={isSaving}
                  >
                    Annuleren
                  </Button>
                  <Button
                    onClick={() => handleUpdateNote(note.id)}
                    disabled={isSaving || !formData.title.trim()}
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
              // View Mode
              <>
                <div 
                  className="flex items-start justify-between cursor-pointer hover:bg-slate-50 -m-6 p-6 rounded-lg transition-colors"
                  onClick={() => toggleNote(note.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {expandedNotes[note.id] ? (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {note.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {format(new Date(note.created_date), 'd MMM yyyy, HH:mm')}
                        {note.updated_date !== note.created_date && (
                          <span> • Bijgewerkt {format(new Date(note.updated_date), 'd MMM yyyy, HH:mm')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      onClick={() => startEditing(note)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteNote(note.id)}
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {expandedNotes[note.id] && (
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <TipTapViewer content={note.content} />
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
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

