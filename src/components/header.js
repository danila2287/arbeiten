import { site } from '../config.js';
import { cart } from '../lib/cart.js';

const nav = [
  ['/catalog', 'Каталог'],
  ['/delivery', 'Доставка и цены'],
  ['/contacts', 'Контакты'],
];

const el = document.getElementById('header');
let currentPath = '/';

function draw() {
  const n = cart.count();
  el.className = 'header';
  el.innerHTML = `
    <div class="wrap header__row">
      <a class="logo" href="#/" aria-label="${site.name}, на главную">
        <svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14"/><path d="M22 14v36M42 14v36M22 20h20M22 28h20M18 34h28"/></svg>
        <span>${site.name}</span>
      </a>
      <nav class="nav" aria-label="Основное меню">
        ${nav.map(([href, label]) => `<a href="#${href}" ${currentPath.startsWith(href) ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
      </nav>
      <a class="header__phone" href="tel:${site.phoneRaw}">${site.phone}</a>
      <a class="cartlink" href="#/cart" ${currentPath === '/cart' ? 'aria-current="page"' : ''}>
        Заявка${n ? `<b>${n}</b>` : ''}
      </a>
    </div>`;
}

export function renderHeader(path) {
  currentPath = path;
  draw();
}

cart.subscribe(draw);
