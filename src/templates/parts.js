// Общая разметка, которая строится из данных каталога.
import { readFileSync } from 'node:fs';
import { esc, rub } from '../js/lib/format.js';
import { productImage } from '../js/shared/art.js';
import { stepperHtml } from '../js/components/stepper.js';
import { partial } from './render.js';

export const itemPath = (p) => `/item/${p.id}/`;
export const catPath = (c) => `/catalog/${c.id}/`;

// Переменные, доступные во всех HTML-компонентах.
export function commonVars(ctx) {
  const { site, categories, link } = ctx;
  return {
    siteName: site.name,
    tagline: site.tagline,
    city: site.city,
    phone: site.phone,
    phoneRaw: site.phoneRaw,
    telegram: site.telegram,
    email: site.email,
    avito: site.avito,
    hours: site.hours,
    year: new Date().getFullYear(),
    minOrder: rub(site.minOrder),
    deliveryInsideMkad: rub(site.deliveryInsideMkad),
    deliveryPerKm: site.deliveryPerKm,
    assemblyPercent: site.assemblyPercent,
    footerCategories: categories
      .map((c) => `<li><a href="${link(catPath(c))}">${esc(c.name)}</a></li>`)
      .join('\n        '),
  };
}

export function productCard(p, link) {
  const href = link(itemPath(p));
  return `
      <article class="pcard" data-card data-name="${esc(`${p.name} ${p.desc}`.toLowerCase())}" data-price="${p.price}">
        <a class="pcard__img" href="${href}" tabindex="-1" aria-hidden="true">${productImage(p, link)}</a>
        <h3 class="pcard__name"><a href="${href}">${esc(p.name)}</a></h3>
        <p class="pcard__price">${rub(p.price)} <span class="pcard__unit">/ сутки</span></p>
        <p class="pcard__stock">В наличии ${p.stock} шт.</p>
        <div class="pcard__add" data-add-box="${p.id}">
          <button class="btn btn--small pcard__btn" data-add="${p.id}" type="button">В заявку</button>
          ${stepperHtml(p.id, 0, p.stock, `Количество: ${p.name}`)}
        </div>
      </article>`;
}

// Хлебные крошки: видимые ссылки + разметка BreadcrumbList для поисковиков.
export function crumbs(ctx, trail) {
  const { site, link } = ctx;
  const all = [['Главная', '/'], ...trail];
  const html = `<nav class="crumbs" aria-label="Навигация">${all
    .map(([label, path], i) =>
      i < all.length - 1
        ? `<a class="crumbs__link" href="${link(path)}">${esc(label)}</a><span aria-hidden="true">/</span>`
        : `<span aria-current="page">${esc(label)}</span>`,
    )
    .join('')}</nav>`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map(([label, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: label,
      item: site.url + path,
    })),
  };
  return { html, ld };
}

const metrikaTpl = readFileSync(new URL('../html/components/metrika.html', import.meta.url), 'utf8');

/**
 * Полная HTML-страница: head + шапка + содержимое + подвал.
 * @param {object} ctx  site, categories, products, kits, link
 * @param {object} o
 * @param {string} o.path        адрес страницы без base, например /catalog/chairs/
 * @param {string} o.title       <title>
 * @param {string} o.description meta description (до ~160 символов)
 * @param {string} o.body        содержимое <main>
 * @param {object[]} [o.ld]      объекты JSON-LD
 * @param {boolean} [o.noindex]  не индексировать (заявка, 404)
 */
export function layout(ctx, o) {
  const { site } = ctx;
  const rctx = { link: ctx.link, path: o.path };
  const vars = commonVars(ctx);
  const canonical = site.url + o.path;

  const head = partial(
    'base/head',
    {
      ...vars,
      title: o.title,
      description: o.description,
      canonical,
      robots: o.noindex
        ? '<meta name="robots" content="noindex" />'
        : `<link rel="canonical" href="${esc(canonical)}" />`,
      jsonLd: (o.ld || [])
        .map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`)
        .join('\n  '),
    },
    rctx,
  );

  const metrika = site.metrikaId
    ? metrikaTpl.replaceAll('{{metrikaId}}', String(Number(site.metrikaId)))
    : '';

  return `<!doctype html>
<html lang="ru">
${head}
<body>
${partial('components/header', vars, rctx)}

<main class="main" id="main" tabindex="-1">
${o.body.trim()}
</main>

${partial('components/footer', vars, rctx)}
<script type="module" src="/js/main.js"></script>
${metrika}
</body>
</html>
`;
}
