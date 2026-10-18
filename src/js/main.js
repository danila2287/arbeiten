// Точка входа. Страницы приходят готовым HTML (его видят поисковики),
// а скрипты добавляют интерактив. Каждый модуль сам проверяет,
// есть ли на странице его разметка, поэтому подключать их можно везде.
import { useCartCount } from './components/cart-count.js';
import { useKits } from './components/kits.js';
import { useCatalogFilter } from './components/catalog-filter.js';
import { useBuy } from './components/buy.js';
import { useGallery } from './components/gallery.js';
import { useCartPage } from './components/cart-page.js';

useCartCount();
useKits();
useCatalogFilter();
useBuy();
useGallery();
useCartPage();
