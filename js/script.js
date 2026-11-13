document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  const header = document.querySelector('.header');
  const dropdowns = document.querySelectorAll('.has-dropdown');
  const mobileNavigation = window.matchMedia('(max-width: 1150px)');

  const setDropdownState = (drop, isOpen, className = 'force-open') => {
    drop.classList.toggle(className, isOpen);
    const link = drop.querySelector(':scope > a');
    if (link) link.setAttribute('aria-expanded', String(isOpen));
  };

  const closeDropdowns = () => {
    dropdowns.forEach(drop => {
      setDropdownState(drop, false, 'open');
      setDropdownState(drop, false);
    });
  };

  const setMenuState = (isOpen) => {
    if (!hamburger || !navbar) return;
    hamburger.classList.toggle('active', isOpen);
    navbar.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.style.overflow = isOpen && mobileNavigation.matches ? 'hidden' : '';
    if (!isOpen) closeDropdowns();
  };

  const updateHeaderState = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  };
  updateHeaderState();

  if (hamburger && navbar) {
    hamburger.addEventListener('click', event => {
      event.stopPropagation();
      setMenuState(!navbar.classList.contains('active'));
    });

    document.addEventListener('click', event => {
      if (!header.contains(event.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navbar.classList.contains('active')) {
        setMenuState(false);
        hamburger.focus();
      }
    });

    navbar.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link) {
        const dropdown = link.closest('.has-dropdown');
        if (!dropdown || dropdown.querySelector(':scope > a') !== link) setMenuState(false);
      }
    });

    mobileNavigation.addEventListener('change', () => {
      setMenuState(false);
    });
  }

  dropdowns.forEach(drop => {
    const link = drop.querySelector(':scope > a');
    if (!link) return;

    link.addEventListener('click', (e) => {
      if (mobileNavigation.matches) {
        e.preventDefault();
        const isOpen = drop.classList.contains('open');
        closeDropdowns();
        if (!isOpen) setDropdownState(drop, true, 'open');
      }
    });

    drop.addEventListener('mouseenter', () => {
      if (!mobileNavigation.matches) {
        dropdowns.forEach(d => {
          if (d !== drop) setDropdownState(d, false);
        });
        setDropdownState(drop, true);
      }
    });

    drop.addEventListener('mouseleave', () => {
      if (!mobileNavigation.matches && !drop.matches(':focus-within')) {
        setDropdownState(drop, false);
      }
    });

    drop.addEventListener('focusin', () => {
      if (!mobileNavigation.matches) setDropdownState(drop, true);
    });

    link.addEventListener('focus', () => {
      if (!mobileNavigation.matches) setDropdownState(drop, true);
    });

    drop.addEventListener('focusout', event => {
      if (!mobileNavigation.matches && !drop.contains(event.relatedTarget)) {
        setDropdownState(drop, false);
      }
    });
  });

  if (navbar) {
    navbar.addEventListener('mouseleave', () => {
      if (!mobileNavigation.matches) {
        dropdowns.forEach(drop => {
          if (!drop.matches(':focus-within')) setDropdownState(drop, false);
        });
      }
    });
  }

  const hero = document.querySelector(".hero");
  const heroImages = hero?.dataset.heroImages
    ? hero.dataset.heroImages.split(',').map(src => src.trim()).filter(Boolean)
    : [];
  const dotWrap = document.querySelector('.hero-slider-dots');
  let sliderIndex = 0;
  let sliderTimer;

  const dots = heroImages.map((_, imageIndex) => {
    if (!dotWrap) return null;
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show hero image ${imageIndex + 1}`);
    dot.addEventListener('click', () => {
      setHeroImage(imageIndex);
      window.clearInterval(sliderTimer);
      sliderTimer = window.setInterval(nextHeroImage, 5000);
    });
    dotWrap.appendChild(dot);
    return dot;
  });

  function setHeroImage(imageIndex) {
    if (hero) {
      sliderIndex = imageIndex;
      hero.style.backgroundImage = `url('${heroImages[sliderIndex]}')`;
      dots.forEach((dot, dotIndex) => {
        if (dot) dot.classList.toggle('active', dotIndex === sliderIndex);
      });
    }
  }

  function nextHeroImage() {
    if (!heroImages.length) return;
    setHeroImage((sliderIndex + 1) % heroImages.length);
  }

  if (hero && heroImages.length) {
    setHeroImage(0);
    sliderTimer = window.setInterval(nextHeroImage, 5000);
  }

  const topBtn = document.getElementById("backToTop");
  let lastScrollY = window.scrollY;

  const updateBackToTop = () => {
    if (!topBtn) return;
    const isVisible = window.scrollY > 250;
    topBtn.style.display = isVisible ? "grid" : "none";
    topBtn.setAttribute('aria-hidden', String(!isVisible));
    topBtn.tabIndex = isVisible ? 0 : -1;
  };
  updateBackToTop();

  window.addEventListener('scroll', () => {
    updateHeaderState();
    updateBackToTop();

    if (header) {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.classList.add('hide');
      } else {
        header.classList.remove('hide');
      }
    }

    lastScrollY = window.scrollY;
  });

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  fadeElements.forEach(el => observer.observe(el));

  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count || 0);
      const duration = 1100;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}+`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = `${target}+`;
        }
      };

      requestAnimationFrame(tick);
      obs.unobserve(counter);
    });
  }, { threshold: 0.45 });

  counters.forEach(counter => countObserver.observe(counter));

  const testimonials = Array.from(document.querySelectorAll('.testimonial-cards blockquote'));
  let testimonialIndex = 0;

  const featureTestimonial = () => {
    if (!testimonials.length) return;
    testimonials.forEach((item, index) => {
      item.classList.toggle('is-featured', index === testimonialIndex);
    });
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  };

  featureTestimonial();
  if (testimonials.length > 1) {
    window.setInterval(featureTestimonial, 3500);
  }

  document.querySelectorAll('footer #year').forEach(yearSpan => {
    yearSpan.textContent = new Date().getFullYear();
  });
});