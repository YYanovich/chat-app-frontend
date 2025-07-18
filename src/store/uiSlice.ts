import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const user = localStorage.getItem("user");
const savedTheme = user ? localStorage.getItem(`theme_${user}`) : null;

const initialState = {
  isDark: savedTheme ? savedTheme === "dark" : false, // дефолт - світла
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDark = !state.isDark;
    },
    setTheme(state, action: PayloadAction<boolean>) {
      state.isDark = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;