import React from "react";
import { Box, Stack, Grid } from "@mui/material";

import { Welcome } from "../components/welcome";
import { NavigationItem } from "../components/navigation-item";
import { HealthMetricsPanel } from "../components/health-metrics";

import home from "../icons/home.png";
import uploadFile from "../icons/upload.png";
import logout from "../icons/logout.png";
import { ReferenceRanges } from "components/reference-ranges/reference-ranges";

export const Dashboard: React.FC = () => {
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

        <HealthMetricsPanel/>
        <ReferenceRanges/>
    </Box>
    
  );
};

