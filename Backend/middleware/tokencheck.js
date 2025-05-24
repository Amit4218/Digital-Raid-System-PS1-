import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies.token;
    const tokenFromHeader = req.headers.authorization?.split(" ")[1];
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: You must be logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export default authMiddleware;
