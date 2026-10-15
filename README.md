# Agent Prompts

A small, working collection of interfaces for handing a task to an AI coding agent. Recognizable product marks, a short prompt, and a readable guide help people move from a website into their own project.

[Try the live site](https://agent-prompts.vercel.app/) · [Implementation guide](public/guides/branded-handoff.md) · [MIT license](LICENSE)

## Examples

| Example                 | What it demonstrates                                             |
| ----------------------- | ---------------------------------------------------------------- |
| The familiar face       | One shared copy action with named agent products.                |
| The personal invitation | An agent picker with a clear selected state.                     |
| The perfect moment      | A prompt beside the work it relates to.                          |
| The quick command       | Searchable tasks with keyboard navigation.                       |
| The tiny starting point | One sentence pointing to a complete guide.                       |
| The direct route        | A Cursor draft link with a copy fallback.                        |
| Continue this project   | Resume from a verified project handoff, then leave the next one. |

The continuation example works with project records already available to the agent. It does not require an account or a particular agent tool. See its [public guide](public/guides/continue-project.md) and [fictional handoff example](public/examples/project-handoff.md).

## Development

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

The development server prints its local URL. The project is a Vite application written in vanilla TypeScript, with self-hosted Geist Variable fonts.

```sh
npm run check
npm run preview
```

`check` verifies formatting, public-source hygiene, local asset links, TypeScript, and the production build. Browser checks are described in [CONTRIBUTING.md](CONTRIBUTING.md). They cover the opening phone screen, copying and recovery, dialogs, filtering, keyboard navigation, and Dark Reader.

## Project layout

- `index.html`: interface, accessible controls, and page metadata.
- `src/main.ts`: prompt payloads, copying, filtering, dialogs, and keyboard behavior.
- `src/style.css`: responsive layouts and appearance.
- `public/guides/`: public task instructions referenced by copied prompts.
- `public/examples/`: fictional project records for the continuation example.
- `public/brands/` and `public/fonts/`: attributed third-party assets and notices.
- `scripts/audit-public.mjs`: source and asset checks before publication.

## Behavior and limits

Copy actions write plain text to your clipboard. If the clipboard is unavailable, the site presents selectable text. The Cursor action opens a draft; it does not execute a task. The form inside the contextual example is an illustration, not a signup form. No example submits personal information or runs an agent.

The field notes are dated observations of public sites, not rankings or promises about their current behavior. Agent Prompts is an independent project and is not endorsed by the referenced providers.

## License and artwork

The original source and documentation are MIT licensed. Fonts and borrowed artwork retain their own notices, and product trademarks remain with their owners. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [asset credits](public/brands/credits.txt).
