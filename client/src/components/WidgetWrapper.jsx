import { Box } from "@mui/material";
import { styled } from "@mui/system";

// create 'WidgetWrapper' style:
// (can then be used across multiple components)
const WidgetWrapper = styled(Box)(({ theme }) => ({	// pass-in color theme, as well
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",	// top, right, bottom, left (goes clockwise)
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
}));

export default WidgetWrapper;