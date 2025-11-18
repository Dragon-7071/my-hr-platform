import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import type {RootState} from '../app/store';
import { getApplicationsForCandidate } from '../features/applications/applicationService';
import type { IApplicationDocument } from '../features/applications/applicationTypes';
import { Link } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { getStatusLabel } from '../shared/utils/formatStatus';

const PageContainer = styled.div`
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px;
`;
const Header = styled.div`
    margin-bottom: 24px;
`;
const BackLink = styled(Link)`
    color: #007bff;
    text-decoration: none;
    &:hover { text-decoration: underline; }
`;
const AppCard = styled.div`
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    border-left: 5px solid ${(props) => props.color || '#ddd'};
`;
const AppTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 8px;
`;
const AppInfo = styled.p`
    margin: 4px 0;
    color: #333;
    font-size: 16px;
    strong { color: #000; }
`;
const InterviewInfo = styled.div`
    background: #fdfdea;
    border: 1px solid #f0e68c;
    border-radius: 6px;
    padding: 12px;
    margin-top: 16px;
    font-size: 14px;
`;
const StyledLink = styled.a`
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

// Функція для форматування дати
const formatInterviewTime = (time: Timestamp | Date): string => {
    const date = time instanceof Timestamp ? time.toDate() : time;
    return date.toLocaleString('uk-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};


const MyApplicationsPage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [applications, setApplications] = useState<IApplicationDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getApplicationsForCandidate(user.uid)
                .then((apps) => {
                    apps.sort((a, b) => b.appliedAt.seconds - a.appliedAt.seconds);
                    setApplications(apps);
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    if (isLoading) {
        return <PageContainer><h1>Завантаження заявок...</h1></PageContainer>;
    }

    return (
        <PageContainer>
            <Header>
                <BackLink to="/home">{'<'} Назад на дашборд</BackLink>
                <h1>Мої Заявки</h1>
            </Header>

            {applications.length === 0 ? (
                <p>Ви ще не подали жодної заявки.</p>
            ) : (
                <div>
                    {applications.map((app) => {
                        //ВИКОРИСТОВУЄМО ФУНКЦІЮ
                        const status = getStatusLabel(app.status);
                        return (
                            <AppCard key={app.id} color={status.color}>
                                <AppTitle>{app.jobTitle}</AppTitle>
                                <AppInfo>
                                    <strong>Статус:</strong> {status.label}
                                </AppInfo>

                                {app.status === 'interview' && app.interviewTime && (
                                    <InterviewInfo>
                                        <strong>Вам призначено інтерв'ю!</strong>
                                        <br />
                                        <strong>Час:</strong> {formatInterviewTime(app.interviewTime)}
                                        <br />
                                        <StyledLink href={app.interviewUrl} target="_blank">
                                            Посилання на зустріч
                                        </StyledLink>
                                    </InterviewInfo>
                                )}
                            </AppCard>
                        );
                    })}
                </div>
            )}
        </PageContainer>
    );
};

export default MyApplicationsPage;