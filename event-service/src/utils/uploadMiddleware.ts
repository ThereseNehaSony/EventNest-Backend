import multer from 'multer';
import path from 'path';

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Corrected path to be relative to your project directory
    cb(null, path.join(__dirname, '../uploads')); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Rename file to include timestamp
  },
});

// Create multer instance
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
   console.log("multer..........................")
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Set a limit for file size (e.g., 5MB)
});

export default upload;
