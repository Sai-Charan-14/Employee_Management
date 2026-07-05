const authorize = (...roles) => {

  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.roleId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();

  };

};

module.exports = authorize;