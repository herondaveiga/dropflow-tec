const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.querySelector('.hero-scene');

if (scene) {
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  let frame = 0;
  const paint = () => {
    frame = 0;
    const { top, height } = scene.getBoundingClientRect();
    const stageHeight = scene.firstElementChild.offsetHeight;
    const stickyTop = Math.min(0, document.documentElement.clientHeight - stageHeight);
    const distance = height - stageHeight;
    const progress = distance > 0 ? Math.min(1, Math.max(0, (stickyTop - top) / distance)) : 0;
    scene.style.setProperty('--scene-sticky-top', `${stickyTop}px`);
    scene.style.setProperty('--scene-progress', progress.toFixed(4));
    if (!reducedMotion.matches) {
      const scrollRange = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pageProgress = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
      document.body.style.setProperty('--page-progress', pageProgress.toFixed(4));
    }
  };
  const update = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };
  const resetPointer = () => {
    scene.style.removeProperty('--scene-x');
    scene.style.removeProperty('--scene-y');
  };
  const configure = () => {
    scene.classList.toggle('scene-motion', !reducedMotion.matches);
    resetPointer();
    update();
  };
  scene.addEventListener('pointermove', (event) => {
    if (!pointer.matches || reducedMotion.matches || event.pointerType !== 'mouse') return;
    const { left, top, width, height } = scene.firstElementChild.getBoundingClientRect();
    scene.style.setProperty('--scene-x', `${((event.clientX - left) / width - 0.5) * 52}px`);
    scene.style.setProperty('--scene-y', `${((event.clientY - top) / height - 0.5) * 36}px`);
  });
  scene.addEventListener('pointerleave', resetPointer);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  reducedMotion.addEventListener('change', configure);
  configure();
}

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reducedMotion.matches) continue;
      if (entry.target.classList.contains('featured-media')) {
        entry.target.classList.add('is-revealing');
      } else if (typeof entry.target.animate === 'function') {
        entry.target.animate(
          [{ opacity: 0.55, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 620, easing: 'cubic-bezier(.2,.75,.3,1)' }
        );
      }
    }
  }, { threshold: 0.15 });

  document.querySelectorAll(
    '.home-statement p, .diagnostic-strip li, .section-head, .problem-cards, .featured-media, .featured-card:last-child, .story-band .split, .method-list li, [aria-labelledby="tecnologia"] > div, .city-cards .card, .faq, .closing, .footer-row'
  ).forEach((element) => reveal.observe(element));
}
