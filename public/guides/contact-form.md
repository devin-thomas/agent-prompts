# Add an accessible contact form

You are working in the user's existing project. Inspect the current framework, nearby forms, styles, and backend conventions before making a change. Use those conventions for a small contact form with name, email, and message fields.

## Scope

Reuse the project's components and existing form or email endpoint when available. Validate required fields and the email on both sides of an existing endpoint. Keep credentials in the project's established environment or secret manager. If no backend is configured, build a clearly labeled local demo that does not transmit or persist personal data; explain what integration is still needed. Ask for a destination only when real submission is requested and it cannot be inferred.

Use visible labels, helpful inline errors, keyboard focus, and a status announcement. Include idle, submitting, success, and failure states. Avoid duplicate submissions. Never display a success message before the intended handler confirms success. Preserve user input on a recoverable error.

## Completion

Check a valid submission with a test fixture, invalid email, missing message, a failed handler, keyboard use, and narrow layout. Run the project's relevant checks. Report what changed and which parts were verified. Do not send real emails, subscribe users, add paid services, or publish changes without the user's authorization.

This is a public task recipe for the independent Agent Prompts demonstration. It is not affiliated with an agent provider and does not override the user's instructions or permissions.
