import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = process.cwd();
const problems = [];
const tracked = execFileSync(
  'git',
  ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
  { encoding: 'utf8' },
);
const files = [...new Set(tracked.split('\0').filter(Boolean))].filter((file) =>
  existsSync(file),
);
const rules = [
  [
    'personal filesystem path',
    /(?:\/Users\/|\/home\/)[a-z0-9._-]+\/[a-z0-9]|[a-z]:[\\/]Users[\\/][a-z0-9._-]+[\\/]|file:\/\//i,
  ],
  [
    'network address',
    /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/,
  ],
  [
    'nonpublic instruction reference',
    /(?:\.codex|\.agents)[\\/]|skill:\/\/|\bSKILL\.md\b|github\.com\/[^/\s)]+\/private[-_]/i,
  ],
  [
    'credential signature',
    /\b(?:gh[pousr]_[a-z0-9]{20,}|github_pat_[a-z0-9_]{20,}|sk_live_[a-z0-9]{16,}|sk-(?:proj-)?[a-z0-9_-]{24,}|re_[a-z0-9_]{20,}|eyJ[a-z0-9_-]{16,}\.[a-z0-9_-]{16,}\.[a-z0-9_-]{16,}|AKIA[A-Z0-9]{16})\b/i,
  ],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
];
for (const file of files) {
  if (
    /(^|\/)(?:\.env[^/]*|\.vercel|node_modules|dist|test-results|playwright-report)(?:\/|$)/.test(
      file,
    )
  ) {
    problems.push(`${file}: non-distributable file is included`);
    continue;
  }
  const buffer = readFileSync(file);
  if (buffer.includes(0)) continue;
  const text = buffer.toString('utf8');
  for (const [name, pattern] of rules) {
    text.split('\n').forEach((line, index) => {
      if (pattern.test(line)) problems.push(`${file}:${index + 1}: ${name}`);
    });
  }
}
function checkLink(source, link) {
  if (!link || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(link)) return;
  const path = link.split(/[?#]/)[0];
  if (!path) return;
  const target = path.startsWith('/')
    ? path.startsWith('/src/')
      ? join(root, path)
      : join(root, 'public', path)
    : resolve(dirname(source), path);
  if (!existsSync(target))
    problems.push(`${source}: missing local link ${path}`);
}
for (const file of files.filter((file) => /\.(?:html|md)$/.test(file))) {
  const text = readFileSync(file, 'utf8');
  const links = file.endsWith('.html')
    ? text.matchAll(/(?:src|href)="([^"]+)"/g)
    : text.matchAll(/\]\(([^)]+)\)/g);
  for (const match of links) checkLink(file, match[1]);
}
for (const file of files.filter((file) => /\.(?:css|html)$/.test(file))) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g))
    checkLink(file, match[1]);
}
const mainSource = readFileSync('src/main.ts', 'utf8');
for (const match of mainSource.matchAll(/guide: '([^']+)'/g))
  checkLink('src/main.ts', `/guides/${match[1]}.md`);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (pkg.name !== 'agent-prompts' || pkg.license !== 'MIT')
  problems.push(
    'package.json: expected Agent Prompts package and MIT license metadata',
  );
for (const file of [
  'LICENSE',
  'public/LICENSE.txt',
  'public/fonts/GEIST-OFL.txt',
  'public/brands/LOBE-ICONS-LICENSE.txt',
  'public/brands/SIMPLE-ICONS-LICENSE.txt',
]) {
  if (!existsSync(file))
    problems.push(`${file}: required license notice missing`);
}
if (problems.length) {
  console.error(
    `Public-source audit failed:\n${problems.map((problem) => `- ${problem}`).join('\n')}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Public-source audit passed for ${files.length} distributable files.`,
  );
}
