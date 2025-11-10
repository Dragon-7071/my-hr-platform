import { useSelector, useDispatch } from 'react-redux';
import type {RootState} from '../app/store';
import { logoutUser } from '../features/auth/authService';
import { clearUser } from '../app/store/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../shared/ui/Button';
import styled from 'styled-components';

// Компонент для Рекрутера
const RecruiterDashboard = () => (
    <>
        <h1>Панель Рекрутера</h1>
        <p>Тут ви можете створювати вакансії та керувати кандидатами.</p>
        <Button as={Link} to="/create-job" style={{ textDecoration: 'none' }}>
            Створити нову вакансію
        </Button>
    </>
);

// Компонент для Кандидата
const CandidateDashboard = () => (
    <>
        <h1>Панель Кандидата</h1>
        <p>Шукайте вакансії мрії та відстежуйте свої заявки.</p>
        <Button as={Link} to="/search-jobs" style={{ textDecoration: 'none' }}>
            Пошук вакансій
        </Button>
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
                    {/* Привітання та вибір панелі за роллю */}
                    <WelcomeHeader>Вітаємо, {user.email}!</WelcomeHeader>

                    {user.role === 'recruiter' && <RecruiterDashboard />}
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