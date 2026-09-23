const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Navigation scroll effect */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

function closeMobileNav() {
  navLinksEl.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Ouvrir le menu');
}

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
}, { passive: true });

function updateActiveLink() {
  const scrollPos = window.scrollY + nav.offsetHeight + 80;
  const sections = document.querySelectorAll('header[id], section[id]');
  let current = 'accueil';

  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

updateActiveLink();

/* Mobile menu */
navToggle.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});

navLinks.forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

/* Cursor glow (desktop only) */
const glow = document.querySelector('.cursor-glow');
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (glow && finePointer && !prefersReducedMotion) {
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
} else if (glow) {
  glow.hidden = true;
}

/* Scroll reveal */
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(el => revealObserver.observe(el));
}

/* Skill bars animation */
const skillBars = document.querySelectorAll('.skill-fill');

if (prefersReducedMotion) {
  skillBars.forEach(bar => {
    bar.style.width = `${bar.dataset.level}%`;
  });
} else {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = `${entry.target.dataset.level}%`;
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach(bar => skillObserver.observe(bar));
}

/* Contact form */
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`Message de ${name}`);
  const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\n${message}`);
  const mailto = `mailto:mandagermain3@gmail.com?subject=${subject}&body=${body}`;

  window.location.href = mailto;
  formNote.textContent = 'Votre client mail va s\'ouvrir…';
  form.reset();

  setTimeout(() => { formNote.textContent = ''; }, 4000);
});
