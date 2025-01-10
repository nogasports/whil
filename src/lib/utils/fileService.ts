import { doc, getDoc } from 'firebase/firestore';
import { withFirestoreRetry } from './firestoreConnection';

export async function getFileContent(url: string): Promise<string> {
  try {
    if (!url.startsWith('firestore://')) {
      return url; // Return as-is if it's an external URL
    }

    const fileId = url.replace('firestore://', '');
    const fileDoc = await withFirestoreRetry(async (db) => {
      return await getDoc(doc(db, 'files', fileId));
    });
    
    if (!fileDoc.exists()) {
      throw new Error('File not found');
    }

    const { content, type } = fileDoc.data();
    return `data:${type};base64,${content}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get file';
    throw new Error(`Error getting file: ${message}`);
  }
}