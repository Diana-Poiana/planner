import { db, set, get, ref, dbref, child } from './firebaseConfig.js';

// calendar
const currentDate = document.querySelector('.calendar__current-month');
const days = document.querySelector('.calendar__days');
const calendarPrevBtn = document.querySelector('.calendar__prev-btn');
const calendarNextBtn = document.querySelector('.calendar__next-btn');
let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// add new weekly pin 
const addPinForAnyDate = document.querySelector('.weekly-task__add-task-btn');
const modalWindow = document.querySelector('.modal-window');
const modalWindowForm = document.querySelector('.modal-window__form');
const closeModalWindowBtn = document.querySelector('.modal-window__widget-close-btn');
const weeklyTask = document.querySelector('.weekly-task');
const currentTask = document.querySelector('.current-task');
const generalInfo = document.querySelector('.general-info');
const weeklyTaskList = document.querySelector('.weekly-task__list');

// add new todays pin
const addPinForToday = document.querySelector('.current-task__add-task-btn');
const todaysTaskList = document.querySelector('.current-task__list');

// weather widget
const weatherApiKey = '747d5a826a76fbbd512ae861950e695f';
const weatherApiAdress = 'https://api.openweathermap.org/data/2.5/weather?';
const timeValueEl = document.querySelector('.general-info__local-time');
const weatherInfoBlock = document.querySelector('.general-info__weather-info');
const weatherIconEl = document.querySelector('.general-info__weather-icon');
const weatherDescriptionEl = document.querySelector('.general-info__weather-description');
const modalWindowSubmitBtn = document.querySelector('.modal-window__btn');
const modalWindowSubtitle = document.querySelector('.modal-window__subtitle');
const weatherBtn = document.querySelector('.widget-burger-btn');
const weatherAdditionalInfo = document.querySelector('.general-info__additional-weather-info');

// emoji scrolling
const prevEmojiBtn = document.querySelector('.modal-window__emoji-btn-prev');
const nextEmojiBtn = document.querySelector('.modal-window__emoji-btn-next');
const emojisContainer = document.querySelector('.modal-window__emojis-wrapper');

// add weekly pin
const allInputs = document.querySelectorAll('.modal-window__input');
const allEmojis = document.querySelectorAll('.modal-window__emoji');
const emojiWrapper = document.querySelector('.modal-window__emojis-wrapper');

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const currentDateEl = document.querySelector('.current-task__date');
const prevDate = document.querySelector('.current-task__prev-btn');
const nextDate = document.querySelector('.current-task__next-btn');

const currentListTitle = document.querySelector('.current-task__title');
const newsBlock = document.querySelector('.general-info__news-block');
const newsBlockBtn = document.querySelector('.general-info__close-btn');
const greetingDeskBlock = document.querySelector('.general-info__profile-name');
const greetingMobBlock = document.querySelector('.header__profile-name');

// weather widget
const humidityInfo = document.querySelector('.general-info__humidity');
const tempInfo = document.querySelector('.general-info__temp');
const windInfo = document.querySelector('.general-info__wind-speed');

// loaders
const weatherLoader = document.querySelector('.weather__loader');
const weeklyTaskLoader = document.querySelector('.weekly-task__loader');
const currentTaskLoader = document.querySelector('.current-task__loader');

// menu
const menuBtn = document.querySelector('.header__profile-image-container');
const generalInfoBlock = document.querySelector('.general-info');

let scrolledPx = 0;
const deadlineInput = document.querySelector('.modal-window__deadline-date');
const body = document.querySelector('body');

const today = new Date();
let dateToFetch = new Date();
let monthToFetch = dateToFetch.getMonth();
let dayOfWeek = dateToFetch.getDay();
let dateOfToday = dateToFetch.getDate();

currentDateEl.textContent = `${daysOfWeek[dayOfWeek]} ${dateOfToday}`;

// FUNCTIONS

