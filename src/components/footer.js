import { site } from '../config.js';
import { categories } from '../data/catalog.js';

export function renderFooter() {
  const el = document.getElementById('footer');
  el.className = 'footer';
  el.innerHTML = `
    <div class="wrap footer__grid">
      <div>
        <p class="footer__brand">${site.name}</p>
        <p>${site.tagline}. ${site.city} и область.</p>
      </div>
      <div>
        <p class="footer__head">Каталог</p>
        <ul>${categories.map((c) => `<li><a href="#/catalog/${c.id}">${c.name}</a></li>`).join('')}</ul>
      </div>
      <div>
        <p class="footer__head">Связаться</p>
        <ul>
          <li><a href="tel:${site.phoneRaw}">${site.phone}</a></li>
          <li><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="https://t.me/${site.telegram}" target="_blank" rel="noopener">Telegram</a></li>
          <li><a href="${site.avito}" target="_blank" rel="noopener">Мы на Авито</a></li>
          <li>${site.hours}</li>
        </ul>
      </div>
    </div>
    <div class="wrap footer__small">© ${new Date().getFullYear()} ${site.name}. Цены на сайте не являются публичной офертой.</div>`;
}
