// Короткое уведомление внизу экрана («Добавлено в заявку»).
let timer;

export function toast(text) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = text;
  el.classList.add('is-on');
  el.removeAttribute('tabindex');
  clearTimeout(timer);
  timer = setTimeout(() => {
    el.classList.remove('is-on');
    el.tabIndex = -1;
  }, 2400);
}
