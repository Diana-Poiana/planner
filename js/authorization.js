import { db, ref, dbref, set, get, auth, child, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from './firebaseConfig.js';

const loader = document.querySelector('.dot-elastic');
// form
const form = document.querySelector('.form__sign-up');
const emailInput = document.querySelector('.form__email');
const passwordInput = document.querySelector('.form__password');
const formBtn = document.querySelector('.form__button');
const formBtnText = document.querySelector('.form__button-text');
// password visability for user
const passwordVisabilityBtn = document.querySelector('.form__hide-button');
const passwordVisabilityBtnTextInner = document.querySelector('.form__btn-txt');
const showPng = document.querySelector('.form__show-png');
const hidePng = document.querySelector('.form__hide-png');


// buttons loader
function showLoader() {
  formBtnText.textContent = '';
  loader.style.display = 'flex';
  formBtn.setAttribute('disabled', true);
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
        });

      sessionStorage.setItem('user-creds', JSON.stringify(credentials.user));
      window.location.href = 'planner.html';
    })
    .catch((error) => {
      console.error(error.message);
    });
}

// event listeners
passwordVisabilityBtn.addEventListener('click', togglePasswordVisability);

form.addEventListener('submit', registerUser);
