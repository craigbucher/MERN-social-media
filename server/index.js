// from: https://www.youtube.com/watch?v=K8YELRmUb5o
// https://github.com/ed-roh/mern-social-media/tree/master

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from  "./models/Post.js";
import { users, posts } from "./data/index.js";


/* CONFIGURATION */
// (because added "type": "module" in package.json):
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();    // invoke dotenv module so we can use it
const app = express();  // invoke express module so we can use it
app.use(express.json());    // configure express to use other modules...
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// set 'assets' directory (where we'll store images)
// ** in production, this would likely be cloud storage **
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
// this configuration comes from the package instructions
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });	// any time we upload a file, we use this variable

/* ROUTES WITH FILES */
// have to be in this file becuase use 'upload' function above
app.post("/auth/register", upload.single("picture"), register);  // use 'upload' middleware to pass the picture to 'register' function
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
// all other routes specified in separate 'routes' files:
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;  // 6001 is backup port number if 'PORT' isn't available
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`)); // print listening PORT

    /* ADD DATA ONE TIME - DONE! */ 
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