function greetUser() {
  const userInfoString = sessionStorage.getItem('user-creds');
  const userInfo = JSON.parse(userInfoString);
  const userEmail = userInfo.email;
  const userEmailParts = userEmail.split('@');
  const name = userEmailParts[0].charAt(0).toUpperCase() + userEmailParts[0].slice(1);

  if (sessionStorage.getItem('user-creds')) {
    greetingDeskBlock.textContent = `${name}`;
    greetingMobBlock.textContent = `${name}`;
  }
}

function celebrate() {
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 },
  });
}

function closeNewsBlock() {
  newsBlock.style.display = 'none';
  localStorage.setItem('newsBlock', 'hidden');
}

function checkUserPreferencesAboutNewsBlock() {
  if (localStorage.getItem('newsBlock') === 'hidden') {
    newsBlock.style.display = 'none';
  }
}

function addActiveClass(e) {
  allEmojis.forEach((emoji) => {
    if (emoji === e.target) {
      e.target.parentNode.classList.add('active');
    } else {
      emoji.parentNode.classList.remove('active');
    }
  })
}

function openModalWindow() {
  modalWindowForm.style.top = scrolledPx + 100 + 'px';
  modalWindow.style.display = '';
  body.style.overflow = 'hidden';
  weeklyTask.style.filter = 'blur(5px)';
  currentTask.style.filter = 'blur(5px)';
  generalInfo.style.filter = 'blur(5px)';

  if (localStorage.getItem('list') === 'weeklyTaskList') {
    modalWindowSubtitle.textContent = 'Add new weekly pin';
    deadlineInput.type = 'date';
    deadlineInput.readOnly = false;
  } else if (localStorage.getItem('list') === 'todaysTaskList') {
    modalWindowSubtitle.textContent = 'Add new pin for today';
    const today = new Date();
    deadlineInput.type = 'text';
    deadlineInput.readOnly = true;
    const month = today.getMonth();
    const date = today.getDate();
    const year = today.getFullYear();
    deadlineInput.value = `${months[month]} ${date}, ${year}`;
  }
}

function closeModalWindow() {
  modalWindow.style.display = 'none';
  weeklyTask.style.filter = 'none';
  currentTask.style.filter = 'none';
  generalInfo.style.filter = 'none';
  body.style.overflow = '';
  allInputs.forEach(input => input.value = '');
}

function changeListTitle(dateToCheck) {
  const today = new Date();
  const currentDate = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());

  if (currentDate.toDateString() === today.toDateString()) {
    currentListTitle.textContent = "Today's schedule";
  } else if (currentDate < today || currentDate > today) {
    currentListTitle.textContent = "Your schedule for";
  }
}

function addPinToList() {
  const inputsValues = {};

  allInputs.forEach((input) => {
    let inputName = input.getAttribute('name');
    let inputValue = input.value;
    inputsValues[inputName] = inputValue;
    console.log(inputsValues);
  });

  if (localStorage.getItem('list') === 'todaysTaskList') {
    const today = new Date();
    const year = today.getFullYear();
    const monthNumber = today.getMonth();
    const month = months[monthNumber];
    const date = today.getDate().toString().padStart(2, '0');
    inputsValues['deadlineDate'] = `${year}-${monthNumber + 1}-${date}`;
  }
  console.log(inputsValues);

  inputsValues['emojiSrc'] = localStorage.getItem('emoji');

  if (localStorage.getItem('list') === 'weeklyTaskList' && (inputsValues.taskName === '' || inputsValues.deadlineDate === '' || !localStorage.getItem('emoji'))) {
    alert('Please enter a name, a date, an emoji for your task');
  } else if (localStorage.getItem('list') === 'todaysTaskList' && (inputsValues.taskName === '' || !localStorage.getItem('emoji'))) {
    alert('Please enter a name, an emoji for your task');
  } else {
    closeModalWindow();
    savePinToDatabase(inputsValues);
    localStorage.removeItem('emoji');
    localStorage.removeItem('list');
  }
}

