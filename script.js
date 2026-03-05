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

document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const viewport = carousel.querySelector('.carousel-viewport');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot')) : [];

  if (!track || !viewport) return;

  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  const isMobileOnly = carousel.classList.contains('mobile-carousel');

  const autoplayTime = 4000;
  const pauseAfterClick = 10000;

  let intervalId = null;
  let pauseTimeoutId = null;
  let isAnimating = false;
  let currentIndex = 0;
  const useIndexMode = dots.length > 0;

  function isDesktopOff() {
    return isMobileOnly && window.innerWidth >= 768;
  }

  const setTransitionOn = () => {
    track.style.transition = 'transform 0.6s cubic-bezier(0.5, 0, 0.4, 1)';
  };

  const setTransitionOff = () => {
    track.style.transition = 'none';
  };

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function moveTo(index) {
    if (isDesktopOff() || isAnimating) return;
    currentIndex = index;
    setTransitionOn();
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
    isAnimating = true;
    track.addEventListener('transitionend', () => {
      isAnimating = false;
    }, { once: true });
  }

  function moveNext() {
    if (isDesktopOff()) {
      track.style.transform = 'none';
      return;
    }
    if (isAnimating) return;

    if (useIndexMode) {
      if (currentIndex < slides.length - 1) {
        moveTo(currentIndex + 1);
      } else {
        moveTo(0);
      }
      return;
    }

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
    if (isDesktopOff()) return;
    if (isAnimating) return;

    if (useIndexMode) {
      if (currentIndex > 0) {
        moveTo(currentIndex - 1);
      } else {
        moveTo(slides.length - 1);
      }
      return;
    }

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

  const nextBtns = carousel.querySelectorAll('.carousel-btn.next, .carousel-btn.next-mobile');
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moveNext();
      pauseAutoplay();
    });
  });

  const prevBtns = carousel.querySelectorAll('.carousel-btn.prev, .carousel-btn.prev-mobile');
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      movePrev();
      pauseAutoplay();
    });
  });

  if (useIndexMode) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (currentIndex !== index) {
          moveTo(index);
          pauseAutoplay();
        }
      });
    });
  }

  window.addEventListener('resize', () => {
    if (isDesktopOff()) {
      track.style.transform = 'none';
      stopAutoplay();
    } else {
      if (useIndexMode) track.style.transform = `translateX(-${currentIndex * 100}%)`;
      startAutoplay();
    }
  });

  if (!isDesktopOff()) {
    startAutoplay();
  } else {
    track.style.transform = 'none';
  }

  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let isTouching = false;
  const SWIPE_THRESHOLD = 50;
  const VERTICAL_TOLERANCE = 30;

  viewport.addEventListener('touchstart', (e) => {
    if (isDesktopOff() || isAnimating) return;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    deltaX = 0;
    deltaY = 0;
    isTouching = true;
    pauseAutoplay();
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!isTouching || isDesktopOff()) return;
    const t = e.touches[0];
    deltaX = t.clientX - startX;
    deltaY = t.clientY - startY;
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > VERTICAL_TOLERANCE) {
      isTouching = false;
    }
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (!isTouching || isDesktopOff()) return;
    isTouching = false;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (deltaX < 0) moveNext();
    else movePrev();
  }, { passive: true });
});


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

    const dotElems = carousel.querySelectorAll(".carousel-controls .dot");
    dotElems.forEach((d, i) => d.classList.toggle("active", i === centerIndex));
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

  const allNext = carousel.querySelectorAll(".t-btn.next, .carousel-btn.next-mobile");
  const allPrev = carousel.querySelectorAll(".t-btn.prev, .carousel-btn.prev-mobile");

  allNext.forEach(b => b.addEventListener("click", goNext));
  allPrev.forEach(b => b.addEventListener("click", goPrev));

  const dots = carousel.querySelectorAll(".carousel-controls .dot");
  dots.forEach((d, i) => d.addEventListener("click", () => {
    centerIndex = i;
    render();
  }));

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