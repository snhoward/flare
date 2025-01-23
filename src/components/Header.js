import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

function Header() {
  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'primary.main'
          }}
        >
          <LocalFireDepartmentIcon 
            sx={{ 
              fontSize: '2rem',
              mr: 1,
              color: 'primary.main'
            }} 
          />
          <Typography 
            variant="h5" 
            component="div"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1E88E5 30%, #64B5F6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Flare
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
