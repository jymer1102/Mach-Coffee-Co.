// --- Mobile Navigation Drawer Toggle (bars morph into an X) ---
(function mobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  const backdrop = document.getElementById('navBackdrop');
  if (!toggleBtn || !navLinks) return;

  function closeMenu() {
    navLinks.classList.remove('nav-open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('nav-scroll-lock');
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    toggleBtn.classList.toggle('active', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (backdrop) backdrop.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-scroll-lock', isOpen);
  });

  if (backdrop) backdrop.addEventListener('click', closeMenu);
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

// --- Sticky header: add shadow/backdrop once the page scrolls ---
(function stickyHeaderShadow() {
  const nav = document.getElementById('top');
  if (!nav) return;
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// --- Scroll-reveal: fade/slide elements with class "reveal" into place ---
(function scrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('in-view'));
    return;
  }

  // Stagger elements that reveal together (e.g. rows/cards in the same batch)
  targets.forEach((el, i) => {
    el.style.transitionDelay = (Math.min(i % 5, 4) * 0.08) + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

// --- Back to top button ---
(function backToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
