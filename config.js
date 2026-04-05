// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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
