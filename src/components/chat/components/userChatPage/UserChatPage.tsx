import React, { useEffect, useState, useRef } from "react"; // Додаємо useRef
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../store/hooks";
import { Box, Typography, Paper, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { jwtDecode } from "jwt-decode";
import { useForm, SubmitHandler } from "react-hook-form";
import { Socket } from "socket.io-client";
import { useTheme } from "../../../../store/hooks";
import API_URL from "../../../../config";

interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
}

interface DecodedToken {
  id: string;
}

interface IFormInput {
  message: string;
}

export default function UserChatPage({ socket }: { socket: Socket }) {
  const { userID } = useParams<{ userID: string }>();
  const token = useAppSelector((state) => state.auth.accessToken);

  //Розшифровуємо токен, щоб отримати ID поточного користувача, є початок токена - Payload
  // це дані по типу id username і тд, а є кінець де є печатка або Signature,
  //  а бібліотека jwt decode бере з токена дані по типу id не ламаючи печатку в кінці.
  const currentUserId = token ? (jwtDecode(token) as DecodedToken).id : null;

  const { themeStyles } = useTheme();
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Ref для автопрокрутки

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Прокрутка при оновленні повідомлень

  // АВТОРИЗАЦІЯ
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userID || !token) return;
      try {
        const response = await fetch(`${API_URL}/api/auth/messages/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok)
          throw new Error("Не вдалося завантажити повідомлення");
        const data = await response.json();
        setMessages(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMessages();
  }, [userID, token]);

  // Цей ефект слухає вхідні повідомлення
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]); // стаивить у ...prevMessages попередні message,
      //  які були і плюс показує нові
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket]);
  /// ВІДПРАВКА без react-hook-form
  //   const handleSendMessage = (e: React.FormEvent) => {
  //     e.preventDefault(); /// без перезавантаження
  //     if (!newMessage.trim()) return; /// якшо повідолення пусте то не буде відправки
  //     console.log("Відправляємо:", newMessage);
  //     setNewMessage("");
  //   };

  /// ВІДПРАВКА з react-hook-form
  const handleSendMessage: SubmitHandler<IFormInput> = (data) => {
    if (!data.message.trim() || !socket) return;
    console.log("Відправлено повідомлення:", data.message);

    const messagePayload = {
      content: data.message,
      to: userID,
    };

    socket.emit("private_message", messagePayload);

    reset();
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: themeStyles.background,
        color: themeStyles.textColor,
      }}
    >
      <Typography variant="h5" sx={{ p: 2, pb: 1 }}>
        Чат з користувачем
      </Typography>

      {/* Контейнер для повідомлень */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
        }}
      >
        {messages.map((msg) => {
          const isMyMessage = msg.sender === currentUserId;
          return (
            <Box
              key={msg._id}
              sx={{
                display: "flex",
                justifyContent: isMyMessage ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: "8px 14px",
                  backgroundColor: isMyMessage
                    ? themeStyles.primaryColor
                    : themeStyles.paperBg,
                  color: isMyMessage
                    ? themeStyles.textColor
                    : themeStyles.textColor,
                  borderRadius: isMyMessage
                    ? "20px 20px 4px 20px"
                    : "20px 20px 20px 4px",
                  maxWidth: "75%",
                }}
              >
                <Typography variant="body1">{msg.content}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    color: isMyMessage ? themeStyles.textColor : "grey.500",
                    opacity: 0.8,
                    mt: 0.5,
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Paper>
            </Box>
          );
        })}
        <div ref={messagesEndRef} /> {/* Елемент для прокрутки */}
      </Box>

      {/* Форма відправки */}
      <Box
        component="form"
        onSubmit={handleSubmit(handleSendMessage)}
        sx={{
          p: 2,
          backgroundColor: themeStyles.paperBg,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="outlined" // Повертаємо стандартний вигляд
          placeholder="Напишіть повідомлення..."
          {...register("message", { required: true })}
          autoComplete="off"
          sx={{
            mr: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: themeStyles.inputBg,
              color: themeStyles.textColor,
            },
          }}
        />
        <IconButton type="submit" color="primary" sx={{ p: "10px" }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
