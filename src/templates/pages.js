// Страницы сайта. Каждая функция возвращает { path, html }.
// Статичные блоки (шаги, доставка, контакты) лежат в src/html/components,
// а здесь собирается то, что зависит от каталога.
import { art, productImage, photosOf } from '../js/shared/art.js';
import { esc, rub, pieces } from '../js/lib/format.js';
import { stepperHtml } from '../js/components/stepper.js';
import { partial } from './render.js';
import { layout, commonVars, productCard, crumbs, itemPath, catPath } from './parts.js';

const byId = (ctx, id) => ctx.products.find((p) => p.id === id);
const block = (ctx, name, path) => partial(name, commonVars(ctx), { link: ctx.link, path });

const faq = (site) => [
  [
    'Можно взять всего несколько стульев?',
    `Да, мы работаем с небольшими заказами: можно взять хоть 4 стула. Минимальная сумма заказа с доставкой — ${rub(site.minOrder)}, при самовывозе договоримся и на меньшее.`,
  ],
  [
    'Сколько стоит доставка?',
    `По Москве в пределах МКАД — ${rub(site.deliveryInsideMkad)} за доставку и вывоз. За МКАД добавляется ${site.deliveryPerKm} ₽ за каждый километр.`,
  ],
  [
    'За сколько дней нужно заказывать?',
    'Лучше за 3–7 дней, на выходные летом — раньше. Если мебель свободна, привезём и на следующий день.',
  ],
  [
    'Нужно ли мыть мебель и стирать скатерти после праздника?',
    'Нет. Мы заберём всё как есть — чистка и стирка входят в стоимость аренды.',
  ],
];

/* ---------- Главная ---------- */

function kitPanel(ctx, kit, i) {
  const lines = kit.items.map(([id, q]) => ({ p: byId(ctx, id), q })).filter((l) => l.p);
  const total = lines.reduce((s, l) => s + l.p.price * l.q, 0);
  const count = lines.reduce((s, l) => s + l.q, 0);
  return `
          <div class="slip__body" role="tabpanel" id="kit-${kit.id}" aria-labelledby="tab-${kit.id}"${i ? ' hidden' : ''}>
            <ul class="slip__lines">
              ${lines
                .map(
                  (l) =>
                    `<li class="slip__line"><a href="${ctx.link(itemPath(l.p))}">${esc(l.p.name)}</a><span class="slip__qty">${l.q} шт.</span><span class="slip__price">${rub(l.p.price * l.q)}</span></li>`,
                )
                .join('\n              ')}
            </ul>
            <div class="slip__total"><span>${pieces(count)} на сутки</span><strong class="slip__sum">${rub(total)}</strong></div>
            <button class="btn btn--wide" type="button" data-kit="${kit.id}" data-kit-name="${esc(kit.name)}" data-items='${JSON.stringify(kit.items)}'>Добавить набор в заявку</button>
            <p class="slip__hint">Состав можно поменять в заявке — убрать лишнее или добавить.</p>
          </div>`;
}

