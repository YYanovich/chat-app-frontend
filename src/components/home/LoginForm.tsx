import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "../../store/hooks"; 

interface IProps {
  onSubmit: (data: { username: string; password: string }) => void;
  error: string;
  onRegister: () => void;
}

const LoginForm: React.FC<IProps> = ({ onSubmit, error, onRegister }) => {
  const { isDark, toggleTheme, themeStyles } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: themeStyles.background,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          backgroundColor: themeStyles.paperBg,
          color: themeStyles.textColor,
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={3}>
          <IconButton 
            sx={{ color: themeStyles.textColor }} 
            onClick={toggleTheme} 
          >
            <Brightness4Icon />
          </IconButton>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{ color: themeStyles.textColor }}
          >
            Вхід у чат
          </Typography>
          <IconButton 
            onClick={onRegister}
            sx={{ color: themeStyles.primaryColor }}
          >
            <PersonAddAlt1Icon />
          </IconButton>
        </Box>

        <Controller
          name="username"
          control={control}
          rules={{ required: "Введіть ім'я" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Ім'я"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
              InputLabelProps={{ 
                style: { color: themeStyles.labelColor } 
              }}
              InputProps={{
                sx: {
                  backgroundColor: themeStyles.inputBg,
                  color: themeStyles.inputColor,
                },
              }}
              FormHelperTextProps={{
                sx: { color: themeStyles.helperColor }
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: "Введіть пароль" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{ 
                style: { color: themeStyles.labelColor } 
              }}
              InputProps={{
                sx: {
                  backgroundColor: themeStyles.inputBg,
                  color: themeStyles.inputColor,
                },
              }}
              FormHelperTextProps={{
                sx: { color: themeStyles.helperColor }
              }}
            />
          )}
        />

        {error && (
          <Typography sx={{ color: themeStyles.errorColor }} variant="body2">
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="success"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit(onSubmit)}
        >
          Увійти
        </Button>

        <Typography
          variant="body2"
          textAlign="center"
          mt={2}
          sx={{ color: `${themeStyles.helperColor} !important` }}
        >
          Ще не маєте акаунту? Натисніть на іконку зверху
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;