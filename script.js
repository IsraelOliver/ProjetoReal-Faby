const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.header-links');

if (toggle && menu) {
  toggle.setAttribute('role', 'button');
  toggle.setAttribute('tabindex', '0');
  toggle.setAttribute('aria-expanded', 'false');
  const openMenu = () => {
    menu.classList.add('active');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menu.classList.remove('active');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const isOpen = () => menu.classList.contains('active');

  const toggleMenu = () => {
    if (isOpen()) closeMenu();
    else openMenu();
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  menu.querySelectorAll('a').forEach((link) => { // aqui fecha o menu se clicar num link
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('click', (e) => { // esse fecha se clicar fora
    if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });


  document.addEventListener('keydown', (e) => { // esse aqui fecha com esc
    if (e.key === 'Escape') closeMenu();
  });
}

const btnVerMais = document.getElementById("verMais_sobre");
const sobre = document.getElementById("sobre");

if (btnVerMais && sobre) {
  btnVerMais.addEventListener("click", function (e) {
    e.preventDefault();

    const expandido = sobre.classList.contains("expandido");

    if (!expandido) {
      sobre.classList.add("expandido");
      btnVerMais.textContent = "Ver menos <";
    } else {
      sobre.classList.remove("expandido");
      btnVerMais.textContent = "Ver mais >";

      setTimeout(() => {
        sobre.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  });
}

const btnCurriculo = document.getElementById("curriculo_pdf");
const modal = document.getElementById("modalCurriculo");

function openModal() {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (btnCurriculo && modal) {
  btnCurriculo.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.dataset && target.dataset.close === "true") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const viewport = document.querySelector('.carousel-viewport');

if (track && viewport) {
  const autoplayTime = 4000;
  const pauseAfterClick = 10000;

  let intervalId = null;
  let pauseTimeoutId = null;
  let isAnimating = false;

  const setTransitionOn = () => {
    track.style.transition = 'transform 0.6s cubic-bezier(0.5, 0, 0.4, 1)';
  };

  const setTransitionOff = () => {
    track.style.transition = 'none';
  };

  function moveNext() {
    if (isAnimating) return;
    if (!track.firstElementChild) return;

    isAnimating = true;

    const firstSlide = track.firstElementChild;

    setTransitionOn();
    track.style.transform = 'translateX(-100%)';

    track.addEventListener('transitionend', () => {
      setTransitionOff();
      track.appendChild(firstSlide);
      track.style.transform = 'translateX(0)';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionOn();
          isAnimating = false;
        });
      });
    }, { once: true });
  }

  function movePrev() {
    if (isAnimating) return;
    if (!track.lastElementChild) return;

    isAnimating = true;

    const lastSlide = track.lastElementChild;

    setTransitionOff();
    track.prepend(lastSlide);
    track.style.transform = 'translateX(-100%)';

    requestAnimationFrame(() => {
      setTransitionOn();
      track.style.transform = 'translateX(0)';
    });

    track.addEventListener('transitionend', () => {
      isAnimating = false;
    }, { once: true });
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(moveNext, autoplayTime);
  }

  function stopAutoplay() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }

  function pauseAutoplay() {
    stopAutoplay();
    if (pauseTimeoutId) clearTimeout(pauseTimeoutId);

    pauseTimeoutId = setTimeout(() => {
      startAutoplay();
    }, pauseAfterClick);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      moveNext();
      pauseAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      movePrev();
      pauseAutoplay();
    });
  }

  startAutoplay();

  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let isTouching = false;

  const SWIPE_THRESHOLD = 50;
  const VERTICAL_TOLERANCE = 30;

  viewport.addEventListener('touchstart', (e) => {
    if (isAnimating) return;

    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    deltaX = 0;
    deltaY = 0;
    isTouching = true;

    pauseAutoplay();
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!isTouching) return;

    const t = e.touches[0];
    deltaX = t.clientX - startX;
    deltaY = t.clientY - startY;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > VERTICAL_TOLERANCE) {
      isTouching = false;
    }
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (!isTouching) return;
    isTouching = false;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) moveNext();
    else movePrev();
  }, { passive: true });
}


