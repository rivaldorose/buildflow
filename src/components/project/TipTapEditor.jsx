import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Plus,
  Minus,
  Trash2,
  Columns,
  Rows,
  Merge,
  Maximize,
  Minimize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TipTapEditor({ content, onChange, placeholder = "Begin met schrijven..." }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:underline',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const isInTable = editor.isActive('table');

  return (
    <div className={`border border-slate-200 rounded-lg bg-white overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b border-slate-200 bg-slate-50 flex-wrap items-center justify-between">
        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            H1
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            H3
          </Button>
        </div>

        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={editor.isActive('link') ? 'bg-slate-200' : ''}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          {isInTable ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="bg-slate-200"
                  style={{ padding: '4px 8px', minWidth: 'auto' }}
                  title="Table Options"
                >
                  <TableIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  disabled={!editor.can().addRowBefore()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Row Above
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  disabled={!editor.can().addRowAfter()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Row Below
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  disabled={!editor.can().deleteRow()}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Delete Row
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  disabled={!editor.can().addColumnBefore()}
                >
                  <Columns className="w-4 h-4 mr-2" />
                  Add Column Left
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  disabled={!editor.can().addColumnAfter()}
                >
                  <Columns className="w-4 h-4 mr-2" />
                  Add Column Right
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  disabled={!editor.can().deleteColumn()}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Delete Column
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().mergeCells().run()}
                  disabled={!editor.can().mergeCells()}
                >
                  <Merge className="w-4 h-4 mr-2" />
                  Merge Cells
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().splitCell().run()}
                  disabled={!editor.can().splitCell()}
                >
                  <Merge className="w-4 h-4 mr-2" />
                  Split Cell
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  disabled={!editor.can().deleteTable()}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Table
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertTable}
              style={{ padding: '4px 8px', minWidth: 'auto' }}
              title="Insert Table"
            >
              <TableIcon className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className={`overflow-y-auto p-6 ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'min-h-[500px] max-h-[70vh]'}`}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .ProseMirror {
          outline: none;
          color: #1e293b;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
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

