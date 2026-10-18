import { site } from '../config.js';

export function contactsPage(main) {
  main.innerHTML = `
    <section class="section section--tight">
      <div class="wrap prose">
        <h1 class="page-title">Контакты</h1>
        <p>Удобнее всего — написать в мессенджер: пришлите список или фото того, что нужно, и дату. Ответим с ценой и наличием.</p>
        <dl class="specs specs--big">
          <div><dt>Телефон</dt><dd><a href="tel:${site.phoneRaw}">${site.phone}</a></dd></div>
          <div><dt>WhatsApp</dt><dd><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">Написать в WhatsApp</a></dd></div>
          <div><dt>Telegram</dt><dd><a href="https://t.me/${site.telegram}" target="_blank" rel="noopener">@${site.telegram}</a></dd></div>
          <div><dt>Почта</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
          <div><dt>Авито</dt><dd><a href="${site.avito}" target="_blank" rel="noopener">Профиль с отзывами</a></dd></div>
          <div><dt>Режим работы</dt><dd>${site.hours}</dd></div>
        </dl>
      </div>
    </section>`;
}
