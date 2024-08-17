
import  Category  from "../models/categories"

export const getAllCategories = async ({page, limit}: any) => {
  console.log("🚀 ~ file: getAllCategories.ts:4 ~ getAllCategories ~ page:", page)
  try {
    const skip = (page - 1) * limit;
    const categories = await Category.find().skip(skip).limit(limit)
    const totalDocuments = await Category.countDocuments();
    console.log("🚀 ~ file: getAllCategories.ts:9 ~ getAllCategories ~ totalDocuments:", totalDocuments)
    const totalPage = Math.ceil(totalDocuments/limit)
    const data = {
      categories,
      totalPage,
      currentPage: page,
    }
    return data
  } catch (error:any) {
    throw new Error(error.message)
  }
}