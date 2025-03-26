import { configureStore } from '@reduxjs/toolkit';
import { wasteManagementApi } from '../services/wasteManagementApi';

export const store = configureStore({
  reducer: {
    [wasteManagementApi.reducerPath]: wasteManagementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wasteManagementApi.middleware),
});
