const iconClose = document.getElementById('iconClose');
const iconOpen = document.getElementById('iconOpen');
const mainMenu = document.getElementById('mainMenu');
const mainHeader = document.getElementById('mainHeader');

iconOpen.addEventListener('click', () => {
    mainMenu.classList.toggle('menu-open');
    mainHeader.classList.toggle('d-none');
})

iconClose.addEventListener('click', () => {
    mainMenu.classList.remove('menu-open');
    mainHeader.classList.remove('d-none');
})


