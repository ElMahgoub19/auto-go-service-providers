import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceProvider, UserRole, VerificationStatus } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  provider: ServiceProvider | null;
  selectedRole: UserRole | null;
  phone: string;
  verificationStatus: VerificationStatus | null;
  isOnboarded: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  provider: null,
  selectedRole: null,
  phone: '',
  verificationStatus: null,
  isOnboarded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<UserRole>) {
      state.selectedRole = action.payload;
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    loginSuccess(state, action: PayloadAction<ServiceProvider>) {
      state.isAuthenticated = true;
      state.provider = action.payload;
      state.verificationStatus = action.payload.verificationStatus;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.provider = null;
      state.selectedRole = null;
      state.phone = '';
      state.verificationStatus = null;
    },
    setVerificationStatus(state, action: PayloadAction<VerificationStatus>) {
      state.verificationStatus = action.payload;
      if (state.provider) {
        state.provider.verificationStatus = action.payload;
        state.provider.isVerified = action.payload === 'approved';
      }
    },
    toggleOnline(state) {
      if (state.provider) {
        state.provider.isOnline = !state.provider.isOnline;
      }
    },
    setOnboarded(state) {
      state.isOnboarded = true;
    },
    updateProfile(state, action: PayloadAction<Partial<ServiceProvider>>) {
      if (state.provider) {
        state.provider = { ...state.provider, ...action.payload };
      }
    },
  },
});

export const {
  setRole,
  setPhone,
  loginSuccess,
  logout,
  setVerificationStatus,
  toggleOnline,
  setOnboarded,
  updateProfile,
} = authSlice.actions;

export default authSlice.reducer;
