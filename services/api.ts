
import { db } from '../src/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

/**
 * Public API Service for backend communication
 */

export interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  message?: string;
}

export const publicApi = {
    getConfig: async () => {
        try {
            const docRef = doc(db, 'config', 'main');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            // Fallback default config if not initialized
            return {
                hero: { groomName: "Groom", brideName: "Bride", date: "Date" },
                pinCode: "0000"
            };
        } catch (error) {
            console.error("Error getting config", error);
            throw error;
        }
    },
    
    submitRSVP: async (data: any) => {
        try {
            await addDoc(collection(db, 'rsvps'), {
                ...data,
                createdAt: Date.now()
            });
            return { success: true };
        } catch (error) {
            console.error("Error submitting RSVP", error);
            throw error;
        }
    },
    
    submitMessage: async (data: any) => {
        try {
            await addDoc(collection(db, 'messages'), {
                ...data,
                createdAt: Date.now()
            });
            return { success: true };
        } catch (error) {
            console.error("Error submitting Message", error);
            throw error;
        }
    }
};

// Also rewrite uploadImage to use the same logic if needed publicly
export const uploadImage = (
  file: File,
  onProgress: (percent: number) => void
): Promise<UploadResponse> => {
  return new Promise(async (resolve, reject) => {
        // This is only used in Admin, we can reuse the logic
        const { adminApi } = await import('./adminApi');
        try {
            const res = await adminApi.uploadFile(file, onProgress);
            resolve(res as UploadResponse);
        } catch(e) {
            reject(e);
        }
  });
};
