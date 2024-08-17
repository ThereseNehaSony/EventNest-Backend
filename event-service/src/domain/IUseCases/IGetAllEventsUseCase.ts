export interface IGetAllEventsUseCase {
    execute({page, limit}: any): Promise<any | null>
  }