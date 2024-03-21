import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";

import { Welcome } from "../components/welcome";
import { NavigationItem } from "../components/navigation-item";
import { HealthMetricsPanel } from "components/health-metrics";
import { ReferenceRanges } from "components/reference-ranges/reference-ranges";
import { Chart } from "components/chart/chart";

import home from "../icons/home.png";
import uploadFile from "../icons/upload.png";
import logout from "../icons/logout.png";


export const Dashboard: React.FC = () => {
  const healthMetricsData = [
  {
    title: "WBC (10^3.UL)",
    lowMedicalBound: "4.5",
    highMedicalBound: "12.5",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "7",
    description: "Measure the number of immune cells crucial for body defense."
  },
  {
    title: "RBC (10^6/uL)",
    lowMedicalBound: "3.8",
    highMedicalBound: "5.2",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "5.13",
    description: "Indicate the number of cells essential for oxygen transport."
  },
  {
    title: "PLATELETS (10^3/uL)",
    lowMedicalBound: "130",
    highMedicalBound: "440",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "297",
    description: "Indicate the number of cells crucial for blood clotting."
  },
  {
    title: "MCV (fL)",
    lowMedicalBound: "78",
    highMedicalBound: "98",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "89.7",
    description: "Size of red blood cells."
  },
  {
    title: "MCHC (g/dL)",
    lowMedicalBound: "32",
    highMedicalBound: "36",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "33.9",
    description: "Amount of hemoglobin relative to the size of the red blood cell."
  },
  {
    title: "MCH (pg)",
    lowMedicalBound: "26",
    highMedicalBound: "34",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "30.4",
    description: "Average amount of hemoglobin in a single red blood cell."
  },
  {
    title: "HGB (g/dL)",
    lowMedicalBound: "11.9",
    highMedicalBound: "15.2",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "15.6",
    description: "Protein in red blood cells that carries oxygen."
  },
  {
    title: "HCT (%)",
    lowMedicalBound: "35",
    highMedicalBound: "45",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "46",
    description: "Percentage of red blood cells in the blood."
  },
  {
    title: "RDW (%)",
    lowMedicalBound: "12.1",
    highMedicalBound: "17.9",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "13.5",
    description: "Variation in the size of red blood cells."
  },
  {
    title: "NEUTROPHILS (%)",
    lowMedicalBound: "37",
    highMedicalBound: "80",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "56.8",
    description: "Percentage of a specific type of white blood cells known for fighting infections."
  },
  {
    title: "LYMPHOCYTES (%)",
    lowMedicalBound: "20",
    highMedicalBound: "50",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "31.2",
    description: "Percentage of a type of white blood cells crucial for immune response."
  },
  {
    title: "MONOCYTES (%)",
    lowMedicalBound: "0",
    highMedicalBound: "11",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "6.5",
    description: "Percentage of a type of white blood cells involved in immune system responses."
  },
  {
    title: "EOSINOPHILS (%)",
    lowMedicalBound: "0",
    highMedicalBound: "6",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "4.2",
    description: "Percentage of a type of white blood cells involved in allergic responses."
  },
  {
    title: "BASOPHILS (%)",
    lowMedicalBound: "0",
    highMedicalBound: "2",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "1",
    description: "Percentage of a type of white blood cells involved in allergic and inflammatory responses."
  },
  {
    title: "NUCLEATED RBC (WBC)",
    lowMedicalBound: "0",
    highMedicalBound: "0.2",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "0",
    description: "Number of red blood cells that contain a nucleus per white blood cell."
  },
  {
    title: "ABSOLUTE NEUTR (Cells/uL)",
    lowMedicalBound: "1400",
    highMedicalBound: "6500",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "3950",
    description: "Total count of a specific type of white blood cells in the blood."
  },
  {
    title: "AMSOLUTE LYMPHS (Cells/uL)",
    lowMedicalBound: "850",
    highMedicalBound: "3900",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "2170",
    description: "Total count of a specific type of white blood cells in the blood."
  },
  {
    title: "MONOCYTES (Cells/uL)",
    lowMedicalBound: "200",
    highMedicalBound: "950",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "450",
    description: "Total count of a specific type of white blood cells in the blood."
  },
  {
    title: "EOSINOPHILS TOTAL (Cells/uL)",
    lowMedicalBound: "0",
    highMedicalBound: "500",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "290",
    description: "Total count of a specific type of white blood cells in the blood."
  },
  {
    title: "BASOPHILS TOTAL (Cells/uL)",
    lowMedicalBound: "0",
    highMedicalBound: "200",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "70",
    description: "Total count of a specific type of white blood cells in the blood."
  },
  {
    title: "ALBUMIN (g/dL)",
    lowMedicalBound: "3.5",
    highMedicalBound: "5.3",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "4.6",
    description: "Measures the level of a major protein made by the liver, important for fluid balance and nutrition assessment."
  },
  {
    title: "TOTAL BILIRUBIN (mg/dL)",
    lowMedicalBound: "0.3",
    highMedicalBound: "1.3",
    lowReferencePercentage: "5",
    highReferencePercentage: "90",
    userValue: "0.5",
    description: "Indicates the total amount of a waste product from red blood cell breakdown, important for liver function and diagnosing jaundice."
  },
  // Note: Due to the text limit, assume the continuation follows the same structure for remaining items.
];

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

  const [selectedIndices, setSelectedIndices] = useState([]);
  const selectedData = selectedIndices.map(index => healthMetricsData[index]);

  useEffect(() => {
    // console.log('selectedData:',selectedData);
  }, [selectedIndices, selectedData]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#E1E7EC", width: "100vw"}} >
      <Welcome userName="John Doe" />
      <Stack direction="row" spacing={2} sx={{ margin: "0.8% 0 0.8% 0", justifyContent: "space-between", padding:"0 0 0 0", overflowX: "auto", }} >
        {navItems.map((item, index) => ( <NavigationItem key={index} iconSrc={item.iconSrc} altText={item.altText} text={item.text} /> ))}
      </Stack>
      
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '75%', width: '97%', gap: '1%', justifyContent: "center" }}>
          <HealthMetricsPanel onSelectionChange={setSelectedIndices as Dispatch<SetStateAction<number[]>>} data={healthMetricsData.map(data => ({ ...data, name: data.title.toString() }))} />
        
          {selectedIndices.length > 0 && (
            <>
              <Box sx={{ width: "35%", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'}}>
                {selectedIndices.length > 0 && 
                  selectedData.map((data, index) => {
                    // console.log(`selectedData ${index}`, data, '\n');
                    return data ? <ReferenceRanges key={index} props={data} /> : null; 
                })}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', }}>
                {selectedData.map((_, index) => ( <Chart key={index} /> ))}
              </Box>
            </>
          )}
        </Box>
    </Box>
  );
};

