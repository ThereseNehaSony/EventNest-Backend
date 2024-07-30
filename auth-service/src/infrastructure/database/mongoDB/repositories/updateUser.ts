import { UserEntity } from "../../../../domain/entities"
import { User } from "../models/loginCredentials"

export const updateUser = async(id: string, phone: string ) => {
  try {
    console.log(phone);
    console.log('reacged.......')
    
    const response = await User.findByIdAndUpdate(id, { phone: phone },{ new: true } )
    console.log("🚀 ~ file: updateUser.ts:7 ~ updateUser ~ response:", response)
    
    return response as UserEntity;    
  } catch (error: any) {
    throw new Error(error.message)
  }

}