import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
// must be 'async' because call to database is similar to api call
// req = request from front-end; res = response from database
export const register = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation,
      } = req.body;	// destructured from the request body
  
      const salt = await bcrypt.genSalt();	// get random number from bcrypt
      const passwordHash = await bcrypt.hash(password, salt);	// bcrypt generates hash based on password, salt
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),	// dummy value to emulate functionality
        impressions: Math.floor(Math.random() * 10000),	// dummy value to emulate functionality
      });
      const savedUser = await newUser.save();	// saves new user to database
      res.status(201).json(savedUser);	// returns status and JSON 'User' object
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  /* LOGGING IN */
  // in real world, would likely use a third-party/trusted authentication scheme
  // not something home-coded like this
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // destructure 'email', 'password' from the request
    const user = await User.findOne({ email: email });  // use mongoose to find user in database with specified email
    // returns full user object
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);  // use bcrypt to compare password (hash) with stored password (hash)
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // creates authentication token
    delete user.password; // so that it doesn't get sent back to front end in the clear
    res.status(200).json({ token, user });  // success
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};