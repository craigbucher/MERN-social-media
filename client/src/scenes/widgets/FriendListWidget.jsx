import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";	// list of friends from global state

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);	// from redux global state
  const friends = useSelector((state) => state.user.friends);

	// retrieve list of friends for current user from backend
  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();	// response from backend
    dispatch(setFriends({ friends: data }));	// update global state
  };

	// get list of friends when page first loads
  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}	// 'sx' because is not a 'Box' component
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
				{/* cycle through list of friends: */}
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}	// file path in underlying filesystem
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;