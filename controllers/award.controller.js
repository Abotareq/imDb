// controllers/award.controller.js
import Award from "../models/award.model.js";
import Entity from "../models/entity.model.js";
import Person from "../models/person.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

/* ---------------------- READ ---------------------- */
export const getAllAwards = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, year, category, entity, person, search } = req.query;
    const filter = {};
    
    // Filter by year
    if (year) filter.year = year;
    
    // Filter by category
    if (category) filter.category = { $regex: category, $options: 'i' };
    
    // Filter by entity
    if (entity) filter.entity = entity;
    
    // Filter by person
    if (person) filter.person = person;
    
    // Search by award name or category
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const awards = await Award.find(filter)
      .populate("entity", "title type posterUrl")
      .populate("person", "name photoUrl roles")
      .limit(Number(limit))
      .skip(skip)
      .sort({ year: -1, createdAt: -1 })
      .lean();

    const total = await Award.countDocuments(filter);

    res.json({ 
      success: true, 
      awards,
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

export const getAwardById = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid award ID format", StatusCodes.BAD_REQUEST));
    }

    const award = await Award.findById(req.params.id)
      .populate("entity", "title type description posterUrl coverUrl rating")
      .populate("person", "name bio photoUrl dateOfBirth roles")
      .lean();

    if (!award) {
      return next(new ErrorResponse("Award not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, award });
  } catch (err) {
    next(err);
  }
};

export const getAwardsByEntity = async (req, res, next) => {
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
    const awards = await Award.find({ entity: entityId })
      .populate("person", "name photoUrl roles")
      .limit(Number(limit))
      .skip(skip)
      .sort({ year: -1 })
      .lean();

    const total = await Award.countDocuments({ entity: entityId });

    res.json({
      success: true,
      entity: {
        _id: entity._id,
        title: entity.title,
        type: entity.type,
        posterUrl: entity.posterUrl
      },
      awards,
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

export const getAwardsByPerson = async (req, res, next) => {
  try {
    const { personId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId format
    if (!personId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid person ID format", StatusCodes.BAD_REQUEST));
    }

    // Check if person exists
    const person = await Person.findById(personId);
    if (!person) {
      return next(new ErrorResponse("Person not found", StatusCodes.NOT_FOUND));
    }

    const skip = (page - 1) * limit;
    const awards = await Award.find({ person: personId })
      .populate("entity", "title type posterUrl")
      .limit(Number(limit))
      .skip(skip)
      .sort({ year: -1 })
      .lean();

    const total = await Award.countDocuments({ person: personId });

    res.json({
      success: true,
      person: {
        _id: person._id,
        name: person.name,
        photoUrl: person.photoUrl,
        roles: person.roles
      },
      awards,
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

export const getAwardsByYear = async (req, res, next) => {
  try {
    const { year } = req.params;
    const { page = 1, limit = 10, category } = req.query;

    // Validate year
    const yearNum = Number(year);
    if (!yearNum || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      return next(new ErrorResponse("Invalid year", StatusCodes.BAD_REQUEST));
    }

    const filter = { year: yearNum };
    if (category) filter.category = { $regex: category, $options: 'i' };

    const skip = (page - 1) * limit;
    const awards = await Award.find(filter)
      .populate("entity", "title type posterUrl")
      .populate("person", "name photoUrl roles")
      .limit(Number(limit))
      .skip(skip)
      .sort({ category: 1, name: 1 })
      .lean();

    const total = await Award.countDocuments(filter);

    res.json({
      success: true,
      year: yearNum,
      awards,
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

export const getAwardCategories = async (req, res, next) => {
  try {
    const categories = await Award.distinct("category");
    const categoriesWithCount = await Award.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      categories: categoriesWithCount.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- CREATE ---------------------- */
export const createAward = async (req, res, next) => {
  try {
    const { name, category, year, entity, person } = req.body;

    // Validate entity if provided
    if (entity) {
      const entityDoc = await Entity.findById(entity);
      if (!entityDoc) {
        return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
      }
    }

    // Validate person if provided
    if (person) {
      const personDoc = await Person.findById(person);
      if (!personDoc) {
        return next(new ErrorResponse("Person not found", StatusCodes.NOT_FOUND));
      }
    }

    // At least one of entity or person should be provided
    if (!entity && !person) {
      return next(new ErrorResponse("Either entity or person must be provided", StatusCodes.BAD_REQUEST));
    }

    const newAward = await Award.create({
      name,
      category,
      year,
      entity: entity || null,
      person: person || null
    });

    // Populate the created award for response
    const populatedAward = await Award.findById(newAward._id)
      .populate("entity", "title type posterUrl")
      .populate("person", "name photoUrl roles")
      .lean();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Award created successfully",
      award: populatedAward,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- UPDATE ---------------------- */
export const updateAward = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid award ID format", StatusCodes.BAD_REQUEST));
    }

    const { name, category, year, entity, person } = req.body;
    const updateData = {};

    // Only include provided fields
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (year !== undefined) updateData.year = year;

    // Validate entity if being updated
    if (entity !== undefined) {
      if (entity === null || entity === "") {
        updateData.entity = null;
      } else {
        const entityDoc = await Entity.findById(entity);
        if (!entityDoc) {
          return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
        }
        updateData.entity = entity;
      }
    }

    // Validate person if being updated
    if (person !== undefined) {
      if (person === null || person === "") {
        updateData.person = null;
      } else {
        const personDoc = await Person.findById(person);
        if (!personDoc) {
          return next(new ErrorResponse("Person not found", StatusCodes.NOT_FOUND));
        }
        updateData.person = person;
      }
    }

    // Check if at least one of entity or person will remain after update
    const currentAward = await Award.findById(req.params.id);
    if (!currentAward) {
      return next(new ErrorResponse("Award not found", StatusCodes.NOT_FOUND));
    }

    const finalEntity = updateData.entity !== undefined ? updateData.entity : currentAward.entity;
    const finalPerson = updateData.person !== undefined ? updateData.person : currentAward.person;

    if (!finalEntity && !finalPerson) {
      return next(new ErrorResponse("Award must be associated with either an entity or person", StatusCodes.BAD_REQUEST));
    }

    const updatedAward = await Award.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("entity", "title type posterUrl")
     .populate("person", "name photoUrl roles");

    res.json({
      success: true,
      message: "Award updated successfully",
      award: updatedAward,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- DELETE ---------------------- */
export const deleteAward = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid award ID format", StatusCodes.BAD_REQUEST));
    }

    const deleted = await Award.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return next(new ErrorResponse("Award not found", StatusCodes.NOT_FOUND));
    }

    res.json({ 
      success: true, 
      message: "Award deleted successfully",
      deletedAward: {
        id: deleted._id,
        name: deleted.name,
        category: deleted.category,
        year: deleted.year
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- BULK OPERATIONS ---------------------- */
export const createMultipleAwards = async (req, res, next) => {
  try {
    const { awards } = req.body;

    if (!Array.isArray(awards) || awards.length === 0) {
      return next(new ErrorResponse("Awards array is required", StatusCodes.BAD_REQUEST));
    }

    // Validate all awards first
    for (const award of awards) {
      if (award.entity) {
        const entity = await Entity.findById(award.entity);
        if (!entity) {
          return next(new ErrorResponse(`Invalid entity: ${award.entity}`, StatusCodes.BAD_REQUEST));
        }
      }

      if (award.person) {
        const person = await Person.findById(award.person);
        if (!person) {
          return next(new ErrorResponse(`Invalid person: ${award.person}`, StatusCodes.BAD_REQUEST));
        }
      }

      if (!award.entity && !award.person) {
        return next(new ErrorResponse("Each award must have either entity or person", StatusCodes.BAD_REQUEST));
      }
    }

    // Create all awards
    const createdAwards = await Award.insertMany(awards);

    // Populate the created awards
    const populatedAwards = await Award.find({
      _id: { $in: createdAwards.map(a => a._id) }
    })
    .populate("entity", "title type posterUrl")
    .populate("person", "name photoUrl roles")
    .lean();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `${createdAwards.length} awards created successfully`,
      awards: populatedAwards,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAwardsByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;

    // Validate ObjectId format
    if (!entityId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST));
    }

    const result = await Award.deleteMany({ entity: entityId });

    res.json({
      success: true,
      message: `${result.deletedCount} awards deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAwardsByPerson = async (req, res, next) => {
  try {
    const { personId } = req.params;

    // Validate ObjectId format
    if (!personId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid person ID format", StatusCodes.BAD_REQUEST));
    }

    const result = await Award.deleteMany({ person: personId });

    res.json({
      success: true,
      message: `${result.deletedCount} awards deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};