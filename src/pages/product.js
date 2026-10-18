import { productById, categoryById, products } from '../data/catalog.js';
import { productImage } from '../components/art.js';
import { productCard, bindAddButtons } from '../components/productCard.js';
import { cart, rub } from '../lib/cart.js';
import { stepper, bindSteppers, toast } from '../lib/ui.js';
import { notFound } from './notfound.js';

export function productPage(main, id) {
  const p = productById(id);
  if (!p) return notFound(main);
  const cat = categoryById(p.cat);
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  let qty = cart.qty(p.id) || 1;

  document.title = `${p.name} — аренда в Москве`;

  main.innerHTML = `
    <section class="section section--tight">
      <div class="wrap">
        <nav class="crumbs" aria-label="Навигация"><a href="#/">Главная</a><span>/</span><a href="#/catalog/${cat.id}">${cat.name}</a><span>/</span><span>${p.name}</span></nav>
        <div class="product">
          <div class="product__img">${productImage(p)}</div>
          <div class="product__info">
            <h1 class="page-title">${p.name}</h1>
            <p class="product__price">${rub(p.price)} <span>за сутки</span></p>
            <p>${p.desc}</p>
            <dl class="specs">
              ${Object.entries(p.specs).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
              <div><dt>В наличии</dt><dd>${p.stock} шт.</dd></div>
            </dl>
            <div class="buy">
              ${stepper(p.id, qty, p.stock)}
              <button class="btn" type="button" id="add">${cart.qty(p.id) ? 'Обновить заявку' : 'Добавить в заявку'}</button>
            </div>
            <p class="buy__sum" id="sum">${rub(p.price * qty)} за ${qty} шт. в сутки</p>
          </div>
        </div>
      </div>
    </section>
    ${related.length ? `
    <section class="section">
      <div class="wrap">
        <h2>Ещё в разделе «${cat.name}»</h2>
        <div class="grid" id="related">${related.map(productCard).join('')}</div>
      </div>
    </section>` : ''}`;

  const sum = main.querySelector('#sum');
  bindSteppers(main.querySelector('.buy'), (_, v) => {
    qty = v;
    sum.textContent = `${rub(p.price * qty)} за ${qty} шт. в сутки`;
  });

  main.querySelector('#add').addEventListener('click', (e) => {
    cart.set(p.id, qty);
    e.target.textContent = qty ? 'Обновить заявку' : 'Добавить в заявку';
    toast(qty ? `В заявке: ${p.name}, ${qty} шт.` : `${p.name} убран из заявки`);
  });

  const rel = main.querySelector('#related');
  if (rel) bindAddButtons(rel, (rid) => toast(`${productById(rid).name} — в заявке`));

  return () => { document.title = 'Сборка — аренда мебели для небольших мероприятий в Москве'; };
}
