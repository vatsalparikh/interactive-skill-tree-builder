# Interactive Skill Tree Builder

A dynamic, accessible, React-based skill tree that allows users to create skills, connect them with prerequisite skill relationships, search and highlight paths, and unlock skills based on completion logic

This project is built with React, TypeScript, Vite, ReactFlow Tailwind CSS, Vitest, React Testing Library, and follows best practices for component architecture, state management, and UI interaction design with dynamic UI elements

## Setup instructions

**Requirements**

- Node.js v20 or higher
- This application is not compatible with Node.js versions below 20

**Running the app**

- Dev: `npm install && npm run dev`
- Prod build: `npm run preview` or `npm run build`
- Tests: `npm test` or `npm test:ui`
- Coverage: `npm test:coverage`
- Linter: `npm run format && npm run lint:fix`

## List of completed bonuses

Completed both extension features:

1. Prevent cycles with validation and user feedback
2. Search and filter nodes by name and highlight matching nodes and paths

## Disclosure of any AI tool usage

- I used AI tools like ChatGPT during development primarily to learn React Flow APIs, validate architectural decisions, code reviews, assist in generating unit test scaffolding to reach full coverage, and to help generate some Tailwind and CSS styling ideas
- All core implementation, component logic, and final code were written and authored by me, with AI serving as a learning and productivity aid

## Architecture

The application is organized into focused components, hooks, and pure helper modules

src/<br>
├── app.tsx<br>
├── components/<br>
├── helpers/<br>
├── hooks/<br>
├── index.css<br>
├── main.tsx<br>
└── types.ts<br>

- **use-skill-tree.ts**  
  Manages:
  - Skills state
  - Prerequisites (edges)
  - Adding skills
  - Connecting skills
  - Cycle detection
  - Unlocking logic
  - Persistence

- **use-skill-highlight.ts**  
  Computes derived view state:
  - Highlighted nodes
  - Highlighted edges
  - Dimming logic  
    _Memoized for performance_

- **skill-view.tsx**  
  Handles all visual node rendering, including:
  - Locked/unlocked styles
  - Highlight glow
  - Dimming
  - Level badge

- **flow.tsx**
  - Renders the graph using ReactFlow
  - Registers event handlers
  - Applies node types and default edge styling
  - Uses useCallback/useMemo for stable handlers

## Security

- Input sanitization using DOMPurify wrappers before storing user input
- Local storage safety: values loaded from storage are sanitized to prevent unsafe content
- All dependencies validated, no known vulnerabilities at time of submission

## Accessibility

- Canvas visually rich but hidden from screen readers (`aria-hidden`)
- Screen-reader-only textual list presented below
- Form fields have `aria-invalid`, `aria-describedby`, and validation messages
- All interactive elements are properly labeled

## Performance

- Heavy computations are memoized
- Interactive callbacks are wrapped in useCallback to prevent unnecessary re-renders of ReactFlow nodes and internal components
- Highlight styles done using Tailwind arbitrary values (CSS only, no JS objects)

## Features

#### Skill Creation

- Add new skills with name, description, and optional level
- Inline validation with character limits
- Inputs are sanitized to prevent unsafe HTML

#### Connect Skills Visually

- Drag and reposition nodes freely
- Create edges by connecting the bottom handle of one node to the top handle of another
- Strong validation:
  - No self-loops
  - No duplicate edges
  - No circular prerequisites
  - No connecting a locked skill as a prerequisite of an already unlocked skill

#### Unlock Skills (Completion Logic)

Skills may be unlocked only if all their prerequisite skills are unlocked

This is handled by:

- `canUnlock()`: checks all parent nodes
- `unlockSkill()`: returns updated, immutable skill list
- `handleUnlock()`: integrates unlock logic with UI

#### Search & Path Highlighting

- Search for skills by name
- All matching skills glow
- All ancestor skills are highlighted (prerequisite path)
- Unrelated nodes dim automatically
- Edges along highlighted paths appear stronger and more visible

#### Persistence

The entire skill tree auto-saves to `localStorage` and reloads on refresh

## Assumptions and Notes

- Second extension feature:
  “Highlight matching nodes and their paths in the graph” returns any matching nodes + any ancestor path and nodes for that matching node, and that I can exclude any descendant path and descendant nodes for that matching node. This means highlight prerequisite nodes, prerequisite paths, and the matching node, because in a skill tree the user is interested in knowing which skills they need to master before they can master the matching skill
- Responsiveness is not covered in this app. The assumption is that this app will be used only by Desktop / Laptop users, not mobile users
- Connecting nodes: Nodes can only be connected from bottom handle of one node to top handle of another node. Any other combination (top to bottom / top to top / bottom to bottom) will fail silently. This is also explained in short below skill legends on bottom left of the page
