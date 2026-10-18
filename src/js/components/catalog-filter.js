// Поиск и сортировка карточек в каталоге. Карточки уже есть в HTML —
// скрипт только прячет и переставляет их.
export function useCatalogFilter() {
  const bar = document.querySelector('[data-toolbar]');
  const list = document.querySelector('[data-list]');
  if (!bar || !list) return;

  bar.hidden = false;
  const cards = [...list.querySelectorAll('[data-card]')];
  const empty = document.querySelector('[data-empty]');
  const search = bar.querySelector('[data-search]');
  const sort = bar.querySelector('[data-sort]');

  const apply = () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((c) => {
      const ok = !q || c.dataset.name.includes(q);
      c.hidden = !ok;
      if (ok) shown++;
    });

    const ordered = [...cards];
    if (sort.value === 'cheap') ordered.sort((a, b) => a.dataset.price - b.dataset.price);
    if (sort.value === 'expensive') ordered.sort((a, b) => b.dataset.price - a.dataset.price);
    ordered.forEach((c) => list.appendChild(c));

    empty.hidden = shown > 0;
  };

  search.addEventListener('input', apply);
  sort.addEventListener('change', apply);
}
