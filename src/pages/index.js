import { Container, Typography, Grid } from '@mui/material'
import Card from '../components/Card';
import VideoComponent from '@/components/VideoComponent';
export default function Home() {
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Bienvenue sur Kristy Fianantsika
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card />
        </Grid>
      </Grid>
      <VideoComponent />
    </Container>
  );
}
