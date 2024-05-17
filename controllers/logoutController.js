const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Failed to logout." });
    } else {
      res.status(200).json({ message: "Logout Successful." });
    }
  });
};

module.exports = logout;
