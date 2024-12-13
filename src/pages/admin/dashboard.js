import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import { styled } from "@mui/system";
import { FaBookOpen, FaList, FaPray, FaChurch, FaCross } from "react-icons/fa";
import { useTheme } from "@mui/material/styles"; // Import pour utiliser le thème

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper, // Utilise le fond du thème
  boxShadow: theme.shadows[3], // Ombre en fonction du thème
}));

const ChristianDashboard = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const prayerRequests = [
    { name: "John Doe", request: "Healing for my mother", date: "2024-01-20" },
    { name: "Jane Smith", request: "Guidance for career decision", date: "2024-01-20" },
    { name: "Mike Johnson", request: "Family unity", date: "2024-01-20" },
    { name: "Sarah Williams", request: "Spiritual growth", date: "2024-01-20" },
    { name: "Tom Brown", request: "Financial breakthrough", date: "2024-01-20" },
  ];

  const dailyVerse = {
    verse: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16"
  };

  const statistics = [
    { name: "Articles", count: 150, icon: <FaBookOpen size={40} color="#4caf50" /> },
    { name: "Categories", count: 25, icon: <FaList size={40} color="#2196f3" /> },
    { name: "Prayer Requests", count: 45, icon: <FaPray size={40} color="#f44336" /> },
    { name: "Online Services", count: 12, icon: <FaChurch size={40} color="#ff9800" /> }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Utilisation du hook useTheme pour accéder au thème actuel
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      <AppBar position="static">
        <Toolbar>
          <FaCross size={24} style={{ marginRight: "10px" }} />
          <Typography variant="h6">Christian Ministry Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

          <Grid item xs={12}>
            <Paper sx={{ width: "100%" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service Name</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Platform</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[{ name: "Morning Prayer", time: "7:00 AM", platform: "Zoom", status: "Live" },
                      { name: "Bible Study", time: "6:00 PM", platform: "YouTube", status: "Upcoming" },
                      { name: "Youth Service", time: "4:00 PM", platform: "Facebook", status: "Completed" }].map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>{row.platform}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              color={row.status === "Live" ? "success" :
                                row.status === "Upcoming" ? "warning" : "default"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChristianDashboard;
