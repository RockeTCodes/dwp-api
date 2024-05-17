const {
  Video,
  Admin,
  User,
  VideoRequest,
  DmcaRemoval,
} = require("../db/models");
const bcrypt = require("bcrypt");

//add a new video
const addVideo = async (req, res) => {
  try {
    const { title, description, url, category, duration, actors } = req.body;
    const likes = 0;
    const views = 0;
    const reviews = [];
    const files = req.files;

    const thumbnail = files.find((file) => file.fieldname === "thumbnail").path;

    const new_video = await Video.create({
      title,
      description,
      thumbnail,
      url,
      category,
      duration,
      actors,
      likes,
      views,
      reviews,
    });

    const admin = await Admin.findOne({ email: req.session.user.email });
    admin.uploaded_videos.push(new_video._id);
    admin.save();
    res.status(201).json({ message: "Video added successfully." });
  } catch (e) {
    res.statu(500).json({ message: "Internal Server error." });
  }
};

//delete an existing video
const editVideo = async (req, res) => {
  try {
    const { video_id, title, description, url, category, duration, actors } =
      req.body;
    const files = req.files;
    const thumbnail = files.find((file) => file.fieldname === "thumbnail").path;

    const video = await Video.findOne({ _id: video_id });

    if (title) {
      video.title = title;
    }
    if (description) {
      video.description = description;
    }
    if (url) {
      video.url = url;
    }
    if (category) {
      video.category = category;
    }
    if (duration) {
      video.duration = duration;
    }
    if (actors) {
      video.actors = actors;
    }
    if (thumbnail) {
      video.thumbnail = thumbnail;
    }

    video.save();
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//get-all-videos-for-this-admin
const getAllVideosForthisAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.session.user.email });
    const videoIds = admin.uploaded_videos;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const uploadedVideos = await Video.find({ _id: { $in: videoIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(videoIds.length / pageSize);

    res.status(200).json({
      videos: uploadedVideos.map((video) => ({
        video_id: video._id,
        title: video.title,
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: video.views,
        likes: video.likes,
      })),
      currentPage: page,
      pageSize: pageSize,
      totalPages: totalPages,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getVideoForAdmin = async (req, res) => {
  try {
    const { video_id } = req.body;
    const video = await Video.findOne({ _id: video_id });
    res.status(200).json({ video: video });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { video_id } = req.body;
    await Video.deleteOne({ _id: video_id });
    const admin = await Admin.findOne({ email: req.session.user.email });
    const uploaded_videos = admin.uploaded_videos.filter(
      (item) => item != video_id
    );
    admin.uploaded_videos = uploaded_videos;
    admin.save();
    res.status(200).json({ message: "Video deleted successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = User.find().sort({ createdAt: -1 });
    res.status(200).json({ users: users });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = User.findOne({ _id: user_id });
    res.status(200).json({ user: user });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const editUser = async (req, res) => {
  try {
    const { user_id, name, email, password, isActive, isPremium, favourites } =
      req.body;
    const user = User.findOne({ _id: user_id });

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (isActive) {
      user.isActive = isActive;
    }
    if (isPremium) {
      user.isPremium = isPremium;
    }
    if (favourites) {
      user.favourites = favourites;
    }
    user.save();
    res.staus(200).json({ message: "User details edited successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    await User.deleteOne({ _id: user_id });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAllVideoRequest = async (req, res) => {
  try {
    const videoRequests = await VideoRequest.find();
    res.status(200).json({ videoRequests: videoRequests });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteVideoRequest = async (req, res) => {
  try {
    const { video_request_id } = req.body;
    await VideoRequest.deleteOne({ _id: video_request_id });
    res.status(200).json({ message: "Video request deleted successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAllDmcaRequest = async (req, res) => {
  try {
    const videoRequests = await DmcaRemoval.find();
    res.status(200).json({ videoRequests: videoRequests });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteDmcaRequest = async (req, res) => {
  try {
    const { video_request_id } = req.body;
    await DmcaRemoval.deleteOne({ _id: video_request_id });
    res.status(200).json({ message: "Video request deleted successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  addVideo,
  editVideo,
  getAllVideosForthisAdmin,
  getVideoForAdmin,
  deleteVideo,
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  getAllVideoRequest,
  deleteVideoRequest,
  getAllDmcaRequest,
  deleteDmcaRequest,
};
