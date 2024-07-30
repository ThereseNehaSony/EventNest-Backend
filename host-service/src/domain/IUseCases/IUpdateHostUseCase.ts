import { UserEntity } from "../entities/userEntity";

export interface IUpdateHostUseCase {
  execute(id: string, username: string): Promise<UserEntity | null>
}