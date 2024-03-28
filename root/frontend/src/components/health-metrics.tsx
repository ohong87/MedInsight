import React, { Dispatch, SetStateAction, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

export interface HealthMetricsPanelProps {
    onSelectionChange: Dispatch<SetStateAction<never[] | number[]>>;
            data: { name: string; description: string; }[]; // Update the type of the data prop
}

export const HealthMetricsPanel: React.FC<HealthMetricsPanelProps> = ({ onSelectionChange, data }) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const handleSelect = (index: number) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(prevItems => {
                const newItems = prevItems.filter(item => item !== index);
                onSelectionChange(newItems); // Call onSelectionChange with the new array
                return newItems;
            });
        } else {
            if (selectedItems.length < 3) {
                setSelectedItems(prevItems => {
                    const newItems = [...prevItems, index];
                    onSelectionChange(newItems); // Call onSelectionChange with the new array
                    return newItems;
                });
            }
        }
    };

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', borderRadius: '8px', '&::-webkit-scrollbar': { display: 'none', }, 'msOverflowStyle': 'none', 'scrollbarWidth': 'none', }} >
            <Paper elevation={3}>
                <Grid container sx={{ backgroundColor: '#E7E7E7' }}>
                    <Grid item xs={2}> {/* Increase the width here */}
                        <Typography variant="h6" sx={{ fontSize: '1rem', pl:1.5 }}>Select</Typography>
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



