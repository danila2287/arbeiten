// Готовые наборы на главной: вкладки и кнопка «Добавить набор в заявку».
import { cart } from '../lib/cart.js';
import { toast } from './toast.js';

export function useKits() {
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
    // Переключение стрелками — как положено у вкладок
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
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
