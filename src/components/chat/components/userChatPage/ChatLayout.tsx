import React from "react";
import { Box } from "@mui/material";
import { Socket } from "socket.io-client";
import AllUsers from "../../components/users/AllUsers";
import { useTheme } from "../../../../store/hooks";
import { Outlet } from "react-router-dom"; // <-- Важливий імпорт

export default function PrivateChatView({ socket }: { socket: Socket }) {
  const { themeStyles } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)", // Висота екрану мінус хедер
        background: themeStyles.background,
      }}
    >
      {/* Ліва колонка (сайдбар) */}
      <Box
        sx={{
          width: "350px",
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AllUsers isSidebar={true} />
      </Box>

      {/* Права колонка (тут буде відображатись чат) */}
      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Outlet рендерить дочірній маршрут (UserChatPage) */}
        <Outlet />
      </Box>
    </Box>
  );
}
