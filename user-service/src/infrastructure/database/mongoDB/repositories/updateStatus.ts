import { User } from "../models/userModel"
import { publishUserBlockedEvent } from "../../../RabbitMQ/publisher";
export const updateStatus = async ({ id, status }: { id: string, status: string }) => {
  try {
    console.log(status, "status......");

    // Update user status in the database
    const response = await User.findByIdAndUpdate(id, { status }, { new: true });
    console.log(response, "resssssssssss");

    // Determine the operation type based on the status
    const operation = status === 'blocked' ? 'block' : 'unblock';

    // Publish the event to RabbitMQ
    await publishUserBlockedEvent(id, operation);
    console.log('Published event to RabbitMQ');

    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};