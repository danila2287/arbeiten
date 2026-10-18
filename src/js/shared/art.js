// Простые линейные иллюстрации вместо фото. Когда снимете свою мебель,
// добавьте товару поле image — productImage покажет фото вместо рисунка.
// Файл используют и генератор страниц, и браузер, поэтому здесь нет обращения к DOM.
import { esc } from '../lib/format.js';

const paths = {
  chiavari: `
    <path d="M78 30h44M80 30v100M120 30v100M80 44h40M80 58h40M80 72h40"/>
    <path d="M72 86h56l-4 8H76z"/><path d="M82 94l-6 36M118 94l6 36M84 112h32"/>`,
  folding: `
    <path d="M82 34h36v34H82z"/><path d="M76 84h48"/>
    <path d="M86 68l-10 62M114 68l10 62M84 130l40-46M116 130L76 84"/>`,
  crossback: `
    <path d="M82 28v102M118 28v102M82 30h36M82 36l36 40M118 36L82 76"/>
    <path d="M74 84h52v8H74z"/><path d="M80 92v38M120 92v38M80 114h40"/>`,
  ghost: `
    <path d="M84 30c0-6 32-6 32 0v52H84z" stroke-dasharray="4 5"/>
    <path d="M76 82h48l-2 10H78z"/><path d="M80 92l-4 38M120 92l4 38M84 92l2 30M116 92l-2 30"/>`,
  tableRound: `
    <ellipse cx="100" cy="62" rx="62" ry="16"/><path d="M38 62v8c0 9 28 16 62 16s62-7 62-16v-8"/>
    <path d="M100 86v34M78 130l22-10 22 10"/>`,
  tableRect: `
    <path d="M30 60l26-16h114l-26 16z"/><path d="M30 60v8h114v-8M144 68l26-16v-8"/>
    <path d="M38 68v58M136 68v58M162 56v52"/>`,
  tableCocktail: `
    <ellipse cx="100" cy="36" rx="34" ry="9"/><path d="M100 45v78M76 132l24-9 24 9"/>`,
  sofa: `
    <path d="M44 66c0-12 6-18 18-18h76c12 0 18 6 18 18v14H44z"/>
    <path d="M30 76c0-8 14-8 14 0v34h112V76c0-8 14-8 14 0v42H30z"/>
    <path d="M100 82v28M42 118v12M158 118v12"/>`,
  armchair: `
    <path d="M66 40c0-8 6-12 14-12h40c8 0 14 4 14 12v42H66z"/>
    <path d="M52 78c0-10 14-10 14 0v26h68V78c0-10 14-10 14 0v36H52z"/><path d="M60 114v16M140 114v16"/>`,
  pouf: `
    <ellipse cx="100" cy="64" rx="44" ry="13"/><path d="M56 64v44c0 7 20 13 44 13s44-6 44-13V64"/>
    <path d="M70 76v40M130 76v40M100 77v44" stroke-dasharray="3 6"/>`,
  beanbag: `
    <path d="M52 124c-14-4-16-30 0-52 14-20 30-34 50-34 16 0 22 14 26 30 4 14 20 18 22 34 2 14-8 22-24 24-24 3-50 3-74-2z"/>
    <path d="M70 98c14 8 40 8 58 0"/>`,
  barCounter: `
    <path d="M40 40h120v12H40z"/><path d="M46 52h108v74H46z"/><path d="M46 70h108M46 108h108"/>`,
  barStool: `
    <ellipse cx="100" cy="40" rx="26" ry="7"/><path d="M84 46l-14 84M116 46l14 84M100 47v83M76 100h48"/>`,
  tablecloth: `
    <ellipse cx="100" cy="44" rx="58" ry="14"/>
    <path d="M42 44l-8 82c22 8 110 8 132 0l-8-82"/><path d="M62 56l-6 74M100 58v76M138 56l6 74" stroke-dasharray="3 6"/>`,
  chairCover: `
    <path d="M78 26c0-6 44-6 44 0l4 64H74z"/><path d="M74 90l-8 40h68l-8-40"/>
    <path d="M86 70c8 6 20 6 28 0M92 70l-8 14M108 70l8 14"/>`,
  skirt: `
    <ellipse cx="100" cy="34" rx="30" ry="8"/>
    <path d="M70 34c6 30-10 56-6 92 24 8 48 8 72 0 4-36-12-62-6-92"/><path d="M84 60c10 4 22 4 32 0"/>`,
  arch: `
    <path d="M48 132V86a52 52 0 0 1 104 0v46"/><path d="M36 132h32M132 132h32"/>
    <circle cx="64" cy="58" r="5"/><circle cx="78" cy="44" r="4"/><circle cx="56" cy="74" r="3"/>`,
  lights: `
    <path d="M20 40c30 30 50 30 80 0s50-30 80 0"/>
    <path d="M40 58v8M68 66v8M100 40v8M132 58v8M160 50v8"/>
    <circle cx="40" cy="72" r="6"/><circle cx="68" cy="80" r="6"/><circle cx="100" cy="54" r="6"/><circle cx="132" cy="72" r="6"/><circle cx="160" cy="64" r="6"/>`,
  candles: `
    <path d="M56 70h20v60H56zM90 50h20v80H90zM124 86h20v44h-20z"/>
    <path d="M66 70v-8M100 50v-8M134 86v-8"/><path d="M66 56c-4-6 0-10 0-14 0 4 4 8 0 14zM100 36c-4-6 0-10 0-14 0 4 4 8 0 14zM134 72c-4-6 0-10 0-14 0 4 4 8 0 14z"/>`,
  easel: `
    <path d="M100 22l-38 112M100 22l38 112M100 22v112"/><path d="M60 46h80v52H60z"/><path d="M70 60h40M70 72h56M70 84h30"/>`,
  tent: `
    <path d="M28 70L100 30l72 40"/><path d="M28 70c12 8 24 8 36 0 12 8 24 8 36 0 12 8 24 8 36 0 12 8 24 8 36 0"/>
    <path d="M34 72v58M166 72v58M100 72v58"/>`,
  speaker: `
    <rect x="68" y="24" width="64" height="104" rx="6"/><circle cx="100" cy="92" r="20"/><circle cx="100" cy="92" r="6"/><circle cx="100" cy="48" r="9"/>
    <path d="M148 40l10 18-6 4M148 40c8 0 12 4 12 4"/>`,
  heater: `
    <path d="M62 34h76l-14 20H76z"/><path d="M100 54v62M84 130h32l-4-14H88z"/><path d="M90 70h20v24H90z"/>`,
  cooler: `
    <rect x="58" y="36" width="84" height="88" rx="6"/><path d="M58 60h84"/><path d="M76 82l8 8M90 76l6 12M108 84l8-6M120 96l-8 8"/>`,
};

export function art(key, tone = 'paper', label = '') {
  const body = paths[key] || paths.chiavari;
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
  return `<svg class="art art--${tone}" viewBox="0 0 200 160" ${a11y}
    fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

// link — функция из config.js, добавляет base к адресу картинки.
export function productImage(p, link = (x) => x) {
  if (p.image) {
    return `<img class="art art--photo" src="${link(p.image)}" alt="${esc(p.name)}" width="500" height="400" loading="lazy">`;
  }
  return art(p.art, p.tone, p.name);
}
