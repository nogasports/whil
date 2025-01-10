import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { withFirestoreRetry } from '../utils/firestoreConnection';

interface UseFirestoreOptions {
  collection: string;
  queries?: QueryConstraint[];
}

export function useFirestore<T = DocumentData>({ collection: collectionName, queries = [] }: UseFirestoreOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await withFirestoreRetry(async (db) => {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...queries);
        return await getDocs(q);
      });
      
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      setData(documents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const addDocument = async (data: Omit<T, 'id'>) => {
    try {
      const docRef = await withFirestoreRetry(async (db) => {
        const collectionRef = collection(db, collectionName);
        return await addDoc(collectionRef, data);
      });
      return docRef.id;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add document');
    }
  };

  const updateDocument = async (id: string, data: Partial<T>) => {
    try {
      await withFirestoreRetry(async (db) => {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data as DocumentData);
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update document');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await withFirestoreRetry(async (db) => {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete document');
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName, JSON.stringify(queries)]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    add: addDocument,
    update: updateDocument,
    remove: deleteDocument
  };
}