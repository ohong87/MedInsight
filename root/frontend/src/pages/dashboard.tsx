import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";

import { Welcome } from "../components/welcome";
import { NavigationItem } from "../components/navigation-item";
import { HealthMetricsPanel } from "components/health-metrics";
import { ReferenceRanges } from "components/reference-ranges/reference-ranges";

import home from "../icons/home.png";
import { useLogout } from "@refinedev/core";
import uploadFile from "../icons/upload.png";
import logout from "../icons/logout.png";
import { jwtDecode } from 'jwt-decode';

export const Dashboard: React.FC = () => {
  const { mutate: logOut } = useLogout();
  const [healthMetricsData, setHealthMetricsData] = useState<any[][]>([]);

  const [selectedIndices, setSelectedIndices] = useState([]);
  const selectedData = selectedIndices.map(index => healthMetricsData[index]);
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = () => {
      const userString = localStorage.getItem("user");
      console.log(userString);
      if (userString) {
        const user = JSON.parse(userString);
        console.log(user);
        console.log(user.given_name);
        setUserName(user.given_name);
        const token: string | null = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const fetchedUserId: string | undefined = decoded.sub;
            if(fetchedUserId !== undefined){
              setUserId(fetchedUserId);
              fetchUserTests(fetchedUserId);
              console.log("User Id: ", fetchedUserId);
            }
            else{
              console.error('User Id is undefined.');
            }
            
        } else{
          console.error("No Google auth token found");
          return;
        }
        
      }
    };
    //fetches usertests in json format
    const fetchUserTests = async (userId: string) => {
      try {
        const response = await fetch('http://localhost:8080/userTest/get-tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId })
        });
        const data = await response.json();
        setHealthMetricsData(data.tests);
        console.log(healthMetricsData)
        console.log(data.tests);
      } catch(error){
        console.error('Error fetching user tests:', error);
      }
    }
    fetchUserData();
    // console.log(selectedIndices);
    // console.log(selectedData);
  }, [selectedIndices]);
  
  const handleFileUpload = async (file: File) => {
    if (userId === null) {
      console.error('userid is null')
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    console.log('formData: ', formData);
    try{
      const response = await fetch('http://localhost:8080/userTest/scraping/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    catch (error) {
      console.error('Error during file upload:', error);
    }
  };
  
  const onUploadClick = () => {
    document.getElementById('hiddenFileInput')?.click();
  };

  const navItems = [
  {
    iconSrc: uploadFile,
    altText: "Upload File",
    text: "Upload File", 
    onClick: onUploadClick
  },
  {
    iconSrc: logout,
    altText: "Logout",
    text: "Logout", 
    onClick: () => logOut()
  },
  ];

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#E1E7EC", width: "100vw"}} >
      <Welcome userName={userName} />
      <Stack direction="row" spacing={2} sx={{ margin: "0.8% 0 0.8% 0", justifyContent: "space-between", padding:"0 0 0 0", overflowX: "auto", }} >
        {navItems.map((item, index) => ( <NavigationItem key={index} iconSrc={item.iconSrc} altText={item.altText} text={item.text} onClick={item.onClick} /> ))}
      </Stack>

        <input
        type="file"
        id="hiddenFileInput"
        style={{ display: 'none' }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files ? event.target.files[0] : null;
          if (file) {
            handleFileUpload(file);
          }
        }}
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '75%', width: '97%', gap: '1%', justifyContent: "center" }}>
          <HealthMetricsPanel onSelectionChange={setSelectedIndices as Dispatch<SetStateAction<number[]>>} data={healthMetricsData.map(data => ({ ...data[data.length - 1], name: data[data.length - 1].name.toString() }))} />
        
          {selectedIndices.length > 0 && (
            <>
              <Box sx={{ width: "75%", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'}}>
                {selectedIndices.length > 0 && 
                  selectedData.map((data, index) => {
                    // console.log(`selectedData ${index}`, data, '\n');
                    return data ? <ReferenceRanges key={index} props={data}/> : null; 
                })}
              </Box>
              {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', }}>
                {selectedData.map((data, index) => {
                  //console.log(`selectedData ${index}`, data, '\n');
                  return <Chart key={index} chartprops={chartData} /> // Pass each inner array as props to Chart
                })}
              </Box> */}
            </>
          )}
        </Box>
    </Box>
  );
};

