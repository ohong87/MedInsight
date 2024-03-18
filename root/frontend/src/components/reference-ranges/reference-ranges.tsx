import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { BarChart } from './bar-chart';

export interface BarChartProps {
    title: string;
    lowMedicalBound: string;
    highMedicalBound: string;
    lowReferencePercentage: string;
    highReferencePercentage: string;
    userValue: string;
  }

interface ReferenceRangesProps {
    id: number;
    props: BarChartProps;
}

export const ReferenceRanges: React.FC<ReferenceRangesProps> = ({ id, props }) => {
    const [lowReference, setLowReference] = useState(props?.lowReferencePercentage);
    const [highReference, setHighReference] = useState(props?.highReferencePercentage);   

    if(props === undefined) { return }

    const handleLowReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: number = Number(event.target.value);
        if(value < 0 ||value > 100) {
            setLowReference('5');
        } else {
            setLowReference(event.target.value);
        }
        props.lowReferencePercentage = lowReference;
    };
    
    const handleHighReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: number = Number(event.target.value);
        if(value < 0 ||value > 100) {
            setHighReference('50');
        } else {
            setHighReference(event.target.value);
        }
        props.highReferencePercentage = highReference;
    };

    return (
        <Box sx={{ 
            backgroundColor: '#fff', 
            height: 250, 
            maxWidth: 500, 
            borderRadius: '8px',
            overflow: 'hidden', // Add this line
            position: 'relative' // Add this line
        }}>
            {/* HEADER */}
            <Typography variant="h6" component="div" sx={{ ml: 2.2, pt:1, pb:2 }}>
                {props.title}
            </Typography>
            {/* CONTENT SECTION */}
            <Box sx={{borderColor: '#FFFFFF', pl:2, pr:2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, height:'100px' }}>
                    <TextField label="myLowRef%" variant="outlined" value={lowReference} onChange={handleLowReferenceChange} />
                    <TextField label="myHighRef%" variant="outlined" value={highReference} onChange={handleHighReferenceChange} />
                </Box>
                {/* Right side for the bar chart */}
                <BarChart {...props} />
            </Box>
        </Box>
    );
};