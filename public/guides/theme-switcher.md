# Add a light and dark theme switcher

Work in the user's current project. Inspect its existing styling system and theme configuration first. Extend that system instead of creating a competing layer.

Add a compact, keyboard-accessible switch with an understandable current-state label. Respect the system preference before the user makes a choice; persist an explicit choice through the project's existing preference mechanism. Avoid a visible theme flash when the framework allows it. Preserve the existing brand colors and use appropriate logo variants.

Check readable text, visible focus, form inputs, dialogs, and important icons in both themes. Test the initial system choice, changing the preference, reloading, and unavailable local storage. Keep the current theme working if persistence is denied. Run relevant existing checks and summarize the results. Do not redesign unrelated screens, install unnecessary dependencies, or publish without authorization.

This is a public task recipe for the independent Agent Prompts demonstration, not an official agent integration.
