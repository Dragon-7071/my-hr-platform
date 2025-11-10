import { configureStore } from '@reduxjs/toolkit';

// Пізніше ми додамо сюди 'slices'
const rootReducer = {};

export const store = configureStore({
    reducer: rootReducer,
});

// Експортуємо типи для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;