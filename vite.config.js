import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';
import { execFile } from 'node:child_process';
import { generate } from './scripts/generate.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const toPosix = (p) => p.split(sep).join('/');

// Пересобирает HTML-страницы, когда вы меняете каталог, контакты,
// HTML-компоненты или шаблоны, и перезагружает страницу в браузере.
function catalogPages() {
  const watched = ['src/data/', 'src/html/', 'src/templates/', 'src/js/shared/', 'src/js/lib/format.js'];
  return {
    name: 'catalog-pages',
    configureServer(server) {
      server.watcher.on('change', (file) => {
        const rel = toPosix(relative(root, file));
        if (!watched.some((w) => rel.startsWith(w))) return;
        // Отдельный процесс — чтобы Node не держал в памяти старые версии модулей
        execFile(process.execPath, ['scripts/generate.mjs'], { cwd: root }, (err, stdout, stderr) => {
          if (err) {
            server.config.logger.error(`[catalog-pages] ${stderr || err.message}`);
            return;
          }
          if (!/обновлено: 0/.test(stdout)) server.ws.send({ type: 'full-reload' });
        });
      });
    },
  };
}

export default defineConfig(async () => {
  const { files, base } = await generate(root);

  return {
    root: './src',
    base,
    publicDir: './assets',
    appType: 'mpa', // многостраничный сайт: у каждой папки свой index.html
    server: {
      port: 3000,
    },
    // Не сканировать HTML-компоненты из src/html как отдельные страницы
    optimizeDeps: {
      entries: ['index.html', 'js/main.js'],
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        // Все сгенерированные страницы: { index: 'src/index.html', 'catalog/chairs/index': … }
        input: Object.fromEntries(
          files.map((f) => [toPosix(relative(join(root, 'src'), f)).replace(/\.html$/, ''), f]),
        ),
      },
    },
    plugins: [
      catalogPages(),
      ViteImageOptimizer({
        png: { quality: 80 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { quality: 80 },
      }),
    ],
  };
});
