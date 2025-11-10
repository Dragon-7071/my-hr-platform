import { addDoc, collection, serverTimestamp, getDocs, query, where, doc, getDoc} from 'firebase/firestore';
import { db, auth } from '../../shared/api/firebase';

import type { IJobData, IJobDocument } from './jobTypes';

/**
 * Створює новий документ вакансії в колекції 'jobs'
 */
export const createJob = async (jobData: IJobData) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Користувач не авторизований');
    }

    try {
        const jobsCollectionRef = collection(db, 'jobs');
        const newJobDoc = await addDoc(jobsCollectionRef, {
            ...jobData,
            recruiterId: user.uid, // Прив'язуємо вакансію до рекрутера
            recruiterEmail: user.email,
            createdAt: serverTimestamp(), // Додаємо час створення
            status: 'open', // 'open' | 'closed'
        });
        return newJobDoc.id; // Повертаємо ID створеної вакансії
    } catch (error) {
        console.error('Error creating job: ', error);
        throw error;
    }
};

/**
 * Отримує всі 'open' вакансії
 */
export const getAllJobs = async (): Promise<IJobDocument[]> => {
    const jobsCollectionRef = collection(db, 'jobs');
    // Створюємо запит: тільки вакансії зі статусом 'open'
    const q = query(jobsCollectionRef, where('status', '==', 'open'));

    const querySnapshot = await getDocs(q);
    const jobs: IJobDocument[] = [];
    querySnapshot.forEach((doc) => {
        // doc.data() - це дані, doc.id - це унікальний ID
        jobs.push({ id: doc.id, ...doc.data() } as IJobDocument);
    });

    return jobs;
};

/**
 * Отримує одну вакансію за її ID
 */
export const getJobById = async (jobId: string): Promise<IJobDocument | null> => {
    const jobDocRef = doc(db, 'jobs', jobId);
    const jobDocSnap = await getDoc(jobDocRef);

    if (jobDocSnap.exists()) {
        return { id: jobDocSnap.id, ...jobDocSnap.data() } as IJobDocument;
    } else {
        // Вакансію не знайдено
        return null;
    }
};