import React from 'react';
import { Paper, Typography, Box, Rating, Grid, Tooltip, IconButton, Divider, Card, CardContent } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoIcon from '@mui/icons-material/Info';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { LocalityData } from '../data/mockData';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import YouTubeVideos from './YouTubeVideos';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

interface RatingsInfoProps {
  localityData: LocalityData | null;
}

const RatingsInfo: React.FC<RatingsInfoProps> = ({ localityData }) => {
  if (!localityData) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">Please select a locality to view ratings</Typography>
      </Paper>
    );
  }

  const radarData = {
    labels: ['Water Availability', 'Noise Levels', 'Traffic Conditions'],
    datasets: [
      {
        label: 'Ratings (out of 5)',
        data: [
          localityData.ratings.water,
          localityData.ratings.noise,
          localityData.ratings.traffic,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const radarOptions: ChartOptions<'radar'> = {
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const getRatingDescription = (category: string, rating: number) => {
    if (category === 'water') {
      if (rating >= 4) return 'Excellent water supply';
      if (rating >= 3) return 'Good water supply with occasional issues';
      if (rating >= 2) return 'Moderate water supply with frequent issues';
      return 'Poor water supply, frequent shortages';
    } else if (category === 'noise') {
      if (rating >= 4) return 'Very quiet area';
      if (rating >= 3) return 'Moderately quiet with occasional noise';
      if (rating >= 2) return 'Somewhat noisy area';
      return 'Very noisy area';
    } else if (category === 'traffic') {
      if (rating >= 4) return 'Minimal traffic congestion';
      if (rating >= 3) return 'Moderate traffic during peak hours';
      if (rating >= 2) return 'Heavy traffic during peak hours';
      return 'Severe traffic congestion throughout the day';
    }
    return '';
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {localityData.name} - Livability Ratings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <Radar data={radarData} options={radarOptions} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Data compiled from multiple public sources
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WaterDropIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Water Availability</Typography>
              <Tooltip title={`Source: ${localityData.citations.waterRating}`}>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Rating 
              value={localityData.ratings.water} 
              precision={0.5} 
              readOnly 
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {getRatingDescription('water', localityData.ratings.water)}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <VolumeUpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Noise Levels</Typography>
              <Tooltip title={`Source: ${localityData.citations.noiseRating}`}>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Rating 
              value={localityData.ratings.noise} 
              precision={0.5} 
              readOnly 
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {getRatingDescription('noise', localityData.ratings.noise)}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DirectionsCarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Traffic Conditions</Typography>
              <Tooltip title={`Source: ${localityData.citations.trafficRating}`}>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Rating 
              value={localityData.ratings.traffic} 
              precision={0.5} 
              readOnly 
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {getRatingDescription('traffic', localityData.ratings.traffic)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      
      {/* Water Supply Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <WaterDropIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Detailed Water Supply Information
        </Typography>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1">
              {localityData.waterSupplyInfo}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Source: {localityData.citations.waterRating}
              </Typography>
              <Tooltip title="Based on BWSSB data and resident surveys">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
        <Typography variant="body2" color="text.secondary">
          Water supply information is based on data from the Bangalore Water Supply and Sewerage Board (BWSSB) and resident feedback.
        </Typography>
      </Box>
      
      {/* YouTube Videos about Water Availability */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <YouTubeIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Water Availability Videos
        </Typography>
        <YouTubeVideos localityData={localityData} category="water" />
      </Box>
    </Paper>
  );
};

export default RatingsInfo;