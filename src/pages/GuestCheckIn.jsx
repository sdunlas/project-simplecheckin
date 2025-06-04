import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Paper, Box, Chip, TextField, InputAdornment, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import GuestDetails from '../components/GuestDetails';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const HeaderContainer = styled(Paper)`
  padding: 1.5rem;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)'} !important;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: none !important;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'} !important;
  z-index: 1000;

  .MuiTypography-root {
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
  }
`;

const HeaderContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
`;

const HeaderRight = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActionButton = styled(Button)`
  padding: 8px 16px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.2s ease-in-out !important;
  
  background: ${props => {
    if (props.variant === 'contained') {
      return props.theme === 'dark' 
        ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)' 
        : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
    }
    return 'transparent';
  }} !important;
  
  color: ${props => {
    if (props.variant === 'contained') {
      return '#ffffff';
    }
    return props.theme === 'dark' ? '#ffffff' : '#1976D2';
  }} !important;

  border: ${props => {
    if (props.variant !== 'contained') {
      return props.theme === 'dark' 
        ? '2px solid rgba(255, 255, 255, 0.2)'
        : '2px solid rgba(25, 118, 210, 0.5)';
    }
    return 'none';
  }} !important;

  &:hover {
    background: ${props => {
      if (props.variant === 'contained') {
        return props.theme === 'dark'
          ? 'linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)'
          : 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
      }
      return props.theme === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(25, 118, 210, 0.1)';
    }} !important;
    transform: translateY(-2px);
  }

  &.Mui-disabled {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.12)'} !important;
    color: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(0, 0, 0, 0.26)'} !important;
  }
`;

const StatsChip = styled(Chip)`
  background: ${props => props.theme === 'dark' 
    ? 'rgba(75, 192, 192, 0.2)' 
    : 'rgba(32, 156, 156, 0.1)'} !important;
  color: ${props => props.theme === 'dark' 
    ? '#4bffa5' 
    : '#00796b'} !important;
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(75, 192, 192, 0.3)' 
    : 'rgba(32, 156, 156, 0.2)'} !important;
  font-size: 1rem !important;
  height: 32px !important;
  padding: 0 16px !important;

  .MuiChip-icon {
    color: ${props => props.theme === 'dark' 
      ? '#4bffa5' 
      : '#00796b'} !important;
    margin-left: 8px !important;
  }
`;

const MainContent = styled.div`
  display: flex;
  padding: 2rem;
  gap: ${props => props.isDetailsOpen ? '24px' : '0px'};
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
  width: 100%;
  overflow: hidden;
  transition: gap 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.isDetailsOpen ? '0.4' : '1'};
  min-width: ${props => props.isDetailsOpen ? '400px' : '320px'};
  max-width: ${props => props.isDetailsOpen ? 'none' : '800px'};
  margin: ${props => props.isDetailsOpen ? '0' : '0 auto'};
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 16px;
  overflow: hidden;
  height: calc(100vh - 180px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
  box-shadow: ${props => props.theme === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)'};
`;

const FixedControls = styled.div`
  padding: 1.5rem;
  background: transparent;
  border-bottom: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const SearchContainer = styled.div`
  position: relative;
  
  .MuiTextField-root {
    width: 100%;
    background: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.05)'};
    border-radius: 12px;
    
    .MuiOutlinedInput-root {
      color: ${props => props.theme === 'dark' ? 'white' : 'black'};
      padding: 8px 12px;
      
      .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.2)' 
          : 'rgba(0, 0, 0, 0.2)'};
        border-radius: 12px;
      }
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'rgba(0, 0, 0, 0.3)'};
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.5)' 
          : 'rgba(33, 150, 243, 0.5)'};
      }
    }
    
    .MuiInputAdornment-root {
      color: ${props => props.theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.7)' 
        : 'rgba(0, 0, 0, 0.7)'};
    }
  }
`;

const ScrollableList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : '#f1f1f1'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : '#888'};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.3)' 
        : '#555'};
    }
  }
`;

const GuestCard = styled.div`
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: ${props => props.theme === 'dark' 
    ? props.selected 
      ? 'rgba(147, 51, 234, 0.2)'
      : 'rgba(255, 255, 255, 0.05)'
    : props.selected 
      ? 'rgba(33, 150, 243, 0.1)'
      : 'white'};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease-in-out;
  border: 1px solid ${props => props.theme === 'dark'
    ? props.selected
      ? 'rgba(147, 51, 234, 0.3)'
      : 'rgba(255, 255, 255, 0.1)'
    : props.selected
      ? 'rgba(33, 150, 243, 0.3)'
      : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.selected
    ? props.theme === 'dark'
      ? '0 8px 32px rgba(147, 51, 234, 0.2)'
      : '0 8px 32px rgba(33, 150, 243, 0.15)'
    : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'};
    background: ${props => props.theme === 'dark'
      ? props.selected
        ? 'rgba(147, 51, 234, 0.25)'
        : 'rgba(255, 255, 255, 0.08)'
      : props.selected
        ? 'rgba(33, 150, 243, 0.15)'
        : 'rgba(255, 255, 255, 1)'};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const GuestInfo = styled.div`
  flex: 1;

  .guest-name {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 4px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
  }

  .guest-company {
    font-size: 0.9rem;
    color: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(0, 0, 0, 0.6)'};
  }
`;

const CheckInButton = styled(ActionButton)`
  min-width: 120px !important;
  margin-left: 16px !important;
  
  background: ${props => {
    if (props.isCheckedIn) {
      return props.theme === 'dark'
        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
        : 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    }
    return props.theme === 'dark'
      ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
      : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
  }} !important;

  &:hover {
    background: ${props => {
      if (props.isCheckedIn) {
        return props.theme === 'dark'
          ? 'linear-gradient(135deg, #047857 0%, #065F46 100%)'
          : 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      }
      return props.theme === 'dark'
        ? 'linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)'
        : 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
    }} !important;
  }
`;

const DetailsWrapper = styled.div`
  flex: 0.6;
  min-width: 500px;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translateX(0)' : 'translateX(20px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  height: calc(100vh - 180px);
  
  &::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    transform: scaleY(${props => props.isVisible ? 1 : 0});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top;
  }
`;

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: ${props => props.theme === 'dark' 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'white'} !important;
    backdrop-filter: blur(10px);
    border: 1px solid ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 16px !important;
    padding: 1rem;
    min-width: 400px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
  padding: 1rem !important;
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  border-bottom: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 1.5rem 1rem !important;

  .MuiTextField-root {
    margin: 12px 0;
    
    .MuiOutlinedInput-root {
      background: ${props => props.theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.02)'};
      border-radius: 12px;
      color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
      
      .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.2)' 
          : 'rgba(0, 0, 0, 0.2)'};
        border-radius: 12px;
      }
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'rgba(0, 0, 0, 0.3)'};
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' 
          ? '#9333ea' 
          : '#2196F3'};
      }
    }
    
    .MuiInputLabel-root {
      color: ${props => props.theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.7)' 
        : 'rgba(0, 0, 0, 0.7)'};
      
      &.Mui-focused {
        color: ${props => props.theme === 'dark' 
          ? '#9333ea' 
          : '#2196F3'};
      }
    }
  }
