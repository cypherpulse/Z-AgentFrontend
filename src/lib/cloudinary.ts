/**
 * Cloudinary Upload Utility
 * Handles image and video uploads to Cloudinary
 */

// Get Cloudinary config from environment
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'raw';
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  url: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload file (image or video) to Cloudinary
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with Cloudinary response containing secure_url
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResponse> {
  // Validate Cloudinary configuration
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file');
  }

  // Validate file type
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  const isImage = validImageTypes.includes(file.type);
  const isVideo = validVideoTypes.includes(file.type);

  if (!isImage && !isVideo) {
    throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, OGG, MOV)');
  }

  // Check file size (max 10MB for images, 100MB for videos)
  const maxSize = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${isImage ? '10MB' : '100MB'} limit`);
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  // Determine resource type
  const resourceType = isVideo ? 'video' : 'image';

  // Upload to Cloudinary
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100)
        });
      }
    });

    // Handle successful upload
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error?.message || 'Upload failed'));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    // Handle upload error
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    // Handle upload abort
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    // Send request
    xhr.open('POST', cloudinaryUrl);
    xhr.send(formData);
  });
}

/**
 * Validate if a URL is a valid image/video URL
 */
export function isValidMediaUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.ogg', '.mov'];
    const hasValidExtension = validExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    );
    
    // Check if it's a Cloudinary URL or has valid extension
    return urlObj.hostname.includes('cloudinary.com') || hasValidExtension;
  } catch {
    return false;
  }
}

/**
 * Get file preview URL for display
 */
export function getFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
