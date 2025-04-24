import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        return JSON.parse(storedAuth);
      } catch (error) {
        console.error('Failed to parse stored auth data', error);
        localStorage.removeItem('auth');
      }
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    lastActivity: null
  };
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.lastActivity = new Date().toISOString();

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          lastActivity: state.lastActivity
        }));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.lastActivity = null;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        // Merge the existing user with the updated fields
        state.user = {
          ...state.user,
          ...action.payload,
          // Ensure these critical fields aren't overwritten if not provided
          id: action.payload.id || state.user.id,
          role: action.payload.role || state.user.role
        };

        // Update localStorage
        if (typeof window !== 'undefined') {
          const storedAuth = localStorage.getItem('auth');
          if (storedAuth) {
            try {
              const authData = JSON.parse(storedAuth);
              localStorage.setItem('auth', JSON.stringify({
                ...authData,
                user: state.user
              }));
            } catch (error) {
              console.error('Error updating localStorage:', error);
            }
          }
        }
      }
    },
    refreshActivity: (state) => {
      state.lastActivity = new Date().toISOString();

      // Update localStorage
      if (typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          localStorage.setItem('auth', JSON.stringify({
            ...authData,
            lastActivity: state.lastActivity
          }));
        }
      }
    }
  }
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
  updateUser,
  refreshActivity
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectLastActivity = (state) => state.auth.lastActivity;

// Helper function to check if session is expired
export const checkSessionExpiry = (state, expiryMinutes = 30) => {
  if (!state.auth.lastActivity) return true;
  const lastActive = new Date(state.auth.lastActivity);
  const now = new Date();
  const diffInMinutes = (now - lastActive) / (1000 * 60);
  return diffInMinutes > expiryMinutes;
};

export default authSlice.reducer;