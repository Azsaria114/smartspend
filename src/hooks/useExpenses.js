import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function useExpenses(userId) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const expensesRef = collection(db, 'expenses');
    
    // Try with orderBy, fallback to just where if index doesn't exist
    let q;
    try {
      q = query(
        expensesRef, 
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
    } catch (error) {
      // If index doesn't exist, just query by userId
      console.warn('Index may not exist, using simpler query:', error);
      q = query(
        expensesRef, 
        where('userId', '==', userId)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => {
        const data = doc.data();
        // Handle date conversion - support both Timestamp and string dates
        let dateValue;
        if (data.date?.toDate) {
          // Firestore Timestamp
          dateValue = data.date.toDate();
        } else if (data.date?.seconds) {
          // Firestore Timestamp (alternative format)
          dateValue = new Date(data.date.seconds * 1000);
        } else if (data.date) {
          // String or Date object
          dateValue = new Date(data.date);
        } else {
          dateValue = new Date();
        }
        
        return {
          id: doc.id,
          ...data,
          date: dateValue,
          amount: Number(data.amount) || 0
        };
      });
      
      // Sort by date descending if we couldn't use orderBy
      if (!q._delegate?._query?.explicitOrderBy?.length) {
        expensesData.sort((a, b) => b.date - a.date);
      }
      
      setExpenses(expensesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching expenses:', error);
      // If index error, try simpler query
      if (error.code === 'failed-precondition') {
        console.warn('Index not found. Please create a composite index in Firebase Console.');
        const simpleQuery = query(
          expensesRef,
          where('userId', '==', userId)
        );
        onSnapshot(simpleQuery, (snapshot) => {
          const expensesData = snapshot.docs.map(doc => {
            const data = doc.data();
            let dateValue;
            if (data.date?.toDate) {
              dateValue = data.date.toDate();
            } else if (data.date?.seconds) {
              dateValue = new Date(data.date.seconds * 1000);
            } else if (data.date) {
              dateValue = new Date(data.date);
            } else {
              dateValue = new Date();
            }
            
            return {
              id: doc.id,
              ...data,
              date: dateValue,
              amount: Number(data.amount) || 0
            };
          });
          expensesData.sort((a, b) => b.date - a.date);
          setExpenses(expensesData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const addExpense = async (expenseData) => {
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Convert date string to Firestore Timestamp
      let dateValue;
      if (expenseData.date) {
        if (typeof expenseData.date === 'string') {
          // If it's a date string (YYYY-MM-DD), convert to Date then Timestamp
          dateValue = Timestamp.fromDate(new Date(expenseData.date));
        } else if (expenseData.date instanceof Date) {
          dateValue = Timestamp.fromDate(expenseData.date);
        } else if (expenseData.date.toDate) {
          // Already a Timestamp
          dateValue = expenseData.date;
        } else {
          dateValue = Timestamp.now();
        }
      } else {
        dateValue = Timestamp.now();
      }
      
      const expenseDoc = {
        description: expenseData.description || '',
        amount: Number(expenseData.amount) || 0,
        category: expenseData.category || 'Other',
        userId: userId,
        date: dateValue,
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'expenses'), expenseDoc);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const expenseRef = doc(db, 'expenses', expenseId);
      
      // Convert date string to Firestore Timestamp
      let dateValue;
      if (expenseData.date) {
        if (typeof expenseData.date === 'string') {
          dateValue = Timestamp.fromDate(new Date(expenseData.date));
        } else if (expenseData.date instanceof Date) {
          dateValue = Timestamp.fromDate(expenseData.date);
        } else if (expenseData.date.toDate) {
          dateValue = expenseData.date;
        } else {
          dateValue = Timestamp.now();
        }
      } else {
        dateValue = Timestamp.now();
      }
      
      const updateDocData = {
        description: expenseData.description || '',
        amount: Number(expenseData.amount) || 0,
        category: expenseData.category || 'Other',
        date: dateValue,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(expenseRef, updateDocData);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense
  };
}

