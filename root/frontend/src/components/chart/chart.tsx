import * as React from "react";
import { Box, Typography } from "@mui/material";

export const Chart = () => {
  const data = [10, 8, 6, 4, 2, 0];

  // const barHeights = [80, 64];
  
  return (
<Box sx={{ width: "100%", height: "21.9%", justifyContent: "center", backgroundColor: "var(--Surface-card, #fff)", display: "flex", flexDirection: "column", fontSize: "10px", color: "var(--Color-Grey-400, #b8c4ce)", fontWeight: 400, textAlign: "right", lineHeight: "100%", padding: "40px 0 40px 0", "@media (max-width: 991px)": { whiteSpace: "initial", }, borderRadius: "10px" }} >
      <Box sx={{ position: "relative", justifyContent: "center", display: "flex", width: "720px", flexDirection: "column", padding: "0 16px", "@media (max-width: 991px)": { maxWidth: "100%", whiteSpace: "initial", }, }} >
        <Box sx={{ display: "flex", gap: "16px", padding: "0 2px", "@media (max-width: 991px)": { maxWidth: "100%", flexWrap: "wrap", whiteSpace: "initial", }, }} >
          <Box sx={{ paddingLeft: "20px", justifyContent: "center", alignItems: "start", display: "flex", flexDirection: "column", "@media (max-width: 991px)": { whiteSpace: "initial", }, }} >
            {data.map((value, index) => (
              <Typography key={index} sx={{ fontFamily: "DM Sans, sans-serif", marginTop: index === 0 ? 0 : "8px", }} >
                {value}
              </Typography>
            ))}
          </Box>
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column-reverse', height: "100%", alignItems: 'flex-start'}} >
            <Box  sx={{ position: "relative", width: "100%", height: "10%", backgroundColor: "rgba(44, 79, 111, .4)", borderRadius: "0px 0px 10px 10px", }} />
            <Box sx={{ position: "relative", width: "100%", height: "10%", backgroundColor: "rgba(136, 190, 220, .4)", borderRadius: "4px 4px 0 0", }} />
            <Box sx={{ position: "relative", width: "100%", height: "60%", backgroundColor: "rgba(256, 256, 256, .4)", borderRadius: "4px 4px 4px 4px", }} />
            <Box sx={{ position: "relative", width: "100%", height: "10%", backgroundColor: "rgba(136, 190, 220, .4)", borderRadius: "0 0 4px 4px", }} />
            <Box sx={{ position: "relative", width: "100%", height: "10%", backgroundColor: "rgba(44, 79, 111, .4)", borderRadius: "4px 4px 0 0", }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}