(() => {
  const carousel = document.getElementById("tCarousel");
  if (!carousel) return;

  const viewport = carousel.querySelector(".t-viewport");
  const track = carousel.querySelector(".t-track");
  const prev = carousel.querySelector(".t-btn.prev");
  const next = carousel.querySelector(".t-btn.next");

  let cards = Array.from(track.querySelectorAll(".testimonial-card"));
  if (cards.length === 0) return;

  let centerIndex = Math.min(1, cards.length - 1);

  const getCardStep = () => {
    const first = cards[0];
    const second = cards[1];
    if (!first) return 0;
    if (!second) return first.getBoundingClientRect().width;

    const r1 = first.getBoundingClientRect();
    const r2 = second.getBoundingClientRect();
    return Math.abs(r2.left - r1.left);
  };

  const applyCenterClass = () => {
    cards.forEach((c, i) => c.classList.toggle("is-center", i === centerIndex));
  };

  const render = () => {
    cards = Array.from(track.querySelectorAll(".testimonial-card"));
    if (cards.length === 0) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    applyCenterClass();

    const step = getCardStep();
    if (!step) return;

    const offsetCards = isMobile ? centerIndex : (centerIndex - 1);
    const offsetPx = Math.max(0, offsetCards) * step;

    track.style.transform = `translateX(${-offsetPx}px)`;
  };

  const goNext = () => {
    if (centerIndex < cards.length - 1) centerIndex++;
    else centerIndex = 0;
    render();
  };

  const goPrev = () => {
    if (centerIndex > 0) centerIndex--;
    else centerIndex = cards.length - 1;
    render();
  };

  if (next) next.addEventListener("click", goNext);
  if (prev) prev.addEventListener("click", goPrev);

  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;
  let touching = false;

  const SWIPE_THRESHOLD = 50;
  const VERTICAL_TOLERANCE = 30;

  viewport.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    dx = 0; dy = 0;
    touching = true;
  }, { passive: true });

  viewport.addEventListener("touchmove", (e) => {
    if (!touching) return;
    const t = e.touches[0];
    dx = t.clientX - startX;
    dy = t.clientY - startY;

    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > VERTICAL_TOLERANCE) {
      touching = false;
    }
  }, { passive: true });

  viewport.addEventListener("touchend", () => {
    if (!touching) return;
    touching = false;

    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    if (dx < 0) goNext();
    else goPrev();
  }, { passive: true });

  window.addEventListener("resize", () => {
    clearTimeout(window.__tResize);
    window.__tResize = setTimeout(render, 120);
  });

  const modal = document.getElementById("modalDepoimento");
  const modalTitle = document.getElementById("modalDepoTitulo");
  const modalText = document.getElementById("modalDepoTexto");

  const openModal = (title, text) => {
    if (!modal) return;
    modalTitle.textContent = title || "Depoimento";
    modalText.textContent = text || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  track.addEventListener("click", (e) => {
    const btn = e.target.closest(".t-more");
    if (!btn) return;

    const title = btn.getAttribute("data-title");
    const full = btn.getAttribute("data-full");
    openModal(title, full);
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.close === "true") closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  render();
})();

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".header-links .link-text");
  const sections = document.querySelectorAll("section, footer, main > section");

  const highlightMenu = () => {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        links.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });

    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 10) {
      links.forEach((link) => link.classList.remove("active"));
      const lastLink = document.querySelector('#link-text-contato');
      if (lastLink) lastLink.classList.add("active");
    }
  };

  window.addEventListener("scroll", highlightMenu);
  highlightMenu();
});


const formContato = document.getElementById("contatoForm");
const formStatus = document.getElementById("formStatus");
const btnSubmit = document.getElementById("btnSubmit");

if (formContato) {
  formContato.addEventListener("submit", async function (event) {
    event.preventDefault();

    const btnOriginalText = btnSubmit.textContent;
    btnSubmit.textContent = "Enviando...";
    btnSubmit.disabled = true;
    formStatus.textContent = "";

    const formData = new FormData(formContato);

    try {
      const response = await fetch(formContato.action, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.textContent = "Obrigado! Sua mensagem foi enviada com sucesso.";
        formStatus.className = "form-success";
        formContato.reset();
      } else {
        formStatus.textContent = "Oops! Houve um problema ao enviar, tente novamente.";
        formStatus.className = "form-error";
      }
    } catch (error) {
      formStatus.textContent = "Oops! Verifique sua conexão e tente novamente.";
      formStatus.className = "form-error";
    }

    btnSubmit.textContent = btnOriginalText;
    btnSubmit.disabled = false;
  });
}