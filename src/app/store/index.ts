import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // 1. Переконайся, що цей імпорт є

const rootReducer = {
    user: userReducer, // 2. Переконайся, що 'user' тут додано
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;