function populateNewPin(data) {

  if (data.length === 0) {
    let newPin = `
      <li li class="current-task__no-item" >
        No tasks for this date
      </li >
      `;

    todaysTaskList.insertAdjacentHTML('beforeend', newPin);
  } else {

    data.forEach((note) => {
      const deadlineTime = note.noteContent.deadlineTime;
      const taskName = note.noteContent.taskName;
      const taskNote = note.noteContent.taskNote;
      const taskLabel = note.noteContent.taskLabel;
      const emojiSrc = note.noteContent.emojiSrc;

      let newPin = `
      <li li class="current-task__item" >
        <div class="current-task__img-container">
          <img class="current-task__task-img" src="${emojiSrc}" alt="emoji">
        </div>

        <div class="current-task__task-content">
          <h3 class="current-task__task-subtitle">
            ${taskName}
          </h3>
          ${taskLabel ? `
          <span class="current-task__task-label">
            ${taskLabel}
          </span>
          ` : ''}

          ${taskNote ? `
          <p class="current-task__task-notes">
            ${taskNote}
          </p>
          ` : ''}
        </div>

        ${deadlineTime ? `
        <p class="current-task__task-deadline">
          ${deadlineTime}
        </p>
        ` : ''
        }
      </li >
      `;

      todaysTaskList.insertAdjacentHTML('beforeend', newPin);

      // Select the newly created pin
      const newPinElement = todaysTaskList.lastElementChild;

      // Attach event listener to the new pin
      newPinElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('checked')) {
          e.target.classList.remove('checked');
        } else {
          e.target.classList.add('checked');
          celebrate();
        }
      });



    })

  }
}

function populateWeeklyPinList(data) {
  const deadlineDatesArr = [];
  let index = 0;

  if (data.length === 0) {
    let newPin = `
      <li li class="weekly-task__no-item" >
        No tasks for this month
      </li >
      `;

    weeklyTaskList.insertAdjacentHTML('beforeend', newPin);
  }
  data.forEach((note) => {
    const newPinContent = Object.entries(note);
    newPinContent.forEach((pin) => {
      const noteContent = pin[1].noteContent;
      const deadlineDate = noteContent.deadlineDate;
      const deadlineTime = noteContent.deadlineTime;
      const emojiSrc = noteContent.emojiSrc;
      const taskLabel = noteContent.taskLabel;
      const taskName = noteContent.taskName;
      const taskNote = noteContent.taskNote;

      let parts = deadlineDate.split('-');
      let day = parts[2];

      if (day < 10) {
        day = day.replace(/^0/, '');
      }

      let month = months[+parts[1] - 1];
      let year = parts[0];

      deadlineDatesArr.push(`${month}, ${day}, ${year}`);

      const todaysYear = today.getFullYear();
      const todaysMonthNumber = today.getMonth();
      const todaysMonth = months[todaysMonthNumber];
      const todaysDate = today.getDate().toString().padStart(2, '0');

      if (`${day} ${month} ${year}` === `${todaysDate} ${todaysMonth} ${todaysYear}`) {
        return;
      } else {
        let newPin = `
        <li li class= "widgets__item" >
      <div class="widgets__img-container">
        <img class="widgets__task-img" src="${emojiSrc}" alt="emoji">
      </div>
      <div class="widgets__task-content">
      <h3 class="widgets__task-subtitle">
        ${taskName}
      </h3>

      <div class="widgets__task-text">
        ${deadlineDate && deadlineTime ? `
          <p class="widgets__task-deadline-date">
            ${day} ${month} ${year}
          </p>
          &nbsp;
          -
          &nbsp;
          <p class="widgets__task-deadline-time">
            ${deadlineTime}
          </p>
        ` : `
          <p class="widgets__task-deadline-date">
            ${day} ${month} ${year}
          </p>

        `}
        </div>
        ${taskLabel ? `
          <span class="widgets__task-label">
            ${taskLabel}
          </span>
        ` : ''}

        ${taskNote ? `
        <p class="widgets__task-notes">
          ${taskNote}
        </p>
        ` : ''}
      </div>
    </li >
        `;

        weeklyTaskList.insertAdjacentHTML('beforeend', newPin);
        index++;
      }
    });
  });

  const btnContainer = document.querySelector('.weekly-task__add-widget');

  if (index === 0 || index === 1) {
    weeklyTaskList.style.overflowY = 'scroll';
    weeklyTaskList.style.height = '';
    btnContainer.style.marginTop = 30 + 'px';
  }

  if (index > 2) {
    weeklyTaskList.style.overflowY = 'scroll';
    weeklyTaskList.style.height = 420 + 'px';
    btnContainer.style.marginTop = 50 + 'px';
  }

  checkForEvents(deadlineDatesArr);
}

