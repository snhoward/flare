import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Checkbox,
  FormControlLabel,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControl,
  Grid,
  Divider
} from '@mui/material';
import { differenceInDays } from 'date-fns';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PackingList = ({ weatherData, startDate, endDate, selectedActivities = [] }) => {
  const [itemStatus, setItemStatus] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  if (!weatherData || !startDate || !endDate) {
    return null;
  }

  const tripDuration = differenceInDays(endDate, startDate) + 1;

  // Activity-based clothing suggestions
  const activityClothing = {
    hiking: [
      'Hiking boots',
      'Moisture-wicking shirts',
      'Hiking pants',
      'Hiking socks',
      'Sun hat'
    ],
    swimming: [
      'Swimsuit',
      'Beach towel',
      'Swim shorts',
      'Rash guard',
      'Water shoes'
    ],
    skiing: [
      'Ski jacket',
      'Ski pants',
      'Thermal base layer',
      'Ski socks',
      'Ski gloves'
    ],
    business: [
      'Business suit',
      'Dress shirts',
      'Dress pants',
      'Dress shoes',
      'Tie/Scarf'
    ],
    sightseeing: [
      'Comfortable walking shoes',
      'Casual shirts',
      'Comfortable pants',
      'Day bag',
      'Sun hat'
    ],
    dining: [
      'Dress shoes',
      'Smart casual shirts',
      'Dress pants/skirt',
      'Evening wear',
      'Accessories'
    ]
  };

  // Get additional items based on selected activities
  const getActivityItems = () => {
    const items = new Set();
    selectedActivities.forEach(activity => {
      if (activityClothing[activity]) {
        activityClothing[activity].forEach(item => items.add(item));
      }
    });
    return Array.from(items);
  };

  const calculateQuantities = (essentials, recommended, optional) => {
    const baseQuantities = {
      't-shirt': 7,
      'shirt': 7,
      'underwear': 7,
      'socks': 7,
      'pants': 4,
      'shorts': 4,
      'sweater': 2,
      'jacket': 1,
      'coat': 1,
      'boots': 1,
      'shoes': 1,
      'sandals': 1,
      'scarf': 1,
      'hat': 1,
      'gloves': 1,
      'default': 1
    };

    const maxQuantities = {
      't-shirt': 10,
      'shirt': 10,
      'underwear': 10,
      'socks': 10,
      'pants': 6,
      'shorts': 6,
      'sweater': 3,
      'default': 2
    };

    const calculateItemQuantity = (item) => {
      const itemLower = item.toLowerCase();
      let baseQuantity = baseQuantities.default;
      
      for (const [key, value] of Object.entries(baseQuantities)) {
        if (itemLower.includes(key)) {
          baseQuantity = value;
          break;
        }
      }

      let quantity = Math.ceil((baseQuantity / 7) * tripDuration);
      
      for (const [key, max] of Object.entries(maxQuantities)) {
        if (itemLower.includes(key)) {
          quantity = Math.min(quantity, max);
          break;
        }
      }

      return Math.max(1, quantity);
    };

    const processItems = (items) => {
      return items.map(item => ({
        name: item,
        quantity: calculateItemQuantity(item),
        status: itemStatus[item] || null
      }));
    };

    // Combine weather-based items with activity-based items
    const activityItems = getActivityItems();
    const allEssentials = [...new Set([...essentials, ...activityItems])];

    return {
      essentials: processItems(allEssentials),
      recommended: processItems(recommended),
      optional: processItems(optional)
    };
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setStatusDialogOpen(true);
  };

  const handleStatusChange = (status) => {
    setItemStatus(prev => ({
      ...prev,
      [selectedItem.name]: status
    }));
    setStatusDialogOpen(false);
  };

  const { essentials, recommended, optional } = calculateQuantities(
    weatherData.essentials || [],
    weatherData.recommended || [],
    weatherData.optional || []
  );

  const renderList = (items, title, color) => {
    // Only show items that have a status
    const filteredItems = items.filter(item => itemStatus[item.name]);
    
    if (filteredItems.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color={color} sx={{ fontWeight: 'bold', mb: 1 }}>
          {title}
        </Typography>
        <List dense>
          {filteredItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handleItemClick(item)}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: title === 'Essential Items' ? 500 : 400
                      }}
                    >
                      {item.name} ({item.quantity}x)
                    </Typography>
                    {itemStatus[item.name] === 'have' && (
                      <Chip
                        size="small"
                        icon={<CheckCircleIcon />}
                        label="Have"
                        color="success"
                        variant="outlined"
                      />
                    )}
                    {itemStatus[item.name] === 'toBuy' && (
                      <Chip
                        size="small"
                        icon={<AddShoppingCartIcon />}
                        label="To Buy"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Packing List
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {tripDuration} day trip
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Selected Activities:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedActivities.map((activity, index) => (
            <Chip key={index} label={activity} size="small" />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Click on items to mark as "Have" or "To Buy"
      </Typography>

      {renderList(essentials, 'Essential Items', 'primary.main')}
      {renderList(recommended, 'Recommended Items', 'secondary.main')}
      {renderList(optional, 'Optional Items', 'text.secondary')}

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Item Status</DialogTitle>
        <DialogContent>
          <FormControl>
            <RadioGroup
              value={selectedItem ? itemStatus[selectedItem.name] || '' : ''}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <FormControlLabel value="have" control={<Radio />} label="I already have this" />
              <FormControlLabel value="toBuy" control={<Radio />} label="Need to buy" />
              <FormControlLabel value="" control={<Radio />} label="Don't include in list" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Shopping List Summary */}
      {Object.entries(itemStatus).some(([_, status]) => status === 'toBuy') && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Shopping List
          </Typography>
          <List dense>
            {[...essentials, ...recommended, ...optional]
              .filter(item => itemStatus[item.name] === 'toBuy')
              .map((item, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${item.name} (${item.quantity}x)`}
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default PackingList;
