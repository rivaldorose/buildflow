import React from 'react';
import { Handle, Position } from 'reactflow';

export default function DatabaseNode({ data, selected }) {
  const width = data.width || 250;
  const fields = data.fields || [];
  const height = Math.max(120, 60 + fields.length * 30);
  const tableName = data.table || 'table_name';

  return (
    <div
      className={`database-node ${selected ? 'selected' : ''}`}
      style={{
        width,
        minHeight: height,
        backgroundColor: '#E0F2FE',
        border: `2px solid ${data.borderColor || '#0EA5E9'}`,
        borderRadius: 8,
        padding: 0,
        boxShadow: selected
          ? '0 0 0 2px #3B82F6'
          : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        overflow: 'hidden',
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

      {/* Database icon header */}
      <div
        style={{
          backgroundColor: '#0EA5E9',
          color: 'white',
          padding: '8px 12px',
          fontWeight: 600,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 1.79 0 4v8c0 2.21 3.58 4 8 4s8-1.79 8-4V4c0-2.21-3.58-4-8-4zm0 1c3.87 0 7 1.86 7 3s-3.13 3-7 3-7-1.86-7-3 3.13-3 7-3zm0 13c-3.87 0-7-1.86-7-3v-3c0 1.14 3.13 3 7 3s7-1.86 7-3v3c0 1.14-3.13 3-7 3z" />
        </svg>
        {tableName}
      </div>

      {/* Fields list */}
      <div style={{ padding: '8px' }}>
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <div
              key={index}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                borderBottom:
                  index < fields.length - 1 ? '1px solid #BFDBFE' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#1F2937', fontWeight: 500 }}>
                {field.name}
              </span>
              <span
                style={{
                  color: '#6B7280',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              >
                {field.type}
                {field.primary && (
                  <span style={{ color: '#F59E0B', marginLeft: '4px' }}>
                    PK
                  </span>
                )}
                {field.unique && (
                  <span style={{ color: '#10B981', marginLeft: '4px' }}>
                    UQ
                  </span>
                )}
              </span>
            </div>
          ))
        ) : (
          <div
            style={{
              padding: '8px',
              fontSize: '12px',
              color: '#6B7280',
              fontStyle: 'italic',
            }}
          >
            No fields defined
          </div>
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