function checkForEvents(eventsArr) {
  const daysOfCalendar = document.querySelectorAll('.calendar__day');

  for (let j = 0; j < daysOfCalendar.length; j++) {
    const day = daysOfCalendar[j];
    for (let i = 0; i < eventsArr.length; i++) {
      if (eventsArr[i] === day.id && !(day.classList.contains('calendar__day--current-day'))) {
        day.classList.add('calendar__day--event-day');
      }
    }
  }
}

function minusOneDay() {
  dateToFetch.setDate(dateToFetch.getDate() - 1);
  updateDateAndFetchData(dateToFetch);
  return dateToFetch;
}

function plusOneDay() {
  dateToFetch.setDate(dateToFetch.getDate() + 1);
  updateDateAndFetchData(dateToFetch);
  return dateToFetch;
}

function setTheDateByClick(dateToFetch) {
  updateDateAndFetchData(dateToFetch);
  return dateToFetch;
}

function updateDateAndFetchData(dayRequested) {
  dayOfWeek = dayRequested.getDay();
  dateOfToday = dayRequested.getDate();
  currentDateEl.textContent = `${daysOfWeek[dayOfWeek]} ${dateOfToday}`;
  dateToFetch = dayRequested;

  const dayToCheck = dayRequested.getDate();
  const monthToCheck = dayRequested.getMonth();
  const yearToCheck = dayRequested.getFullYear();

  console.log(months[monthToCheck], dayToCheck, yearToCheck);

  const daysOfCalendar = document.querySelectorAll('.calendar__day');

  daysOfCalendar.forEach((item) => {
    item.classList.remove('calendar__day--chosen-day');

    if (item.id === `${months[monthToCheck]}, ${dayToCheck}, ${yearToCheck}`) {
      item.classList.add('calendar__day--chosen-day');
      console.log(item.id);
    }
  })
  return dateToFetch;
}

function savePinToDatabase(data) {
  const userCreds = JSON.parse(sessionStorage.getItem('user-creds'));
  const userID = userCreds.uid;
  console.log(data.taskName);
  let parts = data.deadlineDate.split('-');
  let day = parts[2];
  let month = months[+parts[1] - 1];
  let year = parts[0];

  const pinRef = ref(db, 'users/' + userID + '/' + year + '/' + month + '/' + day + '/' + data.taskName);

  set(pinRef, {
    noteContent: data
  });
}

// fetch all pins for the date
function fetchPinsForTheDate(date) {
  currentTaskLoader.style.display = 'flex';

  const year = date.getFullYear();
  const monthNumber = date.getMonth();
  const month = months[monthNumber];
  const day = date.getDate().toString().padStart(2, '0');

  const userCreds = JSON.parse(sessionStorage.getItem('user-creds'));
  const userID = userCreds.uid;

  return new Promise((resolve, reject) => {
    get(child(dbref, 'users/' + userID + '/' + year + '/' + month + '/' + day))
      .then(snapshot => {
        const userDataFromFirebase = [];
        snapshot.forEach(childSnapshot => {
          userDataFromFirebase.push(childSnapshot.val());
        });
        resolve(userDataFromFirebase);
        currentTaskLoader.style.display = 'none';
      })
      .catch(error => {
        console.error('Error fetching pins from database:', error);
        reject(error);
      });
  });
}

