import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { IApplicationDocument } from '../applications/applicationTypes';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ScreeningChartProps {
    applications: IApplicationDocument[];
}

export const ScreeningChart = ({ applications }: ScreeningChartProps) => {

    // 1. Рахуємо тих, хто "не пройшов" (це тільки ті, у кого були питання, але 0 балів)
    const failed = applications.filter(
        (app) => app.maxScore > 0 && app.score === 0
    ).length;

    // 2. Рахуємо тих, хто "пройшов" (це ті, хто набрав >0 балів, або ті, у кого питань не було)
    const passed = applications.filter(
        (app) => app.score > 0 || app.maxScore === 0
    ).length;


    const data = {
        labels: ['Успішно пройшли скринінг', 'Не пройшли скринінг'],
        datasets: [
            {
                label: 'Кандидати',
                data: [passed, failed],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                // Оновлюємо заголовок, бо він тепер враховує всі заявки
                text: 'Результати автоматичного скринінгу',
            },
        },
    };

    // Якщо заявок взагалі не було
    if (applications.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <h4>Результати автоматичного скринінгу</h4>
                <p>Немає даних для аналізу.</p>
            </div>
        );
    }

    return <Pie data={data} options={options} />;
};