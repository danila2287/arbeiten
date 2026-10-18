import { site } from '../config.js';
import { categories, products, kits, productById } from '../data/catalog.js';
import { art } from '../components/art.js';
import { productCard, bindAddButtons } from '../components/productCard.js';
import { cart, rub, pieces } from '../lib/cart.js';
import { toast } from '../lib/ui.js';

const catArt = {
  chairs: ['chiavari', 'paper'], tables: ['tableRound', 'paper'], soft: ['sofa', 'sage'], bar: ['barStool', 'paper'],
  textile: ['tablecloth', 'paper'], decor: ['lights', 'sun'], tents: ['tent', 'sage'], equipment: ['speaker', 'ink'],
};

const popular = ['chiavari-white', 'round-150', 'cocktail', 'tent-3x3', 'lights', 'sofa-white', 'folding-white', 'arch-round'];

function kitSlip(kit) {
  const lines = kit.items.map(([id, q]) => ({ p: productById(id), q }));
  const total = lines.reduce((s, l) => s + l.p.price * l.q, 0);
  const count = lines.reduce((s, l) => s + l.q, 0);
  return `
    <ul class="slip__lines">
      ${lines.map((l) => `<li><span>${l.p.name}</span><span class="slip__q">${l.q} шт.</span><span>${rub(l.p.price * l.q)}</span></li>`).join('')}
    </ul>
    <div class="slip__total"><span>${pieces(count)} на сутки</span><strong>${rub(total)}</strong></div>
    <button class="btn" type="button" data-kit="${kit.id}">Добавить набор в заявку</button>
    <p class="slip__hint">Состав можно поменять в заявке — убрать лишнее или добавить.</p>`;
}

export function home(main) {
  main.innerHTML = `
    <section class="hero">
      <div class="wrap hero__grid">
        <div class="hero__text">
          <h1>Мебель на праздник — от одного стула</h1>
          <p class="lead">Сдаём в аренду стулья, столы, шатры, текстиль и декор для небольших мероприятий в Москве: дни рождения, домашние свадьбы, ужины, фотосессии, вечеринки во дворе. Привезём, расставим и заберём.</p>
          <div class="hero__actions">
            <a class="btn" href="#/catalog">Открыть каталог</a>
            <a class="btn btn--ghost" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">Спросить в WhatsApp</a>
          </div>
          <dl class="facts">
            <div><dt>Заказ</dt><dd>от ${rub(site.minOrder)}</dd></div>
            <div><dt>Доставка по Москве</dt><dd>${rub(site.deliveryInsideMkad)}</dd></div>
            <div><dt>Ответ на заявку</dt><dd>в течение часа</dd></div>
          </dl>
        </div>

        <aside class="slip" aria-label="Готовые наборы">
          <div class="slip__head">
            <p class="slip__title">Готовые наборы</p>
            <div class="slip__tabs" role="tablist">
              ${kits.map((k, i) => `<button role="tab" type="button" aria-selected="${i === 0}" data-tab="${k.id}">${k.name}</button>`).join('')}
            </div>
          </div>
          <div class="slip__body" role="tabpanel">${kitSlip(kits[0])}</div>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2>Что можно взять</h2>
        <ul class="cats">
          ${categories.map((c) => `
            <li><a class="cat" href="#/catalog/${c.id}">
              ${art(catArt[c.id][0], catArt[c.id][1], '')}
              <span class="cat__name">${c.name}</span>
              <span class="cat__note">${c.note}</span>
            </a></li>`).join('')}
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
          <a class="link" href="#/catalog">Весь каталог</a>
        </div>
        <div class="grid" id="popular">${popular.map((id) => productCard(productById(id))).join('')}</div>
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

  const slip = main.querySelector('.slip');
  slip.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      slip.querySelectorAll('[data-tab]').forEach((t) => t.setAttribute('aria-selected', t === tab));
      slip.querySelector('.slip__body').innerHTML = kitSlip(kits.find((k) => k.id === tab.dataset.tab));
      return;
    }
    const add = e.target.closest('[data-kit]');
    if (add) {
      const kit = kits.find((k) => k.id === add.dataset.kit);
      kit.items.forEach(([id, q]) => cart.add(id, q));
      toast(`Набор «${kit.name}» добавлен в заявку`);
    }
  });

  bindAddButtons(main.querySelector('#popular'), (id) => toast(`${productById(id).name} — в заявке`));
}
