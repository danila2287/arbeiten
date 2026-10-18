// Мини-шаблонизатор для HTML-компонентов из src/html.
//
// В .html-файлах можно писать:
//   {{name}}             — значение с экранированием (текст, атрибуты)
//   {{{name}}}           — готовый HTML без экранирования
//   {{link /catalog/}}   — ссылка внутри сайта с учётом base из config.js
//   {{current /catalog/}} — добавит aria-current="page", если это текущий раздел
//
// По смыслу это то же, что <load src="..."> из vite-plugin-html-inject в coca,
// только подстановку делает генератор: ему нужны данные из каталога.
import { readFileSync } from 'node:fs';
import { esc } from '../js/lib/format.js';

const htmlDir = new URL('../html/', import.meta.url);

export function fill(tpl, vars, { link, path }, name = 'шаблон') {
  return tpl
    .replace(/\{\{\{\s*(\w+)\s*\}\}\}/g, (_, k) => {
      if (!(k in vars)) throw new Error(`Нет значения для {{{${k}}}} в ${name}`);
      return vars[k] ?? '';
    })
    .replace(/\{\{link\s+(\S+?)\s*\}\}/g, (_, p) => link(p))
    .replace(/\{\{current\s+(\S+?)\s*\}\}/g, (_, p) =>
      path === p || (p !== '/' && path.startsWith(p)) ? ' aria-current="page"' : '',
    )
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => {
      if (!(k in vars)) throw new Error(`Нет значения для {{${k}}} в ${name}`);
      return esc(vars[k]);
    });
}

// partial('components/header', vars, ctx) → содержимое src/html/components/header.html
export function partial(name, vars, ctx) {
  const tpl = readFileSync(new URL(`${name}.html`, htmlDir), 'utf8');
  return fill(tpl, vars, ctx, `src/html/${name}.html`).trim();
}
