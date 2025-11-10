import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../shared/api/firebase';
import { uploadToCloudinary } from '../../shared/api/cloudinary';
import type { IJobDocument } from '../jobs/jobTypes';
import type { IApplicationData } from './applicationTypes';

/**
 * Повна логіка подачі заявки
 * 1. Завантажує резюме на Cloudinary
 * 2. Розраховує бал за скринінг-питаннями
 * 3. Зберігає заявку в Firestore
 */
export const submitApplication = async (
    job: IJobDocument,
    formData: IApplicationData
) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Користувач не авторизований');

    // 1. Завантажуємо резюме
    if (!formData.resume || formData.resume.length === 0) {
        throw new Error('Резюме не обрано');
    }
    const resumeFile = formData.resume[0];
    const resumeUrl = await uploadToCloudinary(resumeFile);

    // 2. Розраховуємо бал "Automated Screening"
    let score = 0;
    let maxScore = job.screeningQuestions.length;
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
        resumeUrl: resumeUrl,
        answers: answers, // Зберігаємо деталізовані відповіді
        score: score, // Зберігаємо фінальний бал
        maxScore: maxScore,
        status: 'new', // Початковий статус для Kanban-дошки
        appliedAt: serverTimestamp(),
    });
};