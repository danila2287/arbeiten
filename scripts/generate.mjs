// Генератор страниц.
// Берёт src/data (контакты и каталог), src/html (компоненты) и src/templates
// и пишет готовый HTML прямо в src/ — оттуда его забирает Vite:
//   src/index.html, src/catalog/…, src/item/…, src/cart/, src/delivery/,
//   src/contacts/, src/404.html, а также src/assets/sitemap.xml и robots.txt.
// Эти файлы — результат сборки: правьте исходники, а не их (они в .gitignore).
//
// Запускается сам из vite.config.js (npm run dev / npm run build).
// Вручную: npm run pages

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Импорт без кеша — чтобы правки каталога подхватывались без перезапуска.
const fresh = (root, rel) => import(`${pathToFileURL(join(root, rel)).href}?t=${Date.now()}`);

function writeIfChanged(file, content) {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return true;
}

export async function generate(root = projectRoot) {
  const src = join(root, 'src');
  const { site, link } = await fresh(root, 'src/data/config.js');
  const { categories, products, kits } = await fresh(root, 'src/data/catalog.js');
  const t = await fresh(root, 'src/templates/pages.js');
  const ctx = { site, link, categories, products, kits };

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
  for (const page of pages) {
    const file = page.path.endsWith('.html')
      ? join(src, page.path)
      : join(src, page.path, 'index.html');
    if (writeIfChanged(file, page.html)) changed++;
    files.push(file);
  }

  // sitemap.xml — только страницы для поиска (без заявки и 404)
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => p.path !== '/cart/' && p.path !== '/404.html')
    .map((p) => `  <url><loc>${site.url}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  writeIfChanged(
    join(src, 'assets/sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  writeIfChanged(
    join(src, 'assets/robots.txt'),
    `User-agent: *\nDisallow: ${link('/cart/')}\n\nSitemap: ${site.url}/sitemap.xml\n`,
  );

  return { files, changed, base: site.base };
}

// Запуск из командной строки
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { files, changed } = await generate();
  console.log(`Страниц: ${files.length}, обновлено: ${changed}`);
}
