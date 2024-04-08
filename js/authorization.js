import { db, ref, dbref, set, get, auth, child, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from './firebaseConfig.js';

const formLoader = document.querySelectorAll('.form-loader');
// form
const emailInput = document.querySelector('.form__email');
const passwordInput = document.querySelector('.form__password');

const emailInput1 = document.querySelector('.form__email1');
const passwordInput1 = document.querySelector('.form__password1');

const signInBtn = document.querySelector('.form__signin');
const signUpBtn = document.querySelector('.form__signup');
const formBtnText = document.querySelectorAll('.form__button-text');
const formBtnText1 = document.querySelectorAll('.form__button-text');

//toggle forms
const signUpForm = document.querySelector('.form__sign-up');
const signInForm = document.querySelector('.form__sign-in');
const authoLink = document.querySelector('.form__autho-link');
// password visability for user
const passwordVisabilityBtn = document.querySelector('.form__hide-button');
const passwordVisabilityBtn1 = document.querySelector('.form__hide-button1');
const passwordVisabilityBtnTextInner = document.querySelector('.form__btn-txt');
const passwordVisabilityBtnTextInner1 = document.querySelector('.form__btn-txt1');
const showPng = document.querySelector('.form__show-png');
const showPng1 = document.querySelector('.form__show-png1');
const hidePng = document.querySelector('.form__hide-png');
const hidePng1 = document.querySelector('.form__hide-png1');


function toggleSignUpAndInPage() {
  if (signUpForm.classList.contains('active')) {
    signUpForm.classList.remove('active');
    signInForm.classList.add('active');
    authoLink.textContent = 'Create Account';
  } else if (signInForm.classList.contains('active')) {
    signInForm.classList.remove('active');
    signUpForm.classList.add('active');
    authoLink.textContent = 'Already have an account';
  }
}


authoLink.addEventListener('click', toggleSignUpAndInPage);



// buttons loader
function showLoader() {
  formBtnText.forEach((btn) => {
    btn.textContent = '';
  });

  formLoader.forEach((loader) => {
    loader.style.display = 'flex';
  });

  signInBtn.setAttribute('disabled', true);
  signUpBtn.setAttribute('disabled', true);
}

function hideLoader() {
  formBtnText.forEach((btn) => {
    btn.textContent = 'Try again later';
  });

  formLoader.forEach((loader) => {
    loader.style.display = 'none';
  });
  signInBtn.setAttribute('disabled', false);
  signUpBtn.setAttribute('disabled', false);
}

// toggle password visabillity
function togglePasswordVisability() {
  if (passwordInput.getAttribute('type') == 'password') {
    passwordInput.setAttribute('type', 'text');
    passwordVisabilityBtnTextInner.textContent = 'Show';
    hidePng.style.display = 'none';
    showPng.style.display = 'block';
  } else if (passwordInput.getAttribute('type') == 'text') {
    passwordInput.setAttribute('type', 'password');
    passwordVisabilityBtnTextInner.textContent = 'Hide';
    hidePng.style.display = 'block';
    showPng.style.display = 'none';
  }
}

function togglePasswordVisability1() {
  if (passwordInput1.getAttribute('type') == 'password') {
    passwordInput1.setAttribute('type', 'text');
    passwordVisabilityBtnTextInner1.textContent = 'Show';
    hidePng1.style.display = 'none';
    showPng1.style.display = 'block';
  } else if (passwordInput1.getAttribute('type') == 'text') {
    passwordInput1.setAttribute('type', 'password');
    passwordVisabilityBtnTextInner1.textContent = 'Hide';
    hidePng1.style.display = 'block';
    showPng1.style.display = 'none';
  }
}

// user registration
function registerUser(e) {
  e.preventDefault();
  showLoader();

  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then((credentials) => {
      set(ref(db, 'UsersAuthList/' + credentials.user.uid), {
        email: credentials.user.email
      });

      sendEmailVerification(auth.currentUser)
        .catch((error) => {
          console.error(error.message);
          hideLoader();
        });

      sessionStorage.setItem('user-creds', JSON.stringify(credentials.user));
      window.location.href = 'planner.html';
    })
    .catch((error) => {
      console.error(error.message);
      hideLoader();
    });
}

// user login
function logInUser(e) {
  e.preventDefault();
  showLoader();

  signInWithEmailAndPassword(auth, emailInput1.value, passwordInput1.value)
    .then((credentials) => {
      get(child(dbref, 'UsersAuthList/' + credentials.user.uid))
        .then((snapshot) => {
          if (snapshot.exists) {

            sessionStorage.setItem('user-creds', JSON.stringify(credentials.user));
            window.location.href = 'planner.html';
          }
        });
    })
    .catch((error) => {
      alert(error.message);
      window.location.href = 'index.html';
    });
}

// event listeners
passwordVisabilityBtn.addEventListener('click', togglePasswordVisability);
passwordVisabilityBtn1.addEventListener('click', togglePasswordVisability1);

signUpForm.addEventListener('submit', registerUser);
signInForm.addEventListener('submit', logInUser);
