import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Collapse,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LuggageIcon from '@mui/icons-material/Luggage';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function PackingList({ items = [] }) {
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [likedOutfits, setLikedOutfits] = useState({});

  const handleOutfitClick = (outfit) => {
    setSelectedOutfit(outfit);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedOutfit(null);
  };

  const handleExpandClick = (outfitId) => {
    setExpanded((prev) => ({
      ...prev,
      [outfitId]: !prev[outfitId],
    }));
  };

  const handleItemCheck = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleRating = (outfitId, rating) => {
    // Handle outfit rating and replacement logic
    console.log(`Outfit ${outfitId} rated: ${rating}`);
    if (rating === 'like') {
      setLikedOutfits((prev) => ({ ...prev, [outfitId]: true }));
    } else {
      setLikedOutfits((prev) => ({ ...prev, [outfitId]: false }));
    }
  };

  // Sample data for testing
  const sampleOutfits = [
    {
      id: 1,
      day: 'Day 1',
      occasion: 'Business Meeting',
      imageUrl: 'https://via.placeholder.com/400x600?text=Business+Meeting',
      description: 'Professional attire suitable for your morning meeting',
      items: [
        { id: 'item1', name: 'Navy Blazer', brand: 'Theory' },
        { id: 'item2', name: 'White Shirt', brand: 'Brooks Brothers' },
        { id: 'item3', name: 'Tailored Pants', brand: 'Hugo Boss' },
      ]
    },
    {
      id: 2,
      day: 'Day 1',
      occasion: 'Evening Dinner',
      imageUrl: 'https://via.placeholder.com/400x600?text=Evening+Dinner',
      description: 'Elegant outfit for your dinner reservation',
      items: [
        { id: 'item4', name: 'Black Dress', brand: 'Reformation' },
        { id: 'item5', name: 'Strappy Heels', brand: 'Jimmy Choo' },
        { id: 'item6', name: 'Clutch', brand: 'YSL' },
      ]
    },
  ];

  const likedOutfitsList = Object.keys(likedOutfits).filter((outfitId) => likedOutfits[outfitId]).map((outfitId) => {
    const outfit = (items.outfits || sampleOutfits).find((outfit) => outfit.id === parseInt(outfitId));
    return outfit;
  });

  const basicPackingItems = [
    {
      category: 'Toiletries',
      items: [
        'Toothbrush',
        'Toothpaste',
        'Deodorant',
        'Shampoo',
        'Conditioner',
        'Soap',
      ],
    },
    {
      category: 'Electronics',
      items: [
        'Phone',
        'Laptop',
        'Charger',
        'Headphones',
        'Power bank',
      ],
    },
    {
      category: 'Clothing',
      items: [
        'Socks',
        'Underwear',
        'T-shirts',
        'Pants',
        'Dress',
      ],
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: 4, mb: 4, backgroundColor: 'background.paper' }}>
      <Typography variant="h4" gutterBottom>
        Your Complete Packing List
      </Typography>

      {/* Basic Packing List */}
      {basicPackingItems && basicPackingItems.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LuggageIcon sx={{ mr: 1 }} />
            Essential Items
          </Typography>
          {basicPackingItems.map((category, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{category.category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {category.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Selected Outfits */}
      {(items.outfits || sampleOutfits) && (items.outfits || sampleOutfits).length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            Selected Outfits
          </Typography>
          <Grid container spacing={3}>
            {(items.outfits || sampleOutfits).map((outfit) => (
              <Grid item xs={12} key={outfit.id}>
                <Card>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={outfit.imageUrl}
                        alt={outfit.occasion}
                        sx={{ 
                          borderRadius: 1,
                          objectFit: 'cover',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" component="div">
                            {outfit.occasion}
                          </Typography>
                          <Chip 
                            label={outfit.day}
                            color="primary"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {outfit.description}
                        </Typography>
                        
                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                          Items in this outfit:
                        </Typography>
                        <Grid container spacing={2}>
                          {outfit.items.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                              <Card variant="outlined">
                                <CardMedia
                                  component="img"
                                  height="150"
                                  image={item.imageUrl}
                                  alt={item.name}
                                  sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                  <Typography variant="subtitle2">
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.brand}
                                  </Typography>
                                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                    {item.price}
                                  </Typography>
                                  <Button
                                    component={Link}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<ShoppingBagIcon />}
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 1 }}
                                  >
                                    Shop
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Liked Outfits */}
      {likedOutfitsList.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Liked Outfits
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Here are the outfits you liked and their items
          </Typography>

          {likedOutfitsList.map((outfit) => (
            <Card key={outfit.id} sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={outfit.imageUrl}
                    alt={outfit.occasion}
                    sx={{ 
                      borderRadius: 1,
                      objectFit: 'cover',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {outfit.occasion}
                      </Typography>
                      <Chip 
                        label={outfit.day}
                        color="primary"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {outfit.description}
                    </Typography>
                    
                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                      Items in this outfit:
                    </Typography>
                    <Grid container spacing={2}>
                      {outfit.items.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <Card variant="outlined">
                            <CardMedia
                              component="img"
                              height="150"
                              image={item.imageUrl}
                              alt={item.name}
                              sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                              <Typography variant="subtitle2">
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.brand}
                              </Typography>
                              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                {item.price}
                              </Typography>
                              <Button
                                component={Link}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<ShoppingBagIcon />}
                                variant="outlined"
                                size="small"
                                sx={{ mt: 1 }}
                              >
                                Shop
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Box>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Outfit Details - {selectedOutfit?.occasion}
          <IconButton
            onClick={handleDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <img
                src={selectedOutfit?.imageUrl}
                alt="Outfit"
                style={{ 
                  width: '100%',
                  borderRadius: 8,
                  objectFit: 'cover',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Do you have these items?
              </Typography>
              {selectedOutfit?.items.map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      checked={!!selectedItems[item.id]}
                      onChange={() => handleItemCheck(item.id)}
                      sx={{
                        '&.Mui-checked': {
                          color: '#4CAF50',
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.brand}
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'block', mb: 2 }}
                />
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default PackingList;