fetchPinsForTheDate(dateToFetch)
  .then(userDataFromFirebase => {
    populateNewPin(userDataFromFirebase);
  })
  .catch(error => {
    console.error(error);
  });

// fetch all pins for the month
function fetchPinsForCurrentMonth(monthToFetch) {
  weeklyTaskLoader.style.display = 'flex';

  const year = date.getFullYear();
  const monthNumber = date.getMonth();
  const month = months[monthToFetch];
  const userCreds = JSON.parse(sessionStorage.getItem('user-creds'));
  const userID = userCreds.uid;

  return new Promise((resolve, reject) => {

    get(child(dbref, 'users/' + userID + '/' + year + '/' + month))
      .then(snapshot => {
        const userNotesForMonth = [];
        snapshot.forEach(childSnapshot => {
          userNotesForMonth.push(childSnapshot.val());
        });
        resolve(userNotesForMonth);
        weeklyTaskLoader.style.display = 'none';
      })
      .catch(error => {
        console.error('Error fetching pins from database:', error);
        reject(error);
      });
  });
}

fetchPinsForCurrentMonth(monthToFetch)
  .then(userNotesForMonth => {
    populateWeeklyPinList(userNotesForMonth);
  })
  .catch(error => {
    console.error(error);
  });

function fetchPrevMonthPins() {
  monthToFetch = monthToFetch - 1;

  fetchPinsForCurrentMonth(monthToFetch)
    .then(userNotesForMonth => {
      populateWeeklyPinList(userNotesForMonth);
    })
    .catch(error => {
      console.error(error);
    });
}

function fetchNextMonthPins() {
  monthToFetch = monthToFetch + 1;

  fetchPinsForCurrentMonth(monthToFetch)
    .then(userNotesForMonth => {
      populateWeeklyPinList(userNotesForMonth);
    })
    .catch(error => {
      console.error(error);
    });
}

// calendar

function renderCalendar() {
  let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  let lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let lastDayOfMonth = new Date(currentYear, currentMonth, lastDateOfMonth).getDay();
  let lastDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();
  let liTag = '';

  // creating li of previous month last days
  for (let i = firstDayOfMonth; i > 0; i--) {
    let prevMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Check if current month is January
    let prevYear = currentMonth === 0 ? currentYear - 1 : currentYear; // Adjust year accordingly
    liTag += `<li li class= "calendar__day" id = "${months[prevMonth]}, ${lastDateOfLastMonth - i + 1}, ${prevYear}" > ${lastDateOfLastMonth - i + 1}</li > `;
  }

  //  creating li of all days of current month
  for (let i = 1; i <= lastDateOfMonth; i++) {
    let today = '';
    if (i === date.getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
      today = 'calendar__day--current-day';
    }
    liTag += `<li li class= "calendar__day ${today}" id = "${months[currentMonth]}, ${i}, ${currentYear}" > ${i}</li > `;

  }

  // creating li of next month first days
  for (let i = lastDayOfMonth; i < 6; i++) {
    let nextMonth = currentMonth === 11 ? 0 : currentMonth + 1; // Check if current month is December
    let nextYear = currentMonth === 11 ? currentYear + 1 : currentYear; // Adjust year accordingly
    liTag += `<li li class= "calendar__day" id = "${months[nextMonth]}, ${i - lastDayOfMonth + 1}, ${nextYear}" > ${i - lastDayOfMonth + 1}</li > `;
  }

  currentDate.innerText = `${months[currentMonth]}, ${currentYear}`;
  days.innerHTML = liTag;

  checkCalendarDateClicked();
}

