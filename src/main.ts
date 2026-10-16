import './style.css';

type TaskId = 'reference' | 'contact' | 'theme' | 'newsletter' | 'continue';
type AgentId = 'claude' | 'codex' | 'cursor';
type AgentName = 'Claude Code' | 'Codex' | 'Cursor';
type Filter = 'all' | 'copy' | 'launch';
type Task = { name: string; guide: string; outcome: string; agent: AgentId };

const tasks: Record<TaskId, Task> = {
  reference: {
    name: 'Build an agent handoff',
    guide: 'branded-handoff',
    outcome: 'add a compact, branded agent handoff to this site',
    agent: 'codex',
  },
  contact: {
    name: 'Add a contact form',
    guide: 'contact-form',
    outcome: 'add an accessible contact form to this project',
    agent: 'claude',
  },
  theme: {
    name: 'Add a theme switcher',
    guide: 'theme-switcher',
    outcome: 'add an accessible light and dark theme switcher',
    agent: 'codex',
  },
  newsletter: {
    name: 'Add a newsletter form',
    guide: 'newsletter-form',
    outcome: 'add an accessible newsletter signup form',
    agent: 'cursor',
  },
  continue: {
    name: 'Continue this project',
    guide: 'continue-project',
    outcome: 'continue this project from its latest verified handoff',
    agent: 'codex',
  },
};
const agentNames: Record<AgentId, AgentName> = {
  claude: 'Claude Code',
  codex: 'Codex',
  cursor: 'Cursor',
};
const promptFor = (id: TaskId): string =>
  `Read ${location.origin}/guides/${tasks[id].guide}.md and ${tasks[id].outcome}, following its scope and verification steps.`;
