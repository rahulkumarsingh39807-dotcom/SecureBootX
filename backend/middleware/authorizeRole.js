
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    // Ensure authentication ran first
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    // Reject invalid or empty role configuration
    if (
      allowedRoles.length === 0 ||
      !allowedRoles.every(
        (role) => typeof role === "string" && role.trim().length > 0
      )
    ) {
      console.error("authorizeRole requires valid allowed roles.");

      return res.status(500).json({
        message: "Authorization is incorrectly configured.",
      });
    }

    // Verify the user's role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    return next();
  };
}

module.exports = authorizeRole;