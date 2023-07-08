import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;	// stuff sent by front end
    const user = await User.findById(userId);	// retrieve user info
    const newPost = new Post({	// create new post
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();	// save new post

    const post = await Post.find();	// grab all posts
    res.status(201).json(post);	// return them to the front end
  } catch (err) {
    res.status(409).json({ message: err.message });	// why status 409?
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();	// grabs *all* posts
    res.status(200).json(post);	// return them to the front end
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });	// only gets *user's* posts
    res.status(200).json(post);	// grabs *all* posts
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;	// destructure 'id' from params ('post' id?)
    const { userId } = req.body;	// destructure 'userId' from body, since this is how it's sent from front-end
    const post = await Post.findById(id);	// gets all posts from 'id'
    const isLiked = post.likes.get(userId);	// checks if userId exists in likes; means that user liked this post

		// if userId in isLiked, remove it
    if (isLiked) {
      post.likes.delete(userId);
			// if not, add it
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },	// just-modified list of likes
      { new: true }
    );

    res.status(200).json(updatedPost);	// send back to front end
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};