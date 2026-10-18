// Шаблоны страниц. Каждая функция возвращает { path, html }.
import { layout } from './layout.js';
import { art, productImage } from '../shared/art.js';
import { esc, rub, pieces, productCard, crumbs, itemUrl, catUrl } from './parts.js';

const byId = (ctx, id) => ctx.products.find((p) => p.id === id);

const faq = (site) => [
  ['Можно взять всего несколько стульев?', `Да, мы работаем с небольшими заказами: можно взять хоть 4 стула. Минимальная сумма заказа с доставкой — ${rub(site.minOrder)}, при самовывозе договоримся и на меньшее.`],
  ['Сколько стоит доставка?', `По Москве в пределах МКАД — ${rub(site.deliveryInsideMkad)} за доставку и вывоз. За МКАД добавляется ${site.deliveryPerKm} ₽ за каждый километр.`],
  ['За сколько дней нужно заказывать?', 'Лучше за 3–7 дней, на выходные летом — раньше. Если мебель свободна, привезём и на следующий день.'],
  ['Нужно ли мыть мебель и стирать скатерти после праздника?', 'Нет. Мы заберём всё как есть — чистка и стирка входят в стоимость аренды.'],
];

/* ---------- Главная ---------- */
export function home(ctx) {
  const { site, categories, kits } = ctx;
  const popular = ['chiavari-white', 'round-150', 'cocktail', 'tent-3x3', 'lights', 'sofa-white', 'folding-white', 'arch-round']
    .map((id) => byId(ctx, id)).filter(Boolean);

  const kitPanel = (kit, i) => {
    const lines = kit.items.map(([id, q]) => ({ p: byId(ctx, id), q })).filter((l) => l.p);
    const total = lines.reduce((s, l) => s + l.p.price * l.q, 0);
    const count = lines.reduce((s, l) => s + l.q, 0);
    return `
          <div class="slip__body" role="tabpanel" id="kit-${kit.id}" aria-labelledby="tab-${kit.id}"${i ? ' hidden' : ''}>
            <ul class="slip__lines">
              ${lines.map((l) => `<li><a href="${itemUrl(l.p)}">${esc(l.p.name)}</a><span class="slip__q">${l.q} шт.</span><span>${rub(l.p.price * l.q)}</span></li>`).join('\n              ')}
            </ul>
            <div class="slip__total"><span>${pieces(count)} на сутки</span><strong>${rub(total)}</strong></div>
            <button class="btn" type="button" data-kit="${kit.id}" data-kit-name="${esc(kit.name)}" data-items='${JSON.stringify(kit.items)}'>Добавить набор в заявку</button>
            <p class="slip__hint">Состав можно поменять в заявке — убрать лишнее или добавить.</p>
          </div>`;
  };

  const body = `
      <section class="hero">
        <div class="wrap hero__grid">
          <div class="hero__text">
            <h1>Мебель на праздник — от одного стула</h1>
            <p class="lead">Сдаём в аренду стулья, столы, шатры, текстиль и декор для небольших мероприятий в Москве: дни рождения, домашние свадьбы, ужины, фотосессии, вечеринки во дворе. Привезём, расставим и заберём.</p>
            <div class="hero__actions">
              <a class="btn" href="/catalog/">Открыть каталог</a>
              <a class="btn btn--ghost" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">Спросить в WhatsApp</a>
            </div>
            <dl class="facts">
              <div><dt>Заказ</dt><dd>от ${rub(site.minOrder)}</dd></div>
              <div><dt>Доставка по Москве</dt><dd>${rub(site.deliveryInsideMkad)}</dd></div>
              <div><dt>Ответ на заявку</dt><dd>в течение часа</dd></div>
            </dl>
          </div>

          <aside class="slip" aria-label="Готовые наборы" data-kits>
            <div class="slip__head">
              <p class="slip__title">Готовые наборы</p>
              <div class="slip__tabs" role="tablist">
                ${kits.map((k, i) => `<button role="tab" type="button" id="tab-${k.id}" aria-controls="kit-${k.id}" aria-selected="${i === 0}">${esc(k.name)}</button>`).join('\n                ')}
              </div>
            </div>${kits.map(kitPanel).join('')}
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <h2>Что можно взять в аренду</h2>
          <ul class="cats">
            ${categories.map((c) => `<li><a class="cat" href="${catUrl(c)}">
              ${art(c.art[0], c.art[1], '')}
              <span class="cat__name">${esc(c.name)}</span>
              <span class="cat__note">${esc(c.note)}</span>
            </a></li>`).join('\n            ')}
          </ul>
        </div>
      </section>

      <section class="section section--steps">
        <div class="wrap">
          <h2>Как проходит аренда</h2>
          <ol class="steps">
            <li><h3>Соберите заявку</h3><p>Добавьте в заявку нужное количество — хоть 4 стула. Сумма считается сразу.</p></li>
            <li><h3>Подтвердим наличие</h3><p>Перезвоним или напишем, проверим даты и посчитаем доставку до вашего адреса.</p></li>
            <li><h3>Привезём и расставим</h3><p>Приедем к согласованному времени, занесём и при желании расставим по плану.</p></li>
            <li><h3>Заберём после</h3><p>Мыть и складывать ничего не нужно — вывезем сами в удобное время.</p></li>
          </ol>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="section__head">
            <h2>Чаще всего берут</h2>
            <a class="link" href="/catalog/">Весь каталог</a>
          </div>
          <div class="grid">${popular.map(productCard).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap faq">
          <h2>Частые вопросы</h2>
          <div class="faq__list">
            ${faq(site).map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n            ')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap avito">
          <div>
            <h2>Мы есть на Авито</h2>
            <p>Там отзывы клиентов и фото с прошлых мероприятий. Можно написать и оформить заказ прямо там.</p>
          </div>
          <a class="btn btn--ghost" href="${site.avito}" target="_blank" rel="noopener">Открыть профиль на Авито</a>
        </div>
      </section>`;

  const business = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: `${site.tagline} в Москве`,
    url: site.url + '/',
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
    mainEntity: faq(site).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return {
    path: '/',
    html: layout(ctx, {
      path: '/', page: 'home',
      title: `Аренда мебели для небольших мероприятий в Москве — ${site.name}`,
      description: `Аренда стульев, столов, шатров, текстиля и декора в Москве от одной штуки. Доставка ${rub(site.deliveryInsideMkad)}, расстановка и вывоз. Готовые наборы на 10–20 гостей.`,
      body, ld: [business, faqLd],
    }),
  };
}

