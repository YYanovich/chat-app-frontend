import React from 'react';
import { Box } from '@mui/material';
import { Socket } from 'socket.io-client';
import AllUsers from '../../components/users/AllUsers';
import UserChatPage from '../userChatPage/UserChatPage';

//приватний чат з сайдбаром з можливістю вибрати користувачів та приватних повідомлень
export default function PrivateChatView({ socket }: { socket: Socket }) {
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <Box
        sx={{
          width: '350px',
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <AllUsers isSidebar={true} />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <UserChatPage socket={socket} />
      </Box>
    </Box>
  );
}