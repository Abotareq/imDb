// controllers/character.controller.js
import Character from "../models/character.model.js";
import Person from "../models/person.model.js";
import Entity from "../models/entity.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

/* ---------------------- READ ---------------------- */
export const getAllCharacters = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, entity, actor, search } = req.query;
    const filter = {};
    
    // Filter by entity (movie/tv show)
    if (entity) filter.entity = entity;
    
    // Filter by actor
    if (actor) filter.actor = actor;
    
    // Search by character name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const characters = await Character.find(filter)
      .populate("actor", "name photoUrl roles")
      .populate("entity", "title type posterUrl")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Character.countDocuments(filter);

    res.json({ 
      success: true, 
      characters,
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

export const getCharacterById = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid character ID format", StatusCodes.BAD_REQUEST));
    }

    const character = await Character.findById(req.params.id)
      .populate("actor", "name bio photoUrl dateOfBirth roles")
      .populate("entity", "title type description posterUrl coverUrl rating")
      .lean();

    if (!character) {
      return next(new ErrorResponse("Character not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, character });
  } catch (err) {
    next(err);
  }
};

export const getCharactersByEntity = async (req, res, next) => {
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
    const characters = await Character.find({ entity: entityId })
      .populate("actor", "name photoUrl roles")
      .limit(Number(limit))
      .skip(skip)
      .sort({ name: 1 })
      .lean();

    const total = await Character.countDocuments({ entity: entityId });

    res.json({
      success: true,
      entity: {
        _id: entity._id,
        title: entity.title,
        type: entity.type
      },
      characters,
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

export const getCharactersByActor = async (req, res, next) => {
  try {
    const { actorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId format
    if (!actorId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid actor ID format", StatusCodes.BAD_REQUEST));
    }

    // Check if actor exists
    const actor = await Person.findById(actorId);
    if (!actor) {
      return next(new ErrorResponse("Actor not found", StatusCodes.NOT_FOUND));
    }

    if (!actor.roles.includes('actor')) {
      return next(new ErrorResponse("Person is not listed as an actor", StatusCodes.BAD_REQUEST));
    }

    const skip = (page - 1) * limit;
    const characters = await Character.find({ actor: actorId })
      .populate("entity", "title type posterUrl releaseDate")
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Character.countDocuments({ actor: actorId });

    res.json({
      success: true,
      actor: {
        _id: actor._id,
        name: actor.name,
        photoUrl: actor.photoUrl
      },
      characters,
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
export const createCharacter = async (req, res, next) => {
  try {
    const { name, description, actor, entity } = req.body;

    // Check if actor exists and has 'actor' role
    const actorDoc = await Person.findById(actor);
    if (!actorDoc) {
      return next(new ErrorResponse("Actor not found", StatusCodes.NOT_FOUND));
    }
    if (!actorDoc.roles.includes('actor')) {
      return next(new ErrorResponse("Person is not listed as an actor", StatusCodes.BAD_REQUEST));
    }

    // Check if entity exists
    const entityDoc = await Entity.findById(entity);
    if (!entityDoc) {
      return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
    }

    // Check if character already exists for this actor in this entity
    const existingCharacter = await Character.findOne({ actor, entity });
    if (existingCharacter) {
      return next(new ErrorResponse("Character already exists for this actor in this entity", StatusCodes.CONFLICT));
    }

    const newCharacter = await Character.create({
      name,
      description,
      actor,
      entity
    });

    // Populate the created character for response
    const populatedCharacter = await Character.findById(newCharacter._id)
      .populate("actor", "name photoUrl roles")
      .populate("entity", "title type posterUrl")
      .lean();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Character created successfully",
      character: populatedCharacter,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- UPDATE ---------------------- */
export const updateCharacter = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid character ID format", StatusCodes.BAD_REQUEST));
    }

    const { name, description, actor, entity } = req.body;
    const updateData = {};

    // Only include provided fields
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    // If actor is being updated, validate it
    if (actor !== undefined) {
      const actorDoc = await Person.findById(actor);
      if (!actorDoc) {
        return next(new ErrorResponse("Actor not found", StatusCodes.NOT_FOUND));
      }
      if (!actorDoc.roles.includes('actor')) {
        return next(new ErrorResponse("Person is not listed as an actor", StatusCodes.BAD_REQUEST));
      }
      updateData.actor = actor;
    }

    // If entity is being updated, validate it
    if (entity !== undefined) {
      const entityDoc = await Entity.findById(entity);
      if (!entityDoc) {
        return next(new ErrorResponse("Entity not found", StatusCodes.NOT_FOUND));
      }
      updateData.entity = entity;
    }

    // Check for duplicate if actor or entity is being changed
    if (actor !== undefined || entity !== undefined) {
      const currentCharacter = await Character.findById(req.params.id);
      if (!currentCharacter) {
        return next(new ErrorResponse("Character not found", StatusCodes.NOT_FOUND));
      }

      const checkActor = actor !== undefined ? actor : currentCharacter.actor;
      const checkEntity = entity !== undefined ? entity : currentCharacter.entity;

      const existingCharacter = await Character.findOne({ 
        actor: checkActor, 
        entity: checkEntity,
        _id: { $ne: req.params.id } 
      });
      
      if (existingCharacter) {
        return next(new ErrorResponse("Character already exists for this actor in this entity", StatusCodes.CONFLICT));
      }
    }

    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("actor", "name photoUrl roles")
     .populate("entity", "title type posterUrl");

    if (!updatedCharacter) {
      return next(new ErrorResponse("Character not found", StatusCodes.NOT_FOUND));
    }

    res.json({
      success: true,
      message: "Character updated successfully",
      character: updatedCharacter,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- DELETE ---------------------- */
export const deleteCharacter = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid character ID format", StatusCodes.BAD_REQUEST));
    }

    const deleted = await Character.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return next(new ErrorResponse("Character not found", StatusCodes.NOT_FOUND));
    }

    res.json({ 
      success: true, 
      message: "Character deleted successfully",
      deletedCharacter: {
        id: deleted._id,
        name: deleted.name,
        actor: deleted.actor,
        entity: deleted.entity
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- BULK OPERATIONS ---------------------- */
export const createMultipleCharacters = async (req, res, next) => {
  try {
    const { characters } = req.body;

    if (!Array.isArray(characters) || characters.length === 0) {
      return next(new ErrorResponse("Characters array is required", StatusCodes.BAD_REQUEST));
    }

    // Validate all characters first
    for (const char of characters) {
      // Check actor exists and has actor role
      const actor = await Person.findById(char.actor);
      if (!actor || !actor.roles.includes('actor')) {
        return next(new ErrorResponse(`Invalid actor: ${char.actor}`, StatusCodes.BAD_REQUEST));
      }

      // Check entity exists
      const entity = await Entity.findById(char.entity);
      if (!entity) {
        return next(new ErrorResponse(`Invalid entity: ${char.entity}`, StatusCodes.BAD_REQUEST));
      }
    }

    // Create all characters
    const createdCharacters = await Character.insertMany(characters);

    // Populate the created characters
    const populatedCharacters = await Character.find({
      _id: { $in: createdCharacters.map(c => c._id) }
    })
    .populate("actor", "name photoUrl")
    .populate("entity", "title type")
    .lean();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `${createdCharacters.length} characters created successfully`,
      characters: populatedCharacters,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ErrorResponse("Duplicate character found", StatusCodes.CONFLICT));
    }
    next(err);
  }
};

export const deleteCharactersByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;

    // Validate ObjectId format
    if (!entityId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorResponse("Invalid entity ID format", StatusCodes.BAD_REQUEST));
    }

    const result = await Character.deleteMany({ entity: entityId });

    res.json({
      success: true,
      message: `${result.deletedCount} characters deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};