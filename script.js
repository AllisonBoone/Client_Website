// ===================== CONFIG =====================
const CONTACT_FORM_CONFIG = {
  MODE: 'formspree', // 'formspree' (now)  |  'gas' (later)
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/yourEndpointHere', // <-- put your Formspree endpoint
  GAS_ENDPOINT: 'https://script.google.com/macros/s/yourGASexecURL/exec', // <-- paste later
};
// ==================================================

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

  // On load: strip any hash so refresh lands at top/wherever user is
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

// ===== Contact form: Formspree (now) or GAS (later), with validation and UX =====
(function attachContactHandler() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmit');
  if (!form) return;

  // Lightweight client validation
  function validate() {
    const first = form.first.value.trim();
    const last = form.last.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!first || !last || !email || !message) return false;
    // basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    return true;
  }

  async function sendViaFormspree(fd) {
    const endpoint = CONTACT_FORM_CONFIG.FORMSPREE_ENDPOINT;
    // Formspree reads fields from FormData and emails you.
    return fetch(endpoint, {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
    })
      .then((r) => r.json().catch(() => ({})))
      .then((json) => ({ ok: json?.ok !== false && (json?.ok || true) })) // treat non-error as ok
      .catch(() => ({ ok: false }));
  }

  async function sendViaGAS(fd) {
    const endpoint = CONTACT_FORM_CONFIG.GAS_ENDPOINT;
    // GAS web app accepts FormData (no CORS preflight)
    return fetch(endpoint, { method: 'POST', body: fd })
      .then((r) => r.json().catch(() => ({})))
      .then((json) => ({ ok: !!json?.ok }))
      .catch(() => ({ ok: false }));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) {
      statusEl &&
        (statusEl.textContent =
          'Please complete all fields with a valid email.');
      return;
    }

    // Build FormData (includes honeypot)
    const fd = new FormData(form);

    // UX: disable button during send
    const originalText = submitBtn?.textContent;
    submitBtn && (submitBtn.disabled = true);
    submitBtn && (submitBtn.textContent = 'Sending…');
    statusEl && (statusEl.textContent = '');

    let result = { ok: false };
    if (CONTACT_FORM_CONFIG.MODE === 'formspree') {
      result = await sendViaFormspree(fd);
    } else if (CONTACT_FORM_CONFIG.MODE === 'gas') {
      result = await sendViaGAS(fd);
    }

    if (result.ok) {
      statusEl && (statusEl.textContent = "Thanks! I'll be in touch shortly.");
      form.reset();
    } else {
      statusEl &&
        (statusEl.textContent =
          'Something went wrong. Please email us directly.');
    }

    submitBtn && (submitBtn.disabled = false);
    submitBtn && (submitBtn.textContent = originalText || 'SUBMIT');
  });
})();
