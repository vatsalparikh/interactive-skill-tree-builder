import type { SkillFormData, SkillNodeType } from '../types'

export function createSkillNode(data: SkillFormData): SkillNodeType {
    return {
        id: crypto.randomUUID(),
        type: 'skill',
        position: { x: 200, y: 100 },
        data,
        // TODO: fix styling to use tailwind css
        style: {
            width: 160,
            height: 80,
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '6px',
            boxSizing: 'border-box',
            padding: 12,
            overflow: 'auto'
        },
    }
}