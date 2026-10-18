// Галерея фото на странице товара: стрелки, миниатюры и свайп.
// Листание — это обычная прокрутка ленты со scroll-snap, поэтому свайп на телефоне
// работает сам по себе, а скрипт только добавляет стрелки и подсветку миниатюр.
export function useGallery() {
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const track = gallery.querySelector('[data-gallery-track]');
    const slides = [...track.children];
    const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
    const prev = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    const last = slides.length - 1;

    const current = () => Math.round(track.scrollLeft / track.clientWidth);

    const go = (i) => {
      const index = Math.max(0, Math.min(last, i));
      track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
    };

    const update = () => {
      const i = current();
      thumbs.forEach((t, n) => {
        if (n === i) t.setAttribute('aria-current', 'true');
        else t.removeAttribute('aria-current');
      });
      prev.disabled = i === 0;
      next.disabled = i === last;
    };

    prev.hidden = false;
    next.hidden = false;
    prev.addEventListener('click', () => go(current() - 1));
    next.addEventListener('click', () => go(current() + 1));
    thumbs.forEach((t) => t.addEventListener('click', () => go(Number(t.dataset.galleryThumb))));

    // Стрелки клавиатуры, когда фокус на ленте
    track.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      go(current() + d);
    });

    let frame;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    window.addEventListener('resize', () => go(current()));

    update();
  });
}
