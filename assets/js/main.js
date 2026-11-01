/* burger menu */
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

/* modal window */
const btnReservation = document.getElementById('btnReservation');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');

if (modal && btnReservation && closeModal) {
    btnReservation.addEventListener('click', () => modal.classList.remove('d-none'));
    closeModal.addEventListener('click', () => modal.classList.add('d-none'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('d-none');
    });
}

/* block animation */
const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', reveal);
function reveal() {
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const visible = 150;

        if (elementTop < windowHeight - visible) {
            element.classList.add('active');
        }
    });
}
reveal();


// Slider
const rewiews = document.querySelectorAll('.rewiew-item');
const rewiewsWrap = document.querySelector('.reviews-wrap');

let rewiewIndex = 0;

function show(index) {
    rewiews.forEach((rewiew) => {
        rewiew.classList.remove('active');
    });

    rewiews[index].classList.add('active');

    const counter = rewiews[index].querySelector('.scroll-wrap span');
    counter.textContent = `${index + 1} / ${rewiews.length}`;

    rewiewIndex = index;
}

rewiewsWrap.addEventListener('click', (event) => {
    const button = event.target.closest('.prev, .next');
    if (!button) {
        return;
    }

    if (button.classList.contains('prev')) {
        let index = rewiewIndex - 1;
        if (index < 0) {
            index = rewiews.length - 1;
        }
        show(index);
    }

    if (button.classList.contains('next')) {
        let index = rewiewIndex + 1;
        if (index >= rewiews.length) {
            index = 0;
        }
        show(index);
    }
});

show(rewiewIndex);

const dishes = [
    {
        name: "Філе тріски з овочами на пару",
        price: 320,
        description: "Ніжне філе тріски, приготоване на пару з сезонними овочами та лимонним соусом"
    },
    {
        name: "Стейк з травами та вершковим маслом",
        price: 480,
        description: "Соковитий стейк з розмарином та чебрецем, поданий з запеченими овочами"
    },
    {
        name: "Салат з огірків та авокадо",
        price: 210,
        description: "Свіжий салат з огірків, авокадо та м'яти з легкою заправкою на основі оливкової олії"
    },
    {
        name: "Добірка натуральних вин",
        price: 890,
        description: "Ексклюзивна підбірка органічних вин від найкращих виноробень України та Європи"
    }
];

const menuDishes = document.querySelector("#menuDishes");

dishes.forEach((dish) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");

    const price = document.createElement("span");
    price.textContent = `₴${dish.price}`;

    const line = document.createElement("hr");
    const name = document.createElement("h3");
    name.textContent = dish.name;
    const description = document.createElement("p");
    description.textContent = dish.description;
    menuItem.append(price, line, name, description);
    menuDishes.append(menuItem);
});


