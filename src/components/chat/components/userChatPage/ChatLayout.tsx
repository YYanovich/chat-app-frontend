import React from "react";
import { Box } from "@mui/material";
import { Socket } from "socket.io-client";
import AllUsers from "../../components/users/AllUsers";
import { useTheme } from "../../../../store/hooks";
import { Outlet } from "react-router-dom"; // <-- Важливий імпорт

//компонент для чату з лейаутом
export default function ChatLayout({ socket }: { socket: Socket }) {
  const { themeStyles } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          width: "320px",
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <AllUsers isSidebar={true} />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
