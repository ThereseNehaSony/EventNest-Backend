import { IDependencies } from "../../application/interfaces/IDependencies"
import { updateHostController } from "./UpdateHost"

export const controllers = (dependencies: IDependencies) => {
    return {
        
        updateHost: updateHostController(dependencies)
    }
  }