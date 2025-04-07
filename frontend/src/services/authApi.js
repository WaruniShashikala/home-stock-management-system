import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/auth',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    // Get user profile
    getProfile: builder.query({
      query: () => '/me',
    }),

    // In your authApi.js
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/profile',
        method: 'PATCH',
        body: userData
      }),
      invalidatesTags: ['User']
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),

    // Admin: Get all users
    getAllUsers: builder.query({
      query: () => '/admin/users',
    }),

    // Admin: Update user
    adminUpdateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: userData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    // Admin: Delete user
    adminDeleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useGetAllUsersQuery,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
} = authApi;