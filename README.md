## Setup instructions

Starting the app app: npm install && npm run dev
Linting: npm run format && npm run lint:fix
Running tests: npm test / npm test:ui / npm test:coverage
Running production build: npm run preview / npm run build

## List of completed bonuses

Completed both extension features, "preventing cycles with user feedback" and "search and filter"

## Disclosure of any AI tool usage

- Generating unit tests
- Generating JSDoc

## Explanation

Accessibility: Tried to make the UI as accessible as possible
Connecting nodes: Nodes can only be connected from bottom handle of one node to top handle of another node. Any other combination (top to bottom / top to top / bottom to bottom) will fail silently. This is also explained in short below skill legends on bottom left of the page

## Assumptions

Second extension feature:
“Highlight matching nodes and their paths in the graph” returns any matching nodes + any ancestor path and nodes for that matching node, and that I can exclude any descendant path and descendant nodes for that matching node. This means highlight prerequisite nodes, prerequisite paths, and the matching node, because in a skill tree the user is interested in knowing which skills they need to master before they can master the matching skill.
