const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    url: { type: String, required: true },
    category: [{ type: String, required: true }],
    duration: { type: String, required: true },
    actors: [{ type: String, required: true }],
    likes: { type: Number },
    views: { type: Number },
    reviews: [{ type: String }],
    isPremiumContent: { type: Boolean, default: false },
    videoType: {
      type: String,
      enum: ["Video", "Webseries", "Movie"],
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  },
  {
    timestamps: true,
  }
);

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: true },
    uploaded_videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  },
  {
    timestamps: true,
  }
);

const rocketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: true },
    isRocket: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const videoRequestSchema = new mongoose.Schema(
  {
    description: { type: String },
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

const grievanceSchema = new mongoose.Schema(
  {
    problem: { type: String },
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

const DmcaRemovalSchema = new mongoose.Schema(
  {
    videoUrl: { type: String },
    request: { type: String },
    requesterEmail: { type: String },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Rocket = mongoose.model("Rocket", rocketSchema);
const VideoRequest = mongoose.model("VideoRequest", videoRequestSchema);
const Grievance = mongoose.model("Grievance", grievanceSchema);
const DmcaRemoval = mongoose.model("DmcaRemoval", DmcaRemovalSchema);

module.exports = {
  Video,
  User,
  Admin,
  Rocket,
  VideoRequest,
  Grievance,
  DmcaRemoval,
};
