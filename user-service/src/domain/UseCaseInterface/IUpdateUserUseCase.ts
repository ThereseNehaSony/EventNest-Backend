import { UserEntity } from "../entities/userEntity";

export interface IUpdateUserUseCase {
  execute(id: string, username: string): Promise<UserEntity | null>
}