/* ---------- Каталог и категории ---------- */
function catalogLayout(ctx, cat) {
  const { site, categories, products } = ctx;
  const items = cat ? products.filter((p) => p.cat === cat.id) : products;
  const path = cat ? catUrl(cat) : '/catalog/';
  const cr = crumbs(site, cat ? [['Каталог', '/catalog/'], [cat.name, path]] : [['Каталог', path]]);

  const body = `
      <section class="section section--tight">
        <div class="wrap">
          ${cr.html}
          <h1 class="page-title">${esc(cat ? cat.h1 : 'Каталог мебели в аренду')}</h1>
          ${cat ? `<p class="intro">${esc(cat.intro)}</p>` : '<p class="intro">Всё, что сдаём для небольших мероприятий в Москве. Цены — за одну штуку на сутки.</p>'}
          <div class="catalog">
            <aside class="filters">
              <ul class="filters__cats">
                <li><a href="/catalog/"${!cat ? ' aria-current="page"' : ''}>Все товары <span>${products.length}</span></a></li>
                ${categories.map((c) => `<li><a href="${catUrl(c)}"${cat?.id === c.id ? ' aria-current="page"' : ''}>${esc(c.name)} <span>${products.filter((p) => p.cat === c.id).length}</span></a></li>`).join('\n                ')}
              </ul>
            </aside>
            <div>
              <div class="toolbar" data-toolbar hidden>
                <label class="field field--search"><span class="sr">Поиск</span>
                  <input type="search" placeholder="Найти: стул, скатерть, шатёр…" data-search></label>
                <label class="field"><span class="sr">Сортировка</span>
                  <select data-sort>
                    <option value="default">По порядку</option>
                    <option value="cheap">Сначала дешевле</option>
                    <option value="expensive">Сначала дороже</option>
                  </select></label>
              </div>
              <div class="grid" data-list>${items.map(productCard).join('')}
              </div>
              <p class="empty" data-empty hidden>Ничего не нашлось. Попробуйте другое слово или напишите нам — подберём похожее.</p>
            </div>
          </div>
        </div>
      </section>`;

  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: site.url + itemUrl(p), name: p.name })),
  };

  const minPrice = items.length ? Math.min(...items.map((p) => p.price)) : 0;
  return {
    path,
    html: layout(ctx, {
      path, page: 'catalog',
      title: cat ? `${cat.h1} — от ${rub(minPrice)} в сутки | ${site.name}` : `Каталог мебели в аренду в Москве | ${site.name}`,
      description: cat ? cat.intro.slice(0, 155).replace(/\s+\S*$/, '') + '…' : `Стулья, столы, мягкая мебель, шатры, текстиль и декор в аренду в Москве. ${products.length} позиций, заказ от одной штуки.`,
      body, ld: [cr.ld, listLd],
    }),
  };
}

