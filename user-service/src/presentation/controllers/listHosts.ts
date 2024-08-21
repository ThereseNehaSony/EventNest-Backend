import { NextFunction, Request, Response } from "express"
import { User } from "../../infrastructure/database/mongoDB/models/userModel"
import { HttpStatusCode } from "../../utils/statusCode/httpStatusCode"
export const listHostsController = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query?.page) || 1;
      const limit = Number(req.query?.limit) || 5;
      const skip = (page - 1) * limit;

      // Filter users with role 'host'
      const roleFilter = { role: 'host' };
      
      // Count only documents that match the role 'host'
      const totalDocuments = await User.countDocuments(roleFilter);
      console.log(totalDocuments, "documents....");

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
      console.log(data, "dataaaaa");

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