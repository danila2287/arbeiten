// Все контакты и условия бизнеса — в одном месте. Поменяйте на свои.
export const site = {
  name: 'Немного Мебели',
  tagline: 'Аренда мебели для небольших мероприятий',

  // Адрес сайта без слеша в конце — от него строятся canonical-ссылки и sitemap.xml.
  // С GitHub Pages без своего домена: 'https://danila2287.github.io/arbeiten'
  url: 'https://example.ru',

  // Папка, в которой сайт открывается. Со своим доменом — '/'.
  // С GitHub Pages без своего домена — '/arbeiten/' (название репозитория).
  base: '/',

  metrikaId: '', // номер счётчика Яндекс.Метрики, например '98765432'

  city: 'Москва',
  phone: '+7 (902) 882-65-20',
  phoneRaw: '+79028826520',
  telegram: 'Danykik', // ник без @
  email: 'kikeevd25@mail.ru',
  avito: 'https://www.avito.ru/brands/5465a5de2d430b217d9ea2c32fc16b6f?src=sharing', // ссылка на ваш профиль Авито
  hours: 'Ежедневно, 9:00–21:00',

  minOrder: 3000, // минимальная сумма заказа, ₽
  deliveryInsideMkad: 3500, // доставка в пределах МКАД, ₽
  deliveryPerKm: 50, // за МКАД, ₽ за км
  assemblyPercent: 10, // монтаж/демонтаж, % от суммы аренды
};

// Ссылка внутри сайта с учётом base: link('/catalog/') → '/arbeiten/catalog/'
export const link = (path) => site.base.replace(/\/$/, '') + path;
