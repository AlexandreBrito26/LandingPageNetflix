/* ─────────────────────────────────────────
   Netflix Landing Page — script.js
───────────────────────────────────────── */

// ── 1. Navbar scroll effect ──────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── 2. Film-strip background generator ──
const filmStrip = document.getElementById('filmStrip');
if (filmStrip) {
  const colors = ['#1a0000', '#0d0d0d', '#1a1010', '#0a0a1a', '#0d0d0d'];
  for (let i = 0; i < 60; i++) {
    const cell = document.createElement('div');
    cell.classList.add('film-cell');
    cell.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    cell.style.animationDelay = `${(Math.random() * 4).toFixed(2)}s`;
    filmStrip.appendChild(cell);
  }
}

// ── 3. FAQ accordion ────────────────────
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close all
    faqItems.forEach(i => i.classList.remove('open'));
    // toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// ── 4. Plans highlight on click ─────────
const planCards = document.querySelectorAll('.plan-card');
planCards.forEach(card => {
  card.addEventListener('click', () => {
    planCards.forEach(c => {
      c.style.borderColor = '';
      c.style.boxShadow = '';
    });
    card.style.borderColor = 'var(--red)';
    card.style.boxShadow = '0 0 40px rgba(229,9,20,0.3)';
    const btn = card.querySelector('.plan-btn');
    animateBtn(btn);
  });
});

function animateBtn(btn) {
  btn.textContent = '✓ Selecionado';
  btn.style.background = 'var(--red)';
  setTimeout(() => {
    btn.textContent = 'Assinar';
    btn.style.background = '';
  }, 2000);
}

// ── 5. CTA button ripple effect ─────────
document.querySelectorAll('.btn-cta').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      width:10px;height:10px;
      border-radius:50%;
      background:rgba(255,255,255,0.35);
      transform:scale(0);
      animation:rippleAnim 0.6s linear;
      top:${e.clientY - rect.top - 5}px;
      left:${e.clientX - rect.left - 5}px;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);

    // Validate e-mail in the same section
    const form = this.closest('.hero-form');
    if (form) {
      const input = form.querySelector('.hero-input');
      if (input) validateEmail(input, this);
    }
  });
});

// inject ripple keyframe once
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim { to { transform:scale(30); opacity:0; } }`;
document.head.appendChild(rippleStyle);

// ── 6. Email validation helper ──────────
function validateEmail(input, btn) {
  const email = input.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!email) {
    showInputFeedback(input, 'Digite seu e-mail.', 'error');
    return;
  }
  if (!valid) {
    showInputFeedback(input, 'E-mail inválido. Tente novamente.', 'error');
    return;
  }
  showInputFeedback(input, '✓ Ótimo! Redirecionando...', 'success');
  btn.textContent = 'Aguarde...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = 'Comece já <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btn.disabled = false;
    input.value = '';
    clearInputFeedback(input);
  }, 2000);
}

function showInputFeedback(input, msg, type) {
  clearInputFeedback(input);
  input.style.borderColor = type === 'error' ? '#ff4444' : '#00c853';
  const tip = document.createElement('div');
  tip.className = 'input-tip';
  tip.style.cssText = `
    font-size:0.78rem;
    margin-top:6px;
    color:${type === 'error' ? '#ff6b6b' : '#69f0ae'};
    text-align:left;
  `;
  tip.textContent = msg;
  input.insertAdjacentElement('afterend', tip);
}
function clearInputFeedback(input) {
  input.style.borderColor = '';
  const tip = input.nextElementSibling;
  if (tip && tip.classList.contains('input-tip')) tip.remove();
}

// ── 7. Scroll reveal animation ──────────
const revealEls = document.querySelectorAll('.feature, .plans-section, .faq-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'heroIn 0.7s ease both';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  // small delay so initial style applies
  requestAnimationFrame(() => observer.observe(el));
});

// ── 8. Smooth anchor scroll ─────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── 9. Logo click → scroll to top ───────
document.querySelector('.logo')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
