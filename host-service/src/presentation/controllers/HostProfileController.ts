// // src/presentation/controllers/HostProfileController.ts
// import { Request, Response,NextFunction } from "express";
// import { fetchHostProfile } from "../../application/useCases/fetchHostProfile";
// import { updateHostProfile } from "../../application/useCases/updateHostProfile";
// import { HostProfileRepository } from "../../infrastructure/database/mongoDB/repositories/fetchprofile";
// import { isNamedExportBindings } from "typescript";

// export const createHostProfileController = (hostProfileRepository: HostProfileRepository) => ({
//   getProfile: async (req: Request, res: Response, next:NextFunction) => {
//     try {
//       const hostId = req.params.hostId;
//       const profile = await fetchHostProfile(hostProfileRepository)(hostId);
//       res.json(profile);
//     } catch (error) {
//       next(error)
//     }
//   },

//   updateProfile: async (req: Request, res: Response, next:NextFunction) => {
//     try {
//       const hostId = req.params.hostId;
//       const profileDetails = req.body;
//       const profile = await updateHostProfile(hostProfileRepository)(hostId, profileDetails);
//       res.json(profile);
//     } catch (error) {
//         next(error)
//     }
//   }
// });
