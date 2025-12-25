import React from 'react';
import { Handle, Position } from 'reactflow';

export default function DiamondNode({ data, selected }) {
  const size = data.size || 150;
  const color = data.color || '#FFF4E6';
  const borderColor = data.borderColor || '#F59E0B';

  return (
    <div
      className={`diamond-node ${selected ? 'selected' : ''}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <polygon
          points={`${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}`}
          fill={color}
          stroke={borderColor}
          strokeWidth="2"
        />
      </svg>

      <div
        className="node-content"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '12px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: '#1F2937',
          }}
        >
          {data.label || 'Decision'}
        </h3>
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

