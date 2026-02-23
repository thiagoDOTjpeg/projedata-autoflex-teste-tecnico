import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/productsSlice';
import rawMaterialsReducer from "./features/rawMaterialsSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
