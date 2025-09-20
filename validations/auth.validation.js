import Joi from "joi";

const signupValidation = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
const signinValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export default { signupValidation, signinValidation };
