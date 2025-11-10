export interface IApplicationData {
    resume: FileList; // Тип для <input type="file">
    // Об'єкт, де ключ - це ID питання, а значення - відповідь 'yes' або 'no'
    answers: {
        [questionId: string]: 'yes' | 'no';
    };
}