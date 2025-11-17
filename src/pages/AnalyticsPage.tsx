import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import type {RootState} from '../app/store';
import { getApplicationsForRecruiter } from '../features/applications/applicationService';
import type { IApplicationDocument } from '../features/applications/applicationTypes';
import { FunnelChart } from '../features/analytics/FunnelChart';
import { ScreeningChart } from '../features/analytics/ScreeningChart';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
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
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
`;
const ChartContainer = styled.div`
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const AnalyticsPage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [applications, setApplications] = useState<IApplicationDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getApplicationsForRecruiter(user.uid)
                .then(apps => {
                    setApplications(apps);
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    if (isLoading) {
        return <PageContainer><h1>Завантаження аналітики...</h1></PageContainer>;
    }

    return (
        <PageContainer>
            <Header>
                <BackLink to="/home">{'<'} Назад на дашборд</BackLink>
                <h1>Аналітика</h1>
            </Header>

            {applications.length === 0 ? (
                <p>У вас ще немає заявок для аналізу.</p>
            ) : (
                <ChartsGrid>
                    <ChartContainer>
                        <FunnelChart applications={applications} />
                    </ChartContainer>
                    <ChartContainer>
                        <ScreeningChart applications={applications} />
                    </ChartContainer>
                </ChartsGrid>
            )}
        </PageContainer>
    );
};

export default AnalyticsPage;