// Генератор статических страниц.
// Берёт src/config.js и src/data/catalog.js и пишет готовый HTML:
//   index.html, catalog/index.html, catalog/<категория>/index.html,
//   item/<товар>/index.html, cart/, delivery/, contacts/, 404.html,
//   а также public/sitemap.xml и public/robots.txt.
// Эти файлы — результат сборки: правьте шаблоны в src/templates, а не их.
//
// Запускается автоматически из vite.config.js (npm run dev / npm run build).
// Вручную: node scripts/generate.mjs

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Свежий импорт без кеша — чтобы правки каталога подхватывались в dev-режиме.
const fresh = (root, rel) => import(pathToFileURL(join(root, rel)).href + '?t=' + Date.now());

function writeIfChanged(file, content) {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return true;
}

const fileFor = (root, path) => (path.endsWith('.html') ? join(root, path) : join(root, path, 'index.html'));

export async function generate(root = defaultRoot) {
  const { site } = await fresh(root, 'src/config.js');
  const { categories, products, kits } = await fresh(root, 'src/data/catalog.js');
  const t = await fresh(root, 'src/templates/pages.js');
  const ctx = { site, categories, products, kits };

  const pages = [
    t.home(ctx),
    t.catalog(ctx),
    ...categories.map((c) => t.category(ctx, c)),
    ...products.map((p) => t.item(ctx, p)),
    t.cart(ctx),
    t.delivery(ctx),
    t.contacts(ctx),
    t.notFound(ctx),
  ];

  const files = [];
  let changed = 0;
  for (const pg of pages) {
    const file = fileFor(root, pg.path);
    if (writeIfChanged(file, pg.html)) changed++;
    files.push(file);
  }

  // sitemap.xml — только страницы для поиска (без заявки и 404).
  const today = new Date().toISOString().slice(0, 10);
  const indexable = pages.filter((p) => p.path !== '/cart/' && p.path !== '/404.html');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${site.url}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
  writeIfChanged(join(root, 'public/sitemap.xml'), sitemap);
  writeIfChanged(join(root, 'public/robots.txt'), `User-agent: *\nDisallow: /cart/\n\nSitemap: ${site.url}/sitemap.xml\n`);

  return { files, changed };
}

// Запуск из командной строки
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { files, changed } = await generate();
  console.log(`Страниц: ${files.length}, обновлено: ${changed}`);
}
