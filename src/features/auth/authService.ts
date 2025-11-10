import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../shared/api/firebase';
import type { IRegisterData, ILoginData } from './authTypes';

/**
 * Реєструє нового користувача
 * 1. Створює запис в Firebase Auth
 * 2. Створює документ в Firestore 'users' з його роллю
 */
export const registerUser = async ({ email, password, role }: IRegisterData) => {
    try {
        // 1. Створюємо користувача в Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // 2. Створюємо запис в Firestore
        // 'users' -> 'user.uid' -> { email, role }
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: role,
        });

        return user;
    } catch (error) {
        console.error('Error during registration: ', error);
        throw error; // Передаємо помилку, щоб компонент міг її обробити
    }
};

/**
 * Вхід існуючого користувача
 */
export const loginUser = async ({ email, password }: ILoginData) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    } catch (error) {
        console.error('Error during login: ', error);
        throw error;
    }
};

/**
 * Вихід з системи
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error during logout: ', error);
        throw error;
    }
};