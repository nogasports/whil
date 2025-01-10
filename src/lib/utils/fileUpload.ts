import { addDoc, collection } from 'firebase/firestore';
import { withFirestoreRetry } from './firestoreConnection';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB limit for Firestore documents

export async function uploadBase64File(base64Data: string, path: string): Promise<string> {
  try {
    // Remove the data URL prefix to get just the base64 string
    const base64Content = base64Data.split(',')[1];
    const mimeType = base64Data.split(';')[0].split(':')[1];
    
    // Check file size
    const contentSize = Math.ceil((base64Content.length * 3) / 4);
    if (contentSize > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 1MB limit');
    }
    
    // Create a document in the files collection with retry
    const fileDoc = await withFirestoreRetry(async (db) => {
      return await addDoc(collection(db, 'files'), {
        path,
        content: base64Content,
        type: mimeType,
        uploadedAt: new Date().toISOString()
      });
    });

    // Return a URL-like string that can be used to retrieve the file
    return `firestore://${fileDoc.id}`;
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Re-throw FirestoreConnectionError or other errors
    }
    throw new Error('Failed to upload file');
  }
}