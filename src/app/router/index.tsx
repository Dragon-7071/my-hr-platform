import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Використовуємо lazy loading
const HomePage = lazy(() => import('../../pages/HomePage'));
const LoginPage = lazy(() => import('../../pages/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/RegisterPage')); // Додано

const router = createBrowserRouter([
    {
        path: '/',
        // Поки що головна - це просто редірект на логін
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register', // Додано
        element: <RegisterPage />,
    },
    {
        path: '/home', // Створимо тимчасову "домашню" сторінку
        element: <HomePage />,
    }
]);

export const AppRouter = () => {
    return (
        <Suspense fallback={<div>Loading page...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
};