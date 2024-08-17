import { EventEntity } from "../../../../domain/entities/eventEntity";
import { Event } from "../models/event";

export const addEvent = async (data:EventEntity)=>{
   try {
      console.log(data,"data from repositry")
      
      const event :EventEntity | null = await Event.create(data)
      return event as EventEntity

   } catch (error:any) {
     throw new Error(error?.message);
   }
   
}