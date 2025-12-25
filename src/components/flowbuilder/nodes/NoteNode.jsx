import React from 'react';
import { Handle, Position } from 'reactflow';

export default function NoteNode({ data, selected }) {
  const width = data.width || 200;
  const height = data.height || 150;
  const color = data.color || '#FFEB3B';

  return (
    <div
      className={`note-node ${selected ? 'selected' : ''}`}
      style={{
        width,
        minHeight: height,
        backgroundColor: color,
        border: '1px solid #FCD34D',
        borderRadius: 4,
        padding: '12px',
        boxShadow: selected
          ? '0 0 0 2px #3B82F6'
          : '2px 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        position: 'relative',
        transform: 'rotate(-1deg)',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ width: 12, height: 12, borderRadius: '50%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ width: 12, height: 12, borderRadius: '50%' }}
      />

      <div className="node-content">
        <textarea
          value={data.content || ''}
          readOnly
          style={{
            width: '100%',
            minHeight: height - 24,
            border: 'none',
            backgroundColor: 'transparent',
            resize: 'none',
            fontSize: '13px',
            fontFamily: 'inherit',
            color: '#1F2937',
            outline: 'none',
            lineHeight: 1.5,
          }}
        >
          {data.content || 'Sticky note...'}
        </textarea>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ width: 12, height: 12, borderRadius: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ width: 12, height: 12, borderRadius: '50%' }}
      />
    </div>
  );
}

