// Счётчик предметов в шапке, кнопка «В заявку» и степпер на карточках товара.
import { cart } from '../lib/cart.js';
import { productById } from '../../data/catalog.js';
import { toast } from './toast.js';
import { bindSteppers } from './stepper.js';

function updateCount() {
  const el = document.querySelector('[data-cart-count]');
  if (!el) return;
  const n = cart.count();
  el.textContent = n;
  el.hidden = n === 0;
}

function syncAddButtons() {
  document.querySelectorAll('[data-add-box]').forEach((box) => {
    const q = cart.qty(box.dataset.addBox);
    const btn = box.querySelector('[data-add]');
    box.classList.toggle('is-added', q > 0);
    btn.classList.toggle('is-added', q > 0);
    btn.textContent = q ? `В заявке: ${q}` : 'В заявку';
    const input = box.querySelector('.stepper__input');
    if (input && document.activeElement !== input) input.value = q;
  });
}

export function useCartCount() {
  // Первое нажатие «В заявку» — дальше на десктопе количество меняют
  // стрелочки степпера, на телефоне (их нет) — повторное нажатие.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    cart.add(btn.dataset.add, 1);
    toast(`${productById(btn.dataset.add)?.name ?? 'Товар'} — в заявке`);
  });

  document
    .querySelectorAll('[data-add-box]')
    .forEach((box) => bindSteppers(box, (id, v) => cart.set(id, v)));

  updateCount();
  syncAddButtons();
  cart.subscribe(() => {
    updateCount();
    syncAddButtons();
  });
}
