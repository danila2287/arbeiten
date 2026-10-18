import { categories, products, categoryById, productById } from '../data/catalog.js';
import { productCard, bindAddButtons } from '../components/productCard.js';
import { toast, esc } from '../lib/ui.js';

export function catalogPage(main, catId) {
  const cat = catId ? categoryById(catId) : null;
  let query = '';
  let sort = 'default';

  main.innerHTML = `
    <section class="section section--tight">
      <div class="wrap">
        <nav class="crumbs" aria-label="Навигация"><a href="#/">Главная</a><span>/</span>${cat ? `<a href="#/catalog">Каталог</a><span>/</span><span>${cat.name}</span>` : '<span>Каталог</span>'}</nav>
        <h1 class="page-title">${cat ? cat.name : 'Каталог'}</h1>
        <div class="catalog">
          <aside class="filters">
            <ul class="filters__cats">
              <li><a href="#/catalog" ${!cat ? 'aria-current="page"' : ''}>Все товары <span>${products.length}</span></a></li>
              ${categories.map((c) => `<li><a href="#/catalog/${c.id}" ${cat?.id === c.id ? 'aria-current="page"' : ''}>${c.name} <span>${products.filter((p) => p.cat === c.id).length}</span></a></li>`).join('')}
            </ul>
          </aside>
          <div>
            <div class="toolbar">
              <label class="field field--search"><span class="sr">Поиск</span>
                <input type="search" placeholder="Найти: стул, скатерть, шатёр…" id="q"></label>
              <label class="field"><span class="sr">Сортировка</span>
                <select id="sort">
                  <option value="default">По порядку</option>
                  <option value="cheap">Сначала дешевле</option>
                  <option value="expensive">Сначала дороже</option>
                </select></label>
            </div>
            <div class="grid" id="list"></div>
          </div>
        </div>
      </div>
    </section>`;

  const list = main.querySelector('#list');

  function draw() {
    let items = products.filter((p) => !cat || p.cat === cat.id);
    if (query) {
      const q = query.toLowerCase();
      items = items.filter((p) => (p.name + ' ' + p.desc).toLowerCase().includes(q));
    }
    if (sort === 'cheap') items = [...items].sort((a, b) => a.price - b.price);
    if (sort === 'expensive') items = [...items].sort((a, b) => b.price - a.price);

    list.innerHTML = items.length
      ? items.map(productCard).join('')
      : `<div class="empty"><p>По запросу «${esc(query)}» ничего не нашлось. Попробуйте другое слово или напишите нам — подберём похожее.</p></div>`;
  }

  main.querySelector('#q').addEventListener('input', (e) => { query = e.target.value.trim(); draw(); });
  main.querySelector('#sort').addEventListener('change', (e) => { sort = e.target.value; draw(); });
  bindAddButtons(list, (id) => toast(`${productById(id).name} — в заявке`));
  draw();
}
