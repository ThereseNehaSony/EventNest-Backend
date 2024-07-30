import { IDependencies } from "../../application/interfaces/IDependencies"
import { updateStatusController } from "./updateStatus"
import { listUsersController } from "./listUsers"
import {listHostsController} from './listHosts'
import { updateUserController } from "./updateUser"

export const controllers = (dependencies: IDependencies) => {
    return {
        
        updateStatus: updateStatusController(dependencies),
        listUsers: listUsersController(),
        listHosts: listHostsController(),
        updateUser: updateUserController(dependencies)
    }
  }