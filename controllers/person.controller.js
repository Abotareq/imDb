// controllers/person.controller.js
import Person from "../models/person.model.js";
import Entity from "../models/entity.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

/* ---------------------- READ ---------------------- */
export const getAllPeople = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    const filter = {};

    // Filter by role (actor, director, writer)
    if (role) filter.roles = role;

    // Search by name
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const people = await Person.find(filter)
      .limit(Number(limit))
      .skip(skip)
      .sort({ name: 1 })
      .lean();

    const total = await Person.countDocuments(filter);

    res.json({
      success: true,
      people,
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

export const getPersonById = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid person ID format", StatusCodes.BAD_REQUEST)
      );
    }

    const person = await Person.findById(req.params.id).lean();

    if (!person) {
      return next(new ErrorResponse("Person not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, person });
  } catch (err) {
    next(err);
  }
};

export const getPersonEntities = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid person ID format", StatusCodes.BAD_REQUEST)
      );
    }

    // Check if person exists
    const person = await Person.findById(id);
    if (!person) {
      return next(new ErrorResponse("Person not found", StatusCodes.NOT_FOUND));
    }

    const skip = (page - 1) * limit;

    // Find entities where person is director or cast
    const [asDirector, asCast] = await Promise.all([
      Entity.find({ directors: id })
        .select("title type posterUrl releaseDate rating")
        .limit(Number(limit))
        .skip(skip)
        .sort({ releaseDate: -1 })
        .lean(),
      Entity.find({ cast: id })
        .select("title type posterUrl releaseDate rating")
        .limit(Number(limit))
        .skip(skip)
        .sort({ releaseDate: -1 })
        .lean(),
    ]);

    const [directorCount, castCount] = await Promise.all([
      Entity.countDocuments({ directors: id }),
      Entity.countDocuments({ cast: id }),
    ]);

    res.json({
      success: true,
      person: {
        _id: person._id,
        name: person.name,
        photoUrl: person.photoUrl,
      },
      movies: {
        asDirector: {
          items: asDirector,
          total: directorCount,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(directorCount / limit),
          },
        },
        asCast: {
          items: asCast,
          total: castCount,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(castCount / limit),
          },
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getPersonsByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate role
    const validRoles = ["actor", "director", "writer"];
    if (!validRoles.includes(role)) {
      return next(
        new ErrorResponse(
          "Invalid role. Must be: actor, director, or writer",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const skip = (page - 1) * limit;
    const people = await Person.find({ roles: role })
      .select("name photoUrl dateOfBirth roles")
      .limit(Number(limit))
      .skip(skip)
      .sort({ name: 1 })
      .lean();

    const total = await Person.countDocuments({ roles: role });

    res.json({
      success: true,
      people,
      role,
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

/* ---------------------- CREATE ---------------------- */
export const createPerson = async (req, res, next) => {
  try {
    const data = req.body;

    // Attach photo if uploaded
    if (req.file) {
      data.photoUrl = req.file.path;
    }

    // Parse roles if it came as string (from form-data)
    if (typeof data.roles === "string") {
      data.roles = JSON.parse(data.roles);
    }

    // Parse dateOfBirth if it's a string
    if (typeof data.dateOfBirth === "string" && data.dateOfBirth.trim()) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    const newPerson = await Person.create(data);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Person created successfully",
      person: newPerson,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- UPDATE ---------------------- */
export const updatePerson = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid person ID format", StatusCodes.BAD_REQUEST)
      );
    }

    const data = req.body;

    // Attach photo if uploaded
    if (req.file) {
      data.photoUrl = req.file.path;
    }

    // Parse roles if it came as string (from form-data)
    if (typeof data.roles === "string") {
      data.roles = JSON.parse(data.roles);
    }

    // Parse dateOfBirth if it's a string
    if (typeof data.dateOfBirth === "string" && data.dateOfBirth.trim()) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    // Remove undefined values to avoid overwriting with undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === "") {
        delete data[key];
      }
    });

    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      {
        new: true,
        runValidators: true,
        omitUndefined: true,
      }
    );

    if (!updatedPerson) {
      return next(new ErrorResponse("Person not found", StatusCodes.NOT_FOUND));
    }

    res.json({
      success: true,
      message: "Person updated successfully",
      person: updatedPerson,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- DELETE ---------------------- */
export const deletePerson = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid person ID format", StatusCodes.BAD_REQUEST)
      );
    }

    const deleted = await Person.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return next(new ErrorResponse("Person not found", StatusCodes.NOT_FOUND));
    }

    // Remove person from all entities (optional - you might want to keep the references)
    await Entity.updateMany(
      { $or: [{ directors: req.params.id }, { cast: req.params.id }] },
      {
        $pull: {
          directors: req.params.id,
          cast: req.params.id,
        },
      }
    );

    res.json({
      success: true,
      message: "Person deleted successfully",
      deletedPerson: {
        id: deleted._id,
        name: deleted.name,
        roles: deleted.roles,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- STATISTICS ---------------------- */
export const getPersonStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse("Invalid person ID format", StatusCodes.BAD_REQUEST)
      );
    }

    const person = await Person.findById(id);
    if (!person) {
      return next(new ErrorResponse("Person not found", StatusCodes.NOT_FOUND));
    }

    // Get statistics
    const [directorStats, castStats] = await Promise.all([
      Entity.aggregate([
        { $match: { directors: person._id } },
        {
          $group: {
            _id: null,
            totalEntities: { $sum: 1 },
            avgRating: { $avg: "$rating" },
            genres: { $push: "$genres" },
          },
        },
      ]),
      Entity.aggregate([
        { $match: { cast: person._id } },
        {
          $group: {
            _id: null,
            totalEntities: { $sum: 1 },
            avgRating: { $avg: "$rating" },
            genres: { $push: "$genres" },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      person: {
        _id: person._id,
        name: person.name,
        roles: person.roles,
      },
      stats: {
        asDirector: directorStats[0] || {
          totalEntities: 0,
          avgRating: 0,
          genres: [],
        },
        asCast: castStats[0] || { totalEntities: 0, avgRating: 0, genres: [] },
      },
    });
  } catch (err) {
    next(err);
  }
};
