import { db, ref, set, auth, createUserWithEmailAndPassword, sendEmailVerification } from './firebaseConfig.js';

const formLoader = document.querySelector('.form-loader');
// form
const form = document.querySelector('.form__sign-up');
const emailInput = document.querySelector('.form__email');
const passwordInput = document.querySelector('.form__password');
const formBtn = document.querySelector('.form__button');
const formBtnText = document.querySelector('.form__button-text');

//toggle forms
const signUpForm = document.querySelector('.form__sign-up');
const signInForm = document.querySelector('.form__sign-in');
const authoLinks = document.querySelectorAll('.form__autho-link');
// password visability for user
const passwordVisabilityBtn = document.querySelector('.form__hide-button');
const passwordVisabilityBtnTextInner = document.querySelector('.form__btn-txt');
const showPng = document.querySelector('.form__show-png');
const hidePng = document.querySelector('.form__hide-png');


function toggleSignUpAndInPage() {
  if (signUpForm.classList.contains('active')) {
    signUpForm.classList.remove('active');
    signInForm.classList.add('active');
  } else if (signInForm.classList.contains('active')) {
    signInForm.classList.remove('active');
    signUpForm.classList.add('active');
  }
}

authoLinks.forEach((link) => {
  link.addEventListener('click', toggleSignUpAndInPage);
});



// buttons loader
function showLoader() {
  formBtnText.textContent = '';
  formLoader.style.display = 'flex';
  formBtn.setAttribute('disabled', true);
}

function hideLoader() {
  formBtnText.textContent = 'Try again later';
  formLoader.style.display = 'none';
  formBtn.setAttribute('disabled', false);
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

// event listeners
passwordVisabilityBtn.addEventListener('click', togglePasswordVisability);

form.addEventListener('submit', registerUser);
