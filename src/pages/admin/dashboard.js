import React, { useState } from "react";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaBookOpen, FaList, FaPray, FaChurch, FaCross } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export default function Dashboard({ user }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();

  const statistics = [
    { name: "Articles", count: 150, icon: <FaBookOpen size={40} color="#4caf50" /> },
    { name: "Categories", count: 25, icon: <FaList size={40} color="#2196f3" /> },
    { name: "Prayer Requests", count: 45, icon: <FaPray size={40} color="#f44336" /> },
    { name: "Online Services", count: 12, icon: <FaChurch size={40} color="#ff9800" /> },
  ];

  const prayerRequests = [
    { name: "John Doe", request: "Healing for my mother", date: "2024-01-20" },
    { name: "Jane Smith", request: "Guidance for career decision", date: "2024-01-20" },
  ];

  const dailyVerse = {
    verse: "For God so loved the world that he gave his one and only Son...",
    reference: "John 3:16",
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      <AppBar position="static">
        <Toolbar>
          <FaCross size={24} style={{ marginRight: "10px" }} />
          <Typography variant="h6">Christian Ministry Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {user.name} ({user.role})
        </Typography>
        <Grid container spacing={3}>
          {statistics.map((stat, index) => (
            <Grid item xs={12} sm={3} key={index}>
              <StyledCard>
                {stat.icon}
                <Typography variant="h4" sx={{ mt: 2 }}>
                  {stat.count}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {stat.name}
                </Typography>
              </StyledCard>
            </Grid>
          ))}

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: "400px" }}>
              <Typography variant="h6" gutterBottom>
                Daily Verse
              </Typography>
              <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 1, mt: 2 }}>
                <Typography variant="body1" gutterBottom style={{ fontStyle: "italic" }}>
                  "{dailyVerse.verse}"
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  - {dailyVerse.reference}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ width: "100%", height: "400px", overflow: "auto" }}>
              <List>
                <ListItem>
                  <Typography variant="h6">Prayer Requests</Typography>
                </ListItem>
                <Divider />
                {prayerRequests.map((prayer, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={prayer.request}
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            Requested by: {prayer.name} on {prayer.date}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// Protéger la page avec `getServerSideProps`
export async function getServerSideProps({ req }) {
  try {
    const cookies = parse(req.headers.cookie || "");
    if (!cookies.authToken) {
      throw new Error("No authentication token found");
    }

    const decoded = jwt.verify(cookies.authToken, process.env.JWT_SECRET);
    return { props: { user: decoded } };
  } catch (error) {
    return { redirect: { destination: "/admin/", permanent: false } };
  }
}
