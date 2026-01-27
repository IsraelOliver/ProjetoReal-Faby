const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.header-links');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

const btn = document.getElementById("curriculo_sobre");
const sobre = document.getElementById("sobre");

btn.addEventListener("click", function (e) {
  e.preventDefault();

  const expandido = sobre.classList.contains("expandido");

  if (!expandido) {
    sobre.classList.add("expandido");
    btn.textContent = "Ver menos <";
  } else {
    sobre.classList.remove("expandido");
    btn.textContent = "Ver currículo completo >";

    setTimeout(() => {
      sobre.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 300);
  }
});

const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

const autoplayTime = 4000;
const pauseAfterClick = 10000;

let interval = null;
let isAnimating = false;

function moveNext() {
  if (isAnimating) return;
  isAnimating = true;

  const firstSlide = track.firstElementChild;

  track.style.transform = 'translateX(-100%)';

  track.addEventListener('transitionend', () => {
    track.style.transition = 'none';
    track.appendChild(firstSlide);
    track.style.transform = 'translateX(0)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition = 'transform 0.6s cubic-bezier(0.5, 0, 0.4, 1)';
        isAnimating = false;
      });
    });
  }, { once: true });
}


function movePrev() {
  if (isAnimating) return;
  isAnimating = true;

  const lastSlide = track.lastElementChild;

  track.style.transition = 'none';
  track.prepend(lastSlide);
  track.style.transform = 'translateX(-100%)';

  requestAnimationFrame(() => {
    track.style.transition = 'transform 0.6s cubic-bezier(0.5, 0, 0.4, 1)';
    track.style.transform = 'translateX(0)';
  });

  track.addEventListener('transitionend', () => {
    isAnimating = false;
  }, { once: true });
}

function startAutoplay() {
  interval = setInterval(moveNext, autoplayTime);
}

function pauseAutoplay() {
  clearInterval(interval);
  setTimeout(startAutoplay, pauseAfterClick);
}

nextBtn.addEventListener('click', () => {
  moveNext();
  pauseAutoplay();
});

prevBtn.addEventListener('click', () => {
  movePrev();
  pauseAutoplay();
});

startAutoplay();

const viewport = document.querySelector('.carousel-viewport');

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
    return;
  }

}, { passive: true });

viewport.addEventListener('touchend', () => {
  if (!isTouching) return;
  isTouching = false;

  if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

  if (deltaX < 0) moveNext();

  else movePrev();
}, { passive: true });