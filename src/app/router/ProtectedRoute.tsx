import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type {RootState} from '../store';

interface ProtectedRouteProps {
    allowedRoles: ('recruiter' | 'candidate')[]; // Масив дозволених ролей
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.user.user);
    const authStatus = useSelector((state: RootState) => state.user.status);

    if (authStatus === 'loading') {
        return <div>Перевірка авторизації...</div>;
    }

    if (!user) {
        // Якщо користувач не залогінений, відправляємо на логін
        return <Navigate to="/login" replace />;
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
        // Якщо роль користувача не дозволена, відправляємо на головну
        return <Navigate to="/home" replace />;
    }

    // Якщо все добре, показуємо дочірній компонент (сторінку)
    return <Outlet />;
};