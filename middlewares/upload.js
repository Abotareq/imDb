// middlewares/upload.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME||"drdoijiks",
  api_key: process.env.CLOUDINARY_API_KEY||"386223518522129",
  api_secret: process.env.CLOUDINARY_API_SECRET||"pnWiqn466yNw-IMBAht-_zefHU8",
});

const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("📁 File received:", file.fieldname, file.originalname); // DEBUG

    if (!allowedFormats.includes(file.mimetype)) {
      throw new Error(
        "Invalid file type. Only JPG, PNG, and WEBP images are allowed."
      );
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
    console.log("🔍 Filtering file:", file.fieldname); // DEBUG

    if (!allowedFormats.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export default upload;
