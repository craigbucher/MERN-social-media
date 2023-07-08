import { Box } from "@mui/material";
import { styled } from "@mui/system";

// create 'FlexBetween' style:
// (can then be used across multiple components)
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;