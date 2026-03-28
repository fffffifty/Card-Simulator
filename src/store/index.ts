import { configureStore } from '@reduxjs/toolkit';
import globalSliceReducer from './globalSlice';
import { useDispatch } from 'react-redux';

// configureStore创建一个redux数据
const store =  configureStore({
 reducer: {
    global: globalSliceReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export default store;