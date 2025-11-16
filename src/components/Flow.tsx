/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import ReactFlow, { Background, Controls } from 'reactflow';

const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'input',
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
];

export default function Flow() {
  return (
    <div className='h-full w-full'>
      <ReactFlow nodes={initialNodes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
