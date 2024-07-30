// src/domain/repositories/HostProfileRepository.ts
import { IHostProfile, IHostUpdateProfile } from "../../../../domain/entities/HostProfile";
import { Host } from "../models/hostModel";
export interface HostProfileRepository {
  fetchHostProfile: (hostId: string) => Promise<IHostProfile>;
  updateHostProfile: (hostId: string, profileDetails: IHostUpdateProfile) => Promise<IHostProfile>;
}

export const createHostProfileRepository = (dataSource: any): HostProfileRepository => ({
  fetchHostProfile: async (hostId: string) => {
    const hostProfile = await Host.findById(hostId)
    if(!hostProfile){
        throw new Error("not found")
    }
    return dataSource.fetchHostProfileById(hostId);
  },
  updateHostProfile: async (hostId: string, profileDetails: IHostUpdateProfile) => {
    const updatedProfile = await Host.findByIdAndUpdate(hostId, profileDetails, { new: true });
    if (!updatedProfile) {
      throw new Error(`Failed to update host profile with ID ${hostId}`);
    }
    return dataSource.updateHostProfileById(hostId, profileDetails);
  }
});
