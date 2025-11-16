/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { Handle, Position, type NodeProps } from "reactflow";
import type { SkillData } from "../types";

export default function SkillNode({ data }: NodeProps<SkillData>) {
  return (
    <article>
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
      <div>Name: {data.name}</div>
      {data.level !== undefined && (
        <div>Level: {data.level}</div>
      )}
      <div>Description: {data.description}</div>
    </article>
  );
}

