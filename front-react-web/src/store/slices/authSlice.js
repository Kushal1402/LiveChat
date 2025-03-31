// features/auth/authSlice.ts
import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/guest/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/guest/verify_otp', otpData);
            console.log(response);            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const sendMail = createAsyncThunk(
    'auth/sendMail',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/guest/send_mail', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const initialState = {
    user: null,
    tokens: null,
    isLoading: false,
    isRegistering: false,
    isVerifyingOTP: false,
    error: null,
  };
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.tokens = null;
            state.error = null;
            // Clear tokens from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.tokens = action.payload.tokens;
                // Store tokens in localStorage
                localStorage.setItem('accessToken', action.payload.tokens.accessToken);
                localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            })

            // Registration
            .addCase(register.pending, (state) => {
                state.isRegistering = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.isRegistering = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isRegistering = false;
                state.error = action.payload
            })

           
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;