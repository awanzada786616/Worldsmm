// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA44TLKBn93R8SxgmcVWAjr6wI3SQSTvM0",
    authDomain: "wasi-smm.firebaseapp.com",
    projectId: "wasi-smm",
    storageBucket: "wasi-smm.firebasestorage.app",
    messagingSenderId: "100481136940",
    appId: "1:100481136940:web:6dbb01efebc0774957d489"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global Variables (Taake har page par use ho sakain)
const db = firebase.firestore();
const auth = firebase.auth();

// Global Setting: Logo Load karna (Har page ke liye)
function loadGlobalLogo(elementId) {
    db.collection("settings").doc("branding").onSnapshot(doc => {
        if(doc.exists && doc.data().logo) {
            document.getElementById(elementId).src = doc.data().logo;
        }
    });
}
