import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { dependencies } from "../../config/dependencies";

// Define the interface for the expected request body
interface AddEventRequest extends Request {
    file?: Express.Multer.File; // For file uploads
}

export const addEventController = (dependencies: IDependencies) => {
    const { useCases: { addEventUseCase } } = dependencies;

    return async (req: AddEventRequest, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            console.log(data, "data from frontend...");
            console.log(req.body, "body.........");
            console.log('File:', req.file); // Check if the file is being received
            console.log('Body:', req.body);
            // Check if a file was uploaded
            let imagePath = '';
            if (req.file) {
                imagePath = req.file.path; // Save the path or URL of the uploaded image
                console.log(`Image uploaded: ${imagePath}`);
            }
   console.log(imagePath,"img...........");
   
            // Pass the image path with other event data
            const eventData = {
                ...data,
                image: imagePath, // Include the image path
            }; 
            console.log(eventData,"dtsssssssssssssssss");
            

            // Execute the use case with the updated event data
            const event = await addEventUseCase(dependencies).execute(eventData);

            res.status(200).json({
                success: true,
                event: event,
                message: "Event Added",
            });
        } catch (error: any) {
            next(error);
        }
    };
};

