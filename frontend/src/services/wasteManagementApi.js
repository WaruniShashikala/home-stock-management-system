import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wasteManagementApi = createApi({
  reducerPath: 'wasteManagementApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      // If you need to add auth headers or others
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Waste'], // For cache invalidation
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

    // Create New Waste Item (with file upload support)
    createWaste: builder.mutation({
      query: (formData) => ({
        url: '/waste',
        method: 'POST',
        body: formData,
        headers: {
        },
      }),
      invalidatesTags: ['Waste']
    }),

    // Update Waste Item (with file upload support)
    updateWaste: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/waste/${id}`,
        method: 'PUT',
        body: formData,
        headers: {
          // No Content-Type header for FormData
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Waste', id }]
    }),

    // Delete Waste Item
    deleteWaste: builder.mutation({
      query: (id) => ({
        url: `/waste/${id}`,
        method: 'DELETE',
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