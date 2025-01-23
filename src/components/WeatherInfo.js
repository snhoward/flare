import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Chip } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';
import { format, isWithinInterval, subDays, addDays } from 'date-fns';
import getClothingSuggestions from '../utils/clothingSuggestions';

const WeatherInfo = ({ location, startDate, endDate }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeatherIcon = (condition) => {
    if (condition.includes('clear')) return <WbSunnyIcon />;
    if (condition.includes('rain') || condition.includes('storm')) return <ThunderstormIcon />;
    if (condition.includes('snow')) return <AcUnitIcon />;
    return <CloudIcon />;
  };

  const fetchWeatherData = async (lat, lon) => {
    if (!lat || !lon || !startDate || !endDate) {
      console.log('Missing required data:', { lat, lon, startDate, endDate });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if start date is within 5 days
      const isNearFuture = isWithinInterval(startDate, {
        start: new Date(),
        end: addDays(new Date(), 5)
      });

      console.log('Fetching weather data:', {
        isNearFuture,
        apiKey: process.env.REACT_APP_OPENWEATHER_API_KEY?.slice(0, 5) + '...',
        lat,
        lon
      });

      if (isNearFuture) {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`;
        console.log('Fetching forecast from:', forecastUrl);
        
        const response = await fetch(forecastUrl);
        console.log('Forecast API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Weather API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Forecast data received:', data);

        if (!data.list || !Array.isArray(data.list)) {
          throw new Error('Invalid forecast data format');
        }

        // Group forecast by day and calculate daily averages
        const dailyForecasts = data.list.reduce((acc, item) => {
          const date = new Date(item.dt * 1000);
          const dateKey = format(date, 'yyyy-MM-dd');
          
          if (!acc[dateKey]) {
            acc[dateKey] = {
              temps: [],
              conditions: [],
              date: date
            };
          }
          
          acc[dateKey].temps.push(item.main.temp);
          acc[dateKey].conditions.push(item.weather[0].main.toLowerCase());
          return acc;
        }, {});

        // Convert to array and take first 5 days
        const forecastData = Object.values(dailyForecasts)
          .slice(0, 5)
          .map(day => ({
            date: day.date,
            temp: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
            condition: day.conditions[Math.floor(day.conditions.length / 2)],
            description: day.conditions[Math.floor(day.conditions.length / 2)]
          }));
        
        console.log('Processed forecast data:', forecastData);
        
        setWeatherData({
          type: 'forecast',
          data: forecastData
        });
      } else {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`;
        console.log('Fetching current weather from:', currentUrl);
        
        const response = await fetch(currentUrl);
        console.log('Current weather API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Weather API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Current weather data received:', data);

        // For historical context, fetch 5-day forecast to get temperature range
        const rangeUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`;
        console.log('Fetching range data from:', rangeUrl);
        
        const rangeResponse = await fetch(rangeUrl);
        console.log('Range API response status:', rangeResponse.status);
        
        if (!rangeResponse.ok) {
          const errorText = await rangeResponse.text();
          throw new Error(`Range data error: ${rangeResponse.status} - ${errorText}`);
        }
        
        const rangeData = await rangeResponse.json();
        console.log('Range data received:', rangeData);

        if (!rangeData.list || !Array.isArray(rangeData.list)) {
          throw new Error('Invalid range data format');
        }

        const temps = rangeData.list.map(item => item.main.temp);
        
        setWeatherData({
          type: 'historical',
          data: {
            avgTemp: Math.round(data.main.temp),
            minTemp: Math.round(Math.min(...temps)),
            maxTemp: Math.round(Math.max(...temps)),
            condition: data.weather[0].main.toLowerCase()
          }
        });
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(`Unable to fetch weather data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First, verify the API key is properly loaded
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
    
    // Test the API key with a simple endpoint
    const testApiKey = async () => {
      try {
        const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`;
        const response = await fetch(testUrl);
        const data = await response.json();
        console.log('API Key test response:', data);
        
        if (data.cod === 401) {
          setError('Weather API key is not yet activated. This typically takes 2-4 hours after creation. Please check back later.');
          return false;
        }
        return true;
      } catch (err) {
        console.error('API Key test failed:', err);
        return false;
      }
    };

    if (location?.coordinates) {
      testApiKey().then(isValid => {
        if (isValid) {
          const [lon, lat] = location.coordinates;
          fetchWeatherData(lat, lon);
        }
      });
    }
  }, [location, startDate, endDate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: 'error.light' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!weatherData) return null;

  return (
    <Paper elevation={0} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Weather Information
      </Typography>
      
      {weatherData.type === 'forecast' ? (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            5-Day Forecast
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            {weatherData.data.map((day, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{ p: 1, flex: '1 1 150px', textAlign: 'center' }}
              >
                <Typography variant="body2">
                  {format(day.date, 'MMM d')}
                </Typography>
                {getWeatherIcon(day.condition)}
                <Typography variant="h6">{day.temp}°C</Typography>
                <Typography variant="caption">{day.description}</Typography>
              </Paper>
            ))}
          </Box>
          
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Packing Suggestions
          </Typography>
          {(() => {
            // Get suggestions based on average conditions
            const avgTemp = Math.round(
              weatherData.data.reduce((sum, day) => sum + day.temp, 0) / weatherData.data.length
            );
            const commonCondition = weatherData.data[0].condition;
            const suggestions = getClothingSuggestions(avgTemp, commonCondition);
            
            return (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Based on average temperature of {avgTemp}°C
                </Typography>
                
                <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                  Essential Items:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestions.essentials.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" color="secondary" sx={{ mt: 2 }}>
                  Recommended:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestions.recommended.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                {suggestions.optional.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                      Optional:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {suggestions.optional.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            );
          })()}
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Historical Average for {format(startDate, 'MMMM')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {getWeatherIcon(weatherData.data.condition)}
            <Box>
              <Typography>
                Average: {weatherData.data.avgTemp}°C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Range: {weatherData.data.minTemp}°C to {weatherData.data.maxTemp}°C
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Packing Suggestions
          </Typography>
          {(() => {
            const suggestions = getClothingSuggestions(
              weatherData.data.avgTemp,
              weatherData.data.condition
            );
            
            return (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Based on typical conditions for this time of year
                </Typography>
                
                <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                  Essential Items:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestions.essentials.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" color="secondary" sx={{ mt: 2 }}>
                  Recommended:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestions.recommended.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                {suggestions.optional.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                      Optional:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {suggestions.optional.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            );
          })()}
        </Box>
      )}
    </Paper>
  );
};

export default WeatherInfo;
