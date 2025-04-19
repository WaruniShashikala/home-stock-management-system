import { configureStore } from '@reduxjs/toolkit';
import { wasteManagementApi } from '../services/wasteManagementApi';
import { foodApi } from '../services/foodManagementApi'; 
import { productManagementApi } from '../services/productManagementApi';
import { budgetManagementApi } from '../services/budgetManagementApi';
import { authApi } from '../services/authApi';
import authReducer from '../slice/authSlice'; 
import { categoryApi } from '../services/categoryManagementApi';
import { shoppingListApi } from '../services/shoppingListManagementApi';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth reducer
    [authApi.reducerPath]: authApi.reducer,
    [wasteManagementApi.reducerPath]: wasteManagementApi.reducer,
    [foodApi.reducerPath]: foodApi.reducer, 
    [productManagementApi.reducerPath]: productManagementApi.reducer,
    [budgetManagementApi.reducerPath]: budgetManagementApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [shoppingListApi.reducerPath]: shoppingListApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(wasteManagementApi.middleware)
      .concat(foodApi.middleware)
      .concat(productManagementApi.middleware)
      .concat(budgetManagementApi.middleware)
      .concat(categoryApi.middleware)
      .concat(shoppingListApi.middleware),
});