function checkCalendarDateClicked() {
  const daysOfCalendar = document.querySelectorAll('.calendar__day');
  let clickedDay = '';

  daysOfCalendar.forEach((day) => {
    day.addEventListener('click', (e) => {
      clickedDay = e.target;

      daysOfCalendar.forEach((day) => {
        day.classList.remove('calendar__day--chosen-day');
      });

      clickedDay.classList.add('calendar__day--chosen-day');

      let clickedDateparts = clickedDay.id.split(', ');
      let one = clickedDateparts[0];
      let two = clickedDateparts[1];
      let three = clickedDateparts[2];

      let newDateToFetch = formatDateToFullDate(three, one, two);

      fetchPinsForTheDate(new Date(newDateToFetch))
        .then(userDataFromFirebase => {
          todaysTaskList.innerHTML = '';
          setTheDateByClick(newDateToFetch);
          changeListTitle(newDateToFetch);
          populateNewPin(userDataFromFirebase);
        })
        .catch(error => {
          console.error(error);
        });
    });
  });
}

function formatDateToFullDate(year, monthName, day) {
  const monthNumber = new Date(Date.parse(monthName + ' ' + day + ', ' + year)).getMonth() + 1;
  return new Date(`${year}-${monthNumber}-${day}`);
}

function updateAllLists() {
  todaysTaskList.innerHTML = '';
  weeklyTaskList.innerHTML = '';

  fetchPinsForTheDate(dateToFetch)
    .then(userDataFromFirebase => {
      populateNewPin(userDataFromFirebase);
    })
    .catch(error => {
      console.error(error);
    });

  fetchPinsForCurrentMonth(monthToFetch)
    .then(userNotesForMonth => {
      populateWeeklyPinList(userNotesForMonth);
    })
    .catch(error => {
      console.error(error);
    });
}

// weather widget
function getUserGeoPosition() {
  weatherLoader.style.display = 'flex';
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const { latitude: lat, longitude: lon } = coords;
    getWeatherInfo(lat, lon);
  },
    error => {
      console.error('Error getting geolocation:', error);
      setInterval(populateTimeBlock, 1000);
      weatherInfoBlock.style.display = '';
      weatherIconEl.style.display = 'none';
      weatherDescriptionEl.textContent = 'Geolocation is not available';
      weatherLoader.style.display = 'none';
    }
  );
}

function getWeatherInfo(lat, lon) {

  fetch(`${weatherApiAdress}lat=${lat}&lon=${lon}&appid=${weatherApiKey}`)
    .then(response => response.json())
    .then(data => {
      populateWeatherWidget(data);
      weatherLoader.style.display = 'none';
    })
    .catch((error) => {
      console.error('Not possible to get weather data error:', error);
      weatherLoader.style.display = 'none';
    });
}

