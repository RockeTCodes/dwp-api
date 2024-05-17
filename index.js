const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const connectDb = require("./db/connectDb");
const {
  userRegister,
  userLogin,
  checkUserLoginStatus,
} = require("./controllers/userAuthController");
const {
  adminRegister,
  adminLogin,
  checkAdminLoginStatus,
} = require("./controllers/adminAuthController");
const {
  rocketRegister,
  rocketLogin,
  checkRocketLoginStatus,
} = require("./controllers/rocketAuthController");
const logout = require("./controllers/logoutController");
const {
  isAuthenticatedUser,
  isAuthenticatedAdmin,
  isAuthenticatedRocket,
} = require("./middlewares/isAuthenticated");
const {
  addVideo,
  editVideo,
  getAllVideosForthisAdmin,
  getVideoForAdmin,
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  deleteVideo,
  getAllVideoRequest,
  deleteVideoRequest,
  getAllDmcaRequest,
  deleteDmcaRequest,
} = require("./controllers/adminController");
const upload = require("./middlewares/multer");
const {
  getAllVideosUser,
  getVideoUser,
  getVideosByActor,
  searchVideos,
  mostViewedVideos,
  getVideosByCategory,
  addReview,
  addLike,
  videoRequest,
  grievanceRequest,
  dmcaRemovalRequest,
  addVideoToFavourites,
  getAllFavouriteVideos,
  getRecommendedVideos,
  mostLikedVideos,
} = require("./controllers/userController");
const {
  getAllAdmins,
  getAdmin,
  editAdmin,
} = require("./controllers/rocketController");

const app = express();
connectDb();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: "94d0af2c8d07ebe1597de08c08e00096",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

const corsOptions = {
  origin: ["http://localhost:3000"],
  credetials: true,
};
app.use(cors(corsOptions));

//user-auth-routes
app.post("/user-register", userRegister);
app.post("/user-login", userLogin);
app.get("/user-login-status", isAuthenticatedUser, checkUserLoginStatus);

//auth-auth-routes
app.post("/admin-register", adminRegister);
app.post("/admin-login", adminLogin);
app.get("/admin-login-status", isAuthenticatedAdmin, checkAdminLoginStatus);

//rocket-auth-routes
app.post("/rocket-register", rocketRegister);
app.post("/rocket-login", rocketLogin);
app.get("/rocket-login-status", isAuthenticatedRocket, checkRocketLoginStatus);

//logout-route for all
app.post("/logout", logout);

//admin routes for crud on videos and other models
app.post("/add-video", isAuthenticatedAdmin, upload, addVideo);
app.post("/edit-video", isAuthenticatedAdmin, upload, editVideo);
app.post("/delete-video", isAuthenticatedAdmin, deleteVideo);
app.get(
  "/get-all-videos-for-this-admin",
  isAuthenticatedAdmin,
  getAllVideosForthisAdmin
);
app.get("/get-video-for-admin", isAuthenticatedAdmin, getVideoForAdmin);
app.get("/get-all-users", isAuthenticatedAdmin, getAllUsers);
app.get("/get-a-user", isAuthenticatedAdmin, getUser);
app.post("/edit-user", isAuthenticatedAdmin, editUser);
app.post("/delete-user", isAuthenticatedAdmin, deleteUser);
app.get("/get-all-video-request", isAuthenticatedAdmin, getAllVideoRequest);
app.post("/delete-video-request", isAuthenticatedAdmin, deleteVideoRequest);
app.get("/get-all-dmca-request", isAuthenticatedAdmin, getAllDmcaRequest);
app.post("/delete-dmca-request", isAuthenticatedAdmin, deleteDmcaRequest);

//routes for all users
app.get("/get-videos", getAllVideosUser);
app.get("/get-a-video", getVideoUser);
app.get("/get-video-by-actor", getVideosByActor);
app.get("/get-videos-by-category", getVideosByCategory);
app.post("/add-review", addReview);
app.post("/add-like", addLike);
app.post("/video-request", videoRequest);
app.post("/grievance-request", grievanceRequest);
app.post("/dmca-removal", dmcaRemovalRequest);
app.get("/search-videos", searchVideos);
app.get("/get-recommended-videos", getRecommendedVideos);
app.get("/sort-by-likes", mostLikedVideos);
app.get("/sort-by-views", mostViewedVideos);

//routes-for-logged-in-users
app.post("add-video-to-favourites", isAuthenticatedUser, addVideoToFavourites);
app.get(
  "/get-all-favourite-videos",
  isAuthenticatedUser,
  getAllFavouriteVideos
);

//routes-for-rocket
app.get("/get-all-Admins", isAuthenticatedRocket, getAllAdmins);
app.get("/get-admin", isAuthenticatedRocket, getAdmin);
app.post("/edit-admin", isAuthenticatedRocket, editAdmin);

// server port
const port = 4000;
app.listen(port, () => console.log(`Server started on port ${port}.......`));
