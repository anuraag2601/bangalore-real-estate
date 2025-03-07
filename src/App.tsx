import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, Box, createTheme, ThemeProvider } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import LocalitySelector from './components/LocalitySelector';
import PriceInfo from './components/PriceInfo';
import RatingsInfo from './components/RatingsInfo';
import LocalityComparison from './components/LocalityComparison';
import { bangaloreLocalities, LocalityData } from './data/mockData';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('');
  const [selectedLocality, setSelectedLocality] = useState<LocalityData | null>(null);
  const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);
  const [selectedLocalitiesForComparison, setSelectedLocalitiesForComparison] = useState<string[]>([]);
  const [localitiesForComparison, setLocalitiesForComparison] = useState<LocalityData[]>([]);

  useEffect(() => {
    if (selectedLocalityId) {
      const locality = bangaloreLocalities.find(loc => loc.id === selectedLocalityId);
      setSelectedLocality(locality || null);
    } else {
      setSelectedLocality(null);
    }
  }, [selectedLocalityId]);

  useEffect(() => {
    // Limit to 3 localities for comparison
    const limitedIds = selectedLocalitiesForComparison.slice(0, 3);
    const localities = bangaloreLocalities.filter(loc => limitedIds.includes(loc.id));
    setLocalitiesForComparison(localities);
  }, [selectedLocalitiesForComparison]);

  const handleLocalityChange = (localityId: string) => {
    setSelectedLocalityId(localityId);
  };

  const handleComparisonSelectionChange = (localityIds: string[]) => {
    setSelectedLocalitiesForComparison(localityIds.slice(0, 3)); // Limit to 3
  };

  const handleToggleComparisonMode = () => {
    setIsComparisonMode(!isComparisonMode);
    
    // When entering comparison mode, add the currently selected locality to comparison
    if (!isComparisonMode && selectedLocalityId && !selectedLocalitiesForComparison.includes(selectedLocalityId)) {
      setSelectedLocalitiesForComparison([selectedLocalityId]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />
        <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
          <LocalitySelector
            localities={bangaloreLocalities}
            selectedLocality={selectedLocalityId}
            onLocalityChange={handleLocalityChange}
            selectedLocalitiesForComparison={selectedLocalitiesForComparison}
            onComparisonSelectionChange={handleComparisonSelectionChange}
            isComparisonMode={isComparisonMode}
            onToggleComparisonMode={handleToggleComparisonMode}
          />
          
          {isComparisonMode ? (
            <LocalityComparison selectedLocalities={localitiesForComparison} />
          ) : (
            <>
              <PriceInfo localityData={selectedLocality} />
              <RatingsInfo localityData={selectedLocality} />
            </>
          )}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;