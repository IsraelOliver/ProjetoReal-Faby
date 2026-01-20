const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.header-links');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});