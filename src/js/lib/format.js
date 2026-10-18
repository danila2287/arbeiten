// Форматирование — общее для генератора страниц и браузера.

export const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

// 2 500 ₽ — с обычным пробелом, чтобы одинаково выглядело в Node и в браузере.
export const rub = (n) =>
  new Intl.NumberFormat('ru-RU').format(n).replace(/[  ]/g, ' ') + ' ₽';

export function pieces(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} предмет`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} предмета`;
  return `${n} предметов`;
}
