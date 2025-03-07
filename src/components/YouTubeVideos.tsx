import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Link,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import { LocalityData } from '../data/mockData';
import { YouTubeVideo } from '../types/youtube';
import { authenticateYouTube, searchYouTubeVideos } from '../services/youtubeService';

interface YouTubeVideosProps {
  localityData: LocalityData | null;
  category: 'realEstate' | 'water';
}

const YouTubeVideos: React.FC<YouTubeVideosProps> = ({ localityData, category }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAuthenticate = async () => {
    setLoading(true);
    try {
      const success = await authenticateYouTube();
      setAuthenticated(success);
      if (success && localityData) {
        fetchVideos(localityData);
      }
    } catch (err) {
      setError('Failed to authenticate with YouTube. Please try again.');
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async (locality: LocalityData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Search query based on the category and locality
      const searchQuery = category === 'realEstate' 
        ? `${locality.name} Bangalore real estate prices property`
        : `${locality.name} Bangalore water supply availability`;
      
      const results = await searchYouTubeVideos(searchQuery, 6);
      setVideos(results);
    } catch (err) {
      setError('Failed to fetch videos. Please try again.');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && localityData) {
      fetchVideos(localityData);
    }
  }, [localityData, category, authenticated]);

  if (!localityData) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {category === 'realEstate' 
            ? 'Real Estate Videos' 
            : 'Water Availability Videos'} for {localityData.name}
        </Typography>

        {!authenticated && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAuthenticate}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect to YouTube'}
          </Button>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {authenticated && (
        <Tabs 
          value={activeTab} 
          onChange={handleChangeTab} 
          sx={{ mb: 2 }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Popular" />
          <Tab label="Recent" />
        </Tabs>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : authenticated ? (
        videos.length > 0 ? (
          <Grid container spacing={2}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={video.thumbnailUrl}
                    alt={video.title}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" component="div" noWrap title={video.title}>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.channelTitle}
                    </Typography>
                    <Link 
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener"
                      variant="body2"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Watch on YouTube
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No videos found for {localityData.name} related to {category === 'realEstate' ? 'real estate' : 'water availability'}.
            Try another search or check back later.
          </Typography>
        )
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            Connect to YouTube to see videos about {category === 'realEstate' ? 'real estate prices' : 'water availability'} in {localityData.name}.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            YouTube videos provide valuable insights from locals and experts about living conditions in this area.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default YouTubeVideos;