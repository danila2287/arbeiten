// Страница заявки: собирается в браузере из того, что лежит в localStorage.
import { site, link } from '../../data/config.js';
import { productImage } from '../shared/art.js';
import { cart, totals, dayFactor } from '../lib/cart.js';
import { esc, rub, pieces } from '../lib/format.js';
import { orderText, telegramLink, sendOrder } from '../lib/order.js';
import { stepperHtml, bindSteppers } from './stepper.js';
import { toast } from './toast.js';

const emptyHtml = () => `
  <div class="empty-page">
    <h1 class="page-title">Заявка пока пустая</h1>
    <p>Добавьте из каталога то, что нужно на мероприятие — можно по одной штуке. Или начните с готового набора на главной.</p>
    <div class="empty-page__actions">
      <a class="btn" href="${link('/catalog/')}">Открыть каталог</a>
      <a class="btn btn--ghost" href="${link('/')}">Готовые наборы</a>
    </div>
  </div>`;

const lineHtml = ({ product: p, qty }) => `
  <li class="line">
    <a class="line__img" href="${link(`/item/${p.id}/`)}" tabindex="-1" aria-hidden="true">${productImage(p, link)}</a>
    <div class="line__info">
      <a class="line__name" href="${link(`/item/${p.id}/`)}">${esc(p.name)}</a>
      <span class="line__meta">${rub(p.price)} / сутки · есть ${p.stock} шт.</span>
    </div>
    ${stepperHtml(p.id, qty, p.stock, `Количество: ${p.name}`)}
    <span class="line__sum">${rub(p.price * qty)}</span>
    <button class="line__remove" type="button" data-remove="${p.id}" aria-label="Убрать ${esc(p.name)}">Убрать</button>
  </li>`;

function orderHtml(lines, days, form) {
  const t = totals(lines, days);
  const today = new Date().toISOString().slice(0, 10);
  const dayOptions = Array.from({ length: 7 }, (_, i) => i + 1)
    .map((d) => `<option${d === days ? ' selected' : ''}>${d}</option>`)
    .join('');

  return `
    <h1 class="page-title">Заявка</h1>
    <div class="order">
      <div class="order__items">
        <ul class="order__lines">${lines.map(lineHtml).join('')}</ul>
        <button class="link" type="button" data-clear>Очистить заявку</button>
      </div>

      <form class="checkout" data-checkout novalidate>
        <div class="checkout__sum">
          <div class="checkout__row"><span>${pieces(cart.count())}, в сутки</span><span>${rub(t.perDay)}</span></div>
          <label class="checkout__row">
            <span>Дней аренды</span>
            <select class="checkout__days" data-days>${dayOptions}</select>
          </label>
          ${days > 1 ? `<p class="note">Каждые следующие сутки — 50% цены. Коэффициент: ×${dayFactor(days)}</p>` : ''}
          <div class="checkout__row checkout__row--total"><span>Аренда</span><strong>${rub(t.rent)}</strong></div>
          <p class="note">Доставка по Москве в пределах МКАД — ${rub(site.deliveryInsideMkad)}, за МКАД — ${site.deliveryPerKm} ₽/км. Точную сумму подтвердим.</p>
          ${t.belowMin ? `<p class="checkout__warn">Минимальный заказ — ${rub(site.minOrder)}. Добавьте ещё на ${rub(t.toMin)} или выберите самовывоз — обсудим.</p>` : ''}
        </div>

        <label class="field"><span>Имя</span><input name="name" autocomplete="name" required value="${esc(form.name)}"></label>
        <label class="field"><span>Телефон</span><input name="phone" type="tel" autocomplete="tel" required placeholder="+7" value="${esc(form.phone)}"></label>
        <label class="field"><span>Дата мероприятия</span><input name="date" type="date" min="${today}" value="${esc(form.date)}"></label>
        <fieldset class="radios">
          <legend>Получение</legend>
          <label><input type="radio" name="delivery" value="delivery"${form.delivery === 'delivery' ? ' checked' : ''}> Доставка</label>
          <label><input type="radio" name="delivery" value="pickup"${form.delivery === 'pickup' ? ' checked' : ''}> Самовывоз</label>
        </fieldset>
        <label class="field" data-address${form.delivery === 'pickup' ? ' hidden' : ''}><span>Адрес</span><input name="address" autocomplete="street-address" value="${esc(form.address)}"></label>
        <label class="field"><span>Комментарий</span><textarea name="comment" rows="3" placeholder="Этаж, лифт, время доставки, нужна ли расстановка">${esc(form.comment)}</textarea></label>

        <p class="checkout__error" data-error role="alert"></p>
        <button class="btn btn--wide" type="submit" data-via="telegram">Отправить в Telegram</button>
        <button class="link" type="submit" data-via="copy">Скопировать текст заявки</button>
      </form>
    </div>`;
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function useCartPage() {
  const root = document.querySelector('[data-cart-root]');
  if (!root) return;

  const form = { name: '', phone: '', date: '', delivery: 'delivery', address: '', comment: '' };

  async function submit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const err = root.querySelector('[data-error]');
    const noName = !form.name.trim();
    if (noName || form.phone.replace(/\D/g, '').length < 10) {
      err.textContent = noName
        ? 'Укажите имя — так мы поймём, к кому обращаться.'
        : 'Укажите телефон полностью, 10–11 цифр.';
      f.querySelector(noName ? '[name=name]' : '[name=phone]').focus();
      return;
    }
    err.textContent = '';

    const { items, days } = cart.get();
    const text = orderText(cart.lines(), days, form);
    sendOrder({ form, items, days }).catch(() => {});

    const via = e.submitter?.dataset.via;
    if (via === 'copy') {
      if (await copy(text)) toast('Текст заявки скопирован');
      else window.prompt('Скопируйте текст заявки:', text);
      return;
    }
    await copy(text);
    window.open(telegramLink(), '_blank', 'noopener');
    toast('Текст заявки скопирован — вставьте его в чат Telegram');
  }

  function render() {
    const lines = cart.lines();
    if (!lines.length) {
      root.innerHTML = emptyHtml();
      return;
    }

    root.innerHTML = orderHtml(lines, cart.get().days, form);

    bindSteppers(root.querySelector('.order__lines'), (id, v) => cart.set(id, v));
    root
      .querySelectorAll('[data-remove]')
      .forEach((b) => b.addEventListener('click', () => cart.remove(b.dataset.remove)));
    root.querySelector('[data-clear]').addEventListener('click', () => {
      if (window.confirm('Очистить заявку?')) cart.clear();
    });
    root
      .querySelector('[data-days]')
      .addEventListener('change', (e) => cart.setDays(Number(e.target.value)));

    const f = root.querySelector('[data-checkout]');
    f.addEventListener('input', (e) => {
      if (e.target.name) form[e.target.name] = e.target.value;
      if (e.target.name === 'delivery') {
        root.querySelector('[data-address]').hidden = e.target.value === 'pickup';
      }
    });
    f.addEventListener('submit', submit);
  }

  render();
  cart.subscribe(() => {
    // После пересборки возвращаем фокус в поле количества, где он был
    const focused = document.activeElement?.closest('[data-stepper]')?.dataset.stepper;
    render();
    if (focused) root.querySelector(`[data-stepper="${focused}"] input`)?.focus();
  });
}
