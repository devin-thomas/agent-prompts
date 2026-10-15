# Example project handoff

This is a fictional contact-form project used to demonstrate a portable handoff. The file names and check commands below are illustrative; they are not claims about the project you are resuming.

## Goal

Build an accessible contact form that can be integrated with the site's existing submission handler.

## Current state

The name, email, and message fields have a first-pass layout. The submit action is a local demonstration and does not send or store personal information. Validation and error recovery are unfinished.

## Next task

Inspect the current form, add required-field and email validation, and preserve entered values when submission fails. Reuse the project's existing validation and component conventions.

## Relevant files

- `src/contact-form.ts`: form rendering and events.
- `src/contact-form.css`: responsive layout and focus styles.
- `package.json`: available verification commands.

## Verification to perform

- Valid local test input reaches the intended handler once.
- Empty fields and malformed email produce understandable, linked errors.
- A failed handler preserves the input and permits a retry.
- Keyboard use and the narrow layout remain usable.

No checks are claimed as passed by this sample. Verify the actual project state and update its record after completing the task.
