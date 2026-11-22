const video = document.querySelector('.hero-video');
const control = document.querySelector('.video-control');
const mobileMenu = document.querySelector('.mobile-menu');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let onScreen = false;
let pausedByVisitor = false;

mobileMenu.querySelector('nav').addEventListener('click', (event) => {
  if (event.target.closest('a')) mobileMenu.open = false;
});

function syncVideo() {
  if (reducedMotion.matches || pausedByVisitor || !onScreen || document.hidden) {
    video.pause();
    return;
  }

  if (!video.hasAttribute('src')) video.src = video.dataset.src;
  video.play().catch((error) => {
    if (error.name !== 'AbortError' && !reducedMotion.matches && onScreen && !document.hidden) {
      pausedByVisitor = true;
      control.textContent = 'Reproduzir vídeo';
    }
  });
}

video.addEventListener('playing', () => video.classList.add('is-playing'));
video.addEventListener('pause', () => video.classList.remove('is-playing'));
video.addEventListener('error', () => {
  control.hidden = true;
  video.classList.remove('is-playing');
});
control.addEventListener('click', () => {
  pausedByVisitor = !pausedByVisitor;
  control.textContent = pausedByVisitor ? 'Reproduzir vídeo' : 'Pausar vídeo';
  syncVideo();
});

if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    onScreen = entry.intersectionRatio >= 0.2;
    syncVideo();
  }, { threshold: 0.2 }).observe(video.closest('.hero'));

  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!reducedMotion.matches) {
        entry.target.animate(
          [{ opacity: 0.35, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 440, easing: 'cubic-bezier(.2,.75,.25,1)' }
        );
      }
    }
  }, { threshold: 0.15 });
  document.querySelectorAll('.problem-cards, .featured-grid, .story-band .split, .method-list').forEach((element) => reveal.observe(element));

  function updatePreference() {
    control.hidden = reducedMotion.matches || Boolean(video.error);
    syncVideo();
  }
  updatePreference();
  reducedMotion.addEventListener('change', updatePreference);
  document.addEventListener('visibilitychange', syncVideo);
}
