import { Request, Response, NextFunction } from 'express';
import { Host } from '../../infrastructure/database/mongoDB/models/hostModel'; 
import { publishToQueue } from '../../infrastructure/RabbitMQ/publisher';
import { HttpStatusCode } from '../../utils/statusCode/httpStatusCode';

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export const getUserDetails = async (req: CustomRequest, res: Response) => {
  try {
    console.log("reached details, host service");
    
    const userId = req.user?.id;
    console.log(userId, "id......");

    if (!userId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'User ID is missing in the request' });
    }

    const user = await Host.findById(userId);
    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User not found' });
    }

    res.status(HttpStatusCode.OK).json({ userDetails: user });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server Error', error });
  }
};

export const getHostDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const host = await Host.findById(id);

    if (!host) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: 'Host not found',
      });
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      data: host,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHostStatus = async (req: Request, res: Response) => {
  try {
    const { newStatus, hostId } = req.body;

    const host = await Host.findByIdAndUpdate(
      hostId,
      { status: newStatus },
      { new: true }
    );

    console.log(host, "host..");
    console.log("verified");

    if (!host) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Host not found' });
    }

    const message = JSON.stringify({
      userId: host._id, 
      status: newStatus,
    });

    // Publish
    await publishToQueue('hostStatusExchange', message);
    res.status(HttpStatusCode.OK).json(host);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error updating host status', error });
  }
};
