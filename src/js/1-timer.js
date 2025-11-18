
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Змінна для збереження обраної дати
let userSelectedDate = null;

const startBtn = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

// На початку кнопка неактивна
startBtn.disabled = true;

// Функція для форматування числа (додавання нуля на початку)
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для перетворення мілісекунд на об'єкт часу
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для оновлення інтерфейсу таймера
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

// Опції для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    // Перевірка: дата в майбутньому чи в минулому
    if (selectedDate <= now) {
      userSelectedDate = null;
      startBtn.disabled = true;
      iziToast.show({
        title: 'Error',
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
      });
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

// Обробник кліку на кнопку Start
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  // Деактивуємо кнопку і інпут
  startBtn.disabled = true;
  datetimePicker.disabled = true;

  // Запускаємо таймер
  const timerId = setInterval(() => {
    const now = new Date();
    const timeDifference = userSelectedDate - now;

    // Якщо час вичерпався
    if (timeDifference <= 0) {
      clearInterval(timerId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false;
      return;
    }

    // Розраховуємо залишок часу
    const timeRemaining = convertMs(timeDifference);
    updateTimerDisplay(timeRemaining);
  }, 1000);

  // Виконуємо розрахунок одразу при старті
  const initialDifference = userSelectedDate - new Date();
  const initialTime = convertMs(initialDifference);
  updateTimerDisplay(initialTime);
});
