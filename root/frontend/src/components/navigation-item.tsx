import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

export const NavigationItem: React.FC<{ iconSrc: string; altText: string; text: string; onClick: () => void }> = ({ iconSrc, altText, text, onClick }) => {
    return (
        <Box
            onClick={onClick} // Attach the onClick handler here
            sx={{
                borderRadius: 2,
                backgroundColor: "#DCDCDC",
                display: "flex",
                gap: 1,
                p: 2,
                alignItems: "center",
                "&:hover": {
                    cursor: "pointer",
                },
            }}
        >
            <Avatar src={iconSrc} alt={altText} sx={{ width: 24, height: 24 }} />
            <Typography sx={{ flexGrow: 1, color: "#2c4f6f" }}>{text}</Typography>
        </Box>
    );
};
