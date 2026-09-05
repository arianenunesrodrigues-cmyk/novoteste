/**
 * Google Antigravity & AI Models - Interactivity Engine
 * Canvas de Partículas, Simulador de Console e Filtro Dinâmico
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initModelFilter();
  initTerminalSimulator();
  initCopyButton();
  initMobileNav();
});

/* ==========================================================================
   1. Canvas de Partículas Interativas (Cyber Mesh)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce nas bordas
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Interação com o mouse
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * 3;
          const directionY = (dy / distance) * force * 3;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  let particlesArray = [];
  function createParticles() {
    particlesArray = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          let opacity = 1 - distance / 110;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Filtro Interativo dos Modelos de IA
   ========================================================================== */
function initModelFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const modelCards = document.querySelectorAll('.model-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      modelCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Simulador de Console / Playground Antigravity
   ========================================================================== */
const scenarios = {
  'deploy-vercel': [
    { type: 'user', badge: 'USUÁRIO', text: 'Publique esta aplicação web na Vercel com cabeçalhos de segurança e cache otimizado.' },
    { type: 'thought', badge: 'RACIOCÍNIO', text: 'Verificando a estrutura do repositório estático (index.html, style.css, script.js). Elaborando arquivo de configuração vercel.json...' },
    { type: 'tool', badge: 'TOOL CALL', text: 'write_to_file -> TargetFile: vercel.json (Headers: X-Content-Type-Options, Cache-Control, Frame-Options)' },
    { type: 'output', badge: 'SISTEMA', text: '✔ vercel.json criado com sucesso [200 OK]' },
    { type: 'thought', badge: 'RACIOCÍNIO', text: 'Executando o comando de deploy oficial na nuvem global da Vercel...' },
    { type: 'tool', badge: 'TOOL CALL', text: 'run_command -> npx vercel deploy --prod --yes' },
    { type: 'output', badge: 'SISTEMA', text: 'Vercel CLI 34.0.0 — Building static deployment...\n  Aliasing -> https://antigravity-experience.vercel.app\n  Deployment completed in 1.4s' },
    { type: 'success', badge: 'CONCLUÍDO', text: '🚀 Aplicação publicada com sucesso na rede global da Vercel com HTTPS e CDN ativo!' }
  ],
  'refactor-api': [
    { type: 'user', badge: 'USUÁRIO', text: 'Encontre callbacks legados na base de código, refatore para async/await e execute a suíte de testes.' },
    { type: 'thought', badge: 'RACIOCÍNIO', text: 'Utilizando a ferramenta nativa ripgrep para varredura ultrarrápida em todo o repositório...' },
    { type: 'tool', badge: 'TOOL CALL', text: 'grep_search -> Query: "function(err, res)" | Path: ./src' },
    { type: 'output', badge: 'SISTEMA', text: 'Encontradas 12 ocorrências em 3 arquivos: api.js, auth.js e client.js' },
    { type: 'thought', badge: 'RACIOCÍNIO', text: 'Substituindo blocos com replace_file_content mantendo tratamento de exceções com try/catch...' },
    { type: 'tool', badge: 'TOOL CALL', text: 'replace_file_content -> Convertendo para Promises nativas e funções assíncronas' },
    { type: 'tool', badge: 'TOOL CALL', text: 'run_command -> npm test' },
    { type: 'output', badge: 'SISTEMA', text: 'PASS src/__tests__/api.test.js (18 tests passed, 0 failed, 1.2s)' },
    { type: 'success', badge: 'CONCLUÍDO', text: '✨ Refatoração realizada com integridade e 100% dos testes aprovados!' }
  ],
  'browser-e2e': [
    { type: 'user', badge: 'USUÁRIO', text: 'Use o subagente de navegador para simular a interação do usuário no site e registrar gravação de teste.' },
    { type: 'thought', badge: 'RACIOCÍNIO', text: 'Iniciando instância de navegador headless via browser_subagent...' },
    { type: 'tool', badge: 'TOOL CALL', text: 'browser_subagent -> open_browser_url: http://localhost:3000' },
    { type: 'output', badge: 'SISTEMA', text: 'Navegador aberto. DOM renderizado em 140ms. Resolução 1280x800.' },
    { type: 'thought', badge: 'RACIOCÍNIO', text: 'Localizando botões de interação e executando cliques...' },
    { type: 'tool', badge: 'TOOL CALL', text: 'browser_subagent -> click("#cta-header-sim") -> scrollBy(0, 600)' },
    { type: 'output', badge: 'SISTEMA', text: 'Interações gravadas em artifacts/session_recording.webp' },
    { type: 'success', badge: 'CONCLUÍDO', text: '🎥 Fluxo visual e interatividade validados com gravação e relatório anexados!' }
  ]
};

let currentTimeout = null;

function initTerminalSimulator() {
  const terminalBody = document.getElementById('terminal-body');
  const scenarioButtons = document.querySelectorAll('.scenario-btn');
  const replayBtn = document.getElementById('btn-replay-sim');

  let activeScenarioKey = 'deploy-vercel';

  function runScenario(key) {
    if (currentTimeout) clearTimeout(currentTimeout);
    terminalBody.innerHTML = '';

    const steps = scenarios[key];
    let stepIndex = 0;

    function renderNextStep() {
      if (stepIndex >= steps.length) {
        return;
      }

      const step = steps[stepIndex];
      const line = document.createElement('div');
      line.className = 'term-line';

      let badgeClass = 'badge-output';
      if (step.type === 'user') badgeClass = 'badge-user';
      else if (step.type === 'thought') badgeClass = 'badge-thought';
      else if (step.type === 'tool') badgeClass = 'badge-tool';
      else if (step.type === 'success') badgeClass = 'badge-success';

      line.innerHTML = `
        <span class="term-badge ${badgeClass}">${step.badge}</span>
        <span class="term-text">${step.text}</span>
      `;

      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      stepIndex++;
      const delay = step.type === 'thought' ? 700 : step.type === 'tool' ? 600 : 500;
      currentTimeout = setTimeout(renderNextStep, delay);
    }

    renderNextStep();
  }

  scenarioButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      scenarioButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeScenarioKey = btn.getAttribute('data-scenario');
      runScenario(activeScenarioKey);
    });
  });

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      runScenario(activeScenarioKey);
    });
  }

  // Inicia o primeiro cenário
  runScenario(activeScenarioKey);
}

/* ==========================================================================
   4. Botão de Copiar Snippet
   ========================================================================== */
function initCopyButton() {
  const copyBtn = document.getElementById('copy-deploy-btn');
  const codeElem = document.getElementById('deploy-code');

  if (!copyBtn || !codeElem) return;

  copyBtn.addEventListener('click', () => {
    const textToCopy = codeElem.innerText.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="ph ph-check"></i> Copiado!';
      copyBtn.style.color = 'var(--accent-cyan)';

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.style.color = '';
      }, 2000);
    });
  });
}

/* ==========================================================================
   5. Menu Mobile
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    const isOpen = menu.classList.contains('active');
    toggle.innerHTML = isOpen ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.innerHTML = '<i class="ph ph-list"></i>';
    });
  });
}
