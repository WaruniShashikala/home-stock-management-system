import { configureStore } from '@reduxjs/toolkit';
import { wasteManagementApi } from '../services/wasteManagementApi';
import { foodApi } from '../services/foodManagementApi'; 

export const store = configureStore({
  reducer: {
    [wasteManagementApi.reducerPath]: wasteManagementApi.reducer,
    [foodApi.reducerPath]: foodApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(wasteManagementApi.middleware)
      .concat(foodApi.middleware), 
});