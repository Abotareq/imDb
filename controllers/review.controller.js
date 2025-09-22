// controllers/review.controller.js
import Review from "../models/review.model.js";
import Entity from "../models/entity.model.js";
import User from "../models/user.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

/* ---------------------- HELPER FUNCTIONS ---------------------- */
// Update entity rating based on reviews
const updateEntityRating = async (entityId) => {
  try {
    const result = await Review.aggregate([
      { $match: { entity: entityId } },
      { $group: { _id: "$entity", avgRating: { $avg: "$rating" } } },
    ]);

    const avgRating = result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
    await Entity.findByIdAndUpdate(entityId, { rating: avgRating });
    return avgRating;
  } catch (error) {
    console.error("Error updating entity rating:", error);
    return 0;
  }
};

/* ---------------------- PUBLIC READ OPERATIONS ---------------------- */
export const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, entity, user, minRating, maxRating, search } = req.query;
    const filter = {};
    
    // Filter by entity
    if (entity) filter.entity = entity;
    
    // Filter by user
    if (user) filter.user = user;
    
    // Filter by rating range
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }
    
    // Search by comment content
    if (search) {
      filter.comment = { $regex: search, $options: 'i' };
    }
    
    const skip = (page - 1) * limit;
    const reviews = await Review.find(filter)
      .populate("user", "username avatar")
      .populate("entity", "title type posterUrl")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Review.countDocuments(filter);

    res.json({ 
      success: true, 
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid review ID format", StatusCodes.BAD_REQUEST));
    }

    const review = await Review.findById(req.params.id)
      .populate("user", "username avatar bio")
      .populate("entity", "title type description posterUrl coverUrl rating")
      .lean();

    if (!review) {
      return next(new ErrorResponse("Review not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

export const getReviewsByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { page = 1, limit = 10, minRating, maxRating } = req.query;

    // Validate ObjectId format
    if (!entityId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST));
    }

    // Check if entity exists
    const entity = await Entity.findById(entityId);
    if (!entity) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    const filter = { entity: entityId };
    
    // Filter by rating range
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }

    const skip = (page - 1) * limit;
    const reviews = await Review.find(filter)
      .populate("user", "username avatar")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Review.countDocuments(filter);

    // Get rating statistics
    const stats = await Review.aggregate([
      { $match: { entity: entityId } },
      { 
        $group: { 
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating"
          }
        }
      }
    ]);

    const ratingStats = stats[0] || { avgRating: 0, totalReviews: 0, ratingDistribution: [] };

    res.json({
      success: true,
      entity: {
        _id: entity._id,
        title: entity.title,
        type: entity.type,
        posterUrl: entity.posterUrl
      },
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      stats: {
        averageRating: Math.round(ratingStats.avgRating * 10) / 10,
        totalReviews: ratingStats.totalReviews
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getReviewsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid user ID format", StatusCodes.BAD_REQUEST));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse("User not found", StatusCodes.NOT_FOUND));
    }

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ user: userId })
      .populate("entity", "title type posterUrl")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar
      },
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- USER-SPECIFIC READ OPERATIONS ---------------------- */
export const getUserOwnReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ user: userId })
      .populate("entity", "title type posterUrl")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getUserReviewForEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const userId = req.user.id;

    // Validate ObjectId format
    if (!entityId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST));
    }

    const review = await Review.findOne({ user: userId, entity: entityId })
      .populate("entity", "title type posterUrl")
      .lean();

    res.json({
      success: true,
      review: review || null,
      hasReviewed: !!review
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- WRITE OPERATIONS ---------------------- */
export const createReview = async (req, res, next) => {
  try {
    const { entity, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if entity exists
    const entityDoc = await Entity.findById(entity);
    if (!entityDoc) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    // Check if user already reviewed this entity
    const existingReview = await Review.findOne({ user: userId, entity });
    if (existingReview) {
      return next(new ErrorResponse("You have already reviewed this entity", StatusCodes.CONFLICT));
    }

    const newReview = await Review.create({
      user: userId,
      entity,
      rating,
      comment
    });

    // Update entity's average rating
    await updateEntityRating(entity);

    // Populate the created review for response
    const populatedReview = await Review.findById(newReview._id)
      .populate("user", "username avatar")
      .populate("entity", "title type posterUrl")
      .lean();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Review created successfully",
      review: populatedReview,
    });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid review ID format", StatusCodes.BAD_REQUEST));
    }

    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Find the review
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ErrorResponse("Review not found", StatusCodes.NOT_FOUND));
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return next(new ErrorResponse("You can only update your own reviews", StatusCodes.FORBIDDEN));
    }

    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "username avatar")
     .populate("entity", "title type posterUrl");

    // Update entity's average rating if rating was changed
    if (rating !== undefined) {
      await updateEntityRating(review.entity);
    }

    res.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid review ID format", StatusCodes.BAD_REQUEST));
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the review
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ErrorResponse("Review not found", StatusCodes.NOT_FOUND));
    }

    // Check permissions: user can delete their own review, admin can delete any review
    if (review.user.toString() !== userId && userRole !== 'admin') {
      return next(new ErrorResponse("You can only delete your own reviews", StatusCodes.FORBIDDEN));
    }

    const entityId = review.entity;
    await Review.findByIdAndDelete(req.params.id);

    // Update entity's average rating
    await updateEntityRating(entityId);

    res.json({ 
      success: true, 
      message: "Review deleted successfully",
      deletedReview: {
        id: review._id,
        rating: review.rating,
        entity: review.entity
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- ADMIN BULK OPERATIONS ---------------------- */
export const deleteReviewsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid user ID format", StatusCodes.BAD_REQUEST));
    }

    // Get all entities that will be affected
    const affectedReviews = await Review.find({ user: userId }).select('entity');
    const affectedEntities = [...new Set(affectedReviews.map(r => r.entity.toString()))];

    const result = await Review.deleteMany({ user: userId });

    // Update ratings for all affected entities
    for (const entityId of affectedEntities) {
      await updateEntityRating(entityId);
    }

    res.json({
      success: true,
      message: `${result.deletedCount} reviews deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};

export const deleteReviewsByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;

    // Validate ObjectId format
    if (!entityId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST));
    }

    const result = await Review.deleteMany({ entity: entityId });

    // Reset entity rating to 0
    await Entity.findByIdAndUpdate(entityId, { rating: 0 });

    res.json({
      success: true,
      message: `${result.deletedCount} reviews deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- STATISTICS ---------------------- */
export const getReviewStats = async (req, res, next) => {
  try {
    const { entityId } = req.params;

    // Validate ObjectId format
    if (!entityId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST));
    }

    // Check if entity exists
    const entity = await Entity.findById(entityId);
    if (!entity) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    const stats = await Review.aggregate([
      { $match: { entity: entityId } },
      { 
        $group: { 
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratings: { $push: "$rating" }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        success: true,
        entity: { _id: entity._id, title: entity.title },
        stats: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {}
        }
      });
    }

    const { avgRating, totalReviews, ratings } = stats[0];
    
    // Calculate rating distribution
    const distribution = ratings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      entity: {
        _id: entity._id,
        title: entity.title,
        type: entity.type
      },
      stats: {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews,
        ratingDistribution: distribution
      }
    });
  } catch (err) {
    next(err);
  }
};