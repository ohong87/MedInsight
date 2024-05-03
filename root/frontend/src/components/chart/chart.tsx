import * as React from "react";
import { Box, Typography } from "@mui/material";


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

export interface ChartData {
  chartprops: ChartProps[];
}

export const Chart = (data: ChartData) => {

  //////////////////////////
  // NOTICE: this section contains the data we need to change/update to make the chart work

  //console.log(data);
  // Contains chart's horizontal lines
  // How can I populate this so that we can see all the possible points?
  // One way I could think of is by going from 0 to the max 

  // !!!!! CHANGE THESE !!!!! //
  let lowMedicalBound = Number(data.chartprops[0].lowRef);    // change this to whatever the low medical bound is on the specific test
  let highMedicalBound = Number(data.chartprops[0].highRef);  // change this to whatever the high medical bound is on the specific test
  ////

  let height = Math.ceil((highMedicalBound - lowMedicalBound) / 0.8);
  let topLine = Math.ceil((height * 0.2 / 2) + highMedicalBound);
  let bottomLine = Math.floor(lowMedicalBound - (height * 0.2 / 2));

  // Function to calculate nice numbers for the y-axis
  function getNiceNumber(value: number, round: boolean) {
    const exponent = Math.floor(Math.log10(value)); // Exponent of base 10
    const fraction = value / Math.pow(10, exponent); // Fractional part
    let niceFraction: number;
  
    // Find a "nice" number to round to
    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else {
      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;
    }
  
    return niceFraction * Math.pow(10, exponent);
  }

  // Function to calculate the y-axis intervals
  function calculateYAxisIntervals(lowest: number, top: number, desiredIntervals: number = 5): number[] {
    const range = getNiceNumber(top - lowest, false);
    const step = getNiceNumber(range / desiredIntervals, true);
    const niceLowest = Math.floor(lowest / step) * step;
    const niceTop = Math.ceil(top / step) * step;
    let numIntervals = Math.round((niceTop - niceLowest) / step);
    let yAxisValues = [];
  
    for (let i = 0; i <= numIntervals; i++) {
      yAxisValues.push(niceLowest + i * step);
    }
  
    return yAxisValues;
  }

  const horizontalLinesList = calculateYAxisIntervals(bottomLine, topLine);
  //console.log(horizontalLinesList);

  // const horizontalLinesList = [150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

  // Contains chart's data points
  // Populate the userData points
  const userData = data.chartprops.map(d => Number(d.value));

  //console.log(userData);

  // myLowRef and myHighRef inputs as percentage of total height of chart (need to write logic to calculate these values based on user data)
  // This is assuming all of the tests of the same name have the same lowRefPrecentage and highRefPercentage
  const myLowRefInput = Number(data.chartprops[0].lowRefPercentage);
  //console.log(myLowRefInput);
  const myHighRefInput = 100 - Number(data.chartprops[0].highRefPercentage);
  //console.log(myHighRefInput);
  //////////////////////////

  // Calculate height of each section in the chart
  height = horizontalLinesList[horizontalLinesList.length - 1] - horizontalLinesList[0];
  //console.log(height);
  let topDarkBlue = ((horizontalLinesList[horizontalLinesList.length - 1] - highMedicalBound) / height * 100);
  //console.log(topDarkBlue);
  let bottomDarkBlue = ((lowMedicalBound - horizontalLinesList[0]) / height * 100);
  //console.log(bottomDarkBlue);
  let myLowRef = (myLowRefInput * lowMedicalBound) / height;
  let myHighRef = (myHighRefInput * highMedicalBound) / height;
  let greySection = 100 - (topDarkBlue + bottomDarkBlue) - (myHighRef + myLowRef);

  // Calculate the SVG line segments based on data values
  const svgWidth = 700;
  const svgHeight = 250; // Define an arbitrary height for the SVG container
  const xOffset = 35; // Offset to move the line to the right, adjust as needed
  const maxValue = Math.max(...horizontalLinesList); // Find the maximum value in the data for scaling
  const minValue = Math.min(...horizontalLinesList); // Find the minimum value in the data for scaling
  const step = (svgWidth - xOffset) / (userData.length - 1); // Calculate the step between each data point; account for xOffset
  // Assuming the baseline y-coordinate is at the bottom of the SVG
  const baselineY = svgHeight + 50; // Adjust as needed, allows for some padding at the bottom
  const marginTopBottom = 20; // Margin at the top and bottom of the SVG to prevent cutoff
  const effectiveHeight = svgHeight - marginTopBottom * 2; // Effective drawing area height


  // Calculate the y-coordinate for a given data value
  const calculateY = (value: number): number => {
    const maxValue = Math.max(...horizontalLinesList); // Assuming 'data' is accessible here
    const minValue = Math.min(...horizontalLinesList);
    // Adjust calculation to account for margins
    return marginTopBottom + effectiveHeight * (1 - (value - minValue) / (maxValue - minValue));
  };


  // Generate points for the SVG polyline, including xOffset in the x-coordinate
  const points = userData.map((value, index) => {
    const x = index * step + xOffset; // Add xOffset to each x-coordinate
    const y = calculateY(value);
    return `${x},${y}`;
  }).join(" ");


  // Generate horizontal lines for each unique y-value
  const horizontalLines = horizontalLinesList.map((value, index) => {
    const y = calculateY(value);
    return <line key={index} x1={xOffset} x2={svgWidth} y1={y} y2={y} stroke="#e0e0e0" strokeWidth="1" />;
  });


  // Generate y-axis labels as SVG text elements
  const yAxisLabels = horizontalLinesList.map((value, index) => {
    const y = calculateY(value);
    return (
      <text key={index} x="0" y={y} alignmentBaseline="middle" textAnchor="end" fill="var(--Color-Grey-400, #b8c4ce)" fontSize="15px">
        {value}
      </text>
    );
  });
  
  

  return (
<Box sx={{ width: "100%", height: "21.9%", justifyContent: "center", backgroundColor: "var(--Surface-card, #fff)", display: "flex", flexDirection: "column", fontSize: "10px", color: "var(--Color-Grey-400, #b8c4ce)", fontWeight: 400, textAlign: "right", lineHeight: "100%", padding: "0px 0 0px 0", "@media (max-width: 991px)": { whiteSpace: "initial", }, borderRadius: "10px" }} >
      <Box sx={{ position: "relative", justifyContent: "center", display: "flex", width: "720px", flexDirection: "column", padding: "0 16px", "@media (max-width: 991px)": { maxWidth: "100%", whiteSpace: "initial", }, }} >
        <Box sx={{ display: "flex", gap: "16px", padding: "0 2px", "@media (max-width: 991px)": { maxWidth: "100%", flexWrap: "wrap", whiteSpace: "initial", }, }} >

          <Box sx={{ width: "100%", height: svgHeight, display: 'flex', flexDirection: 'column-reverse', position: 'relative', borderRadius: "4px 4px 4px 4px", alignItems: 'flex-start'}}>

            {/* Draw the chart refs */}
            <Box sx={{        // bottom dark blue box
              position: "relative", width: svgWidth - xOffset, 
              height: `${bottomDarkBlue}%`, 
              mb: '20px', ml: xOffset + 'px', 
              backgroundColor: "rgba(44, 79, 111, .7)", 
              borderRadius: "0px 0px 0px 0px"
            }} />
            <Box sx={{        // myLowRef box (bottom light blue box)
              position: "relative", width: svgWidth - xOffset, 
              height: `${myLowRef}%`, 
              ml: xOffset + 'px', 
              backgroundColor: "rgba(136, 190, 220, .7)", 
              borderRadius: "0px 0px 0px 0px"
            }} />
            <Box sx={{        // grey box
              position: "relative", width: "91%", 
              height: `${greySection}%`, 
              backgroundColor: "rgba(256, 256, 256, 1)", 
              borderRadius: "0px 0px 0px 0px"
            }} />
            <Box sx={{        // myHighRef box (top light blue box)
              position: "relative", width: svgWidth - xOffset,
              ml: xOffset + 'px',
              height: `${myHighRef}%`, 
              backgroundColor: "rgba(136, 190, 220, .7)", 
              borderRadius: "0px 0px 0px 0px"
            }} />
            <Box sx={{        // top dark blue box
              position: "relative", width: svgWidth - xOffset,
              mt: '20px', ml: xOffset + 'px', 
              height: `${topDarkBlue}%`, 
              backgroundColor: "rgba(44, 79, 111, .7)", 
              borderRadius: "0px 0px 0px 0px"
            }} />


            {/* Overlay an SVG to draw lines between data points */}
            <svg width="100%" height={svgHeight} style={{position: 'absolute', top: 0, left: 0, zIndex: 1}}>
              {horizontalLines}
              <g transform={`translate(${xOffset - 10}, 0)`}>
                {yAxisLabels}
              </g>
              <polyline fill="none" stroke="#94E19C" strokeWidth="2" strokeOpacity="1" points={points} />
            </svg>
            
          </Box>
        </Box>
      </Box>
    </Box>
  );
}