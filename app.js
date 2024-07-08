import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTdroN3i8PB8u8GeMDm_djZaw_lisgJ4M",
    authDomain: "sopanam-fees-site.firebaseapp.com",
    projectId: "sopanam-fees-site",
    storageBucket: "sopanam-fees-site.appspot.com",
    messagingSenderId: "875694835618",
    appId: "1:875694835618:web:f28cddc9758eddd40914fb",
    measurementId: "G-JMR44EQ6M8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle login form submission
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location.href = "index.html";
            })
            .catch((error) => {
                errorMessage.textContent = error.message;
            });
    });
}

// Check auth state when the page loads or user's auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in.");
    } else {
        console.log("User is not logged in. Redirecting...");
        window.location.href = "login.html";
    }
});

// Add student to Firestore
async function addStudent(studentName) {
    try {
        await addDoc(collection(db, 'students'), { studentName: studentName, feesPaid: false });
        console.log("Student added successfully");
    } catch (error) {
        console.error("Error adding student: ", error);
    }
}

// Load students for fees management
async function loadStudents() {
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    const studentsList = document.getElementById('studentsList');

    studentsSnapshot.forEach((doc) => {
        const studentData = doc.data();
        const studentItem = document.createElement('li');
        studentItem.textContent = studentData.studentName;
        const paidCheckbox = document.createElement('input');
        paidCheckbox.type = 'checkbox';
        paidCheckbox.checked = studentData.feesPaid || false;
        paidCheckbox.addEventListener('change', async () => {
            await updateDoc(doc(db, 'students', doc.id), { feesPaid: paidCheckbox.checked });
        });
        studentItem.appendChild(paidCheckbox);
        studentsList.appendChild(studentItem);
    });
}

// Load students with pending fees
async function loadPendingFees() {
    const pendingFeesSnapshot = await getDocs(query(collection(db, 'students'), where('feesPaid', '==', false)));
    const pendingFeesList = document.getElementById('pendingFeesList');

    pendingFeesSnapshot.forEach((doc) => {
        const studentData = doc.data();
        const studentItem = document.createElement('li');
        studentItem.textContent = studentData.studentName;
        pendingFeesList.appendChild(studentItem);
    });
}

// Event listeners for loading students on respective pages
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('studentsList')) {
        loadStudents();
    }

    if (document.getElementById('pendingFeesList')) {
        loadPendingFees();
    }
});
