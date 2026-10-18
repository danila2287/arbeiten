# arbeiten — сайт аренды мебели для небольших мероприятий

Многостраничный статический сайт на Vite + SCSS. Структура как в проекте
[coca](https://github.com/danila2287/coca): `src/` — корень, HTML разбит на компоненты,
стили и скрипты — по блокам. Отличие одно: страницы каталога и товаров собираются
из данных (`src/data/catalog.js`) генератором, а не пишутся руками.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # готовый сайт в dist/
npm run preview    # посмотреть собранную версию
```

| Команда | Что делает |
|---|---|
| `npm run lint` | проверяет JS (ESLint) и SCSS (Stylelint) |
| `npm run lint:fix` | исправляет то, что можно исправить автоматически (в том числе порядок CSS-свойств) |
| `npm run format` | форматирует код Prettier |
| `npm run pages` | пересобирает HTML-страницы вручную (обычно не нужно — это делает `dev`/`build`) |

## Структура

```
src/
  data/
    config.js          контакты, адрес сайта, доставка, Метрика
    catalog.js         категории, товары, цены, готовые наборы
  html/                HTML-компоненты (как в coca)
    base/head.html
    components/
      header.html, footer.html, metrika.html, not-found.html
      home/            шаги аренды, блок Авито
      delivery/        текст страницы «Доставка и цены»
      contacts/        текст страницы «Контакты»
  templates/           сборка страниц из компонентов и каталога
    pages.js           главная, каталог, товар, заявка…
    parts.js           каркас страницы, карточка товара, хлебные крошки
    render.js          подстановка {{переменных}} в HTML-компоненты
  scss/
    main.scss
    base/              переменные, сброс, типографика
    mixins/            брейкпоинты: laptop, tablet, mobile
    globals/           контейнер, кнопки, поля, секции
    components/        блоки: header, footer, home/*, catalog/*, cart/*…
  js/
    main.js
    components/        заявка, наборы, фильтр каталога, счётчик…
    lib/               логика заявки, текст для мессенджеров, форматирование
    shared/art.js      иллюстрации товаров
  assets/              статика (favicon, images/) — копируется в сборку как есть
scripts/generate.mjs   генератор страниц
```

### Сгенерированные файлы

`src/index.html`, `src/catalog/`, `src/item/`, `src/cart/`, `src/delivery/`,
`src/contacts/`, `src/404.html`, `src/assets/sitemap.xml`, `src/assets/robots.txt`
создаёт генератор. **Не правьте их руками** — они перезапишутся. Они в `.gitignore`.

### HTML-компоненты

В файлах из `src/html` можно использовать:

| Запись | Что подставится |
|---|---|
| `{{phone}}` | значение из `config.js` (список — `commonVars` в `src/templates/parts.js`) |
| `{{link /catalog/}}` | ссылка внутри сайта с учётом `base` |
| `{{current /catalog/}}` | `aria-current="page"`, если открыт этот раздел |
| `{{{footerCategories}}}` | готовый HTML без экранирования |

Опечатка в имени переменной не пройдёт тихо: генератор остановится с понятной ошибкой.

## Где что менять

| Что | Где |
|---|---|
| Название, телефон, мессенджеры, Авито, доставка | `src/data/config.js` |
| Товары, цены, остатки, наборы, тексты категорий | `src/data/catalog.js` |
| Фото товара | файл в `src/assets/images/`, у товара — `image: '/images/файл.jpg'` (при сборке сожмётся) |
| Текст доставки, контактов, шагов аренды | `src/html/components/…` |
| Цвета, шрифты, отступы | `src/scss/base/_vars.scss` |
| Брейкпоинты | `src/scss/mixins/_media.scss` |

## Публикация

### GitHub Pages (автоматически)

В репозитории есть `.github/workflows/deploy.yml`: при каждом `git push` в `main`
сайт собирается и публикуется.

1. Один раз: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Без своего домена сайт откроется по адресу `https://danila2287.github.io/arbeiten/`.
   Для этого в `src/data/config.js` поставьте:
   ```js
   url: 'https://danila2287.github.io/arbeiten',
   base: '/arbeiten/',
   ```
3. Со своим доменом: `base: '/'`, `url: 'https://ваш-домен.ru'`, положите файл
   `src/assets/CNAME` с именем домена и настройте домен в Settings → Pages.

Закоммитьте `package-lock.json` — тогда сборка на GitHub ставит ровно те же версии пакетов, что у вас.

### Перед запуском рекламы и продвижения

- Укажите реальный `url` в `config.js` — от него строятся canonical-ссылки и `sitemap.xml`.
- Заведите счётчик Яндекс.Метрики и впишите номер в `metrikaId`.
- Добавьте сайт в Яндекс.Вебмастер и отправьте туда `sitemap.xml`.
