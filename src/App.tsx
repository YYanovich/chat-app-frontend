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

export default function App() {
  const token = useAppSelector((state) => state.auth.accessToken);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
      }
      setSocket(null);
      return;
    }

    console.log("Створюємо новий сокет з токеном...");
    const newSocket = io(API_URL, {
      auth: { token },
    });

    setSocket(newSocket);

    return () => {
      console.log("Відключаємо старий сокет...");
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatLayout socket={socket!} />
          </ProtectedRoute>
        }
      >
        <Route path=":userID" element={<UserChatPage socket={socket!} />} />

        <Route
          index
          element={
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="h5">
                Оберіть користувача, щоб розпочати чат
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
  );
}
