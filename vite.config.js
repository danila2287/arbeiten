import { fileURLToPath } from 'node:url';
import { relative, sep } from 'node:path';
import { execFile } from 'node:child_process';
import { generate } from './scripts/generate.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));

// Плагин: генерирует HTML-страницы из каталога и пересобирает их,
// когда вы меняете src/config.js, src/data/* или шаблоны.
function pagesPlugin() {
  return {
    name: 'catalog-pages',
    configureServer(server) {
      const watched = ['src/config.js', 'src/data/', 'src/templates/', 'src/shared/'];
      server.watcher.on('change', (file) => {
        const rel = relative(root, file).split(sep).join('/');
        if (!watched.some((w) => rel.startsWith(w))) return;
        // Отдельный процесс — чтобы Node не держал старые версии шаблонов в кеше.
        execFile(process.execPath, ['scripts/generate.mjs'], { cwd: root }, (err, stdout, stderr) => {
          if (err) return server.config.logger.error(`[catalog-pages] ${stderr || err.message}`);
          if (!/обновлено: 0/.test(stdout)) server.ws.send({ type: 'full-reload' });
        });
      });
    },
  };
}

export default async () => {
  const { files } = await generate(root);

  return {
    appType: 'mpa', // многостраничный сайт: каждая папка со своим index.html
    plugins: [pagesPlugin()],
    build: {
      rollupOptions: {
        input: Object.fromEntries(
          files.map((f) => [relative(root, f).split(sep).join('/').replace(/\.html$/, ''), f]),
        ),
      },
    },
  };
};
