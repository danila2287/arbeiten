import { esc } from './parts.js';

const nav = [
  ['/catalog/', 'Каталог'],
  ['/delivery/', 'Доставка и цены'],
  ['/contacts/', 'Контакты'],
];

function metrika(id) {
  if (!id) return '';
  // Стандартный код счётчика. Можно заменить кодом из кабинета Метрики.
  return `
    <script>
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(${Number(id)}, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/${Number(id)}" style="position:absolute; left:-9999px;" alt=""></div></noscript>`;
}

/**
 * Полная HTML-страница.
 * @param {object} o
 * @param {string} o.path        адрес страницы, например /catalog/chairs/
 * @param {string} o.page        имя страницы для клиентского JS (body[data-page])
 * @param {string} o.title       <title>
 * @param {string} o.description meta description (до ~160 символов)
 * @param {string} o.body        содержимое <main>
 * @param {object[]} [o.ld]      объекты JSON-LD
 * @param {boolean} [o.noindex]  не индексировать (заявка, 404)
 */
export function layout(ctx, o) {
  const { site, categories } = ctx;
  const canonical = site.url + o.path;
  const ld = (o.ld || []).map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n    ');

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(o.title)}</title>
    <meta name="description" content="${esc(o.description)}">
    ${o.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
    <meta property="og:type" content="website">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:site_name" content="${esc(site.name)}">
    <meta property="og:title" content="${esc(o.title)}">
    <meta property="og:description" content="${esc(o.description)}">
    <meta property="og:url" content="${canonical}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/src/styles.css">
    ${ld}
  </head>
  <body data-page="${o.page}">
    <a class="skip" href="#main">Перейти к содержимому</a>
    <header class="header">
      <div class="wrap header__row">
        <a class="logo" href="/" aria-label="${esc(site.name)}, на главную">
          <svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14"/><path d="M22 14v36M42 14v36M22 20h20M22 28h20M18 34h28"/></svg>
          <span>${esc(site.name)}</span>
        </a>
        <nav class="nav" aria-label="Основное меню">
          ${nav.map(([href, label]) => `<a href="${href}"${o.path.startsWith(href) ? ' aria-current="page"' : ''}>${label}</a>`).join('\n          ')}
        </nav>
        <a class="header__phone" href="tel:${site.phoneRaw}">${esc(site.phone)}</a>
        <a class="cartlink" href="/cart/"${o.path === '/cart/' ? ' aria-current="page"' : ''}>Заявка<b data-cart-count hidden></b></a>
      </div>
    </header>

    <main id="main" tabindex="-1">${o.body}
    </main>

    <footer class="footer">
      <div class="wrap footer__grid">
        <div>
          <p class="footer__brand">${esc(site.name)}</p>
          <p>${esc(site.tagline)}. ${esc(site.city)} и область.</p>
        </div>
        <div>
          <p class="footer__head">Каталог</p>
          <ul>${categories.map((c) => `<li><a href="/catalog/${c.id}/">${esc(c.name)}</a></li>`).join('')}</ul>
        </div>
        <div>
          <p class="footer__head">Связаться</p>
          <ul>
            <li><a href="tel:${site.phoneRaw}">${esc(site.phone)}</a></li>
            <li><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a href="https://t.me/${site.telegram}" target="_blank" rel="noopener">Telegram</a></li>
            <li><a href="${site.avito}" target="_blank" rel="noopener">Мы на Авито</a></li>
            <li>${esc(site.hours)}</li>
          </ul>
        </div>
      </div>
      <div class="wrap footer__small">© ${new Date().getFullYear()} ${esc(site.name)}. Цены на сайте не являются публичной офертой.</div>
    </footer>

    <div id="toast" class="toast" role="status" aria-live="polite"></div>
    <script type="module" src="/src/main.js"></script>${metrika(site.metrikaId)}
  </body>
</html>
`;
}
