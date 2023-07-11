import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";	// from redux global state
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

// A friend is a box/row of 3 items (photo, name/occupation, add/remove button)
// used at the top of each post and in friend list

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();	// initialize redux
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);	// retrieve from global state
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);	// 'friends' array from 'user' global state

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

	// check to see if user is already a friend:
  const isFriend = friends.find((friend) => friend._id === friendId);

	// why 'PATCH' instead of 'GET'??
  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",	// 'PATCH' = update
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();	// response from server
    dispatch(setFriends({ friends: data }));	// set 'friends' in global state
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
				{/* userPicturePath = filesystem path to image */}
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);	// refresh the page (workaround for routing bug)
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
				{/* if *is* a friend, show 'remove friend' icon: */}
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
				// if isn't already a friend, show 'add friend' icon:
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;