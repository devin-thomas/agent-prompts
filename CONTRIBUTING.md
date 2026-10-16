# Contributing

## Setup and checks

Use Node.js 24 LTS. Run `npm ci`, then `npm run dev`. Before submitting changes, run `npm run check` and review `git diff --check`.

Keep changes scoped. Format maintained source with `npm run format`. Do not commit dependency directories, generated builds, environment files, logs, or editor state.

## Browser review

Check a fresh production build with `npm run preview`:

1. At 320 × 667, 390 × 844, 768 × 1024, and 1440 × 1000 CSS pixels, check for clipping, horizontal scroll, unreadable text, and missing artwork. The opening phone screen should show the shared prompt action, product marks, and names together.
2. Copy each task and compare the clipboard with the inspection dialog. Retrieve each guide. Verify the Cursor link encodes the same contact-form prompt. Opening a draft is the supported outcome; actual agent execution is outside this site.
3. Deny clipboard access and check selectable-text recovery. Repeated share failures should reuse a single recovery dialog.
4. Exercise every filter and agent choice. Open all dialogs and use Tab, arrow keys, Enter, and Escape. Check focus return, empty search results, and status announcements.
5. Check reduced motion and an actual Dark Reader extension transformation. Inspect the light gallery controls, product marks, continuation example, and open dialogs. A dark site alone does not prove extension compatibility.
6. Switch the logo comparison through Original, Black, and White, including by keyboard. Confirm all nine assets load, original colors remain intact, and black and white marks keep their cutouts and contrast with Dark Reader enabled.
7. Read the continuation guide as a new visitor. It should explain how to verify an existing handoff and leave a useful next step without requiring a particular tool or account.

Keep raw browser profiles, logs, and capture evidence outside the source tree. A passing build does not replace visual review.

## Public-source review

The automated audit flags common credentials, local filesystem paths, infrastructure addresses, environment files, and nonpublic instruction links. It is a guardrail, not a complete secret scanner. Also inspect prose, commit history, screenshots, and asset metadata before changing repository visibility.

Documentation should use public URLs and repository-relative paths. Attribute third-party assets and keep their license notices. Do not paste account configuration, transcripts, machine details, or internal operating instructions into examples.
