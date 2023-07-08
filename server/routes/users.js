import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";	// <== we created this

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);	// runs 'verifyToken' before executing 'getUser'
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);	// use 'patch' when updating

export default router;