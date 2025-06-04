import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton, Tooltip, Button } from '@mui/material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import DownloadIcon from '@mui/icons-material/Download';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import styled from 'styled-components';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

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
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AnalyticsCard = styled(Card)`
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

const StatsCard = styled(AnalyticsCard)`
  .MuiCardContent-root {
    padding: 0 !important;
  }

  .icon {
    font-size: 40px;
    margin-right: 16px;
    color: ${props => props.theme === 'dark' 
      ? 'rgb(75, 192, 192)' 
      : 'rgb(32, 156, 156)'};
  }

  .title {
    color: ${props => props.theme === 'dark'
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 0, 0, 0.6)'};
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .value {
    color: ${props => props.theme === 'dark'
      ? '#ffffff'
      : '#1a1a2e'};
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1.2;
  }
`;

const SectionTitle = styled(Typography)`
  font-weight: 600 !important;
  margin-bottom: 1rem !important;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a2e'} !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
`;

const HelperText = styled(Typography)`
  color: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.7)' 
    : 'rgba(0, 0, 0, 0.6)'} !important;
  font-size: 0.875rem !important;
  margin-bottom: 1rem !important;
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

const Analytics = ({ guests, isDarkTheme }) => {
  const [checkInStats, setCheckInStats] = useState({
    totalGuests: 0,
    checkedIn: 0,
    checkInTimes: {},
    companies: {},
  });

  useEffect(() => {
    if (guests) {
      const checkedInCount = guests.filter(guest => guest.isCheckedIn).length;
      
      // Process check-in times for the line graph
      const timeData = {};
      for (let i = 0; i < 24; i++) {
        timeData[i] = 0;
      }
      
      guests.forEach(guest => {
        if (guest.isCheckedIn && guest.checkInHour !== undefined) {
          timeData[guest.checkInHour] = (timeData[guest.checkInHour] || 0) + 1;
        }
      });

      // Process company statistics
      const companyData = guests.reduce((acc, guest) => {
        const company = guest.company || 'Unspecified';
        if (!acc[company]) {
          acc[company] = { total: 0, checkedIn: 0 };
        }
        acc[company].total += 1;
        if (guest.isCheckedIn) {
          acc[company].checkedIn += 1;
        }
        return acc;
      }, {});

      setCheckInStats({
        totalGuests: guests.length,
        checkedIn: checkedInCount,
        checkInTimes: timeData,
        companies: companyData,
      });
    }
  }, [guests]);

  const handleDownloadAnalytics = () => {
    // Create Excel-compatible CSV content
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Guests', checkInStats.totalGuests],
      ['Checked In', checkInStats.checkedIn],
      ['Check-in Rate', `${Math.round((checkInStats.checkedIn / checkInStats.totalGuests) * 100)}%`],
      ['', ''],
      ['Company Statistics', ''],
      ...Object.entries(checkInStats.companies).map(([company, stats]) => [
        company,
        `${stats.checkedIn}/${stats.total} checked in`
      ])
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'check-in-analytics.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const lineChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Check-ins',
        data: Object.values(checkInStats.checkInTimes),
        borderColor: isDarkTheme ? 'rgb(75, 192, 192)' : 'rgb(32, 156, 156)',
        backgroundColor: isDarkTheme ? 'rgba(75, 192, 192, 0.5)' : 'rgba(32, 156, 156, 0.5)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ['Checked In', 'Not Checked In'],
    datasets: [
      {
        data: [checkInStats.checkedIn, checkInStats.totalGuests - checkInStats.checkedIn],
        backgroundColor: isDarkTheme 
          ? ['rgb(75, 192, 192)', 'rgb(255, 99, 132)']
          : ['rgb(32, 156, 156)', 'rgb(220, 52, 85)'],
      },
    ],
  };

  const companyData = {
    labels: Object.keys(checkInStats.companies),
    datasets: [
      {
        label: 'Total Guests',
        data: Object.values(checkInStats.companies).map(stats => stats.total),
        backgroundColor: isDarkTheme ? 'rgba(255, 99, 132, 0.8)' : 'rgba(220, 52, 85, 0.8)',
      },
      {
        label: 'Checked In',
        data: Object.values(checkInStats.companies).map(stats => stats.checkedIn),
        backgroundColor: isDarkTheme ? 'rgba(75, 192, 192, 0.8)' : 'rgba(32, 156, 156, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkTheme ? '#ffffff' : '#1a1a2e',
          font: {
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            size: 12,
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: isDarkTheme ? '#ffffff' : '#1a1a2e',
          font: {
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            size: 11,
          }
        }
      },
      y: {
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: isDarkTheme ? '#ffffff' : '#1a1a2e',
          font: {
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            size: 11,
          }
        }
      }
    }
  };

  return (
    <PageContainer theme={isDarkTheme ? 'dark' : 'light'}>
      <ContentWrapper>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          gap: 2
        }}>
          <SectionTitle variant="h4" theme={isDarkTheme ? 'dark' : 'light'}>
            Event Analytics Dashboard
          </SectionTitle>
          <Tooltip title="Download detailed analytics report in CSV format">
            <ActionButton
              variant="outlined"
              onClick={handleDownloadAnalytics}
              startIcon={<DownloadIcon />}
              theme={isDarkTheme ? 'dark' : 'light'}
              disabled={!checkInStats.totalGuests}
            >
              Download Report
            </ActionButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatsCard theme={isDarkTheme ? 'dark' : 'light'}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon className="icon" />
                <Box>
                  <Typography className="title">Total Guests</Typography>
                  <Typography className="value">{checkInStats.totalGuests}</Typography>
                </Box>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard theme={isDarkTheme ? 'dark' : 'light'}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon className="icon" />
                <Box>
                  <Typography className="title">Checked In</Typography>
                  <Typography className="value">{checkInStats.checkedIn}</Typography>
                </Box>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard theme={isDarkTheme ? 'dark' : 'light'}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <TimelineIcon className="icon" />
                <Box>
                  <Typography className="title">Check-in Rate</Typography>
                  <Typography className="value">
                    {checkInStats.totalGuests
                      ? Math.round((checkInStats.checkedIn / checkInStats.totalGuests) * 100)
                      : 0}%
                  </Typography>
                </Box>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AnalyticsCard theme={isDarkTheme ? 'dark' : 'light'}>
              <SectionTitle variant="h6" theme={isDarkTheme ? 'dark' : 'light'}>
                <TimelineIcon /> Check-ins Throughout the Day
              </SectionTitle>
              <HelperText theme={isDarkTheme ? 'dark' : 'light'}>
                Visualizes the distribution of check-ins across different hours of the day
              </HelperText>
              <Box sx={{ height: 300 }}>
                <Line data={lineChartData} options={chartOptions} />
              </Box>
            </AnalyticsCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <AnalyticsCard theme={isDarkTheme ? 'dark' : 'light'}>
              <SectionTitle variant="h6" theme={isDarkTheme ? 'dark' : 'light'}>
                <CheckCircleIcon /> Check-in Status
              </SectionTitle>
              <HelperText theme={isDarkTheme ? 'dark' : 'light'}>
                Overview of checked-in vs not checked-in guests
              </HelperText>
              <Box sx={{ height: 300 }}>
                <Doughnut data={doughnutData} options={chartOptions} />
              </Box>
            </AnalyticsCard>
          </Grid>
          <Grid item xs={12}>
            <AnalyticsCard theme={isDarkTheme ? 'dark' : 'light'}>
              <SectionTitle variant="h6" theme={isDarkTheme ? 'dark' : 'light'}>
                <GroupIcon /> Company Statistics
              </SectionTitle>
              <HelperText theme={isDarkTheme ? 'dark' : 'light'}>
                Breakdown of guest attendance by company, showing total registered vs checked-in
              </HelperText>
              <Box sx={{ height: 300 }}>
                <Bar data={companyData} options={chartOptions} />
              </Box>
            </AnalyticsCard>
          </Grid>
        </Grid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Analytics; 