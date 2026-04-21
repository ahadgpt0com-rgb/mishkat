
import { db, auth } from '../src/firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const adminApi = {
    login: async (credentials: any) => {
        try {
            // Map admin/admin123 to a dummy Firebase email wrapper if it's the default credentials
            const email = credentials.username.includes('@') ? credentials.username : `${credentials.username}@wedding.com`;
            const userCredential = await signInWithEmailAndPassword(auth, email, credentials.password);
            
            // Return a dummy token for local storage compatibility
            return { token: userCredential.user.uid };
        } catch (error: any) {
            console.error("Login API error:", error);
            throw new Error(error.message || "Invalid credentials");
        }
    },

    getStats: async () => {
        try {
            const rsvps = await adminApi.getRSVPs();
            const messages = await adminApi.getMessages();
            return {
                totalRSVPs: rsvps.length,
                pendingRSVPs: 0, // Not tracked in local either
                totalMessages: messages.length,
                newMessages: messages.length,
                totalPhotos: 0
            };
        } catch (e) {
            console.error("Get Stats error:", e);
            throw e;
        }
    },

    getRSVPs: async () => {
        try {
            const snapshot = await getDocs(collection(db, 'rsvps'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Get RSVPs error:", error);
            throw error;
        }
    },

    deleteRSVP: async (id: string) => {
        try {
            await deleteDoc(doc(db, 'rsvps', id));
            return { success: true };
        } catch (error) {
            console.error("Delete RSVP error:", error);
            throw error;
        }
    },

    getMessages: async () => {
        try {
            const snapshot = await getDocs(collection(db, 'messages'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Get messages error:", error);
            throw error;
        }
    },

    getConfig: async () => {
        const docRef = doc(db, 'config', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    },

    saveConfig: async (config: any) => {
        try {
            await setDoc(doc(db, 'config', 'main'), config);
            return { success: true };
        } catch (error) {
            console.error("Save config error:", error);
            throw error;
        }
    },

    // Handling Media by saving Base64 to Firestore (Compresed strictly before upload)
    getMedia: async () => {
        try {
            const snapshot = await getDocs(collection(db, 'media'));
            return snapshot.docs.map(doc => ({
                name: doc.id,
                url: doc.data().url,
                type: doc.data().type,
                size: doc.data().size,
                createdAt: doc.data().createdAt
            }));
        } catch (error) {
            console.error("Get Media error:", error);
            throw error;
        }
    },

    deleteMedia: async (filename: string) => {
        try {
            await deleteDoc(doc(db, 'media', filename));
            return { success: true };
        } catch (error) {
            console.error("Delete Media error:", error);
            throw error;
        }
    },

    uploadFile: async (file: File, onProgress?: (p: number) => void) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (file.type.includes('video')) {
                    throw new Error("ভিডিও আপলোড বর্তমানে সমর্থিত নয়। শুধু ছবি আপলোড করুন।");
                }
                
                // Compress Image
                const compressedDataUrl = await compressImage(file);
                
                // Save to Firestore for media library
                const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
                
                if (onProgress) onProgress(50);

                await setDoc(doc(db, 'media', filename), {
                    url: compressedDataUrl,
                    type: 'image',
                    size: compressedDataUrl.length,
                    createdAt: Date.now()
                });
                
                if (onProgress) onProgress(100);
                resolve({ success: true, imageUrl: compressedDataUrl });
            } catch (error: any) {
                reject(new Error(error.message || "Failed to upload image"));
            }
        });
    }
};

// Helper to compress image to base64
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.onload = (event) => {
            const img = new Image();
            img.onerror = () => reject(new Error("Invalid image file format"));
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                // Max dimensions to fit in 1MB Firestore limit aggressively
                const MAX_WIDTH = 600;
                const MAX_HEIGHT = 600;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = Math.max(1, Math.floor(width));
                canvas.height = Math.max(1, Math.floor(height));
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error("Canvas context is not supported"));
                }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Heavily compress JPEG
                const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
                resolve(dataUrl);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};