const $ = <T extends Element = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Required page element not found: ${selector}`);
  return element;
};
const isTaskId = (value: string | undefined): value is TaskId =>
  value !== undefined && Object.hasOwn(tasks, value);
const isAgentName = (value: string | undefined): value is AgentName =>
  value === 'Claude Code' || value === 'Codex' || value === 'Cursor';
const isFilter = (value: string | undefined): value is Filter =>
  value === 'all' || value === 'copy' || value === 'launch';
const dialog = $<HTMLDialogElement>('#prompt-dialog');
const palette = $<HTMLDialogElement>('#palette-dialog');
const shareDialog = $<HTMLDialogElement>('#share-dialog');
let currentTask: TaskId = 'contact';
let selectedAgent: AgentName = 'Claude Code';
let toastTimer: ReturnType<typeof setTimeout> | undefined;
const copyLabels = new WeakMap<HTMLElement, string>();
document.querySelectorAll<HTMLElement>('.copy-label').forEach((label) => {
  copyLabels.set(label, label.textContent ?? 'Copy prompt');
});

function resetCopyFeedback(button?: HTMLButtonElement): HTMLElement | null {
  const label = button?.querySelector<HTMLElement>('.copy-label') ?? null;
  if (label) {
    delete label.dataset.copyToken;
    label.textContent =
      button?.dataset.copy === 'theme'
        ? `Copy for ${selectedAgent}`
        : (copyLabels.get(label) ?? 'Copy prompt');
  }
  return label;
}

function announce(message: string): void {
  const toast = $('#toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  if (dialog.open) $('#dialog-status').textContent = message;
  if (shareDialog.open) $('#share-status').textContent = message;
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3400);
}

function inspect(id: TaskId, manual = false): void {
  currentTask = id;
  if (palette.open) palette.close();
  if (shareDialog.open) shareDialog.close();
  const text = promptFor(id);
  $<HTMLTextAreaElement>('#prompt-text').value = text;
  $('#prompt-title').textContent = tasks[id].name;
  $('#prompt-count').textContent =
    `${[...text].length} characters · ${text.trim().split(/\s+/).length} words`;
  $<HTMLAnchorElement>('#prompt-guide').href = `/guides/${tasks[id].guide}.md`;
  resetCopyFeedback($<HTMLButtonElement>('#dialog-copy'));
  $('#dialog-status').textContent = '';
  $('#manual-hint').textContent = manual
    ? 'Copy the selected text manually.'
    : 'Paste into your coding agent.';
  if (!dialog.open) dialog.showModal();
  if (manual) {
    const textArea = $<HTMLTextAreaElement>('#prompt-text');
    textArea.focus();
    textArea.select();
  }
}

async function copy(id: TaskId, button?: HTMLButtonElement): Promise<boolean> {
  if (button?.disabled) return false;
  if (button) button.disabled = true;
  const label = resetCopyFeedback(button);
  const token = `${Date.now()}-${Math.random()}`;
  if (label) label.dataset.copyToken = token;
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(promptFor(id));
    announce('Prompt copied.');
    if (label?.dataset.copyToken === token) {
      label.textContent = 'Copied';
      setTimeout(() => {
        if (label.dataset.copyToken !== token) return;
        resetCopyFeedback(button);
      }, 1800);
    }
    return true;
  } catch {
    if (label?.dataset.copyToken === token) resetCopyFeedback(button);
    inspect(id, true);
    announce('Couldn’t access the clipboard.');
    return false;
  } finally {
    if (button) button.disabled = false;
  }
}

document
  .querySelectorAll<HTMLButtonElement>('[data-copy]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      if (isTaskId(button.dataset.copy)) void copy(button.dataset.copy, button);
    });
  });
document
  .querySelectorAll<HTMLButtonElement>('[data-inspect]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      if (isTaskId(button.dataset.inspect)) inspect(button.dataset.inspect);
    });
  });
$('#show-payload').addEventListener('click', () => inspect('reference'));
$('#dialog-copy').addEventListener(
  'click',
  () => void copy(currentTask, $<HTMLButtonElement>('#dialog-copy')),
);
$('.close-dialog').addEventListener('click', () => dialog.close());
$('.close-palette').addEventListener('click', () => palette.close());
$('.close-share').addEventListener('click', () => shareDialog.close());
document.querySelectorAll<HTMLDialogElement>('dialog').forEach((element) => {
  element.addEventListener('click', (event) => {
    const rect = element.getBoundingClientRect();
    if (
      event.target === element &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      element.close();
  });
});

document
  .querySelectorAll<HTMLButtonElement>('[data-agent]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const agent = button.dataset.agent;
      if (!isAgentName(agent)) return;
      selectedAgent = agent;
      document
        .querySelectorAll<HTMLButtonElement>('[data-agent]')
        .forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle('selected', active);
          candidate.setAttribute('aria-pressed', String(active));
        });
      $('.picker-copy .copy-label').textContent = `Copy for ${selectedAgent}`;
    });
  });
$<HTMLAnchorElement>('#cursor-launch').href =
  `https://cursor.com/link/prompt?text=${encodeURIComponent(promptFor('contact'))}`;
$('#diagram-chars').textContent =
  `${[...promptFor('contact')].length} characters`;

document
  .querySelectorAll<HTMLButtonElement>('[data-filter]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      if (!isFilter(filter)) return;
      document
        .querySelectorAll<HTMLButtonElement>('[data-filter]')
        .forEach((candidate) => {
          candidate.classList.toggle('active', candidate === button);
          candidate.setAttribute('aria-pressed', String(candidate === button));
        });
      let visible = 0;
      document.querySelectorAll<HTMLElement>('.exhibit').forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.kind !== filter;
        if (!card.hidden) visible++;
      });
      $('#filter-status').textContent =
        `${visible} ${visible === 1 ? 'example' : 'examples'} shown.`;
    });
  });

