import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { AxiosError } from 'axios'; // Импортируем для проверки ошибок

interface User {
    id: number;
    email: string;
}

interface AuthState {
    email: User | null;
    token: string | null;
    error: string | null;
}

const initialState: AuthState = {
    email: null,
    token: localStorage.getItem('token') || null,
    error: null,
};

interface Credentials {
    email: string;
    password: string;
}

// Асинхронный экшен для логина
export const login = createAsyncThunk<
    { user: User; token: string },
    Credentials,
    { rejectValue: string }
>('auth/login', async (credentials: Credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/login', credentials);
        const { token, user } = response.data;

        // Сохраняем токен в локальное хранилище
        localStorage.setItem('token', token);

        return { token, user };
    } catch (error) {
        let errorMessage = 'Failed to login';

        if (error instanceof AxiosError && error.response) {
            errorMessage = error.response.data.message || 'Invalid username or password';
        }

        return rejectWithValue(errorMessage);
    }
});

// Асинхронный экшен для регистрации
export const register = createAsyncThunk<void, Credentials, { rejectValue: string }>(
    'auth/register',
    async (credentials: Credentials, { rejectWithValue }) => {
        try {
            await api.post('/register', credentials);
        } catch (error) {
            let errorMessage = 'Failed to register';

            if (error instanceof AxiosError && error.response) {
                errorMessage = error.response.data.message || 'Registration error';
            }

            return rejectWithValue(errorMessage);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.email = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.email = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
