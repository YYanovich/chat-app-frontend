import "./App.css";
import { io, Socket } from "socket.io-client";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import AllUsers from "./components/chat/components/users/AllUsers";
import UserChatPage from "./components/chat/components/userChatPage/UserChatPage";
import ChatLayout from "./components/chat/components/userChatPage/ChatLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAppSelector } from "./store/hooks";
import { useEffect, useState } from "react";
import API_URL from "./config";
import { Box, Typography } from "@mui/material";
import { useTheme } from "./store/hooks";

export default function App() {
  const token = useAppSelector((state) => state.auth.accessToken);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { themeStyles } = useTheme();

  useEffect(() => {
    if (token) {
      const newSocket = io(API_URL, {
        auth: { token },
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) socket.disconnect();
      setSocket(null);
    }
  }, [token]);

  return (
    <Box sx={{ background: themeStyles.background, minHeight: "100vh" }}>
      {/* <Header />  <-- ПРИБРАНО, бо його не існує */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              {socket ? (
                <ChatLayout socket={socket} />
              ) : (
                <div>Завантаження...</div>
              )}
            </ProtectedRoute>
          }
        >
          <Route
            path=":userID"
            element={socket ? <UserChatPage socket={socket} /> : null}
          />
          <Route
            index
            element={
              <Box
                sx={{
                  p: 3,
                  color: themeStyles.textColor,
                  textAlign: "center",
                  mt: 5,
                }}
              >
                <Typography variant="h6">
                  Оберіть чат, щоб почати спілкування
                </Typography>
              </Box>
            }
          />
        </Route>
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AllUsers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}
