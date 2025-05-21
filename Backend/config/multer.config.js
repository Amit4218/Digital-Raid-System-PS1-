// multerConfig.js
import multer from "multer";
import path from "path";

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where uploaded files will be stored
    // Ensure this directory exists (you might create it on server startup)
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

export default upload;
