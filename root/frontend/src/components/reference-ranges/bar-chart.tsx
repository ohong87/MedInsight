import React from "react";
import { Box, Typography } from '@mui/material';
import { ChartProps } from "./reference-ranges";

export const BarChart = (props: ChartProps) => {
    const maxHeight = 150
    const maxValue = Number(props.highRef)
    const minValue = 0;
    const range = maxValue - minValue;

    //console.log(`highReferencePerc: ${props.highRefPercentage}`);
    console.log('-----------------------------');

    const lowReference = (Number(props.lowRefPercentage)/100 + 0.5) * Number(props.lowRef);
    const highReference = Number(props.highRefPercentage)/100 * Number(props.highRef);

    // height of dark blue spots is just the props.ref
    // height of light blue spots is 

    console.log(`maxHeight - highref: ${maxHeight - highReference}`);
    console.log(`highRef: ${highReference}`);
    console.log(`lowRef: ${lowReference}`);
    console.log(`maxHeight - lowRef: ${maxHeight - lowReference}`);
    
    const calculateHeight = (value: string | number) => {
      const percentage = (Number(value) - minValue) / range;
      return `${percentage * maxHeight}px`;
    };

    return (
    <Box sx={{ display:'flex', gap:1, alignItems: 'flex-start'}}>
        <Box sx={{display: 'flex', flexDirection: 'column-reverse', height: maxHeight, alignItems: 'flex-start' }}>
              <Box sx={{ width: 39, height: calculateHeight(props.lowRef), bgcolor: '#2c4f6f', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', pb:3, mb:2}} />
              <Box sx={{ width: 39, height: calculateHeight(lowReference), bgcolor: '#88bedc' }} />
              <Box sx={{ width: 39, height: calculateHeight(maxHeight + props.lowRef), bgcolor: '#e0e0e0' }} />
                <Box sx={{ width: 39, height: calculateHeight(30), bgcolor: '#94e19c' }}>
                  <Typography sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {props.value}
                  </Typography>
                </Box>
              <Box sx={{ width: 39, height: calculateHeight(maxHeight - Number(props.lowRef)), bgcolor: '#e0e0e0' }} />
              <Box sx={{ width: 39, height: calculateHeight(highReference), bgcolor: '#88bedc' }} />
              <Box sx={{ width: 39, height: calculateHeight(props.highRef), bgcolor: '#2c4f6f', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'   }} />
        </Box>
      </Box>
    );
  };
