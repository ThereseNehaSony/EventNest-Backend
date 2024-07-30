import { IUserEntity } from "../entities/userEntities";

export interface IListUsersUseCase {
    execute(): Promise<IUserEntity[]>;
  }