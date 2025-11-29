import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

export default function ScrollIndicator() {
    const handleScroll = () => {
        const nextSection = document.getElementById("features");
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <IconButton
            onClick={handleScroll}
            sx={(theme) => ({
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                color: theme.palette.common.white,
                // backgroundColor: "rgba(255,255,255,0.1)",
                // backdropFilter: "blur(6px)",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                },
                animation: "bounce 2s infinite",
                "@keyframes bounce": {
                    "0%, 100%": { transform: "translate(-50%, 0)" },
                    "50%": { transform: "translate(-50%, -6px)" },
                },
            })}
        >
            <KeyboardArrowDownRounded fontSize="large" />
        </IconButton>
    );
}
