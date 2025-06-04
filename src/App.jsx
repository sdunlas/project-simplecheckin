import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Button, 
  AppBar, 
  Toolbar, 
  Typography,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GuestCheckIn from './pages/GuestCheckIn';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';

const StyledAppBar = styled(AppBar)`
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(53, 122, 189, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)'} !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'} !important;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'} !important;
  box-shadow: none !important;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 2rem !important;
  gap: 1rem;
`;

const AppTitle = styled(Typography)`
  font-weight: 600 !important;
  font-size: 1.5rem !important;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'} !important;
  position: relative;
  white-space: nowrap;
`;

const NavButtonsContainer = styled(Box)`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavButton = styled(Button)`
  padding: 8px 16px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.2s ease-in-out !important;
  
  background: ${props => props.active === 'true' 
    ? props.theme === 'dark'
      ? 'linear-gradient(135deg, rgba(74, 144, 226, 0.2) 0%, rgba(53, 122, 189, 0.2) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)'
    : 'transparent'} !important;
  
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'} !important;
  opacity: ${props => props.active === 'true' ? 1 : 0.7};

  &:hover {
    background: ${props => props.theme === 'dark'
      ? 'linear-gradient(135deg, rgba(74, 144, 226, 0.3) 0%, rgba(53, 122, 189, 0.3) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(25, 118, 210, 0.15) 100%)'} !important;
    transform: translateY(-1px);
    opacity: 1;
  }

  .MuiButton-startIcon {
    margin-right: 8px !important;
  }
`;

const ContentContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'};
`;

const App = () => {
  // Load initial state from localStorage or use defaults
  const [guests, setGuests] = useState(() => {
    const savedGuests = localStorage.getItem('guests');
    return savedGuests ? JSON.parse(savedGuests) : [
      { id: 1, name: 'John Doe', company: 'Tech Corp', isCheckedIn: false },
      { id: 2, name: 'Jane Smith', company: 'Design Co', isCheckedIn: false },
      { id: 3, name: 'Bob Johnson', company: 'Dev Inc', isCheckedIn: false },
    ];
  });

  const [eventTitle, setEventTitle] = useState(() => {
    return localStorage.getItem('eventTitle') || 'Simple Check-in';
  });

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem('isDarkTheme') === 'true';
  });

  const [isCheckInEnabled, setIsCheckInEnabled] = useState(() => {
    return localStorage.getItem('isCheckInEnabled') === 'true';
  });

  const [checkInToken] = useState(() => {
    const savedToken = localStorage.getItem('checkInToken');
    if (savedToken) return savedToken;
    const newToken = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('checkInToken', newToken);
    return newToken;
  });

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('eventTitle', eventTitle);
  }, [eventTitle]);

  useEffect(() => {
    localStorage.setItem('isDarkTheme', isDarkTheme);
  }, [isDarkTheme]);

  useEffect(() => {
    localStorage.setItem('isCheckInEnabled', isCheckInEnabled);
  }, [isCheckInEnabled]);

  // Wrapper for setGuests that also updates localStorage
  const handleSetGuests = (newGuests) => {
    if (typeof newGuests === 'function') {
      setGuests(currentGuests => {
        const updatedGuests = newGuests(currentGuests);
        localStorage.setItem('guests', JSON.stringify(updatedGuests));
        return updatedGuests;
      });
    } else {
      setGuests(newGuests);
      localStorage.setItem('guests', JSON.stringify(newGuests));
    }
  };

  const appTitle = "Fluid Events Check-in Platform";

  return (
    <Router>
      <ContentContainer theme={isDarkTheme ? 'dark' : 'light'}>
        <Routes>
          <Route 
            path="/check-in/:token" 
            element={
              isCheckInEnabled ? (
                <GuestCheckIn 
                  guests={guests} 
                  setGuests={handleSetGuests}
                  isDarkTheme={isDarkTheme}
                  checkInToken={checkInToken}
                  eventTitle={eventTitle}
                />
              ) : (
                <Navigate to="/admin" replace />
              )
            } 
          />
          <Route 
            path="/analytics"
            element={
              <>
                <StyledAppBar position="static" theme={isDarkTheme ? 'dark' : 'light'}>
                  <StyledToolbar>
                    <AppTitle variant="h6" theme={isDarkTheme ? 'dark' : 'light'}>
                      {appTitle}
                    </AppTitle>
                    <NavButtonsContainer>
                      <NavButton 
                        component={Link} 
                        to="/admin"
                        startIcon={<DashboardIcon />}
                        theme={isDarkTheme ? 'dark' : 'light'}
                        active="false"
                      >
                        Admin
                      </NavButton>
                      <NavButton 
                        component={Link} 
                        to="/analytics"
                        startIcon={<AnalyticsIcon />}
                        theme={isDarkTheme ? 'dark' : 'light'}
                        active="true"
                      >
                        Analytics
                      </NavButton>
                    </NavButtonsContainer>
                  </StyledToolbar>
                </StyledAppBar>
                <Analytics
                  guests={guests}
                  isDarkTheme={isDarkTheme}
                />
              </>
            }
          />
          <Route 
            path="/admin" 
            element={
              <>
                <StyledAppBar position="static" theme={isDarkTheme ? 'dark' : 'light'}>
                  <StyledToolbar>
                    <AppTitle variant="h6" theme={isDarkTheme ? 'dark' : 'light'}>
                      {appTitle}
                    </AppTitle>
                    <NavButtonsContainer>
                      <NavButton 
                        component={Link} 
                        to="/admin"
                        startIcon={<DashboardIcon />}
                        theme={isDarkTheme ? 'dark' : 'light'}
                        active="true"
                      >
                        Admin
                      </NavButton>
                      <NavButton 
                        component={Link} 
                        to="/analytics"
                        startIcon={<AnalyticsIcon />}
                        theme={isDarkTheme ? 'dark' : 'light'}
                        active="false"
                      >
                        Analytics
                      </NavButton>
                    </NavButtonsContainer>
                  </StyledToolbar>
                </StyledAppBar>
                <Admin 
                  guests={guests}
                  setGuests={handleSetGuests}
                  eventTitle={eventTitle}
                  setEventTitle={setEventTitle}
                  isDarkTheme={isDarkTheme}
                  setIsDarkTheme={setIsDarkTheme}
                  isCheckInEnabled={isCheckInEnabled}
                  setIsCheckInEnabled={setIsCheckInEnabled}
                  checkInToken={checkInToken}
                />
              </>
            } 
          />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </ContentContainer>
    </Router>
  );
};

export default App; 