import { Request, Response } from 'express';
import Category from '../../infrastructure/database/mongoDB/models/categories';
import { HttpStatusCode } from '../../utils/statusCodes/httpStatusCode';


export const getCategories = async (req: Request, res: Response) => {
    
  try {
    const categories = await Category.find();

    res.status(HttpStatusCode.OK).json(categories);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching categories', error });
  }
};
export const getActiveCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isBlocked: false });
    res.status(HttpStatusCode.OK).json(categories);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching categories', error });
  }
};


export const addCategory = async (req: Request, res: Response) => {
  console.log("category adding....");
  const { name } = req.body;
  console.log(req.body);

  try {
    const category = await Category.findOne({ name: name });
    if (category) {
      console.log("returning.........");
      return res.status(HttpStatusCode.CONFLICT).json({ error: 'Category already exists' });
    }
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(HttpStatusCode.CREATED).json(newCategory);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error adding category', error });
  }
};

export const updateCategoryStatus = async (req: Request, res: Response) => {
  try {
    const { id, isBlocked } = req.body;
    console.log(req.body, "body.........");

    const category = await Category.findById(id);
    if (!category) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Category not found' });
    }

    category.isBlocked = isBlocked;
    await category.save();

    res.status(HttpStatusCode.OK).json(category);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update category status' });
  }
};