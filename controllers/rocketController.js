const { Admin } = require("../db/models");
const bcrypt = require("bcrypt");

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ admins: admins });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAdmin = async (req, res) => {
  try {
    const { admin_id } = req.body;
    const admin = await Admin.findOne({ _id: admin_id });
    res.status(200).json({ admin: admin });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const editAdmin = async (req, res) => {
  try {
    const {
      admin_id,
      name,
      email,
      password,
      isActive,
      isAdmin,
      uploaded_videos,
    } = req.body;
    const admin = await Admin.findOne({ _id: admin_id });
    if (name) {
      admin.name = name;
    }
    if (name) {
      admin.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }
    if (isActive) {
      admin.isActive = isActive;
    }
    if (isAdmin) {
      admin.isAdmin = isAdmin;
    }
    if (uploaded_videos) {
      admin.uploaded_videos = uploaded_videos;
    }
    admin.save();
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = { getAllAdmins, getAdmin, editAdmin };
