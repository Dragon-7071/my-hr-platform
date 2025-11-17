import { useSelector, useDispatch } from 'react-redux';
import type {RootState} from '../app/store';
import { logoutUser } from '../features/auth/authService';
import { clearUser } from '../app/store/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../shared/ui/Button';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getJobsByRecruiter } from '../features/jobs/jobService';
import type { IJobDocument } from '../features/jobs/jobTypes';
import type { UserData } from '../app/store/userSlice';

interface RecruiterDashboardProps {
    user: UserData;
}

// Компонент для Рекрутера
const RecruiterDashboard = ({ user }: RecruiterDashboardProps) => {
    const [jobs, setJobs] = useState<IJobDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const recruiterJobs = await getJobsByRecruiter(user.uid);
                setJobs(recruiterJobs);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, [user.uid]);

    return (
        <RecruiterContainer>
            <h1>Ваші Вакансії</h1>


            <ButtonContainer>
                <Button
                    as={Link}
                    to="/create-job"
                    style={{ textDecoration: 'none' }}
                >
                    + Створити нову вакансію
                </Button>

                <Button
                    as={Link}
                    to="/analytics"
                    style={{ textDecoration: 'none', backgroundColor: '#17a2b8' }}
                >
                    Переглянути аналітику
                </Button>
            </ButtonContainer>


            <JobListContainer>
                {isLoading && <p>Завантаження вакансій...</p>}

                {!isLoading && jobs.length === 0 && (
                    <p>Ви ще не створили жодної вакансії.</p>
                )}

                {jobs.map((job) => (
                    <JobCard key={job.id} to={`/job/${job.id}/applications`}>
                        <JobTitle>{job.title}</JobTitle>
                        <p>{job.location}</p>
                    </JobCard>
                ))}
            </JobListContainer>
        </RecruiterContainer>
    );
};

// Компонент для Кандидата
const CandidateDashboard = () => (
    <>
        <h1>Панель Кандидата</h1>
        <p>Шукайте вакансії мрії та відстежуйте свої заявки.</p>
        <ButtonContainer>
            <Button as={Link} to="/search-jobs" style={{ textDecoration: 'none' }}>
                Пошук вакансій
            </Button>

            <Button
                as={Link}
                to="/my-applications"
                style={{ textDecoration: 'none', backgroundColor: '#17a2b8' }}
            >
                Мої заявки
            </Button>
        </ButtonContainer>
    </>
);

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user.user);
    const authStatus = useSelector((state: RootState) => state.user.status);

    const handleLogout = async () => {
        await logoutUser();
        dispatch(clearUser());
        navigate('/login');
    };

    if (authStatus === 'loading') {
        return <PageContainer><h1>Завантаження...</h1></PageContainer>;
    }

    return (
        <PageContainer>
            {user ? (
                <>
                    <WelcomeHeader>Вітаємо, {user.email}!</WelcomeHeader>

                    {user.role === 'recruiter' && <RecruiterDashboard user={user} />}
                    {user.role === 'candidate' && <CandidateDashboard />}

                    <LogoutButton onClick={handleLogout}>Вийти</LogoutButton>
                </>
            ) : (
                <>
                    <h1>Ви не увійшли в систему</h1>
                    <Link to="/login">Перейти на сторінку входу</Link>
                </>
            )}
        </PageContainer>
    );
};

export default HomePage;


const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
    text-align: center;
`;

const WelcomeHeader = styled.h2`
    font-weight: 500;
    color: #555;
    margin-bottom: 32px;
`;

const LogoutButton = styled(Button)`
    margin-top: 24px;
    max-width: 200px;
    background-color: #6c757d; // Інший колір для кнопки виходу
    &:hover {
        background-color: #5a6268;
    }
`;


const RecruiterContainer = styled.div`
    width: 100%;
    max-width: 800px;
    text-align: left;
`;


const JobListContainer = styled.div`
  margin-top: 24px; // Цей відступ відсуне список від кнопки
`;

const JobCard = styled(Link)`
    display: block;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 16px;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s ease;

    &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
`;

const JobTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 8px;
    color: #007bff;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px; // Простір між кнопками
  margin-top: 16px;
  flex-wrap: wrap; // Для мобільних
`;