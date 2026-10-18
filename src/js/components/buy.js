// Страница товара: выбор количества и добавление в заявку.
import { cart } from '../lib/cart.js';
import { rub } from '../lib/format.js';
import { productById } from '../../data/catalog.js';
import { bindSteppers } from './stepper.js';
import { toast } from './toast.js';

export function useBuy() {
  const box = document.querySelector('[data-buy]');
  if (!box) return;

  const id = box.dataset.buy;
  const product = productById(id);
  const input = box.querySelector('input');
  const btn = box.querySelector('[data-buy-btn]');
  const sum = document.querySelector('[data-buy-sum]');
  let qty = cart.qty(id) || 1;

  const draw = () => {
    input.value = qty;
    sum.textContent = `${rub(product.price * qty)} за ${qty} шт. в сутки`;
    btn.textContent = cart.qty(id) ? 'Обновить заявку' : 'Добавить в заявку';
  };

  bindSteppers(box, (_, v) => {
    qty = v;
    draw();
  });

  btn.addEventListener('click', () => {
    cart.set(id, qty);
    draw();
    toast(qty ? `В заявке: ${product.name}, ${qty} шт.` : `${product.name} убран из заявки`);
  });

  draw();
}
