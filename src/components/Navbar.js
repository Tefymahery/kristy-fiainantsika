import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/system";
import { BsSun, BsMoonStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineRead, AiOutlineAppstore, AiOutlineSearch, AiOutlineMenu } from "react-icons/ai";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const LogoImage = styled("img")({
  height: "40px",
  marginRight: "20px",
});

const MenuButton = styled(Button)(({ theme }) => ({
  margin: "0 8px",
  color: theme.palette.mode === "dark" ? "#ffffff" : "#222222",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    borderRadius: "20px",
    "& fieldset": {
      border: "none",
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "16px",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
  },
}));

const NavigationMenu = ({ darkMode, setDarkMode }) => {
  const isMobile = useMediaQuery("(max-width:800px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode); // Toggle dark/light mode
  };

  const categories = [
    { name: "Categories 1", description: "description categorie 1", articleCount: 2 },
    { name: "Categories 2", description: "description categories 2", articleCount: 0 },
    { name: "Categories 3", description: "description categories 3", articleCount: 5 },
  ];

  const handleCategoryClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const theme = useTheme();
  //console.log("Thème dans un autre composant :", theme);  // Devrait afficher le thème sans problème

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
            sx={{ mr: 2 }}
          >
            <AiOutlineMenu />
          </IconButton>
        )}
        <LogoImage
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&h=100"
          alt="Logo"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1533450718592-29d45635f0a9?auto=format&fit=crop&w=100&h=100";
          }}
        />
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <MenuButton startIcon={<AiOutlineHome />}>Home</MenuButton>
            <MenuButton startIcon={<AiOutlineRead />}>Articles</MenuButton>
            <MenuButton
              startIcon={<AiOutlineAppstore />}
              onClick={handleCategoryClick}
              aria-controls="category-menu"
              aria-haspopup="true"
            >
              Categories
            </MenuButton>
            <Menu
              id="category-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: "300px",
                  maxHeight: "400px",
                  overflow: "auto",
                },
              }}
            >
              {categories.map((category, index) => (
                <StyledMenuItem key={index} onClick={handleClose}>
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {category.name}
                      </Typography>
                      <Chip
                        label={`${category.articleCount} articles`}
                        size="small"
                        color={category.articleCount > 0 ? "primary" : "default"}
                        sx={{ borderRadius: "12px" }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                </StyledMenuItem>
              ))}
            </Menu>
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SearchField
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AiOutlineSearch />
                </InputAdornment>
              ),
            }}
            sx={{ width: isMobile ? "150px" : "250px" }}
          />
          <IconButton onClick={handleThemeToggle} sx={{ color: darkMode ? "#fff" : "#000" }} aria-label="toggle theme">
            {darkMode ? <BsSun /> : <BsMoonStars />}
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 250,
            backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
          },
        }}
      >
        <List>
          <ListItemButton>
            <ListItemIcon>
              <AiOutlineHome />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <AiOutlineRead />
            </ListItemIcon>
            <ListItemText primary="Articles" />
          </ListItemButton>
          <ListItemButton onClick={handleCategoryClick}>
            <ListItemIcon>
              <AiOutlineAppstore />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItemButton>
        </List>

      </Drawer>
    </StyledAppBar>
  );
};

export default NavigationMenu;
