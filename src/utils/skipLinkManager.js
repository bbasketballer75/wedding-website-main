// Skip Link Focus Management Utility
// Ensures skip links properly focus target elements and announce to screen readers

class SkipLinkManager {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return;

    this.setupSkipLinks();
    this.initialized = true;
  }

  setupSkipLinks() {
    // Find all skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');

    skipLinks.forEach((link) => {
      link.addEventListener('click', this.handleSkipLinkClick.bind(this));
      link.addEventListener('keydown', this.handleSkipLinkKeydown.bind(this));
    });
  }

  handleSkipLinkClick(event) {
    const href = event.target.getAttribute('href');
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      event.preventDefault();
      this.focusTarget(target);
    }
  }

  handleSkipLinkKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleSkipLinkClick(event);
    }
  }

  focusTarget(target) {
    // Make target focusable if it isn't already
    const originalTabIndex = target.getAttribute('tabindex');

    if (!target.getAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }

    // Focus the target
    target.focus();

    // Scroll to target smoothly
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Announce to screen readers
    this.announceToScreenReaders(target);

    // Reset tabindex if we added it
    if (originalTabIndex === null) {
      target.addEventListener(
        'blur',
        () => {
          target.removeAttribute('tabindex');
        },
        { once: true }
      );
    }
  }

  announceToScreenReaders(target) {
    // Create temporary announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = `Navigated to ${this.getTargetDescription(target)}`;

    document.body.appendChild(announcement);

    // Remove announcement after delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  getTargetDescription(target) {
    // Get appropriate description for the target
    const ariaLabel = target.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const heading = target.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) return heading.textContent;

    const role = target.getAttribute('role');
    if (role) return role;

    return target.tagName.toLowerCase();
  }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  const skipLinkManager = new SkipLinkManager();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => skipLinkManager.init());
  } else {
    skipLinkManager.init();
  }
}

export default SkipLinkManager;
