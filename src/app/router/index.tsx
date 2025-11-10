import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Використовуємо lazy loading (вимога методички) [cite: 69]
const HomePage = lazy(() => import('../../pages/HomePage'));
const LoginPage = lazy(() => import('../../pages/LoginPage'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />, // TODO: Замінити на MainLayout
    },
    {
        path: '/login',
        element: <LoginPage />, // TODO: Замінити на AuthLayout
    },
]);

export const AppRouter = () => {
    return (
        <Suspense fallback={<div>Loading page...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
};