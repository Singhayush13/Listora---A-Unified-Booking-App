const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("UPLOADING FILE:", file.originalname);

    return {
      folder: "listora-hotels",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],

      // ✅ clarity fixes
      format: "webp",
      quality: "auto",
      fetch_format: "auto",

      transformation: [
        {
          width: 1600,
          height: 1000,
          crop: "limit"
        }
      ]
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
