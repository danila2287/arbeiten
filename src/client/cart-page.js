import { site } from '../config.js';
import { productImage } from '../shared/art.js';
import { cart, totals, rub, pieces, dayFactor } from '../lib/cart.js';
import { stepper, bindSteppers, toast, esc } from '../lib/ui.js';
import { orderText, whatsappLink, telegramLink, sendOrder } from '../lib/order.js';

// Страница заявки целиком собирается в браузере из localStorage.
export function cartPage(root) {
  const form = { name: '', phone: '', date: '', delivery: 'delivery', address: '', comment: '' };

  function render() {
    const lines = cart.lines();
    const { days } = cart.get();

    if (!lines.length) {
      root.innerHTML = `
        <div class="empty-page">
          <h1 class="page-title">Заявка пока пустая</h1>
          <p>Добавьте из каталога то, что нужно на мероприятие — можно по одной штуке. Или начните с готового набора на главной.</p>
          <div class="hero__actions"><a class="btn" href="/catalog/">Открыть каталог</a><a class="btn btn--ghost" href="/">Готовые наборы</a></div>
        </div>`;
      return;
    }

    const t = totals(lines, days);
    const today = new Date().toISOString().slice(0, 10);

    root.innerHTML = `
      <h1 class="page-title">Заявка</h1>
      <div class="order">
        <div>
          <ul class="lines">
            ${lines.map(({ product: p, qty }) => `
              <li class="line">
                <a class="line__img" href="/item/${p.id}/" tabindex="-1" aria-hidden="true">${productImage(p)}</a>
                <div class="line__info">
                  <a href="/item/${p.id}/">${esc(p.name)}</a>
                  <span>${rub(p.price)} / сутки · есть ${p.stock} шт.</span>
                </div>
                ${stepper(p.id, qty, p.stock, `Количество: ${p.name}`)}
                <span class="line__sum">${rub(p.price * qty)}</span>
                <button class="line__remove" type="button" data-remove="${p.id}" aria-label="Убрать ${esc(p.name)}">Убрать</button>
              </li>`).join('')}
          </ul>
          <button class="link" type="button" id="clear">Очистить заявку</button>
        </div>

        <form class="checkout" id="checkout" novalidate>
          <div class="checkout__sum">
            <div class="row"><span>${pieces(cart.count())}, в сутки</span><span>${rub(t.perDay)}</span></div>
            <label class="row row--days">
              <span>Дней аренды</span>
              <select id="days">${Array.from({ length: 7 }, (_, i) => i + 1).map((d) => `<option ${d === days ? 'selected' : ''}>${d}</option>`).join('')}</select>
            </label>
            ${days > 1 ? `<p class="note">Каждые следующие сутки — 50% цены. Коэффициент: ×${dayFactor(days)}</p>` : ''}
            <div class="row row--total"><span>Аренда</span><strong>${rub(t.rent)}</strong></div>
            <p class="note">Доставка по Москве в пределах МКАД — ${rub(site.deliveryInsideMkad)}, за МКАД — ${site.deliveryPerKm} ₽/км. Точную сумму подтвердим.</p>
            ${t.belowMin ? `<p class="warn">Минимальный заказ — ${rub(site.minOrder)}. Добавьте ещё на ${rub(t.toMin)} или выберите самовывоз — обсудим.</p>` : ''}
          </div>

          <label class="field"><span>Имя</span><input name="name" autocomplete="name" required value="${esc(form.name)}"></label>
          <label class="field"><span>Телефон</span><input name="phone" type="tel" autocomplete="tel" required placeholder="+7" value="${esc(form.phone)}"></label>
          <label class="field"><span>Дата мероприятия</span><input name="date" type="date" min="${today}" value="${esc(form.date)}"></label>
          <fieldset class="radios">
            <legend>Получение</legend>
            <label><input type="radio" name="delivery" value="delivery" ${form.delivery === 'delivery' ? 'checked' : ''}> Доставка</label>
            <label><input type="radio" name="delivery" value="pickup" ${form.delivery === 'pickup' ? 'checked' : ''}> Самовывоз</label>
          </fieldset>
          <label class="field" ${form.delivery === 'pickup' ? 'hidden' : ''} id="addr"><span>Адрес</span><input name="address" autocomplete="street-address" value="${esc(form.address)}"></label>
          <label class="field"><span>Комментарий</span><textarea name="comment" rows="3" placeholder="Этаж, лифт, время доставки, нужна ли расстановка">${esc(form.comment)}</textarea></label>

          <p class="error" id="err" role="alert"></p>
          <button class="btn btn--wide" type="submit" data-via="whatsapp">Отправить в WhatsApp</button>
          <button class="btn btn--ghost btn--wide" type="submit" data-via="telegram">Отправить в Telegram</button>
          <button class="link" type="submit" data-via="copy">Скопировать текст заявки</button>
        </form>
      </div>`;

    bindSteppers(root.querySelector('.lines'), (id, v) => cart.set(id, v));
    root.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => cart.remove(b.dataset.remove)));
    root.querySelector('#clear').addEventListener('click', () => { if (confirm('Очистить заявку?')) cart.clear(); });
    root.querySelector('#days').addEventListener('change', (e) => cart.setDays(Number(e.target.value)));

    const f = root.querySelector('#checkout');
    f.addEventListener('input', (e) => {
      if (e.target.name) form[e.target.name] = e.target.value;
      if (e.target.name === 'delivery') root.querySelector('#addr').hidden = e.target.value === 'pickup';
    });

    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = root.querySelector('#err');
      const digits = form.phone.replace(/\D/g, '');
      if (!form.name.trim() || digits.length < 10) {
        err.textContent = !form.name.trim() ? 'Укажите имя — так мы поймём, к кому обращаться.' : 'Укажите телефон полностью, 10–11 цифр.';
        f.querySelector(!form.name.trim() ? '[name=name]' : '[name=phone]').focus();
        return;
      }
      err.textContent = '';
      const text = orderText(cart.lines(), cart.get().days, form);
      sendOrder({ form, items: cart.get().items, days: cart.get().days }).catch(() => {});

      const via = e.submitter?.dataset.via;
      if (via === 'copy') {
        try { await navigator.clipboard.writeText(text); toast('Текст заявки скопирован'); }
        catch { prompt('Скопируйте текст заявки:', text); }
        return;
      }
      if (via === 'telegram') {
        // Telegram не умеет подставлять текст в личный чат — копируем заявку заранее.
        try { await navigator.clipboard.writeText(text); } catch {}
        window.open(telegramLink(), '_blank', 'noopener');
        toast('Текст заявки скопирован — вставьте его в чат Telegram');
        return;
      }
      window.open(whatsappLink(text), '_blank', 'noopener');
      toast('Заявка открыта в WhatsApp — нажмите «Отправить»');
    });
  }

  render();
  cart.subscribe(() => {
    const focused = document.activeElement?.closest('[data-stepper]')?.dataset.stepper;
    render();
    if (focused) root.querySelector(`[data-stepper="${focused}"] input`)?.focus();
  });
}
