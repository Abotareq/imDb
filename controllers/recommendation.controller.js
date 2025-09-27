import Entity from "../models/entity.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

export const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).lean();

    if (!user) return next(new ErrorResponse("User not found", StatusCodes.NOT_FOUND));

    // Get user's reviews to infer preferences
    const reviews = await Review.find({ user: userId })
      .populate("entity")
      .lean();

    const preferences = new Map(user.preferences);

    // Update preferences based on reviews
    reviews.forEach((review) => {
      if (review.entity && review.entity.type) {
        const typeScore = preferences.get(review.entity.type) || 0;
        preferences.set(review.entity.type, typeScore + (review.rating / 10)); // Weight by rating (0-1 scale)
      }
      if (review.entity && review.entity.genres) {
        review.entity.genres.forEach((genre) => {
          const genreScore = preferences.get(genre.name) || 0;
          preferences.set(genre.name, genreScore + (review.rating / 20)); // Lower weight for genres
        });
      }
    });

    // Find entities matching top preferences
    const topPreferences = [...preferences.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2); // Top 2 preferences (type and genre)

    let recommendedEntities = [];
    if (topPreferences.length > 0) {
      const [topType, topGenre] = topPreferences;
      recommendedEntities = await Entity.find({
        $or: [
          { type: topType[0] },
          { "genres.name": topGenre[0] },
        ],
      })
        .where("_id").nin(reviews.map(r => r.entity._id)) // Exclude already reviewed entities
        .limit(5)
        .lean();
    }

    // Fallback to popular entities if no strong preferences
    if (recommendedEntities.length === 0) {
      recommendedEntities = await Entity.find()
        .sort({ rating: -1, createdAt: -1 })
        .limit(5)
        .lean();
    }

    res.json({
      success: true,
      recommendations: recommendedEntities.map(entity => ({
        id: entity._id,
        title: entity.title,
        type: entity.type,
        posterUrl: entity.posterUrl,
        genres: entity.genres.map(g => g.name),
      })),
    });
  } catch (err) {
    next(err);
  }
};