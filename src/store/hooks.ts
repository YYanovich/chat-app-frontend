import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { toggleTheme, setTheme } from "../store/uiSlice";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.ui.isDark);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSetTheme = (theme: boolean) => {
    dispatch(setTheme(theme));
    const user = localStorage.getItem("user");
    if (user) {
      localStorage.setItem(`theme_${user}`, theme ? "dark" : "light");
    }
  };

  const themeStyles = {
    background: isDark
      ? "linear-gradient(to right, #141e30, #243b55)"
      : "linear-gradient(to right, #f0f2f5, #ffffff)",
    paperBg: isDark ? "#1e1e24" : "#ffffff",
    textColor: isDark ? "#fff" : "#000",
    inputBg: isDark ? "#2f2b2b" : "#f5f5f5",
    inputColor: isDark ? "#fff" : "#000",
    labelColor: isDark ? "#aaa" : "#444",
    helperColor: isDark ? "#aaa" : "#000",
    primaryColor: isDark ? "#233cab" : "#1976d2",
    secondaryColor: isDark ? "#f48fb1" : "#dc004e",
    errorColor: "#f44336",
    successColor: "#4caf50",
  };

  return {
    isDark,
    toggleTheme: handleToggleTheme,
    handleSetTheme: handleSetTheme,
    themeStyles,
  };
};
