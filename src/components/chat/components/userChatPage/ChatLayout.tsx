import React from 'react';
import { Box } from '@mui/material';
import { Socket } from 'socket.io-client';
import AllUsers from '../../components/users/AllUsers';
import UserChatPage from '../userChatPage/UserChatPage';
import { useTheme } from '../../../../store/hooks';

//приватний чат з сайдбаром з можливістю вибрати користувачів та приватних повідомлень
export default function PrivateChatView({ socket }: { socket: Socket }) {
  const { themeStyles } = useTheme();
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', background: themeStyles.background }}>
      <Box
        sx={{
          width: '350px',
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <AllUsers isSidebar={true} />
      </Box>

      <Box sx={{ flexGrow: 1, height: '100%', overflowY: 'auto' }}>
        <UserChatPage socket={socket} />
      </Box>
    </Box>
  );
}