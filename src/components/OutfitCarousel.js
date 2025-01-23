import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Chip,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CloseIcon from '@mui/icons-material/Close';

function OutfitCarousel({ outfits, onRate, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState(null);

  const handleNext = () => {
    if (currentIndex < outfits.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // If we're at the end, show finish dialog
      onFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleThumbsUp = (outfitId) => {
    onRate(outfitId, 'like');
    setCurrentOutfit(outfits[currentIndex]);
    setOpenDialog(true);
  };

  const handleThumbsDown = (outfitId) => {
    onRate(outfitId, 'dislike');
    handleNext();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleNext();
  };

  const currentOutfitData = outfits[currentIndex];

  if (!outfits.length) return null;

  return (
    <Box sx={{ position: 'relative', width: '100%', mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '600px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            sx={{
              bgcolor: 'background.paper',
              pointerEvents: 'auto',
              opacity: currentIndex === 0 ? 0.5 : 1,
              transition: 'transform 0.2s, background-color 0.2s',
              '&:hover': { 
                bgcolor: 'grey.200',
                transform: 'scale(1.1)'
              }
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
        </Box>

        <Card sx={{ maxWidth: 600, width: '100%', position: 'relative' }}>
          <CardMedia
            component="img"
            height="400"
            image={currentOutfitData.imageUrl}
            alt={currentOutfitData.occasion}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="div">
                {currentOutfitData.occasion}
              </Typography>
              <Chip 
                label={currentOutfitData.day}
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentOutfitData.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton
                onClick={() => handleThumbsDown(currentOutfitData.id)}
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  mx: 2,
                  transition: 'transform 0.2s, background-color 0.2s',
                  '&:hover': { 
                    bgcolor: 'error.dark',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <ThumbDownIcon />
              </IconButton>
              <IconButton
                onClick={() => handleThumbsUp(currentOutfitData.id)}
                sx={{
                  bgcolor: 'success.main',
                  color: 'white',
                  mx: 2,
                  transition: 'transform 0.2s, background-color 0.2s',
                  '&:hover': { 
                    bgcolor: 'success.dark',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <ThumbUpIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={handleNext}
            disabled={currentIndex === outfits.length - 1}
            sx={{
              bgcolor: 'background.paper',
              pointerEvents: 'auto',
              opacity: currentIndex === outfits.length - 1 ? 0.5 : 1,
              transition: 'transform 0.2s, background-color 0.2s',
              '&:hover': { 
                bgcolor: 'grey.200',
                transform: 'scale(1.1)'
              }
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Great Choice! Check out the items in this outfit
          <IconButton
            onClick={handleCloseDialog}
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
            {currentOutfit?.items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {item.brand}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price}
                    </Typography>
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Shop Now
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OutfitCarousel;
