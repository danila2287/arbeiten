import { productImage } from './art.js';
import { rub } from '../lib/cart.js';
import { cart } from '../lib/cart.js';

export function productCard(p) {
  const inCart = cart.qty(p.id);
  return `
    <article class="pcard">
      <a class="pcard__img" href="#/item/${p.id}" tabindex="-1" aria-hidden="true">${productImage(p)}</a>
      <h3 class="pcard__name"><a href="#/item/${p.id}">${p.name}</a></h3>
      <p class="pcard__meta">${rub(p.price)} <span>/ сутки</span></p>
      <p class="pcard__stock">В наличии ${p.stock} шт.</p>
      <button class="btn btn--small ${inCart ? 'is-added' : ''}" data-add="${p.id}" type="button">
        ${inCart ? `В заявке: ${inCart}` : 'В заявку'}
      </button>
    </article>`;
}

// Делегирование кликов «В заявку» внутри контейнера.
export function bindAddButtons(root, onAdd) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    cart.add(btn.dataset.add, 1);
    const q = cart.qty(btn.dataset.add);
    btn.classList.add('is-added');
    btn.textContent = `В заявке: ${q}`;
    onAdd?.(btn.dataset.add);
  });
}
