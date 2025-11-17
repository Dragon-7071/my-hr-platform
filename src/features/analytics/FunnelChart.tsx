import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import type { IApplicationDocument } from '../applications/applicationTypes';

// Реєструємо компоненти Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface FunnelChartProps {
    applications: IApplicationDocument[];
}

export const FunnelChart = ({ applications }: FunnelChartProps) => {
    // Рахуємо кандидатів у кожній колонці
    const funnelData = {
        new: applications.filter(app => app.status === 'new').length,
        screening: applications.filter(app => app.status === 'screening').length,
        interview: applications.filter(app => app.status === 'interview').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
    };

    const data = {
        labels: ['Нові', 'Скрінінг', 'Інтерв\'ю', 'Відхилено'],
        datasets: [
            {
                label: 'Кількість кандидатів',
                data: [
                    funnelData.new,
                    funnelData.screening,
                    funnelData.interview,
                    funnelData.rejected,
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
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
                text: 'Воронка найму (за статусом)',
            },
        },
    };

    return <Bar options={options} data={data} />;
};