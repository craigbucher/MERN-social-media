import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");	// use mobile version if screen width < 1000px
  const { _id, picturePath } = useSelector((state) => state.user)	
	
	return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
				// regular screens = 3 widgets in a row
				// mobile screens = widgets in a column:
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}	// need small margin when stacked in column
        >
					{/* MyPostWidget = create new post (middle column, top row) */}
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
				{/* *** Friends list only shows on non-mobile screens: *** */}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;