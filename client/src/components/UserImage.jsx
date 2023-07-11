import { Box } from "@mui/material";

// formatting for user image widget - used any time user image is displayed
const UserImage = ({ image, size = "60px" }) => {
  return (
		// 'default' width and height:
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}	// borderRadius: "50%" = a circle
				// 'cover' = content is sized to maintain its aspect ratio while 
				// filling the element's entire content box
				// If the object's aspect ratio does not match the aspect ratio of 
				// its box, then the object will be clipped to fit
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}	// 'convenience component' = individual user's profile image
      />
    </Box>
  );
};

export default UserImage;