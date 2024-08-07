export interface IGetAllCategoriesUseCase {
    execute({page, limit}: any): Promise<any | null>
  }