export function home(ctx) {
  const { site, categories, kits, link } = ctx;
  const popular = [
    'chiavari-white',
    'round-150',
    'cocktail',
    'tent-3x3',
    'lights',
    'sofa-white',
    'folding-white',
    'arch-round',
  ]
    .map((id) => byId(ctx, id))
    .filter(Boolean);

  const body = `
<section class="hero">
  <div class="container hero__grid">
    <div class="hero__text">
      <h1 class="hero__title">Мебель на праздник — от одного стула</h1>
      <p class="hero__lead">Сдаём в аренду стулья, столы, шатры, текстиль и декор для небольших мероприятий в Москве: дни рождения, домашние свадьбы, ужины, фотосессии, вечеринки во дворе. Привезём, расставим и заберём.</p>
      <div class="hero__actions">
        <a class="btn" href="${link('/catalog/')}">Открыть каталог</a>
        <a class="btn btn--ghost" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">Спросить в WhatsApp</a>
      </div>
      <dl class="facts">
        <div class="facts__item"><dt>Заказ</dt><dd>от ${rub(site.minOrder)}</dd></div>
        <div class="facts__item"><dt>Доставка по Москве</dt><dd>${rub(site.deliveryInsideMkad)}</dd></div>
        <div class="facts__item"><dt>Ответ на заявку</dt><dd>в течение часа</dd></div>
      </dl>
    </div>

    <aside class="slip" aria-label="Готовые наборы" data-kits>
      <div class="slip__head">
        <p class="slip__title">Готовые наборы</p>
        <div class="slip__tabs" role="tablist">
          ${kits.map((k, i) => `<button class="slip__tab" role="tab" type="button" id="tab-${k.id}" aria-controls="kit-${k.id}" aria-selected="${i === 0}">${esc(k.name)}</button>`).join('\n          ')}
        </div>
      </div>${kits.map((k, i) => kitPanel(ctx, k, i)).join('')}
    </aside>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section__title">Что можно взять в аренду</h2>
    <ul class="cats">
      ${categories
        .map(
          (c) => `<li><a class="cat" href="${link(catPath(c))}">
        ${art(c.art[0], c.art[1])}
        <span class="cat__name">${esc(c.name)}</span>
        <span class="cat__note">${esc(c.note)}</span>
      </a></li>`,
        )
        .join('\n      ')}
    </ul>
  </div>
</section>

${block(ctx, 'components/home/steps', '/')}

<section class="section">
  <div class="container">
    <div class="section__head">
      <h2 class="section__title">Чаще всего берут</h2>
      <a class="link" href="${link('/catalog/')}">Весь каталог</a>
    </div>
    <div class="grid">${popular.map((p) => productCard(p, link)).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container faq">
    <h2 class="faq__title">Частые вопросы</h2>
    <div class="faq__list">
      ${faq(site)
        .map(
          ([q, a]) =>
            `<details class="faq__item"><summary class="faq__question">${esc(q)}</summary><p class="faq__answer">${esc(a)}</p></details>`,
        )
        .join('\n      ')}
    </div>
  </div>
</section>

${block(ctx, 'components/home/avito', '/')}`;

  const business = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: `${site.tagline} в Москве`,
    url: `${site.url}/`,
    telephone: site.phoneRaw,
    email: site.email,
    areaServed: 'Москва и Московская область',
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'RU' },
    priceRange: '₽₽',
    sameAs: [site.avito],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq(site).map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return {
    path: '/',
    html: layout(ctx, {
      path: '/',
      title: `Аренда мебели для небольших мероприятий в Москве — ${site.name}`,
      description: `Аренда стульев, столов, шатров, текстиля и декора в Москве от одной штуки. Доставка ${rub(site.deliveryInsideMkad)}, расстановка и вывоз. Готовые наборы на 10–20 гостей.`,
      body,
      ld: [business, faqLd],
    }),
  };
}

/* ---------- Каталог и категории ---------- */

