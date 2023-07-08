import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;	// grab 'id' from req.params
    const user = await User.findById(id);	// use 'id' to get user info from database
    res.status(200).json(user);	// send back user info as json object
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(	// 'Promise.all' because making multiple api calls
      user.friends.map((id) => User.findById(id))
    );
		// format in proper way for front end:
    const formattedFriends = friends.map(
			// only want these items from each friend's user record:
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;	// pull 'id' and 'friendId' from request params
    const user = await User.findById(id);	// pull user info from database
    const friend = await User.findById(friendId);	// pull friend info from database
		// if user's friends already includes 'friendId', *remove* it
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);	// 'filter' = return array with everything *but* this friendId
      friend.friends = friend.friends.filter((id) => id !== id);	// do the same with the friend's list
			// otherwise, *add* it
    } else {
      user.friends.push(friendId);	// to user's friends list
      friend.friends.push(id);	// and to friend's friend list
    }
    await user.save();	// update the database
    await friend.save();	// ""		""

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
		// format in proper way for front end:
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};