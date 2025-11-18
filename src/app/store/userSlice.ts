import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
    uid: string;
    email: string | null;
    role: 'recruiter' | 'candidate' | null; // Кастомна логіка
}

// Тип для стану зрізу
interface UserState {
    user: UserData | null;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
    user: null,
    // Починаємо в стані 'loading', щоб ProtectedRoute чекав
    status: 'loading',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Ред'юсер для встановлення користувача (при логіні)
        setUser: (state, action: PayloadAction<UserData | null>) => {
            state.user = action.payload;
            state.status = 'idle'; // Тепер статус 'idle', бо завантаження завершено
        },
        // Ред'юсер для статусу завантаження
        setAuthLoading: (state) => {
            state.status = 'loading';
        },
        // Ред'юсер для скидання користувача (при логауті)
        clearUser: (state) => {
            state.user = null;
            state.status = 'idle'; // Завантаження не потрібне
        },
    },
});

export const { setUser, setAuthLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;