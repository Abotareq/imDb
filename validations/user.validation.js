import Joi from "joi";

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  avatar: Joi.string().uri(),
  bio: Joi.string().max(300),
}).min(1);

const adminUpdateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  avatar: Joi.string().uri(),
  bio: Joi.string().max(300),
  role: Joi.string().valid("user", "admin"),
  verified: Joi.boolean(),
}).min(1);
export default { updateUserSchema, adminUpdateUserSchema };
