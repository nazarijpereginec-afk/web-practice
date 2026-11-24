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

const btnReservation = document.getElementById('btnReservation');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const modalForm = document.getElementById('modalForm');
const modalStatus = document.getElementById('modalStatus');
const quickForm = document.getElementById('reservationForm');
let pendingReservation = {};

if (modal && btnReservation && closeModal && modalForm) {
    const openModal = (details = {}) => {
        pendingReservation = details;
        modal.classList.remove('d-none');
    };

    const hideModal = () => {
        modal.classList.add('d-none');
        modalStatus.textContent = '';
    };

    btnReservation.addEventListener('click', () => openModal());
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

    if (quickForm) {
        quickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!quickForm.checkValidity()) {
                quickForm.reportValidity();
                return;
            }
            const { date, time, guests } = Object.fromEntries(new FormData(quickForm));
            openModal({ date, time, guests });
        });
    }

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
                reservation_date: pendingReservation.date || null,
                reservation_time: pendingReservation.time || null,
                guests: pendingReservation.guests ? Number(pendingReservation.guests) : null,
            });
            pendingReservation = {};
            modalStatus.textContent = 'Дякуємо! Ваше бронювання прийнято.';
            modalForm.reset();
            quickForm?.reset();
            setTimeout(hideModal, 2000);
        } catch (error) {
            console.error('Помилка бронювання:', error);
            modalStatus.textContent = 'Не вдалося надіслати заявку. Спробуйте пізніше.';
        } finally {
            submitButton.disabled = false;
        }
    });
}

const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        const data = Object.fromEntries(new FormData(contactForm));
        const submitButton = contactForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        contactStatus.textContent = 'Надсилання...';

        try {
            await createReservation({
                name: `${data.firstName} ${data.lastName}`.trim(),
                email: data.email.trim(),
                phone: data.phone.trim(),
                reservation_date: data.date || null,
                reservation_time: data.time || null,
                guests: data.guests ? Number(data.guests) : null,
            });
            contactStatus.textContent = 'Дякуємо! Ваше бронювання прийнято.';
            contactForm.reset();
        } catch (error) {
            console.error('Помилка бронювання:', error);
            contactStatus.textContent = 'Не вдалося надіслати заявку. Спробуйте пізніше.';
        } finally {
            submitButton.disabled = false;
        }
    });
}

const pad = (n) => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = today;
});


const subscribeForm = document.querySelector('.subscribe-form');
const subscribeStatus = document.getElementById('subscribeStatus');

if (subscribeForm && subscribeStatus && db) {
    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = new FormData(subscribeForm).get('email').trim();
        const { error } = await db.from('subscribers').insert({ email });

        if (!error) {
            subscribeStatus.textContent = 'Дякуємо за підписку!';
            subscribeForm.reset();
        } else if (error.code === '23505') {
            subscribeStatus.textContent = 'Цей email уже підписаний.';
        } else {
            console.error('Помилка підписки:', error);
            subscribeStatus.textContent = 'Не вдалося оформити підписку.';
        }
    });
}

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