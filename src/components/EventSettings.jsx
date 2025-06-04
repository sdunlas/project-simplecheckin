import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  TextField, 
  Typography,
  IconButton,
  Switch,
  Box,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 12px;
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 12px;
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.03)'};
    border-radius: 12px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};

    fieldset {
      border-color: ${props => props.theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.1)'};
      border-radius: 12px;
    }

    &:hover fieldset {
      border-color: ${props => props.theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(0, 0, 0, 0.2)'};
    }

    &.Mui-focused fieldset {
      border-color: ${props => props.theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.3)' 
        : '#1976d2'};
    }
  }
`;

const StyledSwitch = styled(Switch)`
  .MuiSwitch-track {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)'} !important;
  }
`;

const Label = styled(Typography)`
  color: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(0, 0, 0, 0.87)'} !important;
  font-weight: 600 !important;
  flex: 1;
`;

const EventSettings = ({ eventTitle, setEventTitle, isDarkTheme, setIsDarkTheme }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(eventTitle);

  const handleTitleSave = () => {
    setEventTitle(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(eventTitle);
    setIsEditingTitle(false);
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <SettingsContainer>
      <TitleContainer theme={isDarkTheme ? 'dark' : 'light'}>
        <Label theme={isDarkTheme ? 'dark' : 'light'}>
          Event Name
        </Label>
        {isEditingTitle ? (
          <>
            <StyledTextField
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              theme={isDarkTheme ? 'dark' : 'light'}
              sx={{ flex: 1 }}
            />
            <IconButton 
              onClick={handleTitleSave} 
              size="small"
              sx={{ color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <CheckIcon />
            </IconButton>
            <IconButton 
              onClick={handleTitleCancel} 
              size="small"
              sx={{ color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography sx={{ flex: 1, color: isDarkTheme ? '#ffffff' : '#1a1a2e' }}>
              {eventTitle}
            </Typography>
            <IconButton 
              onClick={() => setIsEditingTitle(true)} 
              size="small"
              sx={{ color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <EditIcon />
            </IconButton>
          </>
        )}
      </TitleContainer>

      <ThemeToggleContainer theme={isDarkTheme ? 'dark' : 'light'}>
        <Label theme={isDarkTheme ? 'dark' : 'light'}>
          Theme
        </Label>
        <Box display="flex" alignItems="center" gap={1}>
          <LightModeIcon sx={{ color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : '#1976d2' }} />
          <StyledSwitch
            checked={isDarkTheme}
            onChange={handleThemeToggle}
            color="primary"
            theme={isDarkTheme ? 'dark' : 'light'}
          />
          <DarkModeIcon sx={{ color: isDarkTheme ? '#4a90e2' : 'rgba(0, 0, 0, 0.54)' }} />
        </Box>
      </ThemeToggleContainer>
    </SettingsContainer>
  );
};

export default EventSettings; 