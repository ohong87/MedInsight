import React from "react";
import { Box, Typography, Avatar, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
    borderRadius: '10px',
    backgroundColor: '#2c4f6f',
    display: 'flex',
    width: '95%',
    height: '10%',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '1% 1% 1% 1%',
  }));

export const Welcome: React.FC<{ userName: string }> = ({ userName }) => {
    return (
        <StyledBox>
        <Box>
            <Typography
            variant="body1"
            sx={{ color: 'rgba(206,213,220,1)', fontWeight: 400 }}
            >
            Hello {userName},
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: '#fff' }}>
            Have a nice day and don’t forget to take care of your health!
            </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/41b33d3640559a4b71be7e134e0b97e2b21f702cfd808a73d05c1ee0c7205801?apiKey=bdfeceb994244fa2958e77119f2bc26e&"
            alt="company logo"
            variant="square"
            sx={{ width: 56, height: 56 }}
            />
            <Typography variant="body1" sx={{ color: '#f9f9f9', fontWeight: 600 }}>
            MedInsight
            </Typography>
        </Stack>
        </StyledBox>
    );
};
