import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

function MissingItems({ items }) {
  return (
    <Paper elevation={0} sx={{ p: 4, mb: 4, backgroundColor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom>
        Complete Your Wardrobe
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        These items will help you create all the suggested outfits
      </Typography>

      <Grid container spacing={3}>
        {items?.missingItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.imageUrl}
                alt={item.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {item.brand}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<LocalOfferIcon />}
                    label={`${item.cashback}% Cash Back`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`$${item.price}`}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingBagIcon />}
                  href={item.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Now
                </Button>
                {item.rentUrl && (
                  <Button
                    variant="outlined"
                    fullWidth
                    href={item.rentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1 }}
                  >
                    Rent Instead
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default MissingItems;
