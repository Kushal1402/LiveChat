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
            const response = await apiClient.post(`/${otpData.request_type === 4 ? 'user' : 'guest'}/verify_otp`, otpData);

            const state = getState().auth;

            // Return different payloads based on flow
            return {
                ...response.data,
                flowType: state.flowType // Include flowType in response
            };
        } catch (error) {
            console.log(error?.response?.data?.message);

            return rejectWithValue(error?.response?.data?.message || 'OTP verification failed');
        }
    }
);

// Send Mail 
export const sendMail = createAsyncThunk(
    'auth/sendMail',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/${userData.request_type === 4 ? 'user' : 'guest'}/send_mail`, userData);
            return {
                token: response.data.token,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to Send Otp');
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
// update password
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

// reset forgot password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, { rejectWithValue }) => {
        try {
            const res = await apiClient.put('/guest/forget-password-reset', data)
            return res.data.message

        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data?.message || 'Failed to Reset the password')
        }
    }
)

// 2FA update
export const update2FA = createAsyncThunk(
    'auth/update2FA',
    async (data, { rejectWithValue }) => {
        try {
            const res = await apiClient.put('/user/update-authentication', data)
            console.log(res);
            return res.data?.two_factor_authentication
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.data?.message)
        }
    }
)

// Update Email Address
export const updateEmail = createAsyncThunk(
    'auth/updateEmail',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/user/update-email', data)
            console.log(response);
            return {
                user: response.data.result,
                ...response.data
            };
        } catch (error) {
            console.log(error);
            
            return rejectWithValue(error?.response?.data?.message)
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
    isResetingPassword: false,
    isUpdatingEmail: false,
    isUpdating2FA: false,
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
        setIs2FAEnabled: (state, action) => {
            state.user.two_factor_authentication = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('vibe-token');
        },
    },
    extraReducers: (builder) => {
        builder
            // Send Mail (OTP)
            .addCase(sendMail.pending, (state) => {
                state.isSendingMail = true;
            })
            .addCase(sendMail.fulfilled, (state, action) => {
                state.isSendingMail = false;
                state.tempToken = action.payload.token;
                // Set temp email based on flow type
                if (state.flowType === 'register') {
                    state.tempEmail = state.tempUserData?.email;
                    state.requiresOTP = true;
                }
                if (state.flowType === 'forgot-password') {
                    state.tempEmail = action.meta.arg.email;
                    state.requiresOTP = true;
                }
            })
            .addCase(sendMail.rejected, (state, action) => {
                state.isSendingMail = false;
            })

            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
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
            })

            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.isVerifyingOTP = true;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isVerifyingOTP = false;
                if (['login'].includes(state.flowType)) {
                    state.user = action.payload.result;
                    state.token = action.payload.token;
                    localStorage.setItem('vibe-token', action.payload.token);
                    state.flowType = null
                }
                state.requiresOTP = false;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isVerifyingOTP = false;
                state.requiresOTP = false;
            })

            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
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
            .addCase(updateProfile.rejected, (state, action) => {
                state.isUpdatingProfile = false
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

            // reset password 
            .addCase(resetPassword.pending, (state, action) => {
                state.isResetingPassword = true
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isResetingPassword = false
                state.flowType = null;
                state.requiresOTP = false
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isResetingPassword = false
                state.flowType = null
            })

            // Update 2FA
            .addCase(update2FA.pending, (state, action) => {
                state.isUpdating2FA = true
            })
            .addCase(update2FA.fulfilled, (state, action) => {
                state.user.two_factor_authentication = action.payload
                state.isUpdating2FA = false
            })
            .addCase(update2FA.rejected, (state, action) => {
                state.isUpdating2FA = false
            })

            .addCase(updateEmail.pending, (state, action) => {
                state.isUpdatingEmail = true
            })
            .addCase(updateEmail.fulfilled, (state, action) => {
                state.isUpdatingEmail = false
                state.tempToken = null
                state.user = action.payload.user
                state.flowType = null

            })
            .addCase(updateEmail.rejected, (state, action) => {
                state.isUpdatingEmail = false
                state.flowType = null
            })


    }
});

export const { clearTempData, setTempUserData, setFlowType, logout, setIs2FAEnabled } = authSlice.actions;
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
export const selectPasswordReseting = (state) => state.auth.isResetingPassword
export const selectUpdating2FA = (state) => state.auth.isUpdating2FA
export const selectIsUpdatingMail = (state) => state.auth.isUpdatingEmail


