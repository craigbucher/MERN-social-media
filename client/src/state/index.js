import { createSlice } from "@reduxjs/toolkit";

// state accessible by *entire* application
const initialState = {
	mode: "light",	// switch between dark/light mode
	user: null,
	token: null,
	posts: [],
};

//authorization workflow
export const authSlice = createSlice({
	name: "auth",
	initialState,	// initialState, from above
	// reducers = 'functions' that modify the global state
	reducers: {
		setMode: (state) => {
		// This syntax is used to be redux toolkit to mask underlying process
		// redux doesn't allow you to change the state directly like this
		// (previous)  (new state) 
			state.mode = state.mode === "light" ? "dark" : "light";
		},
		setLogin: (state, action) => {		// 'action' = arguments/parameters for function (in 'payload')
			state.user = action.payload.user;	// set user to submitted user
			state.token = action.payload.token;	// set token to submitted token
		},
		setLogout: (state) => {
			// reset both when user logs-out
			state.user = null;
			state.token = null;
		},
		setFriends: (state, action) => {
			if (state.user) {		// if user already exists:
				state.user.friends = action.payload.friends;
			} else {
				console.error("user friends non-existent :(");
			}
		},
		setPosts: (state, action) => {
			state.posts = action.payload.posts;	// why no error check?
		},
		setPost: (state, action) => {
			const updatedPosts = state.posts.map((post) => {
				// if submitted post is the same as current post (in state), return it
				if (post._id === action.payload.post._id) return action.payload.post;
				return post;
			});
			state.posts = updatedPosts;
		},
	},
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;