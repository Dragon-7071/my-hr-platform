import { AppRouter } from './app/router';
import { GlobalStyles } from './shared/styles/GlobalStyles';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Створюємо клієнт для React Query
const queryClient = new QueryClient();

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <GlobalStyles />
                <AppRouter />
            </QueryClientProvider>
        </Provider>
    );
}

export default App;