const {
  Video,
  VideoRequest,
  Grievance,
  DmcaRemoval,
  User,
} = require("../db/models");

const pagination = (req, videos) => {
  //pagination params
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const totalPages = Math.ceil(videos.length / pageSize);
  const videos_to_send = [];

  for (let i = startIndex; i < endIndex && i < videos.length; i++) {
    videos_to_send.push({
      video_id: videos[i]._id,
      title: videos[i].title,
      thumbnail: videos[i].thumbnail,
      duration: videos[i].duration,
      views: videos[i].views,
      likes: videos[i].likes,
    });
  }
  return {
    videos: videos_to_send,
    currentPage: page,
    pageSize: pageSize,
    totalPages: totalPages,
  };
};

// const shuffleArray = (array) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

const getAllVideosUser = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });

    res.status(200).json({ videos: shuffleArray(pagination(req, videos)) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getVideoUser = async (req, res) => {
  try {
    const { video_id } = req.body;
    const video = await Video.findOne({ _id: video_id });
    video.views++;
    video.save();
    res.status(200).json({ video: video });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getVideosByActor = async (req, res) => {
  try {
    const { actor } = req.body;

    const videos = await Video.find({
      actors: { $regex: new RegExp(`${actor}`, "i") },
    }).sort({ createdAt: -1 });

    res.status(200).json({ videos: pagination(req, videos) });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.body;

    const videos = await Video.find({
      category: { $regex: new RegExp(`${category}`, "i") },
    }).sort({ createdAt: -1 });

    res.status(200).json({ videos: pagination(req, videos) });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const addReview = async (req, res) => {
  try {
    const { video_id, review } = req.body;
    const video = Video.findOne({ _id: video_id });
    video.reviews.push(review);
    video.save();
    res.status(200).json({ message: "Review added successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const addLike = async (req, res) => {
  try {
    const { video_id } = req.body;
    const video = Video.findOne({ _id: video_id });
    video.likes++;
    video.save();
    res.status(200).json({ message: "Like added successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const videoRequest = async (req, res) => {
  try {
    const { description, email } = req.body;
    await VideoRequest.create({ description, email });
    res.status(201).json({ message: "Video requested successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const grievanceRequest = async (req, res) => {
  try {
    const { problem, email } = req.body;
    await Grievance.create({ problem, email });
    res.status(201).json({
      message:
        "Grievance requested successfully.Please give us 24 Hours to take action.",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const dmcaRemovalRequest = async (req, res) => {
  try {
    const { videoUrl, request, requesterEmail } = req.body;
    await DmcaRemoval.create({ videoUrl, request, requesterEmail });
    res.status(201).json({
      message:
        "DmcaRemoval requested. Please allow us atleast 24 Hours to take action. ",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const searchVideos = async (req, res) => {
  try {
    const { title, actor, category } = req.query;
    const query = {};

    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }

    if (actor) {
      query.actors = { $regex: new RegExp(actor, "i") };
    }
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    const videos = await Video.find(query).sort({ createdAt: -1 });

    res.status(200).json({ videos: videos });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const addVideoToFavourites = async (req, res) => {
  try {
    const { video_id } = req.body;

    const user = User.findOne({ email: req.session.user.email });
    user.favourites.push(video_id);
    user.save();
    res.status(200).json({ message: "Added video to favourites." });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAllFavouriteVideos = async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.session.user.email });
    const videoIds = admin.favourites;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const favouriteVideos = await Video.find({ _id: { $in: videoIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(videoIds.length / pageSize);

    res.status(200).json({
      videos: favouriteVideos.map((video) => ({
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
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getRecommendedVideos = async (req, res) => {
  try {
    const { category } = req.body;
    const videos = Video.find({
      category: { $regex: new RegExp(`${category}`, "i") },
    }).sort({ createdAt: -1 });
    res.status(200).json({ videos: videos });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const mostLikedVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ likes: -1 })
      .sort({ createdAt: -1 });
    res.status(200).json({ videos: videos });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const mostViewedVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ views: -1 })
      .sort({ createdAt: -1 });
    res.status(200).json({ videos: videos });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  getAllVideosUser,
  getVideoUser,
  getVideosByActor,
  getVideosByCategory,
  addReview,
  addLike,
  videoRequest,
  grievanceRequest,
  dmcaRemovalRequest,
  searchVideos,
  addVideoToFavourites,
  getAllFavouriteVideos,
  getRecommendedVideos,
  mostLikedVideos,
  mostViewedVideos,
};
