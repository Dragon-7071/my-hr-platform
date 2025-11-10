export interface IScreeningQuestion {
    id: string;
    question: string;
    correctAnswer: 'yes' | 'no'; // Очікувана відповідь
}

// Це тип даних, які ми збираємо з форми
export interface IJobData {
    title: string;
    description: string;
    salary: number;
    location: string;
    screeningQuestions: IScreeningQuestion[];
}

export interface IScreeningQuestion {
    id: string;
    question: string;
    correctAnswer: 'yes' | 'no';
}

// Це тип даних, які ми збираємо з форми
export interface IJobData {
    title: string;
    description: string;
    salary: number;
    location: string;
    screeningQuestions: IScreeningQuestion[];
}

// Це тип даних, як вони зберігаються в Firestore (з ID)
export interface IJobDocument extends IJobData {
    id: string;
    recruiterId: string;
    recruiterEmail: string;
    createdAt: any; // Firebase Timestamp
    status: 'open' | 'closed';
}