// Мелкие помощники для разметки.

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

let toastTimer;
export function toast(text) {
  const el = document.getElementById('toast');
  el.textContent = text;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2400);
}

// Счётчик количества: кнопки − / + и поле ввода.
export function stepper(id, value, max, label = 'Количество') {
  return `
    <div class="stepper" data-stepper="${id}">
      <button type="button" data-step="-1" aria-label="Меньше">−</button>
      <input type="number" inputmode="numeric" min="0" max="${max}" value="${value}" aria-label="${label}">
      <button type="button" data-step="1" aria-label="Больше">+</button>
    </div>`;
}

export function bindSteppers(root, onChange) {
  root.querySelectorAll('[data-stepper]').forEach((box) => {
    const id = box.dataset.stepper;
    const input = box.querySelector('input');
    box.querySelectorAll('[data-step]').forEach((b) =>
      b.addEventListener('click', () => {
        const max = Number(input.max);
        const v = Math.max(0, Math.min(max, (Number(input.value) || 0) + Number(b.dataset.step)));
        input.value = v;
        onChange(id, v);
      }),
    );
    input.addEventListener('change', () => {
      const max = Number(input.max);
      const v = Math.max(0, Math.min(max, Math.round(Number(input.value) || 0)));
      input.value = v;
      onChange(id, v);
    });
  });
}
