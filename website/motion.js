const menu = document.querySelector('.home-menu');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

menu.querySelector('nav').addEventListener('click', (event) => {
  if (event.target.closest('a')) menu.open = false;
});

menu.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!reducedMotion.matches) {
        entry.target.animate(
          [{ opacity: 0.72, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 350, easing: 'ease-out' }
        );
      }
    }
  }, { threshold: 0.15 });

  document.querySelectorAll('.hero-media, .featured-grid, .story-band .split').forEach((element) => reveal.observe(element));
}
