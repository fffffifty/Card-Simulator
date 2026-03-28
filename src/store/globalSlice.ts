import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


type InitialStateType = {
  showLogin?: boolean,
};
const initState: InitialStateType = {
  showLogin: false,
}
export const globalSlice = createSlice({
  name: 'global',
  initialState: initState,
  reducers: {
    setLogin: (state, action: PayloadAction<boolean>) => {
      return (
        {
          ...state,
          showLogin: action.payload,
        }
      );
    },
   },
});
 
export const { setLogin } = globalSlice.actions;
export default globalSlice.reducer;