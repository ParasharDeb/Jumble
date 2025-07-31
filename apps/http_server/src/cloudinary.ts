import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from "./config";
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

        // Check if file exists
        if (!fs.existsSync(localfilepath)) {
            throw new Error(`File does not exist at path: ${localfilepath}`);
        }

        // Check if Cloudinary credentials are configured
        if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
            throw new Error("Cloudinary credentials not properly configured");
        }

        console.log("Uploading to Cloudinary with config:", {
            cloud_name: CLOUD_NAME,
            api_key: CLOUD_API_KEY ? "***" : "missing",
            api_secret: CLOUD_API_SECRET ? "***" : "missing"
        });

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        });
        
        console.log("File uploaded successfully:", response);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        
        // Clean up local file if it exists
        if (localfilepath && fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath); 
        }
        
        return null 
    }
}