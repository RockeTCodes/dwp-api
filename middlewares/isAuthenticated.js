const isAuthenticatedUser = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.isActive) {
      next();
    } else {
      res.status(403).json({
        message:
          "You account is banned / disabled.If you believe this is an error contact an admin.",
      });
    }
  } else {
    res.status(403).json({ message: "You need to login first." });
  }
};

const isAuthenticatedAdmin = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.isActive) {
      if (req.session.user.isAdmin) {
        next();
      } else {
        res.status(403).json({
          message:
            "Access Prohibited . You need to be an admin to access this page.",
        });
      }
    } else {
      res
        .status(403)
        .json({ message: "You account is disabled.Contact RockeT." });
    }
  } else {
    res.status(403).json({ message: "You need to login first." });
  }
};

const isAuthenticatedRocket = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.isActive) {
      if (req.session.user.isRocket && req.session.user.isAdmin) {
        next();
      } else {
        res.status(403).json({
          message: "Access Prohibited .Only RockeT can access this page.",
        });
      }
    } else {
      res.status(403).json({ message: "This RockeT account is disabled." });
    }
  } else {
    res.status(403).json({ message: "You need to login first." });
  }
};

module.exports = {
  isAuthenticatedUser,
  isAuthenticatedAdmin,
  isAuthenticatedRocket,
};
