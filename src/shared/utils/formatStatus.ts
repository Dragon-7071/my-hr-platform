// Тип для наших статусів
type ApplicationStatus = 'new' | 'screening' | 'interview' | 'rejected' | string;

interface StatusDetails {
    label: string;
    color: string;
}

/**
 * Отримує "людський" лейбл та колір для статусу заявки
 * @param status - Статус із бази даних (напр., 'new')
 * @returns Об'єкт { label, color }
 */
export const getStatusLabel = (status: ApplicationStatus): StatusDetails => {
    switch (status) {
        case 'new':
            return { label: 'Отримано', color: '#007bff' };
        case 'screening':
            return { label: 'Розглядається', color: '#ffc107' };
        case 'interview':
            return { label: 'Інтерв\'ю', color: '#28a745' };
        case 'rejected':
            return { label: 'Відхилено', color: '#dc3545' };
        default:
            return { label: 'Отримано', color: '#007bff' };
    }
};