import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const budgetManagementApi = createApi({
  reducerPath: 'budgetManagementApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const authDataString = localStorage.getItem('auth');
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          const userId = authData?.user?._id;
          headers.set('Accept', 'application/json');
          headers.set('Content-Type', 'application/json');
          if (userId) {
            headers.set('X-User-Id', userId);
          }
          const token = authData?.token;
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          
        } catch (error) {
          console.error('Failed to parse auth data from localStorage', error);
        }
      }
      return headers;
    }
  }),
  tagTypes: ['Budget'], // For cache invalidation
  endpoints: (builder) => ({
    // Get All Budgets
    getAllBudgets: builder.query({
      query: () => '/budgets',
      providesTags: ['Budget']
    }),

    // Get Single Budget
    getBudgetById: builder.query({
      query: (id) => `/budgets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Budget', id }]
    }),

    // Create New Budget
    createBudget: builder.mutation({
      query: (budgetData) => ({
        url: '/budgets',
        method: 'POST',
        body: budgetData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Budget']
    }),

    // Update Budget
    updateBudget: builder.mutation({
      query: ({ id, ...budgetData }) => ({
        url: `/budgets/${id}`,
        method: 'PUT',
        body: budgetData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Budget', id }]
    }),

    // Delete Budget
    deleteBudget: builder.mutation({
      query: (id) => ({
        url: `/budgets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Budget']
    }),
  }),
});

export const {
  useGetAllBudgetsQuery,
  useGetBudgetByIdQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetManagementApi;