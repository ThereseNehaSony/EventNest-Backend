import { EventEntity } from "../../domain/entities/eventEntity";
import { IDependencies } from "../interfaces/IDependencies";

export const addEventUseCase = (dependencies:IDependencies) =>{
    const {repositories: {addEvent} } = dependencies

    return{
         execute: async (data:EventEntity)=>{
            try{
                return await addEvent(data)

                
            }catch(error:any){
              throw new Error(error?.message)
            }
         }
         
    }
}