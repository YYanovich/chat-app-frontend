import React from "react";
import { Box } from "@mui/material";
import { Socket } from "socket.io-client";
import AllUsers from "../../components/users/AllUsers";
import { useTheme } from "../../../../store/hooks";
import { Outlet } from "react-router-dom";

//компонент для чату з лейаутом
export default function ChatLayout({ socket }: { socket: Socket }) {
  const { themeStyles } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        // ВИПРАВЛЕНО: Займає всю доступну висоту
        height: "calc(100vh - 64px)",
        background: themeStyles.background,
      }}
    >
      {/* Ліва колонка (сайдбар) */}
      <Box
        sx={{
          width: "320px",
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          height: "100%",
          display: "flex",
        }}
      >
        <AllUsers isSidebar={true} />
      </Box>

      {/* Права колонка (чат) */}
      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          // ВИПРАВЛЕНО: Запобігає виштовхуванню контентом
          minWidth: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