function catalogPage(ctx, cat) {
  const { site, categories, products, link } = ctx;
  const items = cat ? products.filter((p) => p.cat === cat.id) : products;
  const path = cat ? catPath(cat) : '/catalog/';
  const cr = crumbs(ctx, cat ? [['Каталог', '/catalog/'], [cat.name, path]] : [['Каталог', path]]);
  const count = (id) => products.filter((p) => p.cat === id).length;

  const body = `
<section class="section section--tight">
  <div class="container">
    ${cr.html}
    <h1 class="page-title">${esc(cat ? cat.h1 : 'Каталог мебели в аренду')}</h1>
    <p class="intro">${esc(cat ? cat.intro : 'Всё, что сдаём для небольших мероприятий в Москве. Цены — за одну штуку на сутки.')}</p>
    <div class="catalog">
      <aside class="filters" aria-label="Разделы каталога">
        <ul class="filters__list">
          <li><a class="filters__link" href="${link('/catalog/')}"${!cat ? ' aria-current="page"' : ''}>Все товары <span class="filters__count">${products.length}</span></a></li>
          ${categories.map((c) => `<li><a class="filters__link" href="${link(catPath(c))}"${cat?.id === c.id ? ' aria-current="page"' : ''}>${esc(c.name)} <span class="filters__count">${count(c.id)}</span></a></li>`).join('\n          ')}
        </ul>
      </aside>
      <div class="catalog__main">
        <div class="toolbar" data-toolbar hidden>
          <label class="field field--search"><span class="sr-only">Поиск</span>
            <input type="search" placeholder="Найти: стул, скатерть, шатёр…" data-search></label>
          <label class="field"><span class="sr-only">Сортировка</span>
            <select data-sort>
              <option value="default">По порядку</option>
              <option value="cheap">Сначала дешевле</option>
              <option value="expensive">Сначала дороже</option>
            </select></label>
        </div>
        <div class="grid grid--catalog" data-list>${items.map((p) => productCard(p, link)).join('')}
        </div>
        <p class="empty" data-empty hidden>Ничего не нашлось. Попробуйте другое слово или напишите нам — подберём похожее.</p>
      </div>
    </div>
  </div>
</section>`;

  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: site.url + itemPath(p),
      name: p.name,
    })),
  };

  const minPrice = items.length ? Math.min(...items.map((p) => p.price)) : 0;
  const shortIntro = (text) =>
    text.length > 155 ? `${text.slice(0, 155).replace(/\s+\S*$/, '')}…` : text;

  return {
    path,
    html: layout(ctx, {
      path,
      title: cat
        ? `${cat.h1} — от ${rub(minPrice)} в сутки | ${site.name}`
        : `Каталог мебели в аренду в Москве | ${site.name}`,
      description: cat
        ? shortIntro(cat.intro)
        : `Стулья, столы, мягкая мебель, шатры, текстиль и декор в аренду в Москве. ${products.length} позиций, заказ от одной штуки.`,
      body,
      ld: [cr.ld, listLd],
    }),
  };
}

export const catalog = (ctx) => catalogPage(ctx, null);
export const category = (ctx, cat) => catalogPage(ctx, cat);

/* ---------- Товар ---------- */

// Галерея для товара с несколькими фото: лента со свайпом, стрелки и миниатюры.
// Без JavaScript лента всё равно листается свайпом и прокруткой.
function gallery(p, photos, link) {
  const alt = (i) => esc(`${p.name} — фото ${i + 1} из ${photos.length}`);
  return `<div class="gallery" data-gallery>
          <div class="gallery__viewport">
            <div class="gallery__track" data-gallery-track tabindex="0" role="region" aria-label="Фотографии товара">
              ${photos
                .map(
                  (src, i) =>
                    `<img class="gallery__slide art art--photo" src="${link(src)}" alt="${alt(i)}" width="500" height="400"${i ? ' loading="lazy"' : ''}>`,
                )
                .join('\n              ')}
            </div>
            <button class="gallery__arrow gallery__arrow--prev" type="button" data-gallery-prev aria-label="Предыдущее фото" hidden>‹</button>
            <button class="gallery__arrow gallery__arrow--next" type="button" data-gallery-next aria-label="Следующее фото" hidden>›</button>
          </div>
          <div class="gallery__thumbs">
            ${photos
              .map(
                (src, i) =>
                  `<button class="gallery__thumb" type="button" data-gallery-thumb="${i}" aria-label="Показать фото ${i + 1}"${i ? '' : ' aria-current="true"'}><img src="${link(src)}" alt="" width="80" height="64" loading="lazy"></button>`,
              )
              .join('\n            ')}
          </div>
        </div>`;
}

