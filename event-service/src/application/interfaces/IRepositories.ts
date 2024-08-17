import { EventEntity } from "../../domain/entities/eventEntity";

export interface IRepositories {
 
  getAllCategories: ({ page, limit }: any) => Promise<any | null>;
  addEvent :(data:EventEntity)=> Promise<EventEntity | null>
  getAllEvents:({page,limit}:any) =>Promise<any | null>
}