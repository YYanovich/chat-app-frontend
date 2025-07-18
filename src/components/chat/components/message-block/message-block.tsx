import React, { useState } from "react";
import styles from "./styles.module.css";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { useTheme, useAppSelector } from "../../../../store/hooks";

interface IMessageBlockProps {
  socket: {
    emit: (event: string, ...args: any[]) => void;
    id: string;
  };
}

export default function MessageBlock({ socket }: IMessageBlockProps) {
  const { themeStyles } = useTheme();
  const [message, setMessage] = useState<string>("");

  const user = useAppSelector((state) => state.auth.username);

  const isTyping = (): void => {
    socket.emit("typing", `${localStorage.getItem("user")} пише`);
  };

  const handleSend = (event: React.FormEvent): void => {
    event.preventDefault();

    if (message.trim() && user) {
      socket.emit("message", {
        text: message,
        name: user,
        id: `${socket.id} - ${Math.random()}`,
        socketID: socket.id,
      });
      setMessage("");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ bgcolor: themeStyles.paperBg, p: 2, mt: 2, borderRadius: 3 }}
    >
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{ display: "flex", gap: 2 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Введіть повідомлення..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={isTyping}
          size="small"
          sx={{
            backgroundColor: themeStyles.inputBg,
            "& .MuiInputBase-input": {
              color: themeStyles.inputColor,
            },
            "& .MuiInputBase-input::placeholder": {
              color: themeStyles.helperColor,
              opacity: 1,
            },
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Відіслати
        </Button>
      </Box>
    </Paper>
  );
}
