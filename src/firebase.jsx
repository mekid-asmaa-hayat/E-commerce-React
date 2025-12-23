    // Import Firebase core
    import { initializeApp } from "firebase/app";

    // 🔥 IMPORT MANQUANT (TRÈS IMPORTANT)
    import { getFirestore } from "firebase/firestore";

    

    // Configuration Firebase
    const firebaseConfig = {
    apiKey: "AIzaSyAIMpMVTsU0_v3vC2JRK6d1S49DGNkh0XM",
    authDomain: "sephora-4d92b.firebaseapp.com",
    projectId: "sephora-4d92b",
    storageBucket: "sephora-4d92b.firebasestorage.app",
    messagingSenderId: "1097652620150",
    appId: "1:1097652620150:web:5945379be4157a3505c857"
    };

    // Initialiser Firebase
    const app = initializeApp(firebaseConfig);

    // ✅ EXPORT CORRECT
    export const db = getFirestore(app);
