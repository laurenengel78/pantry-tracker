import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
        apiKey: "AIzaSyCZyQUx4-uOL7pfNx19wR-N88BTFksWBq0",
        authDomain: "pantry-b92b9.firebaseapp.com",
        projectId: "pantry-b92b9",
        storageBucket: "pantry-b92b9.appspot.com",
        messagingSenderId: "68315530754",
        appId: "1:68315530754:web:387784dc048f849c72091b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { firestore };
