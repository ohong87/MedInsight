import React, { useState } from "react";
import { Box, Stack } from "@mui/material";

import { Welcome } from "../components/welcome";
import { NavigationItem } from "../components/navigation-item";
import { HealthMetricsPanel } from "components/health-metrics";
import { BarChartProps, ReferenceRanges } from "components/reference-ranges/reference-ranges";
import { Chart } from "components/chart/chart";

import home from "../icons/home.png";
import uploadFile from "../icons/upload.png";
import logout from "../icons/logout.png";


export const Dashboard: React.FC = () => {
  const healthMetricsData = Array.from({ length: 30 }, (_, i) => ({
    // name: i % 2 === 0 ? 'WBC(10^3.UL)' : 'RBC (10^6/uL)',
    name: i,
    description: 'Measure the number of immune cells crucial for body defense.'
}));
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);

  const [selectedIndices, setSelectedIndices] = useState([]);
  
  // const handleSelectionChange = (newCount: number) => {
  //   setSelectedItemsCount(newCount);
  // }

  const selectedData = selectedIndices.map(index => healthMetricsData[index]);

  // Map over selectedData to create an array of BarChartProps
  const barChartPropsArray: BarChartProps[] = selectedData.map((data, index) => ({
    id: index.toString(), // Convert the 'index' to a string
    title: data.name.toString(), // Convert the 'name' property to a string
    lowMedicalBound: Math.floor(Math.random() * 20).toString(),
    highMedicalBound: Math.floor(Math.random() * 100 + 50).toString(),
    lowReferencePercentage: Math.floor(Math.random() * 10).toString(),
    highReferencePercentage: Math.floor(Math.random() * 10 + 80).toString(),
    userValue: Math.floor(Math.random() * 100).toString(),
  }));

  React.useEffect(() => {
    console.log('selectedIndices:', selectedIndices);
    console.log('selectedData:',selectedData);
    console.log('barChartPropsArray:',barChartPropsArray);
    setSelectedItemsCount(selectedIndices.length)
  }, [selectedIndices, selectedData, barChartPropsArray]);
  
  const navItems = [
    {
      iconSrc: home,
      altText: "Dashboard",
      text: "Dashboard"
    },
    {
      iconSrc: uploadFile,
      altText: "Upload File",
      text: "Upload File"
    },
    {
      iconSrc: logout,
      altText: "Login/Logout",
      text: "Login/Logout"
    },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E1E7EC",
        width: "100%",
      }}
    >
      <Welcome userName="John Doe" />
      <Stack
      direction="row"
      spacing={2}
      sx={{
        mt: 4,
        justifyContent: "space-between",
        p: 2,
        overflowX: "auto",
      }}
    >
        {navItems.map((item, index) => (
          <NavigationItem key={index} iconSrc={item.iconSrc} altText={item.altText} text={item.text} />
        ))}
      </Stack>
      
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '65%',
        gap: '50px'
      }}>
          <HealthMetricsPanel onSelectionChange={setSelectedIndices} data={healthMetricsData}/>
          {selectedItemsCount > 0 && (
            <>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px',
              }}>
                {selectedIndices.length > 0 && selectedIndices?.map((index) => (
                  <ReferenceRanges key={index} id={index} props={barChartPropsArray[index as number]} />
                ))}
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px',
              }}>
                {selectedIndices?.map((index) => (
                  <Chart key={index}/>
                ))}
              </Box>
            </>
          )}
      </Box>
    </Box>
  );
};

