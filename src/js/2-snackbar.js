// Імпорт iziToast
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримуємо елемент форми
const form = document.querySelector('.form');

// Обробник сабміту форми
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Отримуємо дані з форми
    const delay = Number(form.elements.delay.value);
    const state = form.elements.state.value;

    // Створюємо проміс
    const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (state === 'fulfilled') {
        resolve(delay);
        } else {
        reject(delay);
        }
    }, delay);
    });

    // Обробляємо проміс
    promise
    .then((delayValue) => {
        console.log(`✅ Fulfilled promise in ${delayValue}ms`);
        iziToast.show({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delayValue}ms`,
        color: 'green',
        position: 'topRight',
        });
    })
    .catch((delayValue) => {
        console.log(`❌ Rejected promise in ${delayValue}ms`);
        iziToast.show({
        title: 'Error',
        message: `❌ Rejected promise in ${delayValue}ms`,
        color: 'red',
        position: 'topRight',
        });
    });

    // Очищаємо форму
    form.reset();
});
