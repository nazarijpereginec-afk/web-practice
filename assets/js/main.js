/* burger menu */
const iconClose = document.getElementById('iconClose');
const iconOpen = document.getElementById('iconOpen');
const mainMenu = document.getElementById('mainMenu');
const mainHeader = document.getElementById('mainHeader');
const main = document.getElementById('main');
const footer = document.getElementById('footer');

function toggleMenu(isOpen) {
    mainMenu.classList.toggle('menu-open', isOpen);
    [mainHeader, main, footer].forEach((element) => {
        element?.classList.toggle('d-none', isOpen);
    });
}

if (iconOpen && iconClose && mainMenu) {
    iconOpen.addEventListener('click', () => toggleMenu(true));
    iconClose.addEventListener('click', () => toggleMenu(false));
}

/* supabase */
const SUPABASE_URL = 'https://qxamjnougwnwjankqdoy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YW1qbm91Z3dud2phbmtxZG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNjcxMzIsImV4cCI6MjExMDg0MzEzMn0.T_WTViX7STARqaK2cu7cxmvkqrfNOgskjlgQ7F0O5go';
const db = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

async function createReservation(payload) {
    if (!db) {
        throw new Error('Supabase не підключено');
    }
    const { error } = await db.from('reservations').insert(payload);
    if (error) {
        throw error;
    }
}

/* modal window */
const btnReservation = document.getElementById('btnReservation');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const modalForm = document.getElementById('modalForm');
const modalStatus = document.getElementById('modalStatus');

if (modal && btnReservation && closeModal && modalForm) {
    const hideModal = () => {
        modal.classList.add('d-none');
        modalStatus.textContent = '';
    };

    btnReservation.addEventListener('click', () => {
        modal.classList.remove('d-none');
    });

    closeModal.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal();
        }
    });

    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = modalForm.querySelector('button[type="submit"]');
        const formData = Object.fromEntries(new FormData(modalForm));

        submitButton.disabled = true;
        modalStatus.textContent = 'Надсилання...';

        try {
            await createReservation({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
            });
            modalStatus.textContent = 'Дякуємо! Ваше бронювання прийнято.';
            modalForm.reset();
            setTimeout(hideModal, 2000);
        } catch (error) {
            console.error('Помилка бронювання:', error);
            modalStatus.textContent = 'Не вдалося надіслати заявку. Спробуйте пізніше.';
        } finally {
            submitButton.disabled = false;
        }
    });
}

/* block animation */
const reveals = document.querySelectorAll('.reveal');

function reveal() {
    const windowHeight = window.innerHeight;
    const visible = 150;

    reveals.forEach((element) => {
        if (element.getBoundingClientRect().top < windowHeight - visible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal();

/* slider */
const rewiews = document.querySelectorAll('.rewiew-item');
const rewiewsWrap = document.querySelector('.reviews-wrap');
let rewiewIndex = 0;

function show(index) {
    rewiews.forEach((rewiew) => rewiew.classList.remove('active'));
    rewiews[index].classList.add('active');

    const counter = rewiews[index].querySelector('.scroll-wrap span');
    counter.textContent = `${index + 1} / ${rewiews.length}`;

    rewiewIndex = index;
}

if (rewiewsWrap && rewiews.length > 0) {
    rewiewsWrap.addEventListener('click', (event) => {
        const button = event.target.closest('.prev, .next');
        if (!button) {
            return;
        }

        const step = button.classList.contains('next') ? 1 : -1;
        show((rewiewIndex + step + rewiews.length) % rewiews.length);
    });

    show(rewiewIndex);
}

/* dishes from database */
async function loadDishes() {
    const menuDishes = document.querySelector('#menuDishes');
    const menuStatus = document.querySelector('#menuStatus');
    if (!menuDishes || !menuStatus) {
        return;
    }

    try {
        if (!db) {
            throw new Error('Supabase не підключено');
        }
        menuStatus.textContent = 'Завантаження страв...';

        const { data: dishes, error } = await db
            .from('menu_items')
            .select('id, name, description, price')
            .order('id');

        if (error) {
            throw error;
        }

        if (!dishes || dishes.length === 0) {
            menuStatus.textContent = 'Наразі страв немає.';
            return;
        }

        menuDishes.innerHTML = '';
        dishes.forEach((dish) => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');

            const price = document.createElement('span');
            price.textContent = `₴${dish.price}`;

            const name = document.createElement('h3');
            name.textContent = dish.name;

            const description = document.createElement('p');
            description.textContent = dish.description;

            menuItem.append(price, document.createElement('hr'), name, description);
            menuDishes.append(menuItem);
        });
        menuStatus.textContent = '';
    } catch (error) {
        console.error('Помилка завантаження страв:', error);
        menuStatus.textContent = 'Не вдалося завантажити меню. Спробуйте оновити сторінку.';
    }
}

loadDishes();