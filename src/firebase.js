// Import fungsi-fungsi inisialisasi dari SDK Firebase
import { initializeApp } from "firebase/app";
import { initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore"; // Modul Database (Firestore)
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAndNyS0_mDikrAaoTMQByWzL_zpzWVB7g",
  authDomain: "l10-meetings-gwk.firebaseapp.com",
  projectId: "l10-meetings-gwk",
  storageBucket: "l10-meetings-gwk.firebasestorage.app",
  messagingSenderId: "213426293126",
  appId: "1:213426293126:web:a87d1b65ebf50d449d0407",
  measurementId: "G-D98CKK9GX0"
};

// 1. Inisialisasi Aplikasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Inisialisasi Layanan Database
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// 3. Aktifkan Offline Persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        console.warn('Persistence failed-precondition');
    } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        console.warn('Persistence unimplemented');
    }
});