let paletteIds: TaskId[] = Object.keys(tasks) as TaskId[];
let paletteIndex = 0;
function focusPalette(index: number): void {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('#palette-results button'),
  );
  if (!buttons.length) return;
  paletteIndex = (index + buttons.length) % buttons.length;
  buttons[paletteIndex]?.focus();
}
function renderPalette(): void {
  const query = $<HTMLInputElement>('#palette-query')
    .value.toLowerCase()
    .trim();
  paletteIds = (Object.keys(tasks) as TaskId[]).filter((id) =>
    tasks[id].name.toLowerCase().includes(query),
  );
  paletteIndex = 0;
  const list = $('#palette-results');
  list.replaceChildren();
  if (!paletteIds.length) {
    const empty = document.createElement('p');
    empty.className = 'palette-empty';
    empty.setAttribute('role', 'status');
    empty.textContent = 'No matches. Try “form”, “theme”, or “continue”.';
    list.append(empty);
    return;
  }
  paletteIds.forEach((id, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'palette-row';
    button.setAttribute('aria-label', `Copy prompt: ${tasks[id].name}`);
    const image = document.createElement('img');
    image.src = `/brands/${tasks[id].agent}.svg`;
    image.alt = '';
    const name = document.createElement('span');
    name.textContent = tasks[id].name;
    const action = document.createElement('small');
    action.textContent = `${agentNames[tasks[id].agent]} · Copy`;
    button.append(image, name, action);
    button.addEventListener('focus', () => {
      paletteIndex = index;
      list
        .querySelectorAll('.palette-row')
        .forEach((row) => row.classList.toggle('active', row === button));
    });
    button.addEventListener('click', async () => {
      palette.close();
      await copy(id);
    });
    list.append(button);
  });
}
function openPalette(): void {
  if (dialog.open) dialog.close();
  if (shareDialog.open) shareDialog.close();
  $<HTMLInputElement>('#palette-query').value = '';
  renderPalette();
  if (!palette.open) palette.showModal();
  $<HTMLInputElement>('#palette-query').focus();
}
$('#open-palette').addEventListener('click', openPalette);
$<HTMLInputElement>('#palette-query').addEventListener('input', renderPalette);
$<HTMLInputElement>('#palette-query').addEventListener(
  'keydown',
  async (event) => {
    if (event.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusPalette(event.key === 'ArrowDown' ? 0 : paletteIds.length - 1);
    } else if (event.key === 'Enter' && paletteIds.length) {
      event.preventDefault();
      const id = paletteIds[paletteIndex];
      if (id) {
        palette.close();
        await copy(id);
      }
    }
  },
);
$('#palette-results').addEventListener('keydown', (event) => {
  const keyboardEvent = event as KeyboardEvent;
  if (keyboardEvent.isComposing) return;
  const directions: Record<string, number> = {
    ArrowDown: paletteIndex + 1,
    ArrowUp: paletteIndex - 1,
    Home: 0,
    End: paletteIds.length - 1,
  };
  if (Object.hasOwn(directions, keyboardEvent.key)) {
    keyboardEvent.preventDefault();
    focusPalette(directions[keyboardEvent.key]!);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.isComposing) return;
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (palette.open) palette.close();
    else openPalette();
  }
});

const shareUrl = new URL('/', location.href).href;
function showShareFallback(): void {
  $<HTMLTextAreaElement>('#share-text').value = shareUrl;
  $('#share-status').textContent =
    'Use Cmd or Ctrl + C to copy the selected link.';
  if (!shareDialog.open) shareDialog.showModal();
  const textArea = $<HTMLTextAreaElement>('#share-text');
  textArea.focus();
  textArea.select();
}
async function copyShareLink(): Promise<void> {
  try {
    await navigator.clipboard.writeText(shareUrl);
    announce('Agent Prompts link copied.');
  } catch {
    showShareFallback();
  }
}
$('#share-copy').addEventListener('click', () => void copyShareLink());
$('#share').addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Agent Prompts',
        text: 'Working examples of clear handoffs to your coding agent.',
        url: shareUrl,
      });
      return;
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }
  await copyShareLink();
});
document.documentElement.dataset.appReady = 'true';
