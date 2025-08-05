// Skip Link Enhancement Script
// Client-side script to ensure skip links work properly in all browsers

(function () {
  'use strict';

  function handleBlur(target, originalTabIndex) {
    return function () {
      if (!originalTabIndex) {
        target.removeAttribute('tabindex');
      }
    };
  }

  function handleSkipLinkClick(event) {
    const href = event.target.getAttribute('href');
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      event.preventDefault();

      // Ensure target is focusable
      const originalTabIndex = target.getAttribute('tabindex');
      if (!originalTabIndex) {
        target.setAttribute('tabindex', '-1');
      }

      // Focus and scroll to target
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Remove temporary tabindex after blur
      target.addEventListener('blur', handleBlur(target, originalTabIndex), { once: true });
    }
  }

  function enhanceSkipLinks() {
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(function (link) {
      link.addEventListener('click', handleSkipLinkClick);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceSkipLinks);
  } else {
    enhanceSkipLinks();
  }
})();
