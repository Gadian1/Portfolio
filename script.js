// ===== PARTÍCULAS COM INTERAÇÃO DE MOUSE =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let mouse = { x: null, y: null };
let particles = [];

// 1. Deixa o canvas sempre do tamanho da tela
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// 2. Rastreia a posição do mouse
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

// 3. Cada partícula é um objeto com posição, velocidade e cor
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 1;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.speedY = (Math.random() - 0.5) * 0.6;
    const cores = ['#2563eb', '#7c3aed', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b'];
    this.color = cores[Math.floor(Math.random() * cores.length)];
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  // Desenha o ponto na tela
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Atualiza posição a cada frame
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Interação com o mouse — repele as partículas
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const raio = 160;
      if (dist < raio) {
        const forca = (raio - dist) / raio;
        this.x -= (dx / dist) * forca * 4;
        this.y -= (dy / dist) * forca * 4;
      }
    }

    // Rebate nas bordas da tela
    if (this.x < 0 || this.x > canvas.width)  this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    this.x = Math.max(0, Math.min(canvas.width, this.x));
    this.y = Math.max(0, Math.min(canvas.height, this.y));
  }
}

// 4. Cria todas as partículas
function initParticles() {
  particles = [];
  const quantidade = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 130);
  for (let i = 0; i < quantidade; i++) particles.push(new Particle());
}
initParticles();

// 5. Loop principal — roda 60x por segundo
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navList = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('open');
});

navList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navList.classList.remove('open'));
});

// ===== FADE-IN ANIMATION ON SCROLL =====
const fadeEls = document.querySelectorAll(
  '.profile-card, .hero-text, .timeline-item, .project-card, .contact-info, .contact-form, .cv-column'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Mensagem enviada!';
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
    setTimeout(() => {
      btn.innerHTML = 'Enviar Mensagem <i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 3000);
  });
}
