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
    }
  };
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);

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
  const heroImages = [
    "photos/Team Meetings/dd.jpeg",
    "photos/Team Meetings/ntc1.png",
    "Docs/home.JPG",
    "Docs/home2.JPG",
  ];
  let sliderIndex = 0;
  const hero = document.querySelector(".hero");

  function changeHeroImage() {
    if (hero) {
      hero.style.backgroundImage = `url(${heroImages[sliderIndex]})`;
      sliderIndex = (sliderIndex + 1) % heroImages.length;
    }
  }

  changeHeroImage();
  setInterval(changeHeroImage, 4000);

  /* --- 5. SCROLL UTILITIES --- */
  const topBtn = document.getElementById("backToTop");
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (topBtn) {
      topBtn.style.display = window.scrollY > 250 ? "block" : "none";
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

  /* --- 7. FOOTER YEAR --- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});