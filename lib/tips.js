// Tip strings are rendered as innerHTML. Use {command} to insert a keybinding
// badge for the first registered binding for that command, or {selector>command}
// to target a specific binding by its keymap selector (useful when multiple
// bindings exist for the same command and you need a particular one).
module.exports = [
  // Kept from upstream — generic app navigation and shortcuts
  'Close panels like find and replace with {body>core:cancel}',
  `Everything Tranquil can do is in the Command Palette. Open it with {command-palette:toggle}`,
  'Toggle the Project Pane with {.platform-darwin atom-workspace>tree-view:toggle}',
  'Focus the Project Pane with {tree-view:toggle-focus}',
  'Split your workspace into side-by-side panes with {pane:split-right-and-copy-active-item}',
  'Customize Tranquil from the Settings View using {settings-view:open}',
  // Tranquil browser
  'Open a new browser tab with {tranquil-browser:open}',
  'Focus the browser URL bar with {tranquil-browser:focus-url}',
  'Add the current site to the Project Pane with {tranquil-browser:add-to-tree-view}',
  'Refresh the current page in the browser with {tranquil-browser:refresh}',
  'Right-click any .url file in the Project Pane to open it in the browser',
  '.url files are plain text — open one in an editor to update the address it points to',
  'Drag a tab from one pane to another to reorganize your workspace',
]
