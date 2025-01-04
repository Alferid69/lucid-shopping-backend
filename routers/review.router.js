const express = require("express");
const {
  getAllReviews,
  createReview,
  setUserProductIds,
  deleteReview,
  updateReview,
  getReview,
} = require("../controllers/review.controller");

const { protect, restrictTo } = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setUserProductIds, createReview);

router.route("/:id").delete(deleteReview).patch(updateReview).get(getReview);

module.exports = router;
