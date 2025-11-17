## Setup instructions

npm install && npm run dev

## List of completed bonuses

Completed both extension features, "preventing cycles with user feedback" and "search and filter"

## Disclosure of any AI tool usage

- Generating unit tests
- Generating JSDoc

## Assumptions

Second extension feature:
“Highlight matching nodes and their paths in the graph” returns any matching nodes + any ancestor path and nodes for that matching node, and that I can exclude any descendant path and descendant nodes for that matching node. This means highlight prerequisite nodes, prerequisite paths, and the matching node, because in a skill tree the user is interested in knowing which skills they need to master before they can master the matching skill.

Connecting nodes:
Nodes can only be connected from bottom handle of one node to top handle of another node. Any other combination (top to bottom / top to top / bottom to bottom) will fail silently
