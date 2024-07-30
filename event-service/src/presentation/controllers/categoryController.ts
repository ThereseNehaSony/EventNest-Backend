import { Request, Response } from 'express';
import Category from '../../infrastructure/database/mongoDB/models/categories';
// import path from 'path';
// import multer from 'multer';

// // Configure multer for image uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/categories'); // Directory to save images
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });

export const getCategories = async (req: Request, res: Response) => {
    
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  console.log(req.body)
//   const image = req.file ? req.file.path : undefined;
// console.log(image,"img........")
  try {
    const category = await Category.findOne({name:name});
      if (category) {
        return res.status(404).json({ error: 'Category already exists' });
      }
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error });
  }
};

// Middleware for handling image uploads
// export const uploadCategoryImage = upload.single('image');


export const updateCategoryStatus = async (req: Request, res: Response) => {
    try {
      const { id, isBlocked } = req.body;
  console.log(req.body,"body.........");
  
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      category.isBlocked = isBlocked;
      await category.save();
  
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category status' });
    }
  };