import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Тип для даних користувача, які ми зберігаємо
interface UserData {
    uid: string;
    email: string | null;
    role: 'recruiter' | 'candidate' | null; // Наша кастомна логіка
}

// Тип для стану зрізу
interface UserState {
    user: UserData | null;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
    user: null,
    status: 'idle',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Редьюсер для встановлення користувача (при логіні)
        setUser: (state, action: PayloadAction<UserData | null>) => {
            state.user = action.payload;
            state.status = 'idle';
        },
        // Редьюсер для статусу завантаження
        setAuthLoading: (state) => {
            state.status = 'loading';
        },
        // Редьюсер для скидання користувача (при логауті)
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, setAuthLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;