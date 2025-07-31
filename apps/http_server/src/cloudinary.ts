import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from "@repo/backend-common/config";
import {v2 as cloudinary} from "cloudinary"
import * as fs from 'fs'
cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_API_KEY, 
    api_secret: CLOUD_API_SECRET 
});
export const uploadCouldinary=async(localfilepath:any)=>{
    try {
        if(!localfilepath) {
            throw new Error("No file path provided");
        }
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"   });
        console.log("File uploaded successfully:", response);
        return response;
    } catch (error) {
        fs.unlinkSync(localfilepath); 
        return null 
    }
}