export function item(ctx, p) {
  const { site, categories, products, link } = ctx;
  const cat = categories.find((c) => c.id === p.cat);
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const path = itemPath(p);
  const photos = photosOf(p);
  const cr = crumbs(ctx, [
    ['Каталог', '/catalog/'],
    [cat.name, catPath(cat)],
    [p.name, path],
  ]);

  const body = `
<section class="section section--tight">
  <div class="container">
    ${cr.html}
    <div class="product">
      <div class="product__img">${photos.length > 1 ? gallery(p, photos, link) : productImage(p, link)}</div>
      <div class="product__info">
        <h1 class="page-title product__title">${esc(p.name)} — аренда</h1>
        <p class="product__price">${rub(p.price)} <span class="product__unit">за сутки</span></p>
        <p>${esc(p.desc)}</p>
        <dl class="specs">
          ${Object.entries(p.specs)
            .map(([k, v]) => `<div class="specs__row"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
            .join('\n          ')}
          <div class="specs__row"><dt>В наличии</dt><dd>${p.stock} шт.</dd></div>
        </dl>
        <div class="buy" data-buy="${p.id}">
          ${stepperHtml(p.id, 1, p.stock).trim()}
          <button class="btn" type="button" data-buy-btn>Добавить в заявку</button>
        </div>
        <p class="buy__sum" data-buy-sum>${rub(p.price)} за 1 шт. в сутки</p>
        <p class="note">Доставка по Москве — ${rub(site.deliveryInsideMkad)}. <a href="${link('/delivery/')}">Подробнее о доставке и ценах</a></p>
      </div>
    </div>
  </div>
</section>${
    related.length
      ? `

<section class="section">
  <div class="container">
    <h2 class="section__title">Ещё в разделе «${esc(cat.name)}»</h2>
    <div class="grid">${related.map((r) => productCard(r, link)).join('')}
    </div>
  </div>
</section>`
      : ''
  }`;

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.desc,
    category: cat.name,
    ...(photos.length ? { image: photos.map((src) => site.url + src) } : {}),
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
      url: site.url + path,
    },
  };

  return {
    path,
    html: layout(ctx, {
      path,
      title: `${p.name} — аренда в Москве за ${rub(p.price)} | ${site.name}`,
      description: `${p.desc} Аренда от 1 шт., ${rub(p.price)} в сутки. Доставка по Москве.`,
      body,
      ld: [cr.ld, productLd],
    }),
  };
}

/* ---------- Заявка (собирается в браузере) ---------- */

export function cart(ctx) {
  const body = `
<section class="section section--tight">
  <div class="container" data-cart-root>
    <h1 class="page-title">Заявка</h1>
    <noscript><p>Для оформления заявки включите JavaScript или напишите нам в WhatsApp: <a href="https://wa.me/${ctx.site.whatsapp}">wa.me/${ctx.site.whatsapp}</a></p></noscript>
  </div>
</section>`;
  return {
    path: '/cart/',
    html: layout(ctx, {
      path: '/cart/',
      noindex: true,
      title: `Заявка на аренду | ${ctx.site.name}`,
      description: 'Ваша заявка на аренду мебели.',
      body,
    }),
  };
}

/* ---------- Доставка, контакты, 404 ---------- */

export function delivery(ctx) {
  const { site } = ctx;
  return {
    path: '/delivery/',
    html: layout(ctx, {
      path: '/delivery/',
      title: `Доставка и цены на аренду мебели в Москве | ${site.name}`,
      description: `Доставка мебели по Москве — ${rub(site.deliveryInsideMkad)}, за МКАД — ${site.deliveryPerKm} ₽/км. Минимальный заказ ${rub(site.minOrder)}. Оплата, залог и условия аренды.`,
      body: block(ctx, 'components/delivery/content', '/delivery/'),
    }),
  };
}

export function contacts(ctx) {
  const { site } = ctx;
  return {
    path: '/contacts/',
    html: layout(ctx, {
      path: '/contacts/',
      title: `Контакты | ${site.name}`,
      description: `Телефон, WhatsApp и Telegram для заказа мебели в аренду в Москве. ${site.hours}.`,
      body: block(ctx, 'components/contacts/content', '/contacts/'),
    }),
  };
}

export function notFound(ctx) {
  return {
    path: '/404.html',
    html: layout(ctx, {
      path: '/404.html',
      noindex: true,
      title: `Страница не найдена | ${ctx.site.name}`,
      description: 'Страница не найдена.',
      body: block(ctx, 'components/not-found', '/404.html'),
    }),
  };
}
