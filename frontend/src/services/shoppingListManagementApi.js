import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shoppingListApi = createApi({
  reducerPath: 'shoppingListApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/shoppinList',
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
  tagTypes: ['ShoppingListItem'], // Updated tag type
  endpoints: (builder) => ({
    // Get All Shopping List Items
    getAllListItems: builder.query({
      query: () => '/',
      providesTags: ['ShoppingListItem']
    }),

    // Get Single Shopping List Item
    getListItemById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'ShoppingListItem', id }]
    }),

    // Search Shopping List Items
    searchListItems: builder.query({
      query: (searchTerm) => `/search?q=${searchTerm}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'ShoppingListItem', id })), 'ShoppingListItem']
          : ['ShoppingListItem']
    }),

    // Create New Shopping List Item
    createListItem: builder.mutation({
      query: (itemData) => ({
        url: '/',
        method: 'POST',
        body: itemData
      }),
      invalidatesTags: ['ShoppingListItem']
    }),

    // Update Shopping List Item
    updateListItem: builder.mutation({
      query: ({ id, ...itemData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: itemData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ShoppingListItem', id }]
    }),

    // Delete Shopping List Item
    deleteListItem: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShoppingListItem']
    }),
  }),
});

export const {
  useGetAllListItemsQuery,
  useGetListItemByIdQuery,
  useSearchListItemsQuery,
  useCreateListItemMutation,
  useUpdateListItemMutation,
  useDeleteListItemMutation,
} = shoppingListApi;