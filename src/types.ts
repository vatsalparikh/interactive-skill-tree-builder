/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { type Node } from 'reactflow'

export interface SkillFormData {
  name: string;
  description: string;
  level?: number; // optional, >= 0
}

export interface SkillData extends SkillFormData {}

/*
This page shows how custom nodes are created: https://reactflow.dev/learn/tutorials/slide-shows-with-react-flow
This link shows that custom nodes take data with node type as string as parameters: https://github.com/xyflow/xyflow/blob/0984dbb05a3cf06dff8e2df2e2bc71fdb01f5f1d/packages/system/src/types/nodes.ts#L11
*/
export type SkillNodeType = Node<SkillData, 'skill'>;


