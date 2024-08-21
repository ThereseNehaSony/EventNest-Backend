import { NextFunction, Request, Response } from "express"
import { User } from "../../infrastructure/database/mongoDB/models/userModel"
import { HttpStatusCode } from "../../utils/statusCode/httpStatusCode"

export const listUsersController = () => {
  return async(req: Request, res: Response, next: NextFunction) => {
    console.log("called users..........")
    try {
      const page = Number(req.query?.page) || 1;
      console.log(page,"page...")
      const limit = Number(req.query?.limit) || 5;
      console.log(limit,"limit");
      
      const skip = (page - 1) * limit;
      console.log(skip,"skip......");
      
      const users = await User.find({role:'user'}).skip(skip).limit(limit)
      console.log(users,"users.........")
      const totalDocuments = await User.countDocuments();
      console.log(totalDocuments,"docs.....");
      
      const totalPage = Math.ceil(totalDocuments/limit)
      console.log(totalPage,"totalpage....");
      
      const formattedUsers = users.map((user) => {
        // Format date using new Date and toLocaleDateString
        // const formattedDate = new Date(user.dateOfJoining).toLocaleDateString('en-US', {
        //   year: 'numeric',
        //   month: 'long',
        //   day: 'numeric',
        // });
      
        // Create a new object with desired fields and formatted date
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
        
          status: user.status
        };
      });
      console.log(formattedUsers,"formatted........")
      const data = {
        users: formattedUsers,
        totalPage,
      };
      console.log(data,"data...............")
      res.status(HttpStatusCode.OK).json({
        success: true,
        data,
        message: "users fetched!",
        })
    } catch (error) {
      next(error)
    }
  }
}