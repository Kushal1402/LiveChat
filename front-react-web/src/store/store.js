import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';


const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
const { dispatch } = store;

export { dispatch, store }

