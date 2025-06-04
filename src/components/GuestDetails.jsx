import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { 
  IconButton, 
  TextField, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const DetailsContainer = styled(Paper)`
  padding: 20px;
  width: 100%;
  height: 100%;
  background: ${props => props.theme === 'dark' ? '#242444' : 'white'} !important;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'} !important;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  opacity: 0;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f1f1f1'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#888'};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#555'};
    }
  }
`;

const CloseButton = styled(IconButton)`
  position: absolute !important;
  right: 8px !important;
  top: 8px !important;
  color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'} !important;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: 10px;
`;

const DetailRow = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 1rem;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 8px;
  background: ${props => {
    if (props.isCheckedIn) {
      return props.theme === 'dark' 
        ? 'rgba(76, 175, 80, 0.2)' 
        : 'rgba(76, 175, 80, 0.1)';
    }
    return props.theme === 'dark'
      ? 'rgba(126, 87, 194, 0.2)'
      : 'rgba(33, 150, 243, 0.1)';
  }};
  color: ${props => {
    if (props.isCheckedIn) {
      return props.theme === 'dark' 
        ? '#81c784' 
        : '#2e7d32';
    }
    return props.theme === 'dark'
      ? '#9575CD'
      : '#1976d2';
  }};
  border: 1px solid ${props => {
    if (props.isCheckedIn) {
      return props.theme === 'dark' 
        ? 'rgba(76, 175, 80, 0.3)' 
        : 'rgba(76, 175, 80, 0.2)';
    }
    return props.theme === 'dark'
      ? 'rgba(126, 87, 194, 0.3)'
      : 'rgba(33, 150, 243, 0.2)';
  }};

  svg {
    font-size: 1.2rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  text-align: center;
  padding: 20px;
`;

const NotesSection = styled(DetailRow)`
  position: relative;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  .MuiTextField-root {
    width: 100%;
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    border-radius: 4px;
    
    .MuiOutlinedInput-root {
      color: ${props => props.theme === 'dark' ? 'white' : 'black'};
      
      .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
      }
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
      }
    }
  }
`;

const SaveIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  font-size: 0.8em;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const TimestampSection = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  font-size: 0.9em;
  color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
`;

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: ${props => props.theme === 'dark' ? '#1a1a2e' : '#ffffff'};
    border-radius: 16px;
    box-shadow: ${props => props.theme === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'};
    border: 1px solid ${props => props.theme === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  background: ${props => props.theme === 'dark' ? '#242444' : '#f8f9fa'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
  padding: 20px 24px;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 24px !important;
  background: ${props => props.theme === 'dark' ? '#1a1a2e' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};

  .MuiTextField-root {
    margin: 12px 0;
    
    .MuiOutlinedInput-root {
      background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa'};
      border-radius: 8px;
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #2196f3;
        border-width: 2px;
      }
    }

    .MuiOutlinedInput-notchedOutline {
      border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    }

    .MuiInputLabel-root {
      color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
      
      &.Mui-focused {
        color: #2196f3;
      }
    }

    input, textarea {
      color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
      
      &::placeholder {
        color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
      }
    }
  }
`;

const StyledDialogActions = styled(DialogActions)`
  padding: 16px 24px;
  background: ${props => props.theme === 'dark' ? '#242444' : '#f8f9fa'};
  border-top: 1px solid ${props => props.theme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};

  button {
    border-radius: 8px;
    padding: 8px 16px;
    text-transform: none;
    font-weight: 500;
    
    &.MuiButton-contained {
      background: ${props => props.theme === 'dark' 
        ? 'linear-gradient(45deg, #7e57c2, #9575cd)'
        : 'linear-gradient(45deg, #1976d2, #2196f3)'};
      box-shadow: ${props => props.theme === 'dark'
        ? '0 2px 8px rgba(126, 87, 194, 0.3)'
        : '0 2px 8px rgba(33, 150, 243, 0.3)'};
      color: #ffffff;
      
      &:hover {
        background: ${props => props.theme === 'dark'
          ? 'linear-gradient(45deg, #5e35b1, #7e57c2)'
          : 'linear-gradient(45deg, #1565c0, #1976d2)'};
      }
    }
    
    &.MuiButton-outlined {
      border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)'};
      color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
      
      &:hover {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
      }
    }
  }
`;

const GuestDetails = ({ guest, onClose, onUpdateGuest, isDarkTheme }) => {
  const [localNotes, setLocalNotes] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedGuest, setEditedGuest] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (guest) {
      setLocalNotes(guest.notes || '');
      setEditedGuest(guest);
    }
  }, [guest]);

  const debouncedSave = useCallback((value) => {
    setIsSaving(true);
    onUpdateGuest({ ...guest, notes: value });
    setTimeout(() => setIsSaving(false), 1000);
  }, [guest, onUpdateGuest]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (guest && localNotes !== guest.notes) {
        debouncedSave(localNotes);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [localNotes, guest, debouncedSave]);

  const handleNotesChange = (e) => {
    setLocalNotes(e.target.value);
  };

  const handleEditSave = () => {
    onUpdateGuest(editedGuest);
    setIsEditDialogOpen(false);
  };

  if (!guest) {
    return (
      <DetailsContainer theme={isDarkTheme ? 'dark' : 'light'}>
        <EmptyState theme={isDarkTheme ? 'dark' : 'light'}>
          <p>Select a guest to view details</p>
        </EmptyState>
      </DetailsContainer>
    );
  }

  // System fields that shouldn't be editable
  const systemFields = ['id', 'isCheckedIn', 'notes', 'checkInTime', 'checkInDate', 'checkInHour'];
  
  // Get all fields except system fields
  const editableFields = Object.keys(guest).filter(key => !systemFields.includes(key));
  
  // Separate display fields
  const displayFields = [...editableFields];
  if (guest.checkInTime) {
    displayFields.push('checkInTime');
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const formatFieldLabel = (field) => {
    // Convert camelCase or snake_case to Title Case
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <DetailsContainer theme={isDarkTheme ? 'dark' : 'light'} elevation={isDarkTheme ? 0 : 1}>
      <CloseButton onClick={onClose} theme={isDarkTheme ? 'dark' : 'light'}>
        <CloseIcon />
      </CloseButton>

      <Box display="flex" alignItems="center" justifyContent="space-between" pr={4}>
        <Typography variant="h6" gutterBottom>
          Guest Details
        </Typography>
        <IconButton 
          onClick={() => setIsEditDialogOpen(true)}
          sx={{ 
            color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)',
            marginLeft: 1
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>

      <StatusIndicator 
        isCheckedIn={guest.isCheckedIn}
        theme={isDarkTheme ? 'dark' : 'light'}
      >
        {guest.isCheckedIn ? (
          <>
            <CheckCircleIcon />
            <span>Checked In</span>
          </>
        ) : (
          <>
            <PendingIcon />
            <span>Not Checked In</span>
          </>
        )}
      </StatusIndicator>

      <ContentWrapper>
        <Box sx={{ mt: 3 }}>
          {displayFields.map(key => (
            <DetailRow key={key}>
              <Label theme={isDarkTheme ? 'dark' : 'light'}>{formatFieldLabel(key)}</Label>
              <Value theme={isDarkTheme ? 'dark' : 'light'}>
                {key === 'checkInTime' ? formatDateTime(guest[key]) : (guest[key] || '-')}
              </Value>
            </DetailRow>
          ))}
        </Box>

        <NotesSection theme={isDarkTheme ? 'dark' : 'light'}>
          <Label theme={isDarkTheme ? 'dark' : 'light'}>Notes</Label>
          <TextField
            multiline
            rows={4}
            value={localNotes}
            onChange={handleNotesChange}
            variant="outlined"
            placeholder="Add notes about the guest..."
            fullWidth
          />
          <SaveIndicator 
            visible={isSaving}
            theme={isDarkTheme ? 'dark' : 'light'}
          >
            <SaveIcon fontSize="small" /> Saving...
          </SaveIndicator>
        </NotesSection>
      </ContentWrapper>

      <StyledDialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        theme={isDarkTheme ? 'dark' : 'light'}
      >
        <StyledDialogTitle theme={isDarkTheme ? 'dark' : 'light'}>
          Edit Guest Information
        </StyledDialogTitle>
        <StyledDialogContent theme={isDarkTheme ? 'dark' : 'light'}>
          {editableFields.map(field => (
            <TextField
              key={field}
              label={formatFieldLabel(field)}
              value={editedGuest[field] || ''}
              onChange={(e) => setEditedGuest({...editedGuest, [field]: e.target.value})}
              fullWidth
              variant="outlined"
            />
          ))}
        </StyledDialogContent>
        <StyledDialogActions theme={isDarkTheme ? 'dark' : 'light'}>
          <Button onClick={() => setIsEditDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained">
            Save Changes
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </DetailsContainer>
  );
};

export default GuestDetails; 