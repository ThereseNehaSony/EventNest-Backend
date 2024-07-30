import { User } from "../models/userModel"
import { publishUserBlockedEvent } from "../../../RabbitMQ/publisher";
export const updateStatus = async ({id, status}: any) => {
  try {
    const response = await User.findByIdAndUpdate(id, {status}, {new: true})
    console.log(response,"resssssssssss");
    publishUserBlockedEvent(id)
    console.log('calldddd')
    return response
  } catch (error:any) {
    throw new Error(error.message)
  }
}