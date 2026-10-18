import { site } from '../../data/config.js';
import { totals } from './cart.js';
import { rub } from './format.js';

// Текст заявки — уходит в WhatsApp / Telegram или копируется.
export function orderText(lines, days, form) {
  const t = totals(lines, days);
  const rows = lines.map((l) => `• ${l.product.name} — ${l.qty} шт. × ${rub(l.product.price)}`);
  const delivery =
    form.delivery === 'pickup' ? 'самовывоз' : `доставка — ${form.address || 'адрес уточним'}`;

  return [
    `Заявка с сайта ${site.name}`,
    '',
    ...rows,
    '',
    `Дней аренды: ${days}`,
    `Аренда: ${rub(t.rent)} (без доставки)`,
    '',
    `Имя: ${form.name}`,
    `Телефон: ${form.phone}`,
    `Дата мероприятия: ${form.date || 'не указана'}`,
    `Получение: ${delivery}`,
    form.comment ? `Комментарий: ${form.comment}` : '',
  ]
    .filter((s, i, a) => !(s === '' && a[i - 1] === ''))
    .join('\n')
    .trim();
}

export const whatsappLink = (text) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

// Telegram не умеет подставлять текст в личный чат, поэтому только ссылка на чат.
export const telegramLink = () => `https://t.me/${site.telegram}`;

// Задел на будущее: отправка заявки на ваш сервер или в Telegram-бота.
// Токен бота нельзя хранить во фронтенде — нужен небольшой серверный обработчик
// (например, функция на Vercel/Netlify или Яндекс Cloud Functions), который
// принимает JSON и пересылает его в бота. Пока ORDER_ENDPOINT пустой, функция
// ничего не отправляет и сайт использует WhatsApp/Telegram-ссылки.
export const ORDER_ENDPOINT = '';

export async function sendOrder(payload) {
  if (!ORDER_ENDPOINT) return { ok: false, skipped: true };
  const res = await fetch(ORDER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok };
}
