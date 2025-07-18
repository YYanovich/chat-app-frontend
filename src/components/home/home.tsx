import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { login as loginAction } from "../../store/authSlice";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./styles.module.css";
import { useTheme } from "../../store/hooks";

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [error, setError] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (
    endpoint: "login" | "register",
    data: { username: string; password: string }
  ) => {
    try {
      const res = await fetch(`http://localhost:5001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.accessToken);
        dispatch(
          loginAction({
            username: result.username,
            accessToken: result.accessToken,
          })
        );
        navigate("/chat");
      } else {
        setError(result.error || "Помилка авторизації");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("Сервер недоступний");
      setTimeout(() => setError(""), 3000);
    }
  };
  return (
    <div className={`${styles.home} ${isDark ? styles.dark : styles.light}`}>
      {isRegistering ? (
        <RegisterForm
          onSubmit={(data) => handleAuth("register", data)}
          error={error}
          onBack={() => setIsRegistering(false)}
        />
      ) : (
        <LoginForm
          onSubmit={(data) => handleAuth("login", data)}
          error={error}
          onRegister={() => setIsRegistering(true)}
        />
      )}
    </div>
  );
}
