export interface IApplicationData {
    resume: FileList; // Тип для <input type="file">
    // Об'єкт, де ключ - це ID питання, а значення - відповідь 'yes' або 'no'
    answers: {
        [questionId: string]: 'yes' | 'no';
    };
}
// Це тип даних, як вони зберігаються в Firestore
export interface IApplicationDocument {
    id: string;
    jobId: string;
    jobTitle: string;
    candidateId: string;
    candidateEmail: string;
    resumeUrl: string;
    answers: {
        question: string;
        candidateAnswer: 'yes' | 'no';
        correctAnswer: 'yes' | 'no';
        isCorrect: boolean;
    }[];
    score: number;
    maxScore: number;
    status: string; // 'new', 'screening', 'interview', 'rejected'
    appliedAt: any;

    interviewTime?: any; // Firebase Timestamp (або Date локально)
    interviewUrl?: string;
}