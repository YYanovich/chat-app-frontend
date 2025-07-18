import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  username: string;
  isAuth: boolean;
  accessToken: string;
}

const initialState: IAuthState = {
  username: "", 
  isAuth: !!localStorage.getItem("token"),
  accessToken: localStorage.getItem("token") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ username: string; accessToken: string }>
    ) {
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
      state.isAuth = true;
      // зберігаємо токен, щоб сесія не зникала при перезавантаженні
      localStorage.setItem("token", action.payload.accessToken);
    },
    logout(state) {
      state.username = "";
      state.accessToken = "";
      state.isAuth = false;
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;