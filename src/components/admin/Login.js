import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";  // Importez le hook useUser
import { useRouter } from 'next/router';
//import axios from 'axios';  // Si tu utilises axios pour effectuer les requêtes HTTP
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";



const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: 16,
    boxShadow: theme.palette.mode === "dark"
      ? "0 8px 24px rgba(0, 0, 0, 0.5)"
      : "0 8px 24px rgba(0, 0, 0, 0.12)",
    background: theme.palette.mode === "dark"
      ? theme.palette.background.default
      : "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
  }));


const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 4px 12px rgba(255, 255, 255, 0.1)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
    "& fieldset": {
        borderColor: theme?.palette?.primary?.main || "#1976d2", // Définit une couleur par défaut
      },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: "12px 24px",
  fontSize: "1rem",
  textTransform: "none",
  transition: "all 0.3s ease-in-out",
  background: theme.palette.mode === "dark"
    ? theme.palette.primary.dark
    : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 16px rgba(33, 150, 243, 0.7)"
        : "0 8px 16px rgba(33, 150, 243, 0.3)",
  },
}));

const LoginComponent = () => {
  const theme = useTheme(); // Récupère le thème dynamique
  const router = useRouter();
  const { login } = useUser();  // Désestructurez le login depuis le contexte
  //console.log("Thème dans LoginComponent :", theme.palette.primary); // Debug
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error"
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
  
    // Validation du formulaire
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
  
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);  // Vérifiez la structure de la réponse ici
        const { name, role } = data.user;  // Extraire name et role de l'objet user
  
        // Appeler la fonction login du contexte pour mettre à jour l'utilisateur dans le contexte
        login(name, role);
  
        setSnackbar({
          open: true,
          message: 'Login successful!',
          severity: 'success',
        });
  
        // Rediriger vers le tableau de bord
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.msg || 'Login failed. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'An unexpected error occurred.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease-in-out",
            backgroundColor: theme.palette.background.default,
        }}
      >
        <StyledPaper elevation={0}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: 700, mb: 4 }}
          >
            Welcome Back
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaEnvelope />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaLock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
              </Grid>

              <Grid item xs={12}>
                <StyledButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </StyledButton>
              </Grid>

              <Grid item xs={12} container justifyContent="space-between">
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                >
                  Forgot Password?
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                >
                  Create Account
                </Typography>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default LoginComponent;