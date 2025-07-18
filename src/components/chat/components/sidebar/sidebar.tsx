import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../store/hooks";
import { Socket } from "socket.io-client";

interface IUser {
  username: string;
  socketID: string;
}

interface SidebarProps {
  socket: Socket;
}

export default function Sidebar({ socket }: SidebarProps) {

  
  const [users, setUsers] = useState<IUser[]>([]);
  const { themeStyles } = useTheme();

  useEffect(() => {
    if (!socket) return;

    const handleUserListUpdate = (data: IUser[]) => {
      setUsers(data);
    };

    socket.on("responseNewUser", handleUserListUpdate);
    socket.on("usersList", handleUserListUpdate);

    socket.emit("getUsers");

    return () => {
      socket.off("responseNewUser", handleUserListUpdate);
      socket.off("usersList", handleUserListUpdate);
    };
  }, [socket]);

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: themeStyles.paperBg,
        color: themeStyles.textColor,
        p: 2,
        borderRight: "1px solid #333",
        minWidth: 220,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Користувачі онлайн
        </Typography>
        <Divider
          sx={{ mb: 2, bgcolor: themeStyles.primaryColor, opacity: 0.3 }}
        />
        <List dense>
          {users.map((element) => (
            <ListItem
              key={element.socketID}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                mb: 0.5,
                bgcolor: themeStyles.inputBg,
                color: themeStyles.textColor,
                fontWeight: 500,
                fontSize: 15,
                textAlign: "center",
                "&:hover": {
                  bgcolor: themeStyles.primaryColor,
                  color: themeStyles.paperBg,
                },
                cursor: "pointer",
              }}
            >
              {element.username}
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Button component={Link} to="/users" variant="contained" fullWidth>
          Пошук користувачів
        </Button>
      </Box>
    </Box>
  );
}
