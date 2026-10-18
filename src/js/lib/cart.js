// Заявка (корзина): хранится в localStorage браузера.
import { productById } from '../../data/catalog.js';
import { site } from '../../data/config.js';

const KEY = 'nemnogo-mebeli-cart-v1';
const listeners = new Set();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && typeof raw === 'object') return { items: raw.items || {}, days: raw.days || 1 };
  } catch {
    // нет доступа к localStorage или испорченные данные — начинаем с пустой заявки
  }
  return { items: {}, days: 1 };
}

let state = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // приватный режим: заявка проживёт до закрытия вкладки
  }
  listeners.forEach((fn) => fn(state));
}

export const cart = {
  get: () => state,
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  qty: (id) => state.items[id] || 0,

  set(id, qty) {
    const p = productById(id);
    if (!p) return;
    const n = Math.max(0, Math.min(p.stock, Math.round(qty)));
    if (n === 0) delete state.items[id];
    else state.items[id] = n;
    save();
  },
  add(id, qty = 1) {
    cart.set(id, cart.qty(id) + qty);
  },
  remove(id) {
    cart.set(id, 0);
  },
  clear() {
    state = { items: {}, days: state.days };
    save();
  },

  setDays(d) {
    state.days = Math.max(1, Math.min(14, Math.round(d) || 1));
    save();
  },

  lines() {
    return Object.entries(state.items)
      .map(([id, qty]) => ({ product: productById(id), qty }))
      .filter((l) => l.product);
  },
  count: () => Object.values(state.items).reduce((a, b) => a + b, 0),
};

// Первые сутки — полная цена, каждые следующие — 50%.
export function dayFactor(days) {
  return 1 + (days - 1) * 0.5;
}

export function totals(lines = cart.lines(), days = state.days) {
  const perDay = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const rent = Math.round(perDay * dayFactor(days));
  const belowMin = rent > 0 && rent < site.minOrder;
  return { perDay, rent, belowMin, toMin: Math.max(0, site.minOrder - rent) };
}
