import { HttpStatusCode } from "../statusCodes/httpStatusCode";

export const success = (message:string, data :any,statusCode:HttpStatusCode = HttpStatusCode.OK) => {
  return {
    success:true,
    message,
    data,
    code:statusCode
  };
};

export const error = (message:string,statusCode:HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR ,errors: any = null) =>{
    return{
        success: false,
        message,
        code: statusCode,
        errors
    }
}