export const catalog = (ctx) => catalogLayout(ctx, null);
export const category = (ctx, cat) => catalogLayout(ctx, cat);

/* ---------- Товар ---------- */
export function item(ctx, p) {
  const { site, categories, products } = ctx;
  const cat = categories.find((c) => c.id === p.cat);
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const path = itemUrl(p);
  const cr = crumbs(site, [['Каталог', '/catalog/'], [cat.name, catUrl(cat)], [p.name, path]]);

  const body = `
      <section class="section section--tight">
        <div class="wrap">
          ${cr.html}
          <div class="product">
            <div class="product__img">${productImage(p)}</div>
            <div class="product__info">
              <h1 class="page-title">${esc(p.name)} — аренда</h1>
              <p class="product__price">${rub(p.price)} <span>за сутки</span></p>
              <p>${esc(p.desc)}</p>
              <dl class="specs">
                ${Object.entries(p.specs).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n                ')}
                <div><dt>В наличии</dt><dd>${p.stock} шт.</dd></div>
              </dl>
              <div class="buy" data-buy="${p.id}" data-price="${p.price}" data-stock="${p.stock}">
                <div class="stepper" data-stepper="${p.id}">
                  <button type="button" data-step="-1" aria-label="Меньше">−</button>
                  <input type="number" inputmode="numeric" min="0" max="${p.stock}" value="1" aria-label="Количество">
                  <button type="button" data-step="1" aria-label="Больше">+</button>
                </div>
                <button class="btn" type="button" data-buy-btn>Добавить в заявку</button>
              </div>
              <p class="buy__sum" data-buy-sum>${rub(p.price)} за 1 шт. в сутки</p>
              <p class="note">Доставка по Москве — ${rub(site.deliveryInsideMkad)}. <a href="/delivery/">Подробнее о доставке и ценах</a></p>
            </div>
          </div>
        </div>
      </section>${related.length ? `
      <section class="section">
        <div class="wrap">
          <h2>Ещё в разделе «${esc(cat.name)}»</h2>
          <div class="grid">${related.map(productCard).join('')}
          </div>
        </div>
      </section>` : ''}`;

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.desc,
    category: cat.name,
    ...(p.image ? { image: site.url + p.image } : {}),
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
      path, page: 'item',
      title: `${p.name} — аренда в Москве за ${rub(p.price)} | ${site.name}`,
      description: `${p.desc} Аренда от 1 шт., ${rub(p.price)} в сутки. Доставка по Москве.`.slice(0, 200),
      body, ld: [cr.ld, productLd],
    }),
  };
}

/* ---------- Заявка (собирается в браузере) ---------- */
export function cart(ctx) {
  const body = `
      <section class="section section--tight">
        <div class="wrap" data-cart-root>
          <h1 class="page-title">Заявка</h1>
          <noscript><p>Для оформления заявки включите JavaScript или напишите нам в WhatsApp: <a href="https://wa.me/${ctx.site.whatsapp}">wa.me/${ctx.site.whatsapp}</a></p></noscript>
        </div>
      </section>`;
  return {
    path: '/cart/',
    html: layout(ctx, {
      path: '/cart/', page: 'cart', noindex: true,
      title: `Заявка на аренду | ${ctx.site.name}`,
      description: 'Ваша заявка на аренду мебели.',
      body,
    }),
  };
}

