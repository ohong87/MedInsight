import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

export const HealthMetricsPanel = () => {

    const data = Array.from({ length: 30 }, (_, i) => ({
        name: i % 2 === 0 ? 'WBC(10^3.UL)' : 'RBC (10^6/uL)',
        description: 'Measure the number of immune cells crucial for body defense.'
    }));

    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const handleSelect = (index: number) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(selectedItems.filter(item => item !== index));
        } else {
            if (selectedItems.length < 3) {
                setSelectedItems([...selectedItems, index]);
            }
        }
    };

    return (
        <Box
            sx={{
                width: '35%',
                height: '73%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '10px', // Add this line
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                '-ms-overflow-style': 'none',  // IE and Edge
                'scrollbar-width': 'none',  // Firefox
            }}
        >
            <Paper elevation={3}>
                <Grid container sx={{ backgroundColor: '#E7E7E7' }}>
                    <Grid item xs={2}> {/* Increase the width here */}
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>Select</Typography>
                    </Grid>
                    <Grid item xs={4}> {/* Decrease the width here */}
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>Name</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>Description</Typography>
                    </Grid>
                </Grid>
                {data.map((item, index) => (
                    <Grid container key={index}>
                        <Grid item xs={2}> {/* Increase the width here */}
                            <Checkbox 
                            checked={selectedItems.includes(index)}
                            onChange={() => handleSelect(index)}
                            />
                        </Grid>
                        <Grid item xs={4}> {/* Decrease the width here */}
                            <Typography>{item.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>{item.description}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </Paper>
        </Box>
    );
};



