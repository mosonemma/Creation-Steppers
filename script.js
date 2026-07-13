document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  const header = document.querySelector('.header');
  const dropdowns = document.querySelectorAll('.has-dropdown');

  /* --- 1. HEADER HEIGHT & POSITIONING --- */
  const updateHeaderHeight = () => {
    const root = document.documentElement;
    if (header) {
      const h = header.offsetHeight;
      root.style.setProperty('--header-height', h + 'px');
      root.style.setProperty('--site-header-height', h + 'px');
    }
  };
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);

  const updateHeaderState = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  };
  updateHeaderState();

  /* --- 2. MAIN MENU TOGGLE --- */
  if (hamburger && navbar) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const opening = !hamburger.classList.contains('active');
      hamburger.classList.toggle('active');
      navbar.classList.toggle('active');

      if (!document.body.classList.contains('menu-below-header')) {
        document.body.style.overflow = opening ? 'hidden' : '';
      }
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
        navbar.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        dropdowns.forEach(el => el.classList.remove('open'));
      }
    });
  }

  /* --- 3. MOBILE DROPDOWN BEHAVIOR --- */
dropdowns.forEach(drop => {
  const link = drop.querySelector('a');

  link.addEventListener('click', (e) => {
    if (window.innerWidth < 900) {
      e.preventDefault();
      drop.classList.toggle('open');
    }
  });
});

  /* --- 4. HERO SLIDER --- */
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

  /* --- 5. SCROLL UTILITIES --- */
  const topBtn = document.getElementById("backToTop");
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    updateHeaderState();

    if (topBtn) {
      topBtn.style.display = window.scrollY > 250 ? "grid" : "none";
    }

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

  /* --- 6. FADE-IN OBSERVER --- */
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  fadeElements.forEach(el => observer.observe(el));

  /* --- 7. ANIMATED IMPACT NUMBERS --- */
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

  /* --- 8. TESTIMONIAL SPOTLIGHT --- */
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

  /* --- 9. FOOTER YEAR --- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
