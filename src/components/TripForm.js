import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import debounce from 'lodash/debounce';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Available activities
const ACTIVITIES = [
  'Business Meetings',
  'Sightseeing',
  'Beach',
  'Hiking',
  'Shopping',
  'Fine Dining',
  'Casual Dining',
  'Swimming',
  'Museums',
  'Nightlife',
  'Sports',
  'Spa & Wellness'
];

function TripForm({ onSubmit }) {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activities, setActivities] = useState([]);
  const [map, setMap] = useState(null);
  const [mapboxToken, setMapboxToken] = useState(process.env.REACT_APP_MAPBOX_TOKEN);

  useEffect(() => {
    // Debug logging
    console.log('Mapbox Token:', process.env.REACT_APP_MAPBOX_TOKEN);
    if (!process.env.REACT_APP_MAPBOX_TOKEN) {
      console.error('Mapbox token is missing!');
      return;
    }

    if (!map) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
      try {
        const newMap = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-74.006, 40.7128], // Default to NYC
          zoom: 9
        });
        setMap(newMap);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }
  }, [map]);

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      console.log('Fetching suggestions for:', query); // Debug log

      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}&types=place`;

      try {
        console.log('Fetching from endpoint:', endpoint); // Debug log
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        if (data.features) {
          const newSuggestions = data.features.map(place => ({
            label: place.place_name,
            coordinates: place.center
          }));
          console.log('Setting suggestions:', newSuggestions); // Debug log
          setSuggestions(newSuggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    }, 300),
    [mapboxToken]
  );

  const handleDestinationChange = (event, newValue) => {
    console.log('handleDestinationChange:', { newValue }); // Debug log
    if (typeof newValue === 'string') {
      setDestination(newValue);
    } else if (newValue) {
      setDestination(newValue.label);
      if (map && newValue.coordinates) {
        map.flyTo({
          center: newValue.coordinates,
          zoom: 10
        });
      }
    }
  };

  const handleDestinationInputChange = (event, newInputValue) => {
    console.log('handleDestinationInputChange:', { newInputValue }); // Debug log
    setDestination(newInputValue);
    if (newInputValue && newInputValue.length >= 2) {
      fetchSuggestions(newInputValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleActivityChange = (event) => {
    setActivities(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination && startDate && endDate) {
      onSubmit({
        destination,
        startDate,
        endDate,
        activities
      });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Plan Your Trip
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Autocomplete
            freeSolo
            value={destination}
            onChange={handleDestinationChange}
            onInputChange={handleDestinationInputChange}
            options={suggestions}
            getOptionLabel={(option) => {
              console.log('getOptionLabel:', { option }); // Debug log
              return typeof option === 'string' ? option : option.label;
            }}
            isOptionEqualToValue={(option, value) => {
              console.log('isOptionEqualToValue:', { option, value }); // Debug log
              return option.label === value || option.label === value.label;
            }}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination"
                required
                fullWidth
                onChange={(e) => {
                  console.log('TextField onChange:', e.target.value); // Debug log
                  params.inputProps.onChange(e);
                }}
              />
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => (
                  <TextField {...params} required fullWidth />
                )}
                minDate={new Date()}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => (
                  <TextField {...params} required fullWidth />
                )}
                minDate={startDate || new Date()}
              />
            </Box>
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Activities</InputLabel>
            <Select
              multiple
              value={activities}
              onChange={handleActivityChange}
              input={<OutlinedInput label="Activities" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {ACTIVITIES.map((activity) => (
                <MenuItem key={activity} value={activity}>
                  {activity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            id="map"
            sx={{
              height: '300px',
              width: '100%',
              borderRadius: 1,
              overflow: 'hidden'
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!destination || !startDate || !endDate}
            sx={{ mt: 2 }}
          >
            Continue
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default TripForm;