/* ---------- Доставка ---------- */
export function delivery(ctx) {
  const { site } = ctx;
  const body = `
      <section class="section section--tight">
        <div class="wrap prose">
          <h1 class="page-title">Доставка и цены</h1>

          <h2>Как считается аренда</h2>
          <p>Цена в каталоге — за одну штуку на сутки мероприятия. Сутки начинаются с момента доставки. Если аренда дольше, каждые следующие сутки стоят 50% цены.</p>
          <p>Минимальная сумма заказа — ${rub(site.minOrder)}. Меньше — можно при самовывозе, уточните у нас.</p>

          <h2>Доставка</h2>
          <table class="table">
            <tbody>
              <tr><th scope="row">В пределах МКАД</th><td>${rub(site.deliveryInsideMkad)} — привезти и забрать</td></tr>
              <tr><th scope="row">За МКАД</th><td>+${site.deliveryPerKm} ₽ за каждый километр от МКАД</td></tr>
              <tr><th scope="row">Подъём на этаж</th><td>С лифтом — бесплатно, без лифта — обсуждается</td></tr>
              <tr><th scope="row">Расстановка и сборка</th><td>${site.assemblyPercent}% от суммы аренды</td></tr>
              <tr><th scope="row">Самовывоз</th><td>Бесплатно, со склада по договорённости</td></tr>
            </tbody>
          </table>

          <h2>Оплата</h2>
          <p>Предоплата 30% — после подтверждения заявки, остаток — при получении. Принимаем перевод на карту, наличные и оплату по счёту для компаний.</p>

          <h2>Залог и сохранность</h2>
          <p>На крупные заказы может потребоваться залог — вернём сразу после проверки мебели. Обычные следы использования — это нормально, мыть и упаковывать ничего не нужно.</p>
        </div>
      </section>`;
  return {
    path: '/delivery/',
    html: layout(ctx, {
      path: '/delivery/', page: 'delivery',
      title: `Доставка и цены на аренду мебели в Москве | ${site.name}`,
      description: `Доставка мебели по Москве — ${rub(site.deliveryInsideMkad)}, за МКАД — ${site.deliveryPerKm} ₽/км. Минимальный заказ ${rub(site.minOrder)}. Оплата, залог и условия аренды.`,
      body,
    }),
  };
}

/* ---------- Контакты ---------- */
export function contacts(ctx) {
  const { site } = ctx;
  const body = `
      <section class="section section--tight">
        <div class="wrap prose">
          <h1 class="page-title">Контакты</h1>
          <p>Удобнее всего — написать в мессенджер: пришлите список или фото того, что нужно, и дату. Ответим с ценой и наличием.</p>
          <dl class="specs specs--big">
            <div><dt>Телефон</dt><dd><a href="tel:${site.phoneRaw}">${esc(site.phone)}</a></dd></div>
            <div><dt>WhatsApp</dt><dd><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">Написать в WhatsApp</a></dd></div>
            <div><dt>Telegram</dt><dd><a href="https://t.me/${site.telegram}" target="_blank" rel="noopener">@${esc(site.telegram)}</a></dd></div>
            <div><dt>Почта</dt><dd><a href="mailto:${site.email}">${esc(site.email)}</a></dd></div>
            <div><dt>Авито</dt><dd><a href="${site.avito}" target="_blank" rel="noopener">Профиль с отзывами</a></dd></div>
            <div><dt>Режим работы</dt><dd>${esc(site.hours)}</dd></div>
          </dl>
        </div>
      </section>`;
  return {
    path: '/contacts/',
    html: layout(ctx, {
      path: '/contacts/', page: 'contacts',
      title: `Контакты | ${site.name}`,
      description: `Телефон, WhatsApp и Telegram для заказа мебели в аренду в Москве. ${site.hours}.`,
      body,
    }),
  };
}

/* ---------- 404 ---------- */
export function notFound(ctx) {
  const body = `
      <section class="section">
        <div class="wrap empty-page">
          <h1 class="page-title">Такой страницы нет</h1>
          <p>Возможно, ссылка устарела. Начните с каталога — там всё, что сдаём в аренду.</p>
          <a class="btn" href="/catalog/">Открыть каталог</a>
        </div>
      </section>`;
  return {
    path: '/404.html',
    html: layout(ctx, {
      path: '/404.html', page: '404', noindex: true,
      title: `Страница не найдена | ${ctx.site.name}`,
      description: 'Страница не найдена.',
      body,
    }),
  };
}
