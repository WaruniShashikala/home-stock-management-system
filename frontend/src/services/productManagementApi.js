import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productManagementApi = createApi({
  reducerPath: 'productManagementApi',
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
  tagTypes: ['Product'], // For cache invalidation
  endpoints: (builder) => ({
    // Get All Products
    getAllProducts: builder.query({
      query: () => '/products',
      providesTags: ['Product']
    }),

    // Get Single Product
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }]
    }),

    // Create New Product (with file upload support)
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Product']
    }),

    // Update Product
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: productData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }]
    }),

    // Delete Product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product']
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productManagementApi;