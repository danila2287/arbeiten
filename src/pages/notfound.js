export function notFound(main) {
  main.innerHTML = `
    <section class="section">
      <div class="wrap empty-page">
        <h1 class="page-title">Такой страницы нет</h1>
        <p>Возможно, ссылка устарела. Начните с каталога — там всё, что сдаём в аренду.</p>
        <a class="btn" href="#/catalog">Открыть каталог</a>
      </div>
    </section>`;
}
