import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyCIr_siSbou0XVLwqN7Da5aBSes7FU5KOg",
    authDomain: "my-hr-platform.firebaseapp.com",
    projectId: "my-hr-platform",
    storageBucket: "my-hr-platform.firebasestorage.app",
    messagingSenderId: "932013170733",
    appId: "1:932013170733:web:7ad11cd1534c62d406d8a4",
    measurementId: "G-FMQ6L4E7MK"
};

// Ініціалізація
const app = initializeApp(firebaseConfig);

// Експортуємо сервіси, які будуть використовуватись
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;