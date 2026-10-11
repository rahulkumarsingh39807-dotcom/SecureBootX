
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "Authentication token is missing.",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");

    return res.status(500).json({
      message: "Authentication is temporarily unavailable.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      !decoded ||
      typeof decoded !== "object" ||
      !decoded.id ||
      !decoded.role
    ) {
      return res.status(403).json({
        message: "Invalid authentication token.",
      });
    }

    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
}

module.exports = authenticateToken;