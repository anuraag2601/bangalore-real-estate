import React from 'react';
import { Paper, Typography, Box, Grid, Tooltip, IconButton, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { LocalityData } from '../data/mockData';
import YouTubeVideos from './YouTubeVideos';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface PriceInfoProps {
  localityData: LocalityData | null;
}

const PriceInfo: React.FC<PriceInfoProps> = ({ localityData }) => {
  if (!localityData) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Please select a locality to view price information</Typography>
      </Paper>
    );
  }

  const chartData = {
    labels: localityData.priceHistory.map((item) => item.month),
    datasets: [
      {
        label: 'Price per Sq Ft (₹)',
        data: localityData.priceHistory.map((item) => item.price),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Price Trend (Last 6 Months)',
      },
    },
  };

  // Format price in Indian format (e.g., 12,500)
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {localityData.name} - Price Information
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          ₹{formatPrice(localityData.avgPricePerSqFt)} per sq ft
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Average price based on recent transactions
          </Typography>
          <Tooltip title={`Source: ${localityData.citations.priceData}`}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Rental Price Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Rental Prices
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">2 BHK</Typography>
              <Typography variant="h5" color="secondary">₹{formatPrice(localityData.rentalPrice.twoRHK)}</Typography>
              <Typography variant="body2" color="text.secondary">per month</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">3 BHK</Typography>
              <Typography variant="h5" color="secondary">₹{formatPrice(localityData.rentalPrice.threeRHK)}</Typography>
              <Typography variant="body2" color="text.secondary">per month</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Source: {localityData.citations.rentalData}
          </Typography>
          <Tooltip title="Based on actual rental transactions in 2025">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ height: 300, mb: 4 }}>
        <Line options={chartOptions} data={chartData} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Source: {localityData.citations.priceData}
          </Typography>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      
      <Grid container spacing={2}>
        {localityData.recentTransactions.map((transaction, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {transaction.propertyType}
              </Typography>
              <Typography variant="body2">
                Area: {transaction.area} sq ft
              </Typography>
              <Typography variant="body2">
                Price: ₹{(transaction.price / 10000000).toFixed(2)} Cr
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(transaction.date).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          Transaction data compiled from property registrations and listings
          <Tooltip title="Data verified from multiple sources including property registration offices">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
      </Box>
      
      {/* YouTube Videos about Real Estate Prices */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <YouTubeIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Real Estate Videos
        </Typography>
        <YouTubeVideos localityData={localityData} category="realEstate" />
      </Box>
    </Paper>
  );
};

export default PriceInfo;