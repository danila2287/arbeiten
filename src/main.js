import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { home } from './pages/home.js';
import { catalogPage } from './pages/catalog.js';
import { productPage } from './pages/product.js';
import { cartPage } from './pages/cart.js';
import { deliveryPage } from './pages/delivery.js';
import { contactsPage } from './pages/contacts.js';
import { notFound } from './pages/notfound.js';

// Хеш-роутинг: сайт работает на любом статическом хостинге
// (GitHub Pages, Netlify, обычный хостинг) без настройки сервера.
const routes = [
  [/^\/$/, home],
  [/^\/catalog\/?$/, catalogPage],
  [/^\/catalog\/([\w-]+)$/, catalogPage],
  [/^\/item\/([\w-]+)$/, productPage],
  [/^\/cart$/, cartPage],
  [/^\/delivery$/, deliveryPage],
  [/^\/contacts$/, contactsPage],
];

const main = document.getElementById('main');
let cleanup = null;

function currentPath() {
  const raw = location.hash.replace(/^#/, '') || '/';
  return raw.split('?')[0];
}

function route() {
  const path = currentPath();
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;

  let page = notFound, params = [];
  for (const [re, fn] of routes) {
    const m = path.match(re);
    if (m) { page = fn; params = m.slice(1); break; }
  }

  main.innerHTML = '';
  cleanup = page(main, ...params);
  renderHeader(path);
  window.scrollTo(0, 0);
}

renderFooter();
window.addEventListener('hashchange', route);
route();
