export interface IHostProfile {
    id: string;
    username: string;
    email:string;
    phone:string;
    address:string;
    aadharNumber:string;
    bankaccountnumber:string
}

export interface IHostUpdateProfile {
    phone?: string;
    address?: string;
    aadharNumber?: string;
    bankAccountNumber?: string;
  }