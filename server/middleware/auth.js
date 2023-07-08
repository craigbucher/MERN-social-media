import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");	// grabs 'Authorization' header, which includes token

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();	// trimLeft = remove whitespace from the beginning of a string
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);	// confirm token = JWT_SECRET from .env
    req.user = verified;
    next();	// proceed to the next step
  } catch (err) {
    res.status(500).json({ error: err.message });	// same default error message
  }
};