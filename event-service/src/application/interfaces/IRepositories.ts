//import { MovieEntity } from "../../domain/entities/movieEntity";

export interface IRepositories {
 
  getAllCategories: ({ page, limit }: any) => Promise<any | null>;
  
}