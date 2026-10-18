// Счётчик предметов в шапке и состояние кнопок «В заявку».
import { cart } from '../lib/cart.js';
import { productById } from '../../data/catalog.js';
import { toast } from './toast.js';

function updateCount() {
  const el = document.querySelector('[data-cart-count]');
  if (!el) return;
  const n = cart.count();
  el.textContent = n;
  el.hidden = n === 0;
}

function syncAddButtons() {
  document.querySelectorAll('[data-add]').forEach((btn) => {
    const q = cart.qty(btn.dataset.add);
    btn.classList.toggle('is-added', q > 0);
    btn.textContent = q ? `В заявке: ${q}` : 'В заявку';
  });
}

export function useCartCount() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    cart.add(btn.dataset.add, 1);
    toast(`${productById(btn.dataset.add)?.name ?? 'Товар'} — в заявке`);
  });

  updateCount();
  syncAddButtons();
  cart.subscribe(() => {
    updateCount();
    syncAddButtons();
  });
}
