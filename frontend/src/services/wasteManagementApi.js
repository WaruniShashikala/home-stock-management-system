import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wasteManagementApi = createApi({
  reducerPath: 'wasteManagementApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const authDataString = localStorage.getItem('auth');
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          const userId = authData?.user?._id;
          headers.set('Accept', 'application/json');
          // Don't set Content-Type here - it will be set automatically based on the body
          if (userId) {
            headers.set('X-user-id', userId); // Standard header format (lowercase)
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
  tagTypes: ['Waste'],
  endpoints: (builder) => ({
    // Get All Waste Data
    getAllWaste: builder.query({
      query: () => '/waste',
      providesTags: ['Waste']
    }),

    // Get Single Waste Item
    getWasteById: builder.query({
      query: (id) => `/waste/${id}`,
      providesTags: (result, error, id) => [{ type: 'Waste', id }]
    }),

    // Create New Waste Item (supports both JSON and FormData)
    createWaste: builder.mutation({
      query: (data) => {
        const isFormData = data instanceof FormData;
        return {
          url: '/waste',
          method: 'POST',
          body: data,
          // Don't set Content-Type for FormData - browser will handle it
          headers: isFormData ? {} : { 'Content-Type': 'application/json' }
        };
      },
      invalidatesTags: ['Waste']
    }),

    // Update Waste Item (supports both JSON and FormData)
    updateWaste: builder.mutation({
      query: ({ id, ...data }) => {
        const isFormData = data instanceof FormData;
        return {
          url: `/waste/${id}`,
          method: 'PUT',
          body: data,
        
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Waste', id }]
    }),

    // Delete Waste Item
    deleteWaste: builder.mutation({
      query: (id) => ({
        url: `/waste/${id}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ['Waste']
    }),
  }),
});

export const {
  useGetAllWasteQuery,
  useGetWasteByIdQuery,
  useCreateWasteMutation,
  useUpdateWasteMutation,
  useDeleteWasteMutation,
} = wasteManagementApi;