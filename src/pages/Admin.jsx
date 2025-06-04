import React, { useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import { 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Alert, 
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Switch,
  TextField,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import SettingsIcon from '@mui/icons-material/Settings';
import EventSettings from '../components/EventSettings';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'};
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const AdminCard = styled(Card)`
  padding: 2rem;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)'} !important;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.theme === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)'} !important;
  border-radius: 16px !important;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme === 'dark' 
      ? '0 12px 48px rgba(0, 0, 0, 0.4)' 
      : '0 12px 48px rgba(0, 0, 0, 0.15)'} !important;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ActionButton = styled(Button)`
  padding: 12px 24px !important;
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

const DangerButton = styled(ActionButton)`
  color: ${props => props.theme === 'dark' ? '#ef4444' : '#d32f2f'} !important;
  border-color: ${props => props.theme === 'dark' ? '#ef4444' : '#d32f2f'} !important;

  &:hover {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(239, 68, 68, 0.1)' 
      : 'rgba(211, 47, 47, 0.1)'} !important;
  }
`;

const FileInfo = styled(Box)`
  margin: 1.5rem 0;
  padding: 1rem;
  background: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 12px;
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};

  .MuiTypography-root {
    font-size: 0.875rem !important;
    color: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(0, 0, 0, 0.6)'} !important;
  }
`;

const SectionTitle = styled(Typography)`
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  margin-bottom: 1.25rem !important;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'} !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;

  svg {
    font-size: 1.5rem !important;
  }
`;

const HelperText = styled(Typography)`
  color: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.7)' 
    : 'rgba(0, 0, 0, 0.6)'} !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  margin-bottom: 1.5rem !important;
  margin-top: ${props => props.withTopMargin ? '0.75rem' : '0'} !important;
`;

const StyledSwitch = styled(Switch)`
  .MuiSwitch-track {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(147, 51, 234, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)'} !important;
  }

  .MuiSwitch-switchBase.Mui-checked {
    color: ${props => props.theme === 'dark' ? '#9333ea' : '#1976D2'} !important;
  }

  .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(147, 51, 234, 0.5)' 
      : 'rgba(25, 118, 210, 0.5)'} !important;
  }
`;

const SwitchLabel = styled(Typography)`
  color: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(0, 0, 0, 0.87)'} !important;
  font-size: 0.9375rem !important;
  font-weight: 500 !important;

  strong {
    font-weight: 600 !important;
  }
`;

const LinkDisplay = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 12px;
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};

  .MuiTypography-root {
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'};
    font-family: 'Roboto Mono', monospace;
    font-size: 0.875rem !important;
    flex-grow: 1;
    word-break: break-all;
  }
`;

const ButtonGroup = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 2rem;

  ${props => props.fullWidth && `
    width: 100%;
    & > * {
      flex: 1;
    }
  `}
`;

const Admin = ({ setGuests, guests, eventTitle, setEventTitle, isDarkTheme, setIsDarkTheme, isCheckInEnabled, setIsCheckInEnabled, checkInToken }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadMode, setUploadMode] = useState('replace');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setErrorMessage('Please select a CSV file');
        setShowError(true);
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const processCSV = () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file first');
      setShowError(true);
      return;
    }

    Papa.parse(selectedFile, {
      complete: (results) => {
        if (!results.data || results.data.length < 2) {
          setErrorMessage('The CSV file appears to be empty or invalid');
          setShowError(true);
          return;
        }

        const headers = results.data[0].map(header => header.toLowerCase().trim());
        if (!headers.includes('name') || !headers.includes('company')) {
          setErrorMessage('CSV must include "name" and "company" columns');
          setShowError(true);
          return;
        }

        const validRows = results.data.slice(1).filter(row => 
          row.some(cell => cell.trim() !== '') && 
          row.length === headers.length
        );
        
        const processedGuests = validRows.map((row, index) => {
          const guestData = {};
          headers.forEach((header, i) => {
            guestData[header] = row[i]?.trim() || '';
          });
          
          return {
            id: uploadMode === 'merge' ? guests.length + index + 1 : index + 1,
            name: guestData.name || 'Unknown',
            company: guestData.company || '',
            isCheckedIn: false,
            ...guestData
          };
        });

        if (uploadMode === 'merge') {
          // Merge new guests with existing ones
          setGuests(currentGuests => {
            const newGuests = processedGuests.filter(newGuest => 
              !currentGuests.some(existingGuest => 
                existingGuest.name === newGuest.name && 
                existingGuest.company === newGuest.company
              )
            );
            return [...currentGuests, ...newGuests];
          });
        } else {
          // Replace all guests
          setGuests(processedGuests);
        }

        setShowSuccess(true);
        setSelectedFile(null);
        setFileName('');
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      },
      error: (error) => {
        setErrorMessage('Error processing the file: ' + error.message);
        setShowError(true);
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const handleClearData = () => {
    setGuests([]);
    setShowClearConfirm(false);
    setShowSuccess(true);
  };

  const generateReport = () => {
    // Get all possible fields from all guests
    const allFields = new Set();
    guests.forEach(guest => {
      Object.keys(guest).forEach(key => {
        // Exclude internal fields and redundant check-in fields
        if (!['id', 'checkInDate', 'checkInHour'].includes(key)) {
          allFields.add(key);
        }
      });
    });

    // Convert fields to array and sort them
    const fields = Array.from(allFields).sort((a, b) => {
      // Put important fields first
      const priority = ['name', 'company', 'email', 'phone', 'isCheckedIn', 'checkInTime'];
      const aIndex = priority.indexOf(a);
      const bIndex = priority.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

    const formatFieldName = (field) => {
      return field
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    const reportData = guests.map(guest => {
      const row = {};
      fields.forEach(field => {
        if (field === 'isCheckedIn') {
          row['Check-in Status'] = guest.isCheckedIn ? 'Checked In' : 'Not Checked In';
        } else if (field === 'checkInTime') {
          row['Check-in Time'] = guest.checkInTime ? new Date(guest.checkInTime).toLocaleString() : '';
        } else {
          row[formatFieldName(field)] = guest[field] || '';
        }
      });
      return row;
    });

    const csv = Papa.unparse(reportData, {
      quotes: true,
      header: true
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `guest-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageContainer theme={isDarkTheme ? 'dark' : 'light'}>
      <ContentWrapper>
        <AdminCard theme={isDarkTheme ? 'dark' : 'light'}>
          <SectionTitle variant="h5" theme={isDarkTheme ? 'dark' : 'light'}>
            <SettingsIcon /> Event Settings
          </SectionTitle>
          <EventSettings 
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            isDarkTheme={isDarkTheme}
            setIsDarkTheme={setIsDarkTheme}
          />
        </AdminCard>

        <AdminCard theme={isDarkTheme ? 'dark' : 'light'}>
          <SectionTitle variant="h5" theme={isDarkTheme ? 'dark' : 'light'}>
            <CloudUploadIcon /> Upload Guest List
          </SectionTitle>
          <HelperText theme={isDarkTheme ? 'dark' : 'light'}>
            Choose how you want to handle the new guest list:
          </HelperText>
          
          <ButtonGroup fullWidth>
            <Box>
              <ActionButton
                variant={uploadMode === 'replace' ? 'contained' : 'outlined'}
                onClick={() => setUploadMode('replace')}
                fullWidth
                theme={isDarkTheme ? 'dark' : 'light'}
              >
                Start Fresh List
              </ActionButton>
              <HelperText withTopMargin theme={isDarkTheme ? 'dark' : 'light'}>
                Replace existing guest list with the new one. Warning: This will remove all check-in data.
              </HelperText>
            </Box>
            <Box>
              <ActionButton
                variant={uploadMode === 'merge' ? 'contained' : 'outlined'}
                onClick={() => setUploadMode('merge')}
                fullWidth
                theme={isDarkTheme ? 'dark' : 'light'}
              >
                Append to List
              </ActionButton>
              <HelperText withTopMargin theme={isDarkTheme ? 'dark' : 'light'}>
                Keep existing guests and add new ones from the file. Preserves all check-in data.
              </HelperText>
            </Box>
          </ButtonGroup>

          <Box display="flex" flexDirection="column" gap={2}>
            <label style={{ width: '100%' }}>
              <HiddenInput
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
              />
              <ActionButton
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                theme={isDarkTheme ? 'dark' : 'light'}
                fullWidth
              >
                Choose CSV File
              </ActionButton>
            </label>

            {fileName && (
              <FileInfo theme={isDarkTheme ? 'dark' : 'light'}>
                <Typography variant="body2">
                  Selected file: {fileName}
                </Typography>
              </FileInfo>
            )}

            <ActionButton
              variant="contained"
              onClick={processCSV}
              disabled={!selectedFile}
              startIcon={<UploadFileIcon />}
              theme={isDarkTheme ? 'dark' : 'light'}
              fullWidth
            >
              {uploadMode === 'merge' ? 'Upload & Append Guests' : 'Upload & Start Fresh'}
            </ActionButton>
          </Box>
        </AdminCard>

        <AdminCard theme={isDarkTheme ? 'dark' : 'light'}>
          <SectionTitle variant="h5" theme={isDarkTheme ? 'dark' : 'light'}>
            <LinkIcon /> Guest Check-in Link
          </SectionTitle>
          <HelperText theme={isDarkTheme ? 'dark' : 'light'}>
            Share this link with your guests to allow them to check in. You can enable or disable access to the check-in page at any time.
          </HelperText>
          
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <SwitchLabel theme={isDarkTheme ? 'dark' : 'light'}>
              <strong>Enable Check-in Page:</strong>
            </SwitchLabel>
            <StyledSwitch
              checked={isCheckInEnabled}
              onChange={(e) => setIsCheckInEnabled(e.target.checked)}
              color="primary"
              theme={isDarkTheme ? 'dark' : 'light'}
            />
          </Box>

          <LinkDisplay theme={isDarkTheme ? 'dark' : 'light'}>
            <Typography 
              sx={{ 
                opacity: isCheckInEnabled ? 1 : 0.5,
                textDecoration: isCheckInEnabled ? 'none' : 'line-through'
              }}
            >
              {`${window.location.origin}/check-in/${checkInToken}`}
            </Typography>
            <Tooltip title="Copy link">
              <IconButton 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/check-in/${checkInToken}`);
                  setShowCopySuccess(true);
                }}
                disabled={!isCheckInEnabled}
                size="small"
                sx={{ color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </LinkDisplay>
        </AdminCard>

        <AdminCard theme={isDarkTheme ? 'dark' : 'light'}>
          <SectionTitle variant="h5" theme={isDarkTheme ? 'dark' : 'light'}>
            <DownloadIcon /> Generate Report
          </SectionTitle>
          <HelperText theme={isDarkTheme ? 'dark' : 'light'}>
            Download a complete report of all guests including check-in status, timestamps, and notes.
          </HelperText>
          <ActionButton
            variant="contained"
            onClick={generateReport}
            disabled={!guests.length}
            startIcon={<DownloadIcon />}
            theme={isDarkTheme ? 'dark' : 'light'}
            fullWidth
          >
            Download Report
          </ActionButton>
        </AdminCard>

        <AdminCard theme={isDarkTheme ? 'dark' : 'light'}>
          <SectionTitle variant="h5" color="error" theme={isDarkTheme ? 'dark' : 'light'}>
            <DeleteIcon /> Danger Zone
          </SectionTitle>
          <HelperText theme={isDarkTheme ? 'dark' : 'light'}>
            Warning: Actions in this section cannot be undone.
          </HelperText>
          <DangerButton
            variant="outlined"
            onClick={() => setShowClearConfirm(true)}
            startIcon={<DeleteIcon />}
            theme={isDarkTheme ? 'dark' : 'light'}
            fullWidth
          >
            Clear All Guest Data
          </DangerButton>
        </AdminCard>
      </ContentWrapper>

      <Dialog
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        PaperProps={{
          style: {
            backgroundColor: isDarkTheme ? '#242444' : '#ffffff',
            color: isDarkTheme ? '#ffffff' : '#1a1a2e',
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle>Clear All Data?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all guest data? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <ActionButton 
            onClick={() => setShowClearConfirm(false)}
            theme={isDarkTheme ? 'dark' : 'light'}
          >
            Cancel
          </ActionButton>
          <DangerButton 
            onClick={handleClearData} 
            variant="contained"
            theme={isDarkTheme ? 'dark' : 'light'}
          >
            Clear All Data
          </DangerButton>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setShowSuccess(false)}
          sx={{
            backgroundColor: isDarkTheme ? 'rgba(46, 125, 50, 0.9)' : '#4caf50',
            color: '#ffffff',
            '& .MuiAlert-icon': {
              color: '#ffffff'
            }
          }}
        >
          {guests.length === 0 ? 'All data cleared successfully!' : 'Guest list updated successfully!'}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setShowError(false)}
          sx={{
            backgroundColor: isDarkTheme ? 'rgba(211, 47, 47, 0.9)' : '#f44336',
            color: '#ffffff',
            '& .MuiAlert-icon': {
              color: '#ffffff'
            }
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showCopySuccess}
        autoHideDuration={3000}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity="success"
          onClose={() => setShowCopySuccess(false)}
          sx={{
            backgroundColor: isDarkTheme ? 'rgba(46, 125, 50, 0.9)' : '#4caf50',
            color: '#ffffff',
            '& .MuiAlert-icon': {
              color: '#ffffff'
            }
          }}
        >
          Check-in link copied to clipboard!
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Admin; 