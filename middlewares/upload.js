import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!allowedFormats.includes(file.mimetype)) {
      throw new Error("Invalid file type. Only JPG, PNG, and WEBP images are allowed.");
    }
    return {
      folder: "imdb_clone", 
      format: file.mimetype.split("/")[1],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedFormats.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export default upload;
