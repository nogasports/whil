import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to login');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to logout');
    }
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update profile');
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!auth.currentUser) return;
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to change password');
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    updateUserProfile,
    changePassword
  };
}