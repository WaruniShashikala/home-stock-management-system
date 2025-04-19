import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/category',
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
  tagTypes: ['Category'], // Changed tag type
  endpoints: (builder) => ({
    // Get All Categories
    getAllCategories: builder.query({
      query: () => '/',
      providesTags: ['Category']
    }),

    // Get Active Categories Only
    getActiveCategories: builder.query({
      query: () => '/active',
      providesTags: ['Category']
    }),

    // Get Single Category
    getCategoryById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }]
    }),

    // Search Categories
    searchCategories: builder.query({
      query: (searchTerm) => `/search?q=${searchTerm}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Category', id })), 'Category']
          : ['Category']
    }),

    // Create New Category
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/',
        method: 'POST',
        body: categoryData
      }),
      invalidatesTags: ['Category']
    }),

    // Update Category
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: categoryData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }]
    }),

    // Delete Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category']
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetActiveCategoriesQuery,
  useGetCategoryByIdQuery,
  useSearchCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;