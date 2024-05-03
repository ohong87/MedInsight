import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { BarChart } from './bar-chart';
import { Chart, ChartData } from 'components/chart/chart';

export interface ChartProps {
    name: string;
    value: string;
    lowRef: string;
    highRef: string;
    lowRefPercentage: string;
    highRefPercentage: string;
    unit: string;
    date: string;
}

interface ReferenceRangesProps {
    props: ChartProps[];
}

export const ReferenceRanges: React.FC<ReferenceRangesProps> = ({ props }) => {
    const [lowReference, setLowReference] = useState(props[props.length - 1]?.lowRefPercentage);
    const [highReference, setHighReference] = useState(props[props.length - 1]?.highRefPercentage);
    const [chartData, setChartData] = useState<ChartProps[]>(props);

    if(props === undefined) {
        return;
    }

    const handleLowReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: number = Number(event.target.value);
        const updatedData = [...props];
        if(value < 0 ||value > 100) {
            setLowReference('5');
            setChartData(prevData => {
                const updatedData = [...prevData];
                updatedData[0].lowRefPercentage = '5';
                return updatedData;
            });
        } else {
            setLowReference(event.target.value);
            setChartData(prevData => {
                const updatedData = [...prevData];
                updatedData[0].lowRefPercentage = event.target.value;
                return updatedData;
            });
        }
    };
    
    const handleHighReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: number = Number(event.target.value);
        const updatedData = [...props];
        if(value < 0 ||value > 100) {
            setHighReference('90');
            setChartData(prevData => {
                const updatedData = [...prevData];
                updatedData[0].highRefPercentage = '90';
                return updatedData;
            });
        } else {
            setHighReference(event.target.value);
            setChartData(prevData => {
                const updatedData = [...prevData];
                updatedData[0].highRefPercentage = event.target.value;
                return updatedData;
            });
        }
    };

    return (
        <Box sx={{ backgroundColor: '#fff', height: "40%", width: "100%", borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
            {/* HEADER */}
            <Typography variant="h6" component="div" sx={{ position: 'absolute', top: 0, left: 0, ml: 2.2, pt:1, pb:2 }}>
                {props[props.length - 1].name}
            </Typography>
            {/* CONTENT SECTION */}
            <Box sx={{pl:2, pr:2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Box sx={{ borderColor: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, height:'100px', width: '120px'}}>
                    <TextField label="myLowRef%" variant="outlined" value={lowReference} onChange={handleLowReferenceChange} />
                    <TextField label="myHighRef%" variant="outlined" value={highReference} onChange={handleHighReferenceChange} />
                </Box>
                {/* Right side for the bar chart */}
                <BarChart {...props[props.length - 1]} lowRefPercentage={lowReference} highRefPercentage={highReference}/>
                <Chart chartprops={chartData}></Chart>
            </Box>
        </Box>
    );
};