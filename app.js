import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTdroN3i8PB8u8GeMDm_djZaw_lisgJ4M",
  authDomain: "sopanam-fees-site.firebaseapp.com",
  projectId: "sopanam-fees-site",
  storageBucket: "sopanam-fees-site.appspot.com",
  messagingSenderId: "875694835618",
  appId: "1:875694835618:web:f28cddc9758eddd40914fb",
  measurementId: "G-JMR44EQ6M8" 
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(); 

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

// -- Login Logic --
if (loginForm) { // Only run if on the login page
  loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              // Redirect on success, may need to change the URL:
              window.location.href = "index.html";
          })
          .catch((error) => {
              errorMessage.textContent = error.message; 
          });
  }); 
}

// -- Protect other pages -- 
// Function to check authentication and potentially redirect.
function checkAuthStateAndRedirect() {
    onAuthStateChanged(auth, (user) => {
        if (user) { 
            console.log("User logged in:", user.email);
        } else { 
            console.log("User not logged in - redirecting to login."); 
            // Redirect if NOT logged in
            window.location.href = "login.html"; 
        }
    });
}

// Add this call to all pages you want protected. For example:

// index.html :
checkAuthStateAndRedirect(); 
 
// add_students.html:
checkAuthStateAndRedirect(); 

// fees.html
checkAuthStateAndRedirect(); 

// students.html
checkAuthStateAndRedirect(); 

// pending_fees.html
checkAuthStateAndRedirect(); 
