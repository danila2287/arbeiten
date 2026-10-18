// Счётчик количества: кнопки − / + и поле ввода.
// stepperHtml используют и генератор страниц, и браузер — поэтому без обращения к DOM.
import { esc } from '../lib/format.js';

export function stepperHtml(id, value, max, label = 'Количество') {
  return `
    <div class="stepper" data-stepper="${id}">
      <button class="stepper__btn" type="button" data-step="-1" aria-label="Меньше">−</button>
      <input class="stepper__input" type="number" inputmode="numeric" min="0" max="${max}" value="${value}" aria-label="${esc(label)}">
      <button class="stepper__btn" type="button" data-step="1" aria-label="Больше">+</button>
    </div>`;
}

export function bindSteppers(root, onChange) {
  root.querySelectorAll('[data-stepper]').forEach((box) => {
    const id = box.dataset.stepper;
    const input = box.querySelector('input');
    const clamp = (v) => Math.max(0, Math.min(Number(input.max), Math.round(v)));

    box.querySelectorAll('[data-step]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const v = clamp((Number(input.value) || 0) + Number(btn.dataset.step));
        input.value = v;
        onChange(id, v);
      }),
    );

    input.addEventListener('change', () => {
      const v = clamp(Number(input.value) || 0);
      input.value = v;
      onChange(id, v);
    });
  });
}
