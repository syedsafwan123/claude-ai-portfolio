/* ============================
   SCRIPT.JS — Claude AI Portfolio
   ============================ */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ---- PARTICLE CANVAS ----
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    const colors = ['#a78bfa', '#38bdf8', '#f472b6', '#34d399'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Create particles
for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ---- HERO CHAT ANIMATION ----
const aiMessages = [
  "I can help you write code, analyze data, answer complex questions, and so much more!",
  "From healthcare to automotive — I integrate seamlessly with your workflows.",
  "Ask me anything. I'm trained to be helpful, harmless, and honest.",
  "I can read 200,000 tokens at once — that's like an entire book in one conversation.",
];

let msgIndex = 0;
const aiMsg = document.getElementById('aiMsg');

function typeMessage(text, element) {
  let i = 0;
  element.innerHTML = '';
  const interval = setInterval(() => {
    element.innerHTML += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(nextMessage, 3000);
    }
  }, 30);
}

function nextMessage() {
  msgIndex = (msgIndex + 1) % aiMessages.length;
  aiMsg.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  setTimeout(() => {
    typeMessage(aiMessages[msgIndex], aiMsg);
  }, 1200);
}

// Start chat animation after 1.5s
setTimeout(() => {
  typeMessage(aiMessages[0], aiMsg);
}, 1500);

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start);
  }, 16);
}

// ---- INTERSECTION OBSERVER (REVEAL + COUNTERS) ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ---- REVEAL STAGGER FOR GRIDS ----
document.querySelectorAll('.about-grid .about-card, .capabilities-grid .cap-card, .plans-grid .plan-card, .testimonials-grid .testi-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});

// ---- BILLING TOGGLE ----
const billingToggle = document.getElementById('billingToggle');
const monthlyLabel = document.getElementById('monthlyLabel');
const annualLabel = document.getElementById('annualLabel');
let isAnnual = false;

billingToggle.addEventListener('click', () => {
  isAnnual = !isAnnual;
  billingToggle.classList.toggle('active', isAnnual);
  monthlyLabel.classList.toggle('active-label', !isAnnual);
  annualLabel.classList.toggle('active-label', isAnnual);

  document.querySelectorAll('.price-amount').forEach(el => {
    const monthly = parseInt(el.getAttribute('data-monthly'));
    const annual = parseInt(el.getAttribute('data-annual'));
    const target = isAnnual ? annual : monthly;
    animateCounter(el, target);
  });
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- CURSOR GLOW EFFECT ----
const glowCursor = document.createElement('div');
glowCursor.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  margin: -150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
  mix-blend-mode: screen;
`;
document.body.appendChild(glowCursor);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  glowCursor.style.left = mouseX + 'px';
  glowCursor.style.top = mouseY + 'px';
});

// ---- PLAN CARD TILT EFFECT ----
document.querySelectorAll('.plan-card, .about-card, .cap-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ---- INTEGRATION BLOCK HIGHLIGHT ----
const integrationBlocks = document.querySelectorAll('.integration-block');
integrationBlocks.forEach(block => {
  block.addEventListener('mouseenter', () => {
    block.style.boxShadow = '0 20px 60px rgba(167,139,250,0.12), 0 0 1px rgba(167,139,250,0.3)';
  });
  block.addEventListener('mouseleave', () => {
    block.style.boxShadow = '';
  });
});

// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navItem = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItem.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = '#a78bfa';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

// ---- SCROLL PROGRESS BAR ----
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #a78bfa, #38bdf8);
  z-index: 9999;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(167,139,250,0.6);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
});

// ---- PLAN BUTTON RIPPLE ----
function createRipple(e, btn) {
  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  circle.style.cssText = `
    position: absolute;
    width: ${diameter}px;
    height: ${diameter}px;
    left: ${e.clientX - btn.getBoundingClientRect().left - radius}px;
    top: ${e.clientY - btn.getBoundingClientRect().top - radius}px;
    transform: scale(0);
    animation: ripple 0.6s linear;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    pointer-events: none;
  `;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple { to { transform: scale(4); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.plan-btn, .btn').forEach(btn => {
  btn.addEventListener('click', e => createRipple(e, btn));
});

console.log('%c Claude AI Portfolio %c ✨ Built with Anthropic Claude ', 
  'background: linear-gradient(135deg, #a78bfa, #38bdf8); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-weight: bold;',
  'background: #0d0f1e; color: #a78bfa; padding: 8px 16px; border-radius: 0 4px 4px 0; font-weight: bold; border: 1px solid #a78bfa;'
);
