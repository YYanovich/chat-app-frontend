import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { logout } from "../../../../store/authSlice";
import {
  Button,
  Typography,
  Box,
  Paper,
  Stack
} from "@mui/material";

interface IMessage {
  id: string;
  name: string;
  text: string;
  timestamp?: string;
}

interface BodyProps {
  messages: IMessage[];
  status: string;
}

const Body: React.FC<BodyProps> = ({ messages, status }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { themeStyles, isDark } = useTheme();

  const handleLeave = (): void => {
    dispatch(logout());
    navigate("/");
  };

  const currentUser = useAppSelector((state) => state.auth.username);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 7,
        }}
      >
        <Button
          variant="contained"
          onClick={handleLeave}
          sx={{ backgroundColor: themeStyles.errorColor }}
        >
          Вийти
        </Button>
      </Box>

      <Stack spacing={2} sx={{ p: 2, overflowY: "auto" }}>
        {messages.map((element: IMessage) =>
          element.name === currentUser ? (
            <Stack key={element.id} direction="row" justifyContent="flex-end">
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  maxWidth: "70%",
                  bgcolor: themeStyles.inputBg,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: themeStyles.textColor, mb: 0.5, display: "block", textAlign: "right" }}
                >
                  Ви
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: themeStyles.textColor, textAlign: "right" }}
                >
                  {element.text}
                </Typography>
              </Paper>
            </Stack>
          ) : (
            <Stack key={element.id} direction="row" justifyContent="flex-start">
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  maxWidth: "70%",
                  bgcolor: themeStyles.paperBg,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: themeStyles.textColor, mb: 0.5, display: "block", textAlign: "left" }}
                >
                  {element.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: themeStyles.textColor, textAlign: "left" }}
                >
                  {element.text}
                </Typography>
              </Paper>
            </Stack>
          )
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: themeStyles.secondaryColor }}>
            {status}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default Body;