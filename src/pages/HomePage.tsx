import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { logoutUser } from '../features/auth/authService';
import { clearUser } from '../app/store/userSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/ui/Button';
import styled from 'styled-components';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Отримуємо дані користувача з Redux
    const user = useSelector((state: RootState) => state.user.user);
    const authStatus = useSelector((state: RootState) => state.user.status);

    const handleLogout = async () => {
        await logoutUser();
        dispatch(clearUser()); // Очищуємо Redux
        navigate('/login'); // Перекидаємо на логін
    };

    if (authStatus === 'loading') {
        return <PageContainer><h1>Завантаження...</h1></PageContainer>;
    }

    return (
        <PageContainer>
            {user ? (
                <>
                    <h1>Вітаємо, {user.email}!</h1>
                    <UserInfo>Ваш ID: {user.uid}</UserInfo>
                    <UserInfo>Ваша роль: <strong>{user.role}</strong></UserInfo>
                    <LogoutButton onClick={handleLogout}>Вийти</LogoutButton>
                </>
            ) : (
                <>
                    <h1>Ви не увійшли в систему</h1>
                    <a href="/login">Перейти на сторінку входу</a>
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

    const UserInfo = styled.p`
    font-size: 18px;
    color: #333;
    `;

    const LogoutButton = styled(Button)`
    margin-top: 24px;
    max-width: 200px;
    `;