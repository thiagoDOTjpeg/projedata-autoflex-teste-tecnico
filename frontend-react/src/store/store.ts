import { configureStore } from '@reduxjs/toolkit';
import productionReducer from './features/productionSlice';
import productsReducer from './features/productsSlice';
import rawMaterialsReducer from "./features/rawMaterialsSlice";
import systemReducer from "./features/systemSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    production: productionReducer,
    system: systemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
