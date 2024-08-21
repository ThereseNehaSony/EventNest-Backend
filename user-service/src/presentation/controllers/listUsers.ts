import { NextFunction, Request, Response } from "express"
import { User } from "../../infrastructure/database/mongoDB/models/userModel"
import { HttpStatusCode } from "../../utils/statusCode/httpStatusCode"

export const listUsersController = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("called users..........");
    try {
      const page = Number(req.query?.page) || 1;
      const limit = Number(req.query?.limit) || 5;
      const skip = (page - 1) * limit;
      const roleFilter = { role: 'user' };
      const totalDocuments = await User.countDocuments(roleFilter);
      const users = await User.find(roleFilter).skip(skip).limit(limit);
      const totalPage = Math.ceil(totalDocuments / limit);
    
      const formattedUsers = users.map((user) => {
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          status: user.status,
        };
      });
  
      const data = {
        users: formattedUsers,
        totalPage,
      };
    

      res.status(HttpStatusCode.OK).json({
        success: true,
        data,
        message: "users fetched!",
      });
    } catch (error) {
      next(error);
    }
  };
};