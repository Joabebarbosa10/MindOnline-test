// ===== CURSOR PERSONALIZADO =====
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
  document.body.style.cursor = 'none';
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, .dica-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width = '56px';
      follower.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width = '32px';
      follower.style.height = '32px';
    });
  });
}

// ===== HEADER COM FUNDO AO ROLAR =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== ANIMAÇÃO DE ENTRADA DAS SEÇÕES =====
const animarEls = document.querySelectorAll('.animar');

if (animarEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visivel');
        }, i * 80);
      }
    });
  }, { threshold: 0.1 });

  animarEls.forEach(el => observer.observe(el));
}

// ===== MENU ATIVO AO ROLAR =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('ativo', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(sec => sectionObserver.observe(sec));
// ===== MENU HAMBURGUER =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('aberto');
    navMenu.classList.toggle('aberto');
  });

  // Fecha o menu ao clicar em um link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('aberto');
      navMenu.classList.remove('aberto');
    });
  });
}
// ===== ENVIO DO FORMULÁRIO — Netlify + Neon =====
const btnEnviar = document.querySelector('.btn-form');

if (btnEnviar) {
  btnEnviar.addEventListener('click', async () => {
    const nome      = document.getElementById('nome').value.trim();
    const telefone  = document.getElementById('telefone').value.trim();
    const email     = document.getElementById('email').value.trim();
    const novidades = document.querySelector('input[name="novidades"]:checked').value;
    const mensagem  = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    btnEnviar.textContent = 'Enviando...';
    btnEnviar.disabled = true;

    try {
      const resposta = await fetch('/.netlify/functions/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone, email, novidades, mensagem })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('✅ Mensagem enviada com sucesso!');
        document.getElementById('nome').value     = '';
        document.getElementById('telefone').value = '';