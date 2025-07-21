import React from "react";
import { Box } from "@mui/material";
import { Socket } from "socket.io-client";
import AllUsers from "../../components/users/AllUsers";
import UserChatPage from "../userChatPage/UserChatPage";
import { useTheme } from "../../../../store/hooks";

export default function PrivateChatView({ socket }: { socket: Socket }) {
  const { themeStyles } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)", // Висота мінус хедер
        background: themeStyles.background,
      }}
    >
      {/* Сайдбар зі списком користувачів */}
      <Box
        sx={{
          width: "350px",
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          height: "100%",
          overflowY: "auto", // Додаємо незалежну прокрутку
        }}
      >
        <AllUsers isSidebar={true} />
      </Box>

      {/* Основне вікно чату */}
      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <UserChatPage socket={socket} />
      </Box>
    </Box>
  );
}
