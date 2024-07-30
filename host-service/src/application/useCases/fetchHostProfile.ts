import { HostProfileRepository } from "../../infrastructure/database/mongoDB/repositories/fetchprofile";
import { IHostProfile } from "../../domain/entities/HostProfile";

export const fetchHostProfile = (hostProfileRepository: HostProfileRepository) => 
  async (hostId: string): Promise<IHostProfile> => {
    return hostProfileRepository.fetchHostProfile(hostId);
  };