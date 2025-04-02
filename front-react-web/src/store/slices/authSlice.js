import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/guest/login', credentials, {
                validateStatus: function (status) {
                    // Consider 307 as valid response
                    return (status >= 200 && status < 300) || status === 307;
                }
            });
            return {
                status: response.status,
                token: response.data.token,
                user: response.data.result,
                ...response.data
            };
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data?.message || 'Login failed');
        }
    }
);

// Register 
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/guest/register', userData);
            return {
                user: response.data.result,
                token: response.data.token,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Registration failed');
        }
    }
);

// Verify OTP 
export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (otpData, { rejectWithValue, getState }) => {
        try {
            const response = await apiClient.post('/guest/verify_otp', otpData);
            const state = getState().auth;

            // Return different payloads based on flow
            return {
                ...response.data,
                flowType: state.flowType // Include flowType in response
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'OTP verification failed');
        }
    }
);

// Send Mail 
export const sendMail = createAsyncThunk(
    'auth/sendMail',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/guest/send_mail', userData);
            return {
                token: response.data.token,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send email');
        }
    }
);

// logout
export const logoutUser = createAsyncThunk(
    "/auth/logoutUser", async (_, { rejectWithValue, dispatch }) => {
        try {
            // First call the logout API endpoint
            const response = await apiClient.post("/user/logout");
            // Only clear storage if API call succeeds
            if (response.status === 200) {
                localStorage.removeItem("vibe-token");
                dispatch(clearTempData());
                dispatch(logout()); // Dispatch the sync logout action
                return response.data;
            }
            throw new Error("Logout failed with status: " + response.status);

        } catch (error) {
            console.log(error);

            // Handle API errors
            return rejectWithValue(error?.response?.data?.message || "Logout failed");
        }
    });

// GET Profile Details
export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/user/details');
            return {
                user: response.data.result,
                message: response.data.message
            }

        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data?.message || 'failed to fetch profile')
        }
    }
)

// Update Profile Details
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.put('/user/update-profile', formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
            return {
                user: response.data?.result,
                message: response?.data?.message,
            }
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data?.message || 'Failed to update profile')
        }
    }
)

export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (data, { rejectWithValue }) => {
        try {
            const res = await apiClient.put('/user/update-password', data)
            return res.data.token
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data?.message || 'Failed to update password')
        }
    }
)

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    isSendingMail: false,
    isVerifyingOTP: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    error: null,
    requiresOTP: false,
    tempToken: null,
    tempEmail: null,
    tempUserData: null,
    flowType: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearTempData: (state) => {
            state.tempToken = null;
            state.tempEmail = null;
            state.tempUserData = null;
            state.requiresOTP = false;
            state.flowType = null;
        },
        setTempUserData: (state, action) => {
            state.tempUserData = action.payload;
        },
        setFlowType: (state, action) => {
            state.flowType = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('vibe-token');
        },
    },
    extraReducers: (builder) => {
        builder
            // Send Mail (OTP)
            .addCase(sendMail.pending, (state) => {
                state.isSendingMail = true;
                state.error = null;
            })
            .addCase(sendMail.fulfilled, (state, action) => {
                state.isSendingMail = false;
                state.tempToken = action.payload.token;
                // Set temp email based on flow type
                if (state.flowType === 'register') {
                    state.tempEmail = state.tempUserData?.email;
                    state.requiresOTP = true;
                }
            })
            .addCase(sendMail.rejected, (state, action) => {
                state.isSendingMail = false;
                state.error = action.payload;
            })

            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(action.payload);

                if (action.payload.status === 307) {
                    state.requiresOTP = true;
                    state.tempToken = action.payload.token;
                    state.tempEmail = action.meta.arg.email;
                    state.flowType = 'login';
                } else {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    localStorage.setItem('vibe-token', action.payload.token);
                    state.requiresOTP = false;
                }
            })
            .addCase(login.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.error = action.payload;
            })

            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.isVerifyingOTP = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isVerifyingOTP = false;
                if (state.flowType === 'login') {
                    state.user = action.payload.result;
                    state.token = action.payload.token;
                    localStorage.setItem('vibe-token', action.payload.token);
                }
                state.requiresOTP = false;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isVerifyingOTP = false;
                state.error = action.payload;
            })

            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('vibe-token', action.payload.token);
                state.tempUserData = null;
                state.flowType = null;
                state.requiresOTP = false
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Details
            .addCase(getProfile.fulfilled, (state, action) => {
                state.user = action.payload.user
            })

            // update Details
            .addCase(updateProfile.pending, (state, action) => {
                state.isUpdatingProfile = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.isUpdatingProfile = false;

            })

            // update password
            .addCase(updatePassword.pending, (state, action) => {
                state.isUpdatingPassword = true
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.isUpdatingPassword = false
                state.token = action.payload
                localStorage.setItem('vibe-token', action.payload);

            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.isUpdatingPassword = false
            })

    }
});

export const { clearTempData, setTempUserData, setFlowType, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors (export all used in components)
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectTempEmail = (state) => state.auth.tempEmail;
export const selectFlowType = (state) => state.auth.flowType;
export const selectIsSendingMail = (state) => state.auth.isSendingMail;
export const selectIsVerifyingOTP = (state) => state.auth.isVerifyingOTP;
export const selectRequiresOTP = (state) => state.auth.requiresOTP;
export const selectTempToken = (state) => state.auth.tempToken;
export const selectTempUserData = (state) => state.auth.tempUserData;
export const selectProfileUpdating = (state) => state.auth.isUpdatingProfile
export const selectPasswordUpdating = (state) => state.auth.isUpdatingPassword
