
/**
 * API Service for backend communication
 */

export interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  message?: string;
}

/**
 * Upload an image to the backend server with progress tracking.
 * Uses absolute URL to bypass proxy issues.
 */
export const uploadImage = (
  file: File,
  onProgress: (percent: number) => void
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('image', file);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error("সার্ভার থেকে সঠিক রেসপন্স পাওয়া যায়নি।"));
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          reject(new Error(response.message || "আপলোড ব্যর্থ হয়েছে।"));
        } catch (e) {
          reject(new Error(`সার্ভার এরর: ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error("নেটওয়ার্ক এরর! অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চালু আছে।"));
    });

    // Use relative URL
    xhr.open('POST', '/api/upload');
    
    // Add Authorization header for the backend verifyToken middleware
    const token = localStorage.getItem('admin_token');
    if (token) {
      xhr.setRequestHeader('Authorization', token);
    }
    
    xhr.send(formData);
  });
};
