import { UserEntity } from "../../domain/entities/userEntity";

export interface IRepositories {
  //updateStatus:({id, status}: any) => Promise<UserEntity | null>
  updateHost: (id: string, username: string) => Promise<UserEntity | null>;
}