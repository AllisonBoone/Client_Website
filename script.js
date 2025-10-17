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

// Close drawer when clicking a drawer link (extra safety)
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
  // Support either <header class="header"> or plain <header>
  const header =
    document.querySelector('.header') || document.querySelector('header');

  function headerOffset() {
    const h = header ? header.getBoundingClientRect().height : 0;
    return Math.ceil(h + 16); // mirror CSS scroll-margin-top extra space
  }

  function scrollToTarget(target) {
    if (!target) return;
    const top =
      window.scrollY + target.getBoundingClientRect().top - headerOffset();
    window.scrollTo({ top, left: 0, behavior: 'smooth' });
  }

  // Intercept same-page anchors and smooth-scroll WITHOUT pushing a hash
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
      // Do not modify URL (prevents refresh jumping to a section)
      scrollToTarget(target);
    });
  });

  // On load: if a hash is present, strip it so refresh lands at top/current position
  window.addEventListener('load', () => {
    if (window.location.hash) {
      // Remove only the fragment; keep path + query intact
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
      // Optionally scroll to top after stripping (comment out if you prefer staying put)
      // window.scrollTo({ top: 0, left: 0 });
    }
  });
})();
