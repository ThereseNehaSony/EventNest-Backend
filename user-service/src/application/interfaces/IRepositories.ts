import { UserEntity } from "../../domain/entities/userEntity";

export interface IRepositories {
  updateStatus:({id, status}: any) => Promise<UserEntity | null>
  updateUser: (id: string, username: string) => Promise<UserEntity | null>;
}