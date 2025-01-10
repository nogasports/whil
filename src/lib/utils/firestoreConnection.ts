import { Firestore } from 'firebase/firestore';
import { db } from '../firebase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export class FirestoreConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirestoreConnectionError';
  }
}

export async function withFirestoreRetry<T>(
  operation: (db: Firestore) => Promise<T>
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation(db);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < MAX_RETRIES) {
        console.warn(`Firestore operation failed (attempt ${attempt}/${MAX_RETRIES}). Retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  }
  
  throw new FirestoreConnectionError(
    `Failed to connect to Firestore after ${MAX_RETRIES} attempts. Last error: ${lastError.message}`
  );
}