`;

const StyledDialogActions = styled(DialogActions)`
  padding: 1rem !important;
  border-top: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const GuestCheckIn = ({ guests, setGuests, isDarkTheme, checkInToken, eventTitle }) => {
  const { token } = useParams();
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddGuestDialogOpen, setIsAddGuestDialogOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: ''
  });

  const checkedInCount = guests.filter(guest => guest.isCheckedIn).length;

  const handleCheckIn = (guestId) => {
    const now = new Date();
    setGuests(guests.map(guest => 
      guest.id === guestId 
        ? { 
            ...guest, 
            isCheckedIn: !guest.isCheckedIn,
            checkInTime: !guest.isCheckedIn ? now.toISOString() : null,
            checkInDate: !guest.isCheckedIn ? now.toLocaleDateString() : null,
            checkInHour: !guest.isCheckedIn ? now.getHours() : null
          }
        : guest
    ));
  };

  const handleAddGuest = (shouldCheckIn = false) => {
    const now = new Date();
    const guestToAdd = {
      ...newGuest,
      id: Date.now(),
      isCheckedIn: shouldCheckIn,
      checkInTime: shouldCheckIn ? now.toISOString() : null,
      checkInDate: shouldCheckIn ? now.toLocaleDateString() : null,
      checkInHour: shouldCheckIn ? now.getHours() : null
    };

    setGuests(currentGuests => [...currentGuests, guestToAdd]);
    setNewGuest({
      name: '',
      company: '',
      email: '',
      phone: '',
      notes: ''
    });
    setIsAddGuestDialogOpen(false);
  };

  const handleCloseDetails = () => {
    setSelectedGuest(null);
  };

  const handleUpdateGuest = (updatedGuest) => {
    setGuests(guests.map(guest => 
      guest.id === updatedGuest.id ? updatedGuest : guest
    ));
  };

  const filteredGuests = guests.filter(guest => {
    const searchLower = searchQuery.toLowerCase();
    return (
      guest.name.toLowerCase().includes(searchLower) ||
      (guest.company && guest.company.toLowerCase().includes(searchLower))
    );
  });

  // Validate token
  if (!token || token !== checkInToken) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <PageContainer theme={isDarkTheme ? 'dark' : 'light'}>
      <HeaderContainer theme={isDarkTheme ? 'dark' : 'light'} elevation={0}>
        <HeaderContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {eventTitle}
          </Typography>
          <HeaderRight>
            <ActionButton
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setIsAddGuestDialogOpen(true)}
              theme={isDarkTheme ? 'dark' : 'light'}
              size="medium"
            >
              Add Guest
            </ActionButton>
            <StatsChip
              icon={<CheckCircleOutlineIcon />}
              label={`${checkedInCount}/${guests.length} Checked In`}
              theme={isDarkTheme ? 'dark' : 'light'}
            />
          </HeaderRight>
        </HeaderContent>
      </HeaderContainer>
      
      <MainContent isDetailsOpen={selectedGuest !== null}>
        <ListContainer 
          theme={isDarkTheme ? 'dark' : 'light'} 
          isDetailsOpen={selectedGuest !== null}
        >
          <FixedControls theme={isDarkTheme ? 'dark' : 'light'}>
            <SearchContainer theme={isDarkTheme ? 'dark' : 'light'}>
              <TextField
                placeholder="Search guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                        sx={{ color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </SearchContainer>
          </FixedControls>
          <ScrollableList theme={isDarkTheme ? 'dark' : 'light'}>
            {filteredGuests.map(guest => (
              <GuestCard 
                key={guest.id}
                theme={isDarkTheme ? 'dark' : 'light'}
                selected={selectedGuest === guest.id}
                onClick={() => setSelectedGuest(guest.id)}
              >
                <GuestInfo theme={isDarkTheme ? 'dark' : 'light'}>
                  <div className="guest-name">{guest.name}</div>
                  {guest.company && (
                    <div className="guest-company">{guest.company}</div>
                  )}
                </GuestInfo>
                <CheckInButton
                  variant="contained"
                  isCheckedIn={guest.isCheckedIn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheckIn(guest.id);
                  }}
                  theme={isDarkTheme ? 'dark' : 'light'}
                >
                  {guest.isCheckedIn ? 'Checked In' : 'Check In'}
                </CheckInButton>
              </GuestCard>
            ))}
            {filteredGuests.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
              }}>
                No guests found matching "{searchQuery}"
              </div>
            )}
          </ScrollableList>
        </ListContainer>
        {selectedGuest && (
          <DetailsWrapper 
            isVisible={selectedGuest !== null}
            theme={isDarkTheme ? 'dark' : 'light'}
          >
            <GuestDetails 
              guest={guests.find(g => g.id === selectedGuest)}
              onClose={handleCloseDetails}
              onUpdateGuest={handleUpdateGuest}
              isDarkTheme={isDarkTheme}
            />
          </DetailsWrapper>
        )}
      </MainContent>

      <StyledDialog 
        open={isAddGuestDialogOpen} 
        onClose={() => setIsAddGuestDialogOpen(false)}
        theme={isDarkTheme ? 'dark' : 'light'}
        maxWidth="sm"
        fullWidth
      >
        <StyledDialogTitle theme={isDarkTheme ? 'dark' : 'light'}>
          Add New Guest
        </StyledDialogTitle>
        <StyledDialogContent theme={isDarkTheme ? 'dark' : 'light'}>
          <TextField
            label="Name"
            value={newGuest.name}
            onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
            fullWidth
            required
          />
          <TextField
            label="Company (Optional)"
            value={newGuest.company}
            onChange={(e) => setNewGuest({...newGuest, company: e.target.value})}
            fullWidth
          />
          <TextField
            label="Email"
            value={newGuest.email}
            onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
            fullWidth
            type="email"
          />
          <TextField
            label="Phone"
            value={newGuest.phone}
            onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
            fullWidth
          />
          <TextField
            label="Notes"
            value={newGuest.notes}
            onChange={(e) => setNewGuest({...newGuest, notes: e.target.value})}
            fullWidth
            multiline
            rows={3}
            placeholder="Add any additional notes..."
          />
        </StyledDialogContent>
        <StyledDialogActions theme={isDarkTheme ? 'dark' : 'light'}>
          <Button 
            onClick={() => setIsAddGuestDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleAddGuest(false)}
            variant="contained"
            disabled={!newGuest.name}
          >
            Add Guest
          </Button>
          <Button 
            onClick={() => handleAddGuest(true)}
            variant="contained"
            disabled={!newGuest.name}
            startIcon={<CheckCircleOutlineIcon />}
          >
            Add & Check In
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </PageContainer>
  );
};

export default GuestCheckIn;