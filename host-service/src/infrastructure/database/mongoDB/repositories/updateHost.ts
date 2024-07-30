import { UserEntity } from "../../../../domain/entities/userEntity"
import { Host } from "../models/hostModel"

export const updateHost = async(id: string, phone: string ) => {
  try {
    console.log(phone);
    console.log('reached.......')
    
    const response = await Host.findByIdAndUpdate(id, { phone: phone },{ new: true } )
    console.log("🚀 ~ file: updateUser.ts:7 ~ updateUser ~ response:", response)
    
    return response as UserEntity;    
  } catch (error: any) {
    throw new Error(error.message)
  }

}