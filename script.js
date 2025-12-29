// Common menu and dropdown behavior (used by all pages)
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');

  // Keep a CSS variable with the header height so the mobile menu can position and size correctly
  const updateHeaderHeight = () => {
    const headerEl = document.querySelector('.header');
    const root = document.documentElement;
    if (headerEl) {
      const h = headerEl.offsetHeight;
      root.style.setProperty('--header-height', h + 'px');
    } else {
      root.style.setProperty('--header-height', '70px');
    }
  };

  // initialize and keep in sync (resize & load)
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);
  window.addEventListener('load', updateHeaderHeight);

  if (hamburger && navbar) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const opening = !hamburger.classList.contains('active');
      hamburger.classList.toggle('active');
      navbar.classList.toggle('active');
      // disable body scroll only for pages that use the fullscreen overlay.
      // Pages that include `menu-below-header` class (index.html) should keep normal scroll.
      if (!document.body.classList.contains('menu-below-header')) {
        document.body.style.overflow = opening ? 'hidden' : '';
      }
      // If this page uses menu-below-header, explicitly position the navbar below the header
      // using inline styles so it appears immediately even if CSS variable isn't applied yet.
      if (document.body.classList.contains('menu-below-header')) {
        const headerEl = document.querySelector('.header');
        if (headerEl && navbar) {
          const h = headerEl.offsetHeight;
          if (opening) {
            navbar.style.top = h + 'px';
            navbar.style.height = `calc(100vh - ${h}px)`;
            // ensure it's on the right side for index-like panel
            navbar.style.right = '0';
            navbar.style.left = 'auto';
            navbar.style.width = '70%';
            // ensure the first menu item is visible (avoid being hidden by header)
            // scroll navbar to top and bring first link into view
            try {
              navbar.scrollTop = 0;
              const firstLink = navbar.querySelector('a');
              if (firstLink) firstLink.scrollIntoView({block: 'start', behavior: 'auto'});
            } catch (err) {
              // ignore
            }
          } else {
            navbar.style.top = '';
            navbar.style.height = '';
            navbar.style.right = '';
            navbar.style.left = '';
            navbar.style.width = '';
          }
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
        navbar.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
      }
    });
  }

  // Dropdown toggles: on small screens we open on first click and allow navigation on second click
  document.querySelectorAll('.has-dropdown > a').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const parent = anchor.parentElement;
      if (window.innerWidth < 900) {
        // If dropdown is not open, open it and prevent navigation so user can see options.
        // If it's already open, allow the click to follow the link (navigate).
        if (!parent.classList.contains('open')) {
          e.preventDefault();
          // close other open dropdowns for tidy behavior
          document.querySelectorAll('.has-dropdown.open').forEach(el => {
            if (el !== parent) el.classList.remove('open');
          });
          parent.classList.add('open');
        } else {
          // let the anchor navigate (do not preventDefault) — this allows parent link to be clickable
        }
      }
    });
  });

  // Reset menu state when resizing to larger screens
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) {
      if (navbar) navbar.classList.remove('active');
      if (hamburger) hamburger.classList.remove('active');
      document.body.style.overflow = '';
      document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
    }
  });
});
