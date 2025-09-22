// controllers/article.controller.js
import Article from "../models/article.model.js";
import User from "../models/user.model.js";
import Entity from "../models/entity.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

/* ---------------------- READ ---------------------- */
export const getAllArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, author, relatedEntity, search } = req.query;
    const filter = {};
    
    // Filter by author
    if (author) filter.author = author;
    
    // Filter by related entity
    if (relatedEntity) filter.relatedEntity = relatedEntity;
    
    // Search by title or content
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const articles = await Article.find(filter)
      .populate("author", "username avatar verified")
      .populate("relatedEntity", "title type posterUrl")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Article.countDocuments(filter);

    res.json({ 
      success: true, 
      articles,
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

export const getArticleById = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid article ID format", StatusCodes.BAD_REQUEST));
    }

    const article = await Article.findById(req.params.id)
      .populate("author", "username avatar bio verified createdAt")
      .populate("relatedEntity", "title type description posterUrl coverUrl rating")
      .lean();

    if (!article) {
      return next(new ErrorResponse("Article not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, article });
  } catch (err) {
    next(err);
  }
};

export const getArticlesByAuthor = async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId format
    if (!authorId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid author ID format", StatusCodes.BAD_REQUEST));
    }

    // Check if author exists
    const author = await User.findById(authorId);
    if (!author) {
      return next(new ErrorResponse("Author not found", StatusCodes.NOT_FOUND));
    }

    const skip = (page - 1) * limit;
    const articles = await Article.find({ author: authorId })
      .populate("relatedEntity", "title type posterUrl")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Article.countDocuments({ author: authorId });

    res.json({
      success: true,
      author: {
        _id: author._id,
        username: author.username,
        avatar: author.avatar,
        verified: author.verified
      },
      articles,
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

export const getArticlesByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId format
    if (!entityId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST));
    }

    // Check if entity exists
    const entity = await Entity.findById(entityId);
    if (!entity) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    const skip = (page - 1) * limit;
    const articles = await Article.find({ relatedEntity: entityId })
      .populate("author", "username avatar verified")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Article.countDocuments({ relatedEntity: entityId });

    res.json({
      success: true,
      entity: {
        _id: entity._id,
        title: entity.title,
        type: entity.type,
        posterUrl: entity.posterUrl
      },
      articles,
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

export const getUserArticles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const articles = await Article.find({ author: userId })
      .populate("relatedEntity", "title type posterUrl")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Article.countDocuments({ author: userId });

    res.json({
      success: true,
      articles,
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

/* ---------------------- CREATE ---------------------- */
export const createArticle = async (req, res, next) => {
  try {
    const { title, content, relatedEntity } = req.body;
    const userId = req.user.id;

    // Check if user is verified
    if (!req.user.verified) {
      return next(new ErrorResponse("Only verified users can create articles", StatusCodes.FORBIDDEN));
    }

    // Check if related entity exists (if provided)
    if (relatedEntity) {
      const entity = await Entity.findById(relatedEntity);
      if (!entity) {
        return next(new ErrorResponse("Related entity not found", StatusCodes.NOT_FOUND));
      }
    }

    const newArticle = await Article.create({
      title,
      content,
      author: userId,
      relatedEntity: relatedEntity || null
    });

    // Populate the created article for response
    const populatedArticle = await Article.findById(newArticle._id)
      .populate("author", "username avatar verified")
      .populate("relatedEntity", "title type posterUrl")
      .lean();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Article created successfully",
      article: populatedArticle,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- UPDATE ---------------------- */
export const updateArticle = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid article ID format", StatusCodes.BAD_REQUEST));
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return next(new ErrorResponse("Article not found", StatusCodes.NOT_FOUND));
    }

    // Check if user owns the article
    if (article.author.toString() !== req.user.id) {
      return next(new ErrorResponse("Not authorized to update this article", StatusCodes.FORBIDDEN));
    }

    const { title, content, relatedEntity } = req.body;
    const updateData = {};

    // Only include provided fields
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    
    // Validate related entity if being updated
    if (relatedEntity !== undefined) {
      if (relatedEntity) {
        const entity = await Entity.findById(relatedEntity);
        if (!entity) {
          return next(new ErrorResponse("Related entity not found", StatusCodes.NOT_FOUND));
        }
      }
      updateData.relatedEntity = relatedEntity || null;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("author", "username avatar verified")
     .populate("relatedEntity", "title type posterUrl");

    res.json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- DELETE ---------------------- */
export const deleteArticle = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid article ID format", StatusCodes.BAD_REQUEST));
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return next(new ErrorResponse("Article not found", StatusCodes.NOT_FOUND));
    }

    // Check permissions: Article owner OR Admin
    const isOwner = article.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return next(new ErrorResponse("Not authorized to delete this article", StatusCodes.FORBIDDEN));
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: "Article deleted successfully",
      deletedArticle: {
        id: article._id,
        title: article.title,
        author: article.author
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- BULK OPERATIONS (Admin only) ---------------------- */
export const deleteArticlesByAuthor = async (req, res, next) => {
  try {
    const { authorId } = req.params;

    // Only admins can do bulk deletions
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse("Admin access required", StatusCodes.FORBIDDEN));
    }

    // Validate ObjectId format
    if (!authorId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid author ID format", StatusCodes.BAD_REQUEST));
    }

    const result = await Article.deleteMany({ author: authorId });

    res.json({
      success: true,
      message: `${result.deletedCount} articles deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};

export const deleteArticlesByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;

    // Only admins can do bulk deletions
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse("Admin access required", StatusCodes.FORBIDDEN));
    }

    // Validate ObjectId format
    if (!entityId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST));
    }

    const result = await Article.deleteMany({ relatedEntity: entityId });

    res.json({
      success: true,
      message: `${result.deletedCount} articles deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};