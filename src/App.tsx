import { AppRouter } from './app/router';
import { GlobalStyles } from './shared/styles/GlobalStyles';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './shared/api/firebase'; // Імпорт auth та db
import { setUser, setAuthLoading } from './app/store/userSlice';
import { doc, getDoc } from 'firebase/firestore';

const queryClient = new QueryClient();

// Компонент, який буде слухати стан автентифікації
const AuthStateListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAuthLoading()); // Починаємо завантаження

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Користувач залогінений
                // Отримуємо його 'role' з Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    dispatch(setUser({
                        uid: user.uid,
                        email: user.email,
                        role: userData.role || null, // Отримуємо роль
                    }));
                } else {
                    // Якщо раптом документа немає (буває при помилках реєстрації)
                    dispatch(setUser({
                        uid: user.uid,
                        email: user.email,
                        role: null,
                    }));
                }
            } else {
                // Користувач не залогінений
                dispatch(setUser(null));
            }
        });

        // Відписуємося від слухача при закритті компонента
        return () => unsubscribe();
    }, [dispatch]);

    return <AppRouter />;
};

function App() {
    return (
        // Provider з Redux має бути ЗОВНІ
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <GlobalStyles />
                <AuthStateListener />
            </QueryClientProvider>
        </Provider>
    );
}

export default App;