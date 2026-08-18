// Tip strings are rendered as innerHTML. Use {command} to insert a keybinding
// badge for the first registered binding for that command, or {selector>command}
// to target a specific binding by its keymap selector (useful when multiple
// bindings exist for the same command and you need a particular one).
module.exports = [
  // Generic app navigation and shortcuts
  'Close panels like find and replace with {body>core:cancel}',
  `Everything Tranquil can do is in the Command Palette. Open it with {command-palette:toggle}`,
  'Split your workspace into side-by-side panes with {pane:split-right-and-copy-active-item}',
  'Cycle through your center tabs with {tranquil:show-next-item-in-center}',
  'Customize Tranquil from Settings with {application:show-settings}',
  // Tranquil browser
  'Open a new browser tab with {tranquil-browser:open}',
  'Focus the browser URL bar with {tranquil-browser:focus-url}',
  'Find text on the current page with {tranquil-browser:find}',
  'Add the current site to the Project Pane with {tranquil-browser:add-to-tree-view}',
  'Refresh the current page in the browser with {tranquil-browser:refresh}',
  'Right-click any .url file in the Project Pane to open it in the browser',
  '.url files are plain text — open one in an editor to update the address it points to',
  // Tranquil automations & workspace
  'Run the automation in the current .ts file with {tranquil-automations:run-automation}',
  "Watch a run's output, and cancel it, in the Automation Runs panel — {tranquil-automations:toggle-runs-panel}",
  'Select a few lines of an automation and run them on their own — the file\'s imports come along',
  'Every automation declares what it may reach in a // @permissions header, approved once per script',
  'Runnable examples live at github.com/tranquillabs/tranquil-examples — clone it and open the folder in Tranquil',
  'Give each window its own accent color from the Window menu to tell projects apart',
  'Drag a tab from one pane to another to reorganize your workspace',
]
