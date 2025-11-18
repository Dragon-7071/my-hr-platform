import {addDoc, collection, serverTimestamp, query, where, getDocs, doc, updateDoc, Timestamp} from 'firebase/firestore';
import { db, auth } from '../../shared/api/firebase';
import type { IJobDocument } from '../jobs/jobTypes';
import type {IApplicationData, IApplicationDocument,} from './applicationTypes';
/**
 * ІМІТАЦІЯ ПОДАЧІ ЗАЯВКИ (через блокування Cloudinary)
 * 1. Імітує завантаження резюме
 * 2. Розраховує бал за скринінг-питаннями
 * 3. Зберігає заявку в Firestore
 */
export const submitApplication = async (
    job: IJobDocument,
    formData: IApplicationData
) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Користувач не авторизований');

    // 1. Імітуємо завантаження резюме
    if (!formData.resume || formData.resume.length === 0) {
        throw new Error('Резюме не обрано');
    }
    // Просто створюємо фейкове посилання
    const resumeUrl = `https://mock-resume-link.com/file/${formData.resume[0].name}`;
    console.log('ІМІТАЦІЯ: Файл "завантажено" на:', resumeUrl);

    // 2. Розраховуємо бал "Automated Screening"
    let score = 0;
    const maxScore = job.screeningQuestions.length;
    const answers = job.screeningQuestions.map((q) => {
        // Знаходимо відповідь кандидата на це питання
        const candidateAnswer = formData.answers[q.id];
        const isCorrect = candidateAnswer === q.correctAnswer;
        if (isCorrect) {
            score++; // Збільшуємо бал
        }
        return {
            question: q.question,
            candidateAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect,
        };
    });

    // 3. Зберігаємо заявку в Firestore
    const appCollectionRef = collection(db, 'applications');
    await addDoc(appCollectionRef, {
        jobId: job.id,
        jobTitle: job.title,
        candidateId: user.uid,
        candidateEmail: user.email,
        resumeUrl: resumeUrl, // Зберігаємо фейкове посилання
        answers: answers, // Зберігаємо деталізовані відповіді
        score: score, // Зберігаємо фінальний бал
        maxScore: maxScore,
        status: 'new', // Початковий статус для Kanban-дошки
        appliedAt: serverTimestamp(),
    });
};

/**
 * Отримує всі заявки на конкретну вакансію
 */
export const getApplicationsForJob = async (
    jobId: string
): Promise<IApplicationDocument[]> => {
    const appCollectionRef = collection(db, 'applications');
    // Запит: знайти всі заявки, де jobId == id поточної вакансії
    const q = query(appCollectionRef, where('jobId', '==', jobId));

    const querySnapshot = await getDocs(q);
    const applications: IApplicationDocument[] = [];
    querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() } as IApplicationDocument);
    });

    return applications;
};

/**
 * Оновлює статус заявки (для Kanban)
 */
export const updateApplicationStatus = async (
    applicationId: string,
    newStatus: string
) => {
    const appDocRef = doc(db, 'applications', applicationId);
    await updateDoc(appDocRef, {
        status: newStatus,
    });
};

export const getApplicationsForRecruiter = async (recruiterId: string): Promise<IApplicationDocument[]> => {
    // 1. Знаходимо всі вакансії цього рекрутера
    const jobsCollectionRef = collection(db, 'jobs');
    const jobsQuery = query(jobsCollectionRef, where('recruiterId', '==', recruiterId));
    const jobsSnapshot = await getDocs(jobsQuery);

    if (jobsSnapshot.empty) {
        return []; // У рекрутера немає вакансій = немає заявок
    }

    // 2. Збираємо ID всіх його вакансій
    const jobIds = jobsSnapshot.docs.map(doc => doc.id);

    // 3. Знаходимо всі заявки, де 'jobId' входить у масив 'jobIds'
    // Firestore має обмеження: оператор 'in' підтримує до 30 значень.
    // Для курсової роботи це більш ніж достатньо.
    const appCollectionRef = collection(db, 'applications');
    const appsQuery = query(appCollectionRef, where('jobId', 'in', jobIds));

    const appsSnapshot = await getDocs(appsQuery);
    const applications: IApplicationDocument[] = [];
    appsSnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() } as IApplicationDocument);
    });

    return applications;
};
/**
 * Додає час та посилання на інтерв'ю до заявки
 */
export const scheduleInterview = async (
    applicationId: string,
    interviewTime: Date,
    interviewUrl: string
) => {
    const appDocRef = doc(db, 'applications', applicationId);
    await updateDoc(appDocRef, {
        // Зберігаємо час у форматі Timestamp для сортування
        interviewTime: Timestamp.fromDate(interviewTime),
        interviewUrl: interviewUrl,
    });
};

/**
 * Отримує всі заявки, подані конкретним кандидатом
 */
export const getApplicationsForCandidate = async (candidateId: string): Promise<IApplicationDocument[]> => {
    const appCollectionRef = collection(db, 'applications');
    // Запит: знайти всі заявки, де candidateId == id поточного користувача
    const q = query(appCollectionRef, where('candidateId', '==', candidateId));

    const querySnapshot = await getDocs(q);
    const applications: IApplicationDocument[] = [];
    querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() } as IApplicationDocument);
    });

    return applications;
};