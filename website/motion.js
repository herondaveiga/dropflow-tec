const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!reducedMotion.matches) {
        entry.target.animate(
          [{ opacity: 0.25, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 620, easing: 'cubic-bezier(.2,.75,.3,1)' }
        );
      }
    }
  }, { threshold: 0.15 });

  document.querySelectorAll(
    '.diagnostic-strip li, .problem-cards, .featured-card, .story-band .split, .method-list li, .city-cards .card, .faq, .closing'
  ).forEach((element) => reveal.observe(element));
}
