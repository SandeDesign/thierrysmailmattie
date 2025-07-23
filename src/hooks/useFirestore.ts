import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export const useFirestore = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveData = async (collection: string, data: any) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, 'users', user.uid, collection, 'data');
      await setDoc(docRef, {
        ...data,
        lastUpdated: new Date()
      }, { merge: true });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (collection: string) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, 'users', user.uid, collection, 'data');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveAbonnement = async (collectionName: string, abonnement: any) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const colRef = collection(db, 'users', user.uid, collectionName);
      if (abonnement.id) {
        const docRef = doc(colRef, abonnement.id);
        await updateDoc(docRef, abonnement);
      } else {
        await addDoc(colRef, abonnement);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAbonnementen = async (collectionName: string) => {
    if (!user) return [];
    
    try {
      setLoading(true);
      const colRef = collection(db, 'users', user.uid, collectionName);
      const querySnapshot = await getDocs(colRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const deleteAbonnement = async (collectionName: string, id: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const docRef = doc(db, 'users', user.uid, collectionName, id);
      await deleteDoc(docRef);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveData,
    loadData,
    saveAbonnement,
    loadAbonnementen,
    deleteAbonnement
  };
};