function populateWeatherWidget(data) {
  console.log(data);
  const weatherDescription = data.weather[0].description;
  const weatherIcon = data.weather[0].icon;
  const weatherIconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`;

  const windSpeed = data.wind.speed;
  console.log(windSpeed);

  const humidity = data.main.humidity;
  console.log(humidity);

  const temperature = data.main.temp;
  console.log(temperature);

  weatherLoader.style.display = 'none';
  weatherInfoBlock.style.display = '';
  weatherIconEl.setAttribute('src', weatherIconUrl);
  weatherDescriptionEl.textContent = weatherDescription;

  //additional 
  humidityInfo.textContent = `Humidity: ${humidity}%`;
  tempInfo.textContent = `Temperature: ${Math.round(temperature) - 273}°C`;
  windInfo.textContent = `Wind Speed: ${windSpeed} km/h`;


  setInterval(populateTimeBlock, 1000);
}

function populateTimeBlock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let beforeOrAfterMidday = '';

  if (hours >= 12) {
    beforeOrAfterMidday = 'PM';
  } else {
    beforeOrAfterMidday = 'AM';
  }

  if (hours > 12) {
    hours -= 12;
  }

  if (minutes < 10) {
    timeValueEl.textContent = `${hours}:0${minutes} ${beforeOrAfterMidday}`;
  } else {
    timeValueEl.textContent = `${hours}:${minutes} ${beforeOrAfterMidday}`;
  }
}

changeListTitle(today);
greetUser();
checkUserPreferencesAboutNewsBlock();
renderCalendar();
populateTimeBlock();
getUserGeoPosition();

// fetch events for calendar dates
prevDate.addEventListener('click', () => {
  dateToFetch = minusOneDay();
  changeListTitle(new Date(dateToFetch));

  fetchPinsForTheDate(dateToFetch)
    .then(userDataFromFirebase => {
      todaysTaskList.innerHTML = '';
      populateNewPin(userDataFromFirebase);
    })
    .catch(error => {
      console.error(error);
    });
});

nextDate.addEventListener('click', () => {
  dateToFetch = plusOneDay();
  changeListTitle(new Date(dateToFetch));

  fetchPinsForTheDate(dateToFetch)
    .then(userDataFromFirebase => {
      todaysTaskList.innerHTML = '';
      populateNewPin(userDataFromFirebase);
    })
    .catch(error => {
      console.error(error);
    });
});

// event listeners - calendar
try {
  calendarPrevBtn.addEventListener('click', () => {
    currentMonth = currentMonth - 1;

    if (currentMonth < 0 || currentMonth > 11) {
      date = new Date(currentYear, currentMonth);
      currentYear = date.getFullYear();
      currentMonth = date.getMonth();
    } else {
      date = new Date();
    }

    renderCalendar();
  });
} catch (error) {
  console.error();
}

try {
  calendarNextBtn.addEventListener('click', () => {
    currentMonth = currentMonth + 1;

    if (currentMonth < 0 || currentMonth > 11) {
      date = new Date(currentYear, currentMonth);
      currentYear = date.getFullYear();
      currentMonth = date.getMonth();
    } else {
      date = new Date();
    }

    renderCalendar();
  });
} catch (error) {
  console.error();
}

calendarPrevBtn.addEventListener('click', () => {
  weeklyTaskList.innerHTML = '';
  fetchPrevMonthPins();
})

calendarNextBtn.addEventListener('click', () => {
  weeklyTaskList.innerHTML = '';
  fetchNextMonthPins();
})

// event listeners - adding pins
try {
  addPinForToday.addEventListener('click', () => {
    localStorage.setItem('list', 'todaysTaskList');
    openModalWindow();
  });
} catch (error) {
  console.error();
}

try {
  addPinForAnyDate.addEventListener('click', () => {
    localStorage.setItem('list', 'weeklyTaskList');
    openModalWindow();
  });
} catch (error) {
  console.error();
}

// event listeners - modal window
try {
  closeModalWindowBtn.addEventListener('click', closeModalWindow);
} catch (error) {
  console.error();
}

try {
  modalWindowSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addPinToList();
    updateAllLists();
  });
} catch (error) {
  console.error();
}

// event listeners - emojis
allEmojis.forEach(emoji => {
  emoji.addEventListener('click', addActiveClass);
});

try {
  emojiWrapper.addEventListener('click', (e) => {
    let emojiSrc = e.target.src;
    localStorage.setItem('emoji', emojiSrc);
  });
} catch (error) {
  console.error();
}

try {
  prevEmojiBtn.addEventListener('click', () => {
    emojisContainer.scrollLeft -= 119;
  });
} catch (error) {
  console.error();
}

try {
  nextEmojiBtn.addEventListener('click', () => {
    emojisContainer.scrollLeft += 119;
  });
} catch (error) {
  console.error();
}

// event listeners - news block
try {
  newsBlockBtn.addEventListener('click', closeNewsBlock);
} catch (error) {
  console.error();
}

// event listeners - mobile menu
try {
  menuBtn.addEventListener('click', () => {
    generalInfoBlock.classList.toggle('active');
  });
} catch (error) {
  console.error();
}

// event listeners - weather widget
weatherBtn.addEventListener('click', () => {
  weatherBtn.classList.toggle('active');
  weatherAdditionalInfo.classList.toggle('active');
});

// event listeners - where open modal window
window.addEventListener('scroll', function () {
  modalWindowForm.style.top = scrolledPx;
  scrolledPx = window.scrollY;
});






