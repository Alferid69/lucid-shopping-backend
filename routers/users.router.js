const express = require("express");
const {
  getAllUsers,
  updateMe,
  deleteMe,
  getUser,
  getMe,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);
router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);
router.get('/me', getMe);

router.use(restrictTo("admin"));
router.get("/", getAllUsers);
router.route("/:id").get( getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
