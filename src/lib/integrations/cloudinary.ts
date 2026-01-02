import { v2 as cloudinary } from "cloudinary";
import { hasEnv } from "@/lib/env";

export const isCloudinaryConfigured =
  hasEnv("CLOUDINARY_CLOUD_NAME") &&
  hasEnv("CLOUDINARY_API_KEY") &&
  hasEnv("CLOUDINARY_API_SECRET");

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadBuffer(buffer: Buffer, filename: string) {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary not configured");
  }

  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: filename,
        resource_type: "auto",
        folder: "alkaya",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}
