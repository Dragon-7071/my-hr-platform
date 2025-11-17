import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute'; // Імпортуємо наш захист


const HomePage = lazy(() => import('../../pages/HomePage'));
const LoginPage = lazy(() => import('../../pages/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/RegisterPage'));

const CreateJobPage = lazy(() => import('../../pages/CreateJobPage'));
const JobSearchPage = lazy(() => import('../../pages/JobSearchPage'));
const JobDetailsPage = lazy(() => import('../../pages/JobDetailsPage'));
const JobApplicationsPage = lazy(() => import('../../pages/JobApplicationsPage'));
const AnalyticsPage = lazy(() => import('../../pages/AnalyticsPage'));
const MyApplicationsPage = lazy(() => import('../../pages/MyApplicationsPage'));

const router = createBrowserRouter([
    // Публічні роути
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },

    // Роути, які вимагають входу (будь-яка роль)
    {
        element: <ProtectedRoute allowedRoles={['candidate', 'recruiter']} />,
        children: [
            {
                path: '/home',
                element: <HomePage />,
            },
            {
                path: '/job/:jobId', // :jobId - це динамічний параметр
                element: <JobDetailsPage />,
            }
        ],
    },

    // Роути ТІЛЬКИ ДЛЯ РЕКРУТЕРІВ
    {
        element: <ProtectedRoute allowedRoles={['recruiter']} />,
        children: [
            {
                path: '/create-job',
                element: <CreateJobPage />,
            },
            {
                path: '/job/:jobId/applications',
                element: <JobApplicationsPage />,
            },
            {
                path: '/analytics',
                element: <AnalyticsPage />,
            },
        ],
    },

    // Роути тільки для кандидатів
    {
        element: <ProtectedRoute allowedRoles={['candidate']} />,
        children: [
            {
                path: '/search-jobs',
                element: <JobSearchPage />,
            },
            {
                path: '/my-applications',
                element: <MyApplicationsPage />,
            },
        ],
    },

    // Редірект з головної
    {
        path: '/',
        element: <Navigate to="/home" replace />,
    },
]);

export const AppRouter = () => {
    return (
        <Suspense fallback={<div>Loading page...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
};