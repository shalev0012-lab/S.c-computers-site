/* ════════════════════════════════════════════════
   S.C פתרונות מחשוב — main.js
   ════════════════════════════════════════════════ */

// ── Dark mode ────────────────────────────────────
(function () {
  if (localStorage.getItem('darkMode') === '1') {
    document.body.classList.add('dark-mode');
  }
})();

function toggleDarkMode() {
  var isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? '1' : '0');
}

// ── Mobile hamburger menu ────────────────────────
function toggleMobileMenu() {
  var btn  = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  var isOpen = menu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }
}
function closeMobileMenu() {
  var btn  = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  menu.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
}
// Close when clicking outside the header
document.addEventListener('click', function(e) {
  var header = document.querySelector('.site-header');
  if (header && !header.contains(e.target)) {
    closeMobileMenu();
  }
});
// Close on resize back to desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 860) closeMobileMenu();
}, { passive: true });

// ── FAQ Toggle ──────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  });
  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// ── Accessibility Widget ─────────────────────────
var ACC_WRAP    = ['acc-big-text','acc-bigger-text','acc-high-contrast','acc-negative','acc-grayscale'];
var ACC_BODY    = ['acc-light-bg','acc-underline-links','acc-readable-font','acc-no-anim'];
var ACC_CLASSES = ACC_WRAP.concat(ACC_BODY);

function accEl(cls) {
  return ACC_WRAP.indexOf(cls) !== -1
    ? document.getElementById('page-wrap')
    : document.body;
}
function toggleAccessPanel() {
  document.getElementById('accessPanel').classList.toggle('open');
}
function toggleAcc(cls, btn) {
  var el = accEl(cls);
  var pairs = [['acc-big-text','acc-bigger-text'],['acc-high-contrast','acc-negative']];
  pairs.forEach(function(pair) {
    if (pair.indexOf(cls) !== -1) {
      var other = pair[0] === cls ? pair[1] : pair[0];
      if (accEl(other).classList.contains(other)) {
        accEl(other).classList.remove(other);
        document.querySelectorAll('.access-grid button').forEach(function(b) {
          if ((b.getAttribute('onclick') || '').indexOf(other) !== -1) b.classList.remove('active');
        });
      }
    }
  });
  el.classList.toggle(cls);
  btn.classList.toggle('active');
  saveAccState();
}
function resetAcc() {
  ACC_WRAP.forEach(function(c) { document.getElementById('page-wrap').classList.remove(c); });
  ACC_BODY.forEach(function(c) { document.body.classList.remove(c); });
  document.querySelectorAll('.access-grid button').forEach(function(b) { b.classList.remove('active'); });
  localStorage.removeItem('acc_state');
}
function saveAccState() {
  var wrap = document.getElementById('page-wrap');
  var active = ACC_CLASSES.filter(function(c) {
    return (ACC_WRAP.indexOf(c) !== -1 ? wrap : document.body).classList.contains(c);
  });
  localStorage.setItem('acc_state', JSON.stringify(active));
}
function loadAccState() {
  try {
    var saved = JSON.parse(localStorage.getItem('acc_state') || '[]');
    saved.forEach(function(cls) {
      accEl(cls).classList.add(cls);
      document.querySelectorAll('.access-grid button').forEach(function(btn) {
        if ((btn.getAttribute('onclick') || '').indexOf("'" + cls + "'") !== -1) btn.classList.add('active');
      });
    });
  } catch(e) {}
}
document.addEventListener('click', function(e) {
  var panel = document.getElementById('accessPanel');
  if (panel && panel.classList.contains('open') &&
      !panel.contains(e.target) && !e.target.closest('.access-btn')) {
    panel.classList.remove('open');
  }
});
loadAccState();

// ── Active nav link on scroll ────────────────────
(function() {
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!navLinks.length) return;

  var sections = [];
  navLinks.forEach(function(link) {
    var id = link.getAttribute('data-section');
    var el = document.getElementById(id);
    if (el) sections.push({ el: el, link: link });
  });

  var heroLink = document.querySelector('.nav-link[data-section="hero"]');

  var navObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function(l) { l.classList.remove('active'); });
        var match = sections.find(function(s) { return s.el === entry.target; });
        if (match) match.link.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -65% 0px', threshold: 0 });

  sections.forEach(function(s) { navObs.observe(s.el); });

  // Fallback: activate "בית" when at very top
  window.addEventListener('scroll', function() {
    if (window.scrollY < 80 && heroLink) {
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      heroLink.classList.add('active');
    }
  }, { passive: true });
})();

// ── Scroll Reveal — data-reveal system ──────────
(function() {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Small timeout respects the CSS --d (delay) variable already set inline
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(function(el) { obs.observe(el); });
})();

// ── Hero elements: trigger immediately on load ───
(function() {
  // Hero children have data-reveal but are visible without scroll,
  // so we trigger them after a brief paint delay
  var heroReveals = document.querySelectorAll('.hero [data-reveal]');
  if (!heroReveals.length) return;
  requestAnimationFrame(function() {
    setTimeout(function() {
      heroReveals.forEach(function(el) { el.classList.add('revealed'); });
    }, 60);
  });
})();

// ── Hero Video Panel Slider ──────────────────────
(function() {
  var slides      = document.querySelectorAll('.hvp-slide');
  var dots        = document.querySelectorAll('.hvp-dot');
  var progressBar = document.getElementById('hvpProgressBar');
  if (!slides.length) return;

  var current      = 0;
  var total        = slides.length;
  var DURATION     = 7000;
  var autoTimer    = null;
  var progressRaf  = null;
  var progressStart = null;
  var paused        = false;
  var manualPaused  = false;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');
    var oldVid = slides[current].querySelector('.hvp-video');
    if (oldVid) oldVid.pause();

    current = ((idx % total) + total) % total;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
    var newVid = slides[current].querySelector('.hvp-video');
    if (newVid) {
      newVid.currentTime = 0;
      if (!manualPaused) newVid.play().catch(function() {});
    }

    resetProgress();
    if (!paused && !manualPaused) scheduleNext();
  }

  function scheduleNext() {
    if (manualPaused) return;
    clearTimeout(autoTimer);
    autoTimer = setTimeout(function() { goTo(current + 1); }, DURATION);
  }

  function resetProgress() {
    cancelAnimationFrame(progressRaf);
    if (!progressBar) return;
    progressBar.style.width = '0%';
    progressStart = performance.now();
    (function tick(now) {
      var pct = Math.min(((now - progressStart) / DURATION) * 100, 100);
      progressBar.style.width = pct + '%';
      if (pct < 100) progressRaf = requestAnimationFrame(tick);
    })(progressStart);
  }

  window.hvpPrev  = function() { cancelAnimationFrame(progressRaf); clearTimeout(autoTimer); goTo(current - 1); };
  window.hvpNext  = function() { cancelAnimationFrame(progressRaf); clearTimeout(autoTimer); goTo(current + 1); };
  window.hvpGoTo  = function(n) { cancelAnimationFrame(progressRaf); clearTimeout(autoTimer); goTo(n); };

  window.hvpTogglePause = function() {
    manualPaused = !manualPaused;
    var btn = document.getElementById('hvpPauseBtn');
    var vid = slides[current].querySelector('.hvp-video');
    if (manualPaused) {
      clearTimeout(autoTimer);
      cancelAnimationFrame(progressRaf);
      if (vid) vid.pause();
      if (btn) btn.setAttribute('aria-label', 'הפעל סרטון');
      if (btn) btn.classList.add('is-paused');
    } else {
      if (vid) vid.play().catch(function() {});
      resetProgress();
      scheduleNext();
      if (btn) btn.setAttribute('aria-label', 'השהה סרטון');
      if (btn) btn.classList.remove('is-paused');
    }
  };

  var panel = document.querySelector('.hero-video-panel');
  if (panel) {
    panel.addEventListener('mouseenter', function() {
      if (!manualPaused) { paused = true; clearTimeout(autoTimer); cancelAnimationFrame(progressRaf); }
    });
    panel.addEventListener('mouseleave', function() {
      if (!manualPaused) { paused = false; resetProgress(); scheduleNext(); }
    });

    var touchStartX = null;
    panel.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    panel.addEventListener('touchend',   function(e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? window.hvpNext() : window.hvpPrev(); }
      touchStartX = null;
    }, { passive: true });
  }

  resetProgress();
  scheduleNext();
})();

// ── Contact Form → WhatsApp ──────────────────────
window.selectService = function(value) {
  var select = document.getElementById('formSubject');
  if (!select) return;
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === value) {
      select.selectedIndex = i;
      break;
    }
  }
  var scrollTarget = document.getElementById('contactForm') || document.getElementById('contact');
  if (scrollTarget) {
    var offset = scrollTarget.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
  select.classList.add('highlight');
  setTimeout(function() { select.classList.remove('highlight'); }, 1800);
};

(function() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  function setError(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.add('error');
      el.addEventListener('input', function rm() { el.classList.remove('error'); el.removeEventListener('input', rm); });
      el.addEventListener('change', function rm() { el.classList.remove('error'); el.removeEventListener('change', rm); });
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name    = document.getElementById('formName').value.trim();
    var phone   = document.getElementById('formPhone').value.trim();
    var email   = document.getElementById('formEmail').value.trim();
    var subject = document.getElementById('formSubject').value;
    var message = document.getElementById('formMessage').value.trim();

    var valid = true;
    if (!name)    { setError('formName');    valid = false; }
    if (!phone)   { setError('formPhone');   valid = false; }
    if (!subject) { setError('formSubject'); valid = false; }
    if (!valid) return;

    var text = '*פנייה חדשה – S.C פתרונות מחשוב*\n';
    text += '━━━━━━━━━━━━━━━━━━━━\n\n';
    text += '*שם:* ' + name + '\n';
    text += '*טלפון:* ' + phone + '\n';
    if (email) text += '*דואר:* ' + email + '\n';
    text += '*שירות מבוקש:* ' + subject + '\n';
    if (message) text += '*פרטים:* ' + message + '\n';
    text += '\n━━━━━━━━━━━━━━━━━━━━';

    var url = 'https://wa.me/972515060413?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
