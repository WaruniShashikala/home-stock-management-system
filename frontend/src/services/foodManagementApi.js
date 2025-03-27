import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const foodApi = createApi({
  reducerPath: 'foodApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/food',
    prepareHeaders: (headers) => {
      // Add headers if needed (e.g., authorization)
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Food'], // For cache invalidation
  endpoints: (builder) => ({
    // Get All Food Items
    getAllFoods: builder.query({
      query: () => '/',
      providesTags: ['Food']
    }),

    // Get Single Food Item
    getFoodById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Food', id }]
    }),

    // Search Food Items
    searchFoods: builder.query({
      query: (searchTerm) => `/search?q=${searchTerm}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Food', id })), 'Food']
          : ['Food']
    }),

    // Create New Food Item
    createFood: builder.mutation({
      query: (foodData) => ({
        url: '/',
        method: 'POST',
        body: foodData
      }),
      invalidatesTags: ['Food']
    }),

    // Update Food Item
    updateFood: builder.mutation({
      query: ({ id, ...foodData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: foodData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Food', id }]
    }),

    // Delete Food Item
    deleteFood: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Food']
    }),
  }),
});

export const {
  useGetAllFoodsQuery,
  useGetFoodByIdQuery,
  useSearchFoodsQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
} = foodApi;