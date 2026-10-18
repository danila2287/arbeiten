// Клиентский JS. Страницы уже приходят готовым HTML (это видят поисковики),
// а скрипт добавляет интерактив: заявку, кнопки «В заявку», поиск и наборы.
import { cart } from './lib/cart.js';
import { toast, bindSteppers } from './lib/ui.js';
import { productById } from './data/catalog.js';
import { rub } from './lib/cart.js';
import { cartPage } from './client/cart-page.js';

/* Счётчик в шапке */
function updateCount() {
  const el = document.querySelector('[data-cart-count]');
  if (!el) return;
  const n = cart.count();
  el.textContent = n;
  el.hidden = n === 0;
}

/* Кнопки «В заявку» на карточках */
function syncAddButtons() {
  document.querySelectorAll('[data-add]').forEach((btn) => {
    const q = cart.qty(btn.dataset.add);
    btn.classList.toggle('is-added', q > 0);
    btn.textContent = q ? `В заявке: ${q}` : 'В заявку';
  });
}

document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if (add) {
    cart.add(add.dataset.add, 1);
    toast(`${productById(add.dataset.add)?.name ?? 'Товар'} — в заявке`);
  }
});

/* Готовые наборы на главной */
function initKits() {
  const box = document.querySelector('[data-kits]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
  box.querySelectorAll('[data-kit]').forEach((btn) =>
    btn.addEventListener('click', () => {
      JSON.parse(btn.dataset.items).forEach(([id, q]) => cart.add(id, q));
      toast(`Набор «${btn.dataset.kitName}» добавлен в заявку`);
    }),
  );
}

/* Поиск и сортировка в каталоге */
function initCatalog() {
  const bar = document.querySelector('[data-toolbar]');
  const list = document.querySelector('[data-list]');
  if (!bar || !list) return;
  bar.hidden = false;
  const cards = [...list.querySelectorAll('[data-card]')];
  const empty = document.querySelector('[data-empty]');
  const search = bar.querySelector('[data-search]');
  const sort = bar.querySelector('[data-sort]');

  const apply = () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((c) => {
      const ok = !q || c.dataset.name.includes(q);
      c.hidden = !ok;
      if (ok) shown++;
    });
    const ordered = [...cards];
    if (sort.value === 'cheap') ordered.sort((a, b) => a.dataset.price - b.dataset.price);
    if (sort.value === 'expensive') ordered.sort((a, b) => b.dataset.price - a.dataset.price);
    ordered.forEach((c) => list.appendChild(c));
    empty.hidden = shown > 0;
  };
  search.addEventListener('input', apply);
  sort.addEventListener('change', apply);
}

/* Страница товара: количество и добавление */
function initBuy() {
  const box = document.querySelector('[data-buy]');
  if (!box) return;
  const id = box.dataset.buy;
  const price = Number(box.dataset.price);
  const input = box.querySelector('input');
  const btn = box.querySelector('[data-buy-btn]');
  const sum = document.querySelector('[data-buy-sum]');
  let qty = cart.qty(id) || 1;

  const draw = () => {
    input.value = qty;
    sum.textContent = `${rub(price * qty)} за ${qty} шт. в сутки`;
    btn.textContent = cart.qty(id) ? 'Обновить заявку' : 'Добавить в заявку';
  };
  bindSteppers(box, (_, v) => { qty = v; draw(); });
  btn.addEventListener('click', () => {
    cart.set(id, qty);
    draw();
    toast(qty ? `В заявке: ${productById(id).name}, ${qty} шт.` : `${productById(id).name} убран из заявки`);
  });
  draw();
}

updateCount();
syncAddButtons();
cart.subscribe(() => { updateCount(); syncAddButtons(); });

const page = document.body.dataset.page;
if (page === 'home') initKits();
if (page === 'catalog') initCatalog();
if (page === 'item') initBuy();
if (page === 'cart') cartPage(document.querySelector('[data-cart-root]'));
