import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from "redux-persist/lib/storage";
import persistStore from 'redux-persist/es/persistStore';

const rootReducer = combineReducers({
  auth: authReducer,
});


const persistConfig = {
  key: "root",
  storage, // Can be sessionStorage if needed
  whitelist: ["auth"], // Persist only auth-related state (modify accordingly)
};
const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
    }),
})
const { dispatch } = store;

export { dispatch, store }

export const persistor = persistStore(store);


