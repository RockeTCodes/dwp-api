const { Rocket } = require("../db/models");
const bcrypt = require("bcrypt");

//register rocket
const rocketRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingRocket = await Rocket.findOne({ email });
    if (existingRocket) {
      return res.status(400).json({ error: "There can only be one rocket." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRocket = new Rocket({
      name,
      email,
      password: hashedPassword,
    });

    await newRocket.save();

    res.status(201).json({ message: "Registration Successful." });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

//login rocket
const rocketLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const rocket = await Rocket.findOne({ email });
    if (!rocket) {
      return res.status(404).json({ error: "You are not rocket." });
    }

    bcrypt.compare(password, rocket.password, (err, result) => {
      if (result) {
        if (!rocket.isActive) {
          return res.status(401).json({
            error: "Rocekt is not active yet.Please contact RockeT.",
          });
        }
        req.session.user = {
          name: rocket.name,
          email: rocket.email,
          isActive: rocket.isActive,
          isAdmin: rocket.isAdmin,
          isRocket: rocket.isRocket,
        };
        res.status(200).json({ message: "Welcome RockeT." });
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

//check session status of rocket
const checkRocketLoginStatus = async (req, res) => {
  if (
    req.session.user &&
    req.session.user.isRocket &&
    req.session.user.isAdmin &&
    req.session.user.isActive
  ) {
    res.status(200).json({ isLoggedIn: true });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
};

module.exports = { rocketRegister, rocketLogin, checkRocketLoginStatus };
