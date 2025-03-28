import { configureStore } from '@reduxjs/toolkit';
import { wasteManagementApi } from '../services/wasteManagementApi';
import { foodApi } from '../services/foodManagementApi'; 
import { productManagementApi } from '../services/productManagementApi';
import { budgetManagementApi } from '../services/budgetManagementApi';

export const store = configureStore({
  reducer: {
    [wasteManagementApi.reducerPath]: wasteManagementApi.reducer,
    [foodApi.reducerPath]: foodApi.reducer, 
    [productManagementApi.reducerPath]: productManagementApi.reducer,
    [budgetManagementApi.reducerPath]: budgetManagementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(wasteManagementApi.middleware)
      .concat(foodApi.middleware)
      .concat(productManagementApi.middleware)
      .concat(budgetManagementApi.middleware), 
});