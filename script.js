/* ════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════ */
function navigateTo(page) {
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Show/hide pages
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    // Re-trigger animations by briefly removing and re-adding content
    const animated = target.querySelectorAll('[class*="animation"]');
    animated.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // trigger reflow
      el.style.animation = '';
    });
  }

  // Show hero text only on work page
  const heroContent = document.getElementById('hero-content');
  if (heroContent) {
    heroContent.classList.toggle('hidden', page !== 'work');
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════════
   FORMSPREE FORM HANDLING (AJAX)
   ════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Dynamic scroll animation per image ── */
  setupScrollAnimations();

  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      })
        .then(response => {
          if (response.ok) {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            form.reset();
            // Analytics: a real inquiry, not just a visit.
            if (window.umami) window.umami.track('contact-form-submit');
          } else {
            alert('Oops! Something went wrong. Please try again.');
          }
        })
        .catch(() => {
          alert('Oops! Something went wrong. Please try again.');
        });
    });
  }
});

/* ════════════════════════════════════════
   DYNAMIC SCROLL ANIMATION
   Calculates the perfect scroll distance
   for each screenshot based on its height.
   ════════════════════════════════════════ */
function setupScrollAnimations() {
  document.querySelectorAll('.scroll-image').forEach(function (img, index) {
    // If already loaded, set up immediately; otherwise wait
    if (img.complete && img.naturalHeight > 0) {
      applyScrollAnimation(img, index);
    } else {
      img.addEventListener('load', function () {
        applyScrollAnimation(img, index);
      });
    }
  });
}

function applyScrollAnimation(img, index) {
  var viewport = img.closest('.browser-viewport');
  if (!viewport) return;

  var viewportHeight = viewport.offsetHeight;
  var renderedHeight = img.offsetHeight;

  // How far (in %) do we need to scroll to see the bottom?
  // We want the bottom of the image to align with the bottom of the viewport
  var scrollPercent = ((renderedHeight - viewportHeight) / renderedHeight) * 100;

  // Clamp between 10% and 95% just in case
  scrollPercent = Math.min(Math.max(scrollPercent, 10), 95);

  // Create a unique keyframe animation for this image
  var animName = 'scrollImg' + index;
  var keyframes =
    '@keyframes ' + animName + ' {' +
    '  0%   { transform: translateY(0); }' +
    '  42%  { transform: translateY(-' + scrollPercent.toFixed(1) + '%); }' +
    '  50%  { transform: translateY(-' + scrollPercent.toFixed(1) + '%); }' +
    '  92%  { transform: translateY(0); }' +
    '  100% { transform: translateY(0); }' +
    '}';

  // Inject the keyframes into the page
  var style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);

  // Apply the animation to this image
  img.style.animation = animName + ' 14s linear infinite';
  img.style.animationDelay = (index * 1.5) + 's';
}
