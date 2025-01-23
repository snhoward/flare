import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Button } from '@mui/material';
import Header from './components/Header';
import TripForm from './components/TripForm';
import OutfitCarousel from './components/OutfitCarousel';
import PackingList from './components/PackingList';
import MissingItems from './components/MissingItems';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E88E5', // Blue for the Flare logo
      light: '#64B5F6',
      dark: '#1565C0',
    },
    secondary: {
      main: '#FFD700', // Gold for CTAs
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '12px 24px',
        },
      },
    },
  },
});

// Sample outfit data with reliable image URLs
const initialOutfits = [
  {
    id: 1,
    day: 'Day 1',
    occasion: 'Business Meeting',
    description: 'Professional attire suitable for your morning meeting',
    imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    items: [
      {
        id: 'item1',
        name: 'Classic Blazer',
        brand: 'Theory',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        price: '$495',
        link: 'https://www.theory.com/womens-blazers'
      },
      {
        id: 'item2',
        name: 'Silk Blouse',
        brand: 'Equipment',
        imageUrl: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=800&q=80',
        price: '$280',
        link: 'https://www.equipmentfr.com/silk-shirts'
      },
      {
        id: 'item3',
        name: 'Tailored Pants',
        brand: 'Hugo Boss',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
        price: '$248',
        link: 'https://www.hugoboss.com/us/women-pants'
      }
    ],
    rating: null
  },
  {
    id: 2,
    day: 'Day 1',
    occasion: 'Evening Dinner',
    description: 'Elegant outfit for your dinner reservation',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    items: [
      {
        id: 'item4',
        name: 'Midi Dress',
        brand: 'Reformation',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        price: '$278',
        link: 'https://www.reformation.com/dresses'
      },
      {
        id: 'item5',
        name: 'Strappy Sandals',
        brand: 'Jimmy Choo',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        price: '$795',
        link: 'https://us.jimmychoo.com/en/women/shoes/sandals'
      },
      {
        id: 'item6',
        name: 'Evening Clutch',
        brand: 'Saint Laurent',
        imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80',
        price: '$1,290',
        link: 'https://www.ysl.com/en-us/handbags/clutches'
      }
    ],
    rating: null
  }
];

// Generate basic packing list based on trip details
const generateBasicPackingList = (location, startDate, endDate, activities = []) => {
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  
  // Basic items everyone needs
  const basicItems = [
    { category: 'Documents', items: ['Passport/ID', 'Travel insurance', 'Booking confirmations', 'Credit cards'] },
    { category: 'Electronics', items: ['Phone + charger', 'Power adapter', 'Portable charger', 'Camera'] },
    { category: 'Toiletries', items: ['Toothbrush & toothpaste', 'Deodorant', 'Shampoo & conditioner', 'Skincare items'] },
  ];

  // Clothing basics based on number of days
  const clothingBasics = {
    category: 'Basic Clothing',
    items: [
      `Underwear (${days + 2} pairs)`,
      `Socks (${days + 2} pairs)`,
      `T-shirts/tops (${Math.ceil(days/2)} pieces)`,
      'Sleepwear (2 sets)',
      'Comfortable walking shoes'
    ]
  };

  // Location-specific items
  const locationItems = {
    category: 'Location-Specific Items',
    items: []
  };

  // Add location-specific items based on typical weather/climate
  if (location.toLowerCase().includes('beach') || location.toLowerCase().includes('tropical')) {
    locationItems.items.push(
      'Swimwear',
      'Beach towel',
      'Sunscreen',
      'Sunglasses',
      'Sun hat',
      'Sandals'
    );
  } else if (location.toLowerCase().includes('mountain') || location.toLowerCase().includes('ski')) {
    locationItems.items.push(
      'Warm jacket',
      'Thermal underwear',
      'Gloves',
      'Scarf',
      'Winter boots',
      'Warm socks'
    );
  } else if (location.toLowerCase().includes('city')) {
    locationItems.items.push(
      'Comfortable walking shoes',
      'City map/guide',
      'Day bag/backpack',
      'Smart casual outfits'
    );
  }

  // Activity-specific items
  const activityItems = {
    category: 'Activity-Specific Items',
    items: []
  };

  activities.forEach(activity => {
    if (activity.toLowerCase().includes('business')) {
      activityItems.items.push('Business suits', 'Professional shoes', 'Business cards');
    } else if (activity.toLowerCase().includes('hiking')) {
      activityItems.items.push('Hiking boots', 'Hiking socks', 'Backpack', 'Water bottle');
    } else if (activity.toLowerCase().includes('swimming')) {
      activityItems.items.push('Swimsuit', 'Goggles', 'Beach towel', 'Flip-flops');
    }
  });

  return [...basicItems, clothingBasics, locationItems, activityItems].filter(category => category.items.length > 0);
};

function App() {
  const [tripData, setTripData] = useState(null);
  const [outfits, setOutfits] = useState(initialOutfits);
  const [packingList, setPackingList] = useState(null);
  const [showPackingList, setShowPackingList] = useState(false);

  const handleTripSubmit = (data) => {
    setTripData(data);
  };

  const handleOutfitRating = (outfitId, rating) => {
    setOutfits(prevOutfits => 
      prevOutfits.map(outfit => 
        outfit.id === outfitId 
          ? { ...outfit, rating } 
          : outfit
      )
    );
  };

  const generatePackingList = () => {
    const likedOutfits = outfits.filter(outfit => outfit.rating === 'like');
    const basicPackingList = tripData 
      ? generateBasicPackingList(
          tripData.destination, 
          tripData.startDate, 
          tripData.endDate, 
          tripData.activities
        )
      : [];

    setPackingList({
      outfits: likedOutfits,
      basicItems: basicPackingList,
      missingItems: likedOutfits.reduce((acc, outfit) => {
        outfit.items.forEach(item => {
          if (!item.owned) {
            acc.push(item);
          }
        });
        return acc;
      }, [])
    });
    setShowPackingList(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        <Header />
        <Container maxWidth="lg">
          {!tripData && <TripForm onSubmit={handleTripSubmit} />}
          
          {tripData && !showPackingList && (
            <>
              <OutfitCarousel 
                outfits={outfits} 
                onRate={handleOutfitRating}
                onFinish={generatePackingList}
              />
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={generatePackingList}
                >
                  Generate my packing list
                </Button>
              </Box>
            </>
          )}
          
          {showPackingList && (
            <>
              <PackingList 
                items={packingList} 
                tripDetails={tripData}
              />
              <MissingItems items={packingList} />
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
