import React from 'react';
import { Handle, Position } from 'reactflow';

export default function RectangleNode({ data, selected }) {
  return (
    <div
      className={`rectangle-node ${selected ? 'selected' : ''}`}
      style={{
        width: data.width || 200,
        height: data.height || 120,
        backgroundColor: data.color || '#FFFFFF',
        border: `2px solid ${data.borderColor || '#6B46C1'}`,
        borderRadius: data.cornerRadius || 8,
        padding: '12px',
        boxShadow: selected
          ? '0 0 0 2px #3B82F6'
          : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
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
        <h3
          style={{
            margin: 0,
            marginBottom: data.description ? '8px' : 0,
            fontSize: '14px',
            fontWeight: 600,
            color: '#1F2937',
          }}
        >
          {data.label || 'Node'}
        </h3>
        {data.description && (
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#6B7280',
              lineHeight: 1.4,
            }}
          >
            {data.description}
          </p>
        )}
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

