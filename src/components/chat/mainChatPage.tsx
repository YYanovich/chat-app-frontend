import Sidebar from "./components/sidebar/sidebar";
import Body from "./components/body/body";
import MessageBlock from "./components/message-block/message-block";
import styles from "../chat/components/styles.module.css";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { useTheme } from "../../store/hooks";
import { useAppSelector } from "../../store/hooks";

interface IUser {
  id: string;
  name: string;
}

interface ISocketType {
  emit: (event: string, ...args: any[]) => void;
  id: string;
  on: (event: string, callback: (data: any) => void) => void;
  off?: (event: string, callback?: (data: any) => void) => void;
}

interface IChatPageProps {
  socket: any;
}

export default function ChatPage({ socket }: IChatPageProps) {
  const { themeStyles } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");
  const username = useAppSelector((state) => state.auth.username);

  useEffect(() => {
    if (!socket) return;
    if (username) {
      socket.emit("newUser", { user: username, socketID: socket.id });
    }
  }, [socket, username]);

  useEffect(() => {
    if (!socket) return;
    const handleResponse = (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("response", handleResponse);

    return () => {
      if (socket.off) {
        socket.off("response", handleResponse);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const handleResponseTyping = (data: string) => {
      setStatus(data);
      setTimeout(() => setStatus(""), 1000);
    };

    socket.on("responseTyping", handleResponseTyping);

    return () => {
      if (socket.off) {
        socket.off("responseTyping", handleResponseTyping);
      }
    };
  }, [socket]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: themeStyles.background,
      }}
    >
      <Box
        sx={{
          width: 280,
          borderRight: "1px solid #333",
          bgcolor: "#20232a",
          display: { xs: "none", sm: "block" },
        }}
      >
        <Sidebar socket={socket} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: "900px",
          margin: "0 auto",
          p: { xs: 1, sm: 3 },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            mb: 2,
            overflow: "hidden",
            background: "transparent",
            boxShadow: "none",
          }}
        >
          <Body messages={messages} status={status} />
        </Paper>
        <MessageBlock socket={socket} />
      </Box>
    </Box>
  );
}