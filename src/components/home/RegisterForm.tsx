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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useTheme } from "../../store/hooks"

interface IProps {
  onSubmit: (data: { username: string; password: string }) => void;
  error: string;
  onBack: () => void;
}

const RegisterForm: React.FC<IProps> = ({ onSubmit, error, onBack }) => {
  const { isDark, themeStyles } = useTheme();

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
        <Box
          display="flex"
          alignItems="center"
          mb={3}
        >
          <IconButton sx={{ color: themeStyles.textColor }} onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h4"
            fontWeight="bold"
            pl={10}
            sx={{ color: `${themeStyles.textColor} !important` }}
          >
            Реєстрація
          </Typography>
        </Box>

        <Controller
          name="username"
          control={control}
          rules={{
            required: "Введіть ім'я",
            minLength: { value: 3, message: "Мінімум 3 символи" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Ім'я користувача"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
              InputLabelProps={{
                style: { color: themeStyles.labelColor },
              }}
              InputProps={{
                sx: {
                  backgroundColor: themeStyles.inputBg,
                  color: themeStyles.inputColor,
                },
              }}
              FormHelperTextProps={{
                sx: { color: themeStyles.helperColor },
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: "Введіть пароль",
            minLength: { value: 6, message: "Мінімум 6 символів" },
          }}
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
                style: { color: themeStyles.labelColor },
              }}
              InputProps={{
                sx: {
                  backgroundColor: themeStyles.inputBg,
                  color: themeStyles.inputColor,
                },
              }}
              FormHelperTextProps={{
                sx: { color: themeStyles.helperColor },
              }}
            />
          )}
        />

        {error && (
          <Typography
            sx={{ color: themeStyles.errorColor }}
            variant="body2"
            mt={1}
          >
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: themeStyles.primaryColor,
            "&:hover": {
              backgroundColor: isDark ? "#1565c0" : "#1565c0",
            },
          }}
          onClick={handleSubmit(onSubmit)}
        >
          Зареєструватися
        </Button>

        <Typography
          variant="body2"
          textAlign="center"
          mt={2}
          sx={{ color: `${themeStyles.helperColor} !important` }}
        >
          Вже маєте акаунт? Натисніть стрілку назад
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
