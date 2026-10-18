// Общие кусочки разметки для генератора страниц.
// Данные (каталог, контакты) сюда не импортируются — их передаёт генератор,
// чтобы при правке catalog.js страницы пересобирались без перезапуска.
import { productImage } from '../shared/art.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

export const rub = (n) => new Intl.NumberFormat('ru-RU').format(n).replace(/ | /g, ' ') + ' ₽';

export function pieces(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} предмет`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} предмета`;
  return `${n} предметов`;
}

export const itemUrl = (p) => `/item/${p.id}/`;
export const catUrl = (c) => `/catalog/${c.id}/`;

export function productCard(p) {
  return `
    <article class="pcard" data-card data-name="${esc((p.name + ' ' + p.desc).toLowerCase())}" data-price="${p.price}">
      <a class="pcard__img" href="${itemUrl(p)}" tabindex="-1" aria-hidden="true">${productImage(p)}</a>
      <h3 class="pcard__name"><a href="${itemUrl(p)}">${esc(p.name)}</a></h3>
      <p class="pcard__meta">${rub(p.price)} <span>/ сутки</span></p>
      <p class="pcard__stock">В наличии ${p.stock} шт.</p>
      <button class="btn btn--small" data-add="${p.id}" type="button">В заявку</button>
    </article>`;
}

// Хлебные крошки: видимые ссылки + разметка для поисковиков.
export function crumbs(site, trail) {
  const all = [['Главная', '/'], ...trail];
  const html = `<nav class="crumbs" aria-label="Навигация">${all
    .map(([label, href], i) => (i < all.length - 1 ? `<a href="${href}">${esc(label)}</a><span>/</span>` : `<span>${esc(label)}</span>`))
    .join('')}</nav>`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map(([label, href], i) => ({
      '@type': 'ListItem', position: i + 1, name: label, item: site.url + href,
    })),
  };
  return { html, ld };
}
