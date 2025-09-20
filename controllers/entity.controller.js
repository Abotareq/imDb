import Entity from "../models/entity.model.js";
import Review from "../models/review.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

/* ---------------------- HELPER ---------------------- */
// Update entity rating based on reviews
const updateEntityRating = async (entityId) => {
  try {
    const result = await Review.aggregate([
      { $match: { entity: entityId } },
      { $group: { _id: "$entity", avgRating: { $avg: "$rating" } } },
    ]);

    const avgRating =
      result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;

    await Entity.findByIdAndUpdate(entityId, { rating: avgRating });
    return avgRating;
  } catch (error) {
    console.error("Error updating entity rating:", error);
    return 0;
  }
};

/* ---------------------- READ ---------------------- */
export const getAllEntities = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const filter = type ? { type } : {};

    const skip = (page - 1) * limit;
    const entities = await Entity.find(filter)
      .populate("directors cast", "name")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Entity.countDocuments(filter);

    res.json({
      success: true,
      entities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getEntityById = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST)
      );
    }

    const entity = await Entity.findById(req.params.id)
      .populate("directors cast", "name bio profileImage")
      .lean();

    if (!entity) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, entity });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- CREATE ---------------------- */
export const createEntity = async (req, res, next) => {
  try {
    const data = req.body;

    // Attach poster & cover if uploaded (validateFormData already handles this)
    if (req.files?.posterUrl) {
      data.posterUrl = req.files.posterUrl[0].path;
    }
    if (req.files?.coverUrl) {
      data.coverUrl = req.files.coverUrl[0].path;
    }

    // validateFormData middleware already parses JSON fields, but keep as fallback
    if (typeof data.genres === "string") data.genres = JSON.parse(data.genres);
    if (typeof data.directors === "string")
      data.directors = JSON.parse(data.directors);
    if (typeof data.cast === "string") data.cast = JSON.parse(data.cast);
    if (typeof data.seasons === "string")
      data.seasons = JSON.parse(data.seasons);

    const newEntity = await Entity.create(data);

    // Populate the created entity for response
    const populatedEntity = await Entity.findById(newEntity._id)
      .populate("directors cast", "name")
      .lean();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `${newEntity.type} created successfully`,
      entity: populatedEntity,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- UPDATE ---------------------- */
export const updateEntity = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST)
      );
    }

    const data = req.body;

    // Attach poster & cover if uploaded
    if (req.files?.posterUrl) {
      data.posterUrl = req.files.posterUrl[0].path;
    }
    if (req.files?.coverUrl) {
      data.coverUrl = req.files.coverUrl[0].path;
    }

    // validateFormData middleware handles JSON parsing, but keep as fallback
    if (typeof data.genres === "string") data.genres = JSON.parse(data.genres);
    if (typeof data.directors === "string")
      data.directors = JSON.parse(data.directors);
    if (typeof data.cast === "string") data.cast = JSON.parse(data.cast);
    if (typeof data.seasons === "string")
      data.seasons = JSON.parse(data.seasons);

    // Remove undefined values to avoid overwriting with undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === "") {
        delete data[key];
      }
    });

    const updatedEntity = await Entity.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      {
        new: true,
        runValidators: true,
        omitUndefined: true,
      }
    ).populate("directors cast", "name");

    if (!updatedEntity) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    res.json({
      success: true,
      message: "Entity updated successfully",
      entity: updatedEntity,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- DELETE ---------------------- */
export const deleteEntity = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST)
      );
    }

    const deleted = await Entity.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    // Also delete related reviews
    await Review.deleteMany({ entity: req.params.id });

    res.json({
      success: true,
      message: `${deleted.type} deleted successfully`,
      deletedEntity: {
        id: deleted._id,
        title: deleted.title,
        type: deleted.type,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- RATING HANDLER ---------------------- */
export const getEntityRating = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST)
      );
    }

    // Check if entity exists
    const entity = await Entity.findById(req.params.id);
    if (!entity) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    const avgRating = await updateEntityRating(req.params.id);

    res.json({
      success: true,
      rating: avgRating,
      entityId: req.params.id,
      entityTitle: entity.title,
    });
  } catch (err) {
    next(err);
  }
};
