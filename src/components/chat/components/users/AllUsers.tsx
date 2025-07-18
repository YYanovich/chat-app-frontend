import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Box,
  Pagination,
} from "@mui/material";
import { useTheme, useAppSelector } from "../../../../store/hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

interface User {
  _id: string;
  username: string;
}
interface ISearch {
  search: string;
}
//"?" - значить шо він не обов'язковий
//                  ||
//                  \/
export default function AllUsers({ isSidebar }: { isSidebar?: boolean }) {
  const { themeStyles } = useTheme();
  const token = useAppSelector((state) => state.auth.accessToken);

  const [users, setUsers] = useState<User[]>([]);
  // const [inputValue, setInputValue] = useState(""); без react-hook-form
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { register, watch } = useForm<ISearch>(); //з react-hook-form
  const currentSearchValue = watch("search"); //з react-hook-form

  useEffect(() => {
    //отримуємо дані з сервер та використовуємо їх на фронтенді
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/users?page=${currentPage}&limit=10&search=${debouncedInputValue}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Не вдалося завантажити користувачів");
        }

        const data = await response.json();
        setUsers(Array.isArray(data.users) ? data.users : []); //перевіряємо чи є дані з data масивом бо якщо ні
        //то просто буде пустий масив шоб map коректно працювало
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Помилка завантаження:", error);
        setUsers([]);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token, currentPage, debouncedInputValue]);

  useEffect(() => {
    //дебаунс для оптимізації
    const debouncedTimer = setTimeout(() => {
      setDebouncedInputValue(currentSearchValue);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(debouncedTimer);
    };
  }, [currentSearchValue]);

  const navigate = useNavigate(); //для безшовного перехожу без перезавнтаження

  const handleUserClick = (userID: string, username: string) => {
    //обробник для переходу на сторінку користувача
    console.log(`Обрано користувача ${username} з ID ${userID}`);
    navigate(`/chat/${userID}`);
  };

  const handlePageChange = (
    //обробник для зміни сторінок
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <Box
      sx={{
        ...(isSidebar
          ? {
              p: 2,
              minHeight: "95vh",
              overflowY: "auto",
              background: themeStyles.background,
              color: themeStyles.textColor,
              pt: 4,
            }
          : {
              minWidth: "107rem",
              minHeight: "100vh",
              p: 3,
              background: themeStyles.background,
              color: themeStyles.textColor,
              boxSizing: "border-box",
              pl: 25,
            }),
      }}
    >
      <Box
        sx={{
          ...(isSidebar
            ? {
                width: "100%",
              }
            : {
                maxWidth: "500px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                pl: 55,
              }),
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          {isSidebar ? "Чати" : "Користувачі"}
        </Typography>

        <TextField
          label="Пошук користувачів"
          // value={inputValue}                               без react-hook-form
          // onChange={(e) => setInputValue(e.target.value)}  без react-hook-form
          {...register("search")} //з react-hook-form
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: themeStyles.paperBg,
              "& fieldset": {
                borderColor: themeStyles.inputBg,
              },
              "&:hover fieldset": {
                borderColor: themeStyles.primaryColor,
              },
              "&.Mui-focused fieldset": {
                borderColor: themeStyles.primaryColor,
              },
            },
            "& .MuiInputLabel-root": {
              color: themeStyles.textColor,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: themeStyles.primaryColor,
            },
            input: { color: themeStyles.textColor },
          }}
        />

        <List sx={isSidebar ? { width: "100%", top: 12 } : { width: "100%" }}>
          {users.map((user) => (
            <ListItem
              onClick={() => handleUserClick(user._id, user.username)}
              key={user._id}
              sx={{
                bgcolor: themeStyles.paperBg,
                border: `1px solid ${themeStyles.inputBg}`,
                borderRadius: "8px",
                mb: 2.5,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: themeStyles.primaryColor,
                  color: themeStyles.paperBg,
                  borderColor: themeStyles.primaryColor,
                },
              }}
            >
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
        <Pagination
          sx={
            isSidebar
              ? {
                  mt: "auto",
                  pt: 5.5, 
                  alignSelf: "center",
                  ml: 7.4,
                  "& .MuiPaginationItem-root": {
                    color: themeStyles.textColor,
                  }, 
                }
              : { 
                  "& .MuiPaginationItem-root": {
                    color: themeStyles.textColor,
                  },
                }
          }
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        ></Pagination>
      </Box>
    </Box>
  );
}