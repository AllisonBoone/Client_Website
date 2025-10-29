// ===== Mobile drawer =====
const drawer = document.getElementById('drawer');
const openBtn = document.getElementById('openMenu');
const closeBtn = document.getElementById('closeMenu');

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}
openBtn?.addEventListener('click', () => {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
});
closeBtn?.addEventListener('click', closeDrawer);
drawer?.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', closeDrawer);
});

// ===== Privacy dialog =====
const privacy = document.getElementById('privacy');
document.getElementById('openPrivacy')?.addEventListener('click', (e) => {
  e.preventDefault();
  privacy?.showModal();
});
document.getElementById('closePrivacy')?.addEventListener('click', () => {
  privacy?.close();
});

// ===== Smooth scroll with header offset (desktop + mobile) =====
(function setupSmoothScroll() {
  const header =
    document.querySelector('.header') || document.querySelector('header');

  function headerOffset() {
    const h = header ? header.getBoundingClientRect().height : 0;
    return Math.ceil(h + 16); // keep in sync with CSS scroll-margin-top
  }

  function scrollToTarget(target) {
    if (!target) return;
    const top =
      window.scrollY + target.getBoundingClientRect().top - headerOffset();
    window.scrollTo({ top, left: 0, behavior: 'smooth' });
  }

  const links = document.querySelectorAll(
    'a[href^="#"]:not([href="#"]):not([href="#0"])'
  );

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      // Do not push a hash to the URL (prevents refresh jump)
      scrollToTarget(target);
    });
  });

  // On load: strip any hash so refresh lands at top/clean URL
  window.addEventListener('load', () => {
    if (window.location.hash) {
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  });
})();
