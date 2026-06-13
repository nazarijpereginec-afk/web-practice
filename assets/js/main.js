const iconClose = document.getElementById('iconClose');
const iconOpen = document.getElementById('iconOpen');
const mainMenu = document.getElementById('mainMenu');
const mainHeader = document.getElementById('mainHeader');
const main = document.getElementById('main');
const footer = document.getElementById('footer');


iconOpen.addEventListener('click', () => {
    mainMenu.classList.toggle('menu-open');
    mainHeader.classList.toggle('d-none');
    main.classList.toggle('d-none');
    footer.classList.toggle('d-none');
})

iconClose.addEventListener('click', () => {
    mainMenu.classList.remove('menu-open');
    mainHeader.classList.remove('d-none');
    main.classList.remove('d-none');
    footer.classList.remove('d-none');
})
