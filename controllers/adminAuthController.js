const { Admin } = require("../db/models");
const bcrypt = require("bcrypt");

//register admin
const adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "An admin with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Registration Successful." });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

//login admin
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "User does not exist." });
    }

    bcrypt.compare(password, admin.password, (err, result) => {
      if (result) {
        if (!admin.isActive) {
          return res.status(401).json({
            error: "Your account is not active yet.Please contact RockeT.",
          });
        }
        req.session.user = {
          name: admin.name,
          email: admin.email,
          isActive: admin.isActive,
          isAdmin: admin.isAdmin,
        };
        res.status(200).json({ message: `Welcome ${admin.name}.` });
      } else {
        res
          .status(401)
          .json(
            "Invalid password.Please re-enter the correct password and try again."
          );
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

//check session status of admin
const checkAdminLoginStatus = async (req, res) => {
  if (
    req.session.user &&
    req.session.user.isAdmin &&
    req.session.user.isActive
  ) {
    res.status(200).json({ isLoggedIn: true });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
};

module.exports = { adminRegister, adminLogin, checkAdminLoginStatus };
