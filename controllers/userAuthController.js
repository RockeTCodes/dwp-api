const { User } = require("../db/models");
const bcrypt = require("bcrypt");

//register user
const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration Successful." });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

//login user
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User does not exist." });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        if (!user.isActive) {
          return res
            .status("401")
            .json(
              "Your account is not active.Please contact an admin to activate your account."
            );
        }
        req.session.user = {
          name: user.name,
          email: user.email,
          isActive: user.isActive,
          isPremium: user.isPremium,
        };
        res
          .status(200)
          .json({ message: `Login Successful.Welcome ${user.name}` });
      } else {
        res
          .status(401)
          .json(
            "Invalid password.Please re-enter the correct password and try again."
          );
      }
    });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

//check session status of user
const checkUserLoginStatus = async (req, res) => {
  if (req.session.user && req.session.user.isActive) {
    res.status(200).json({ isLoggedIn: true });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
};

module.exports = { userRegister, userLogin, checkUserLoginStatus };
