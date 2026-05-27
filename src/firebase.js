// Import fungsi-fungsi inisialisasi dari SDK Firebase
import { initializeApp } from "firebase/app";
import { initializeFirestore, enableIndexedDbPersistence, doc, setDoc, onSnapshot } from "firebase/firestore"; // Modul Database (Firestore)
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

// 2. Inisialisasi Layanan Database (Firestore)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// 3. Aktifkan Offline Persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Persistence failed-precondition');
    } else if (err.code === 'unimplemented') {
        console.warn('Persistence unimplemented');
    }
});

// 4. Fungsi mengambil IP Publik perangkat (Menggunakan format JSON yang benar)
async function getClientIP() {
  try {
    // Menggunakan api.ipify.org dengan format json eksplisit, atau gunakan https://icanhazip.com
    const response = await fetch('https://ipify.org');
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    
    // Firestore tidak membolehkan karakter garis miring (/), tetapi aman dengan tanda strip (-)
    return data.ip.replace(/\./g, '-'); 
  } catch (error) {
    console.error("Gagal mengambil IP, menggunakan fallback room", error);
    // Ganti "default-room" dengan ID string tanpa simbol aneh jika gagal
    return "room-default"; 
  }
}


// 5. Fungsi Sinkronisasi Real-Time Firestore
async function startSync() {
  const identifier = await getClientIP(); 
  
  // Membuat referensi dokumen di koleksi 'web_activities' dengan ID berupa IP perangkat
  const docRef = doc(db, 'web_activities', identifier);

  // === DEVICE 2: Mendengarkan Perubahan Data secara Real-Time ===
  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Data diperbarui dari device lain:", data);
      
      // Pastikan elemen UI ini ada di HTML Anda agar tidak error
      const outputElement = document.getElementById("output");
      if (outputElement) {
        outputElement.innerText = data.input_text || "";
      }
    }
  });

  // === DEVICE 1: Mengirim Aktivitas Saat Ada Input/Perubahan ===
  const inputElement = document.getElementById("myInput");
  if (inputElement) {
    inputElement.addEventListener("input", async (e) => {
      try {
        await setDoc(docRef, {
          input_text: e.target.value,
          timestamp: Date.now()
        }, { merge: true }); // Merge true agar tidak menimpa data lain di dokumen tersebut
      } catch (error) {
        console.error("Gagal mengirim data ke Firestore:", error);
      }
    });
  }
}

// Jalankan fungsi sinkronisasi setelah DOM siap
if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", startSync);
}

