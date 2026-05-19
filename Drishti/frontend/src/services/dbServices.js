import { collection, addDoc, getDocs, doc, setDoc, query, orderBy, limit, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db, auth } from '../firebase';
// Note: Requires firebase/storage to be initialized if we were doing actual avatar uploads, but for now we'll mock the storage URL return to keep it simple.

// Add a new health log based on old Mongoose schema
export const addHealthLog = async (metrics, status, session) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to save health logs");

    const logsRef = collection(db, 'users', user.uid, 'healthLogs');
    const newLog = {
      metrics: {
        blinkRate: metrics.blinkRate || 0,
        distance: metrics.distance || 0,
        distanceFactor: metrics.distanceFactor || 0,
        screenTime: metrics.screenTime || 0,
      },
      status: {
        isFatigued: status.isFatigued || false,
        needsBreak: status.needsBreak || false,
        skipCount: status.skipCount || 0,
      },
      session: {
        startTime: session.startTime || new Date(),
        lastBreak: session.lastBreak || new Date(),
      },
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(logsRef, newLog);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding health log: ", error);
    return { success: false, error: error.message };
  }
};

// Get recent health logs (One-time fetch)
export const getHealthLogs = async (limitCount = 50) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to get health logs");

    const logsRef = collection(db, 'users', user.uid, 'healthLogs');
    const q = query(logsRef, orderBy('createdAt', 'desc'), limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    
    return { success: true, logs };
  } catch (error) {
    console.error("Error fetching health logs: ", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to recent health logs (Real-time listener)
export const subscribeToHealthLogs = (callback, limitCount = 50) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const logsRef = collection(db, 'users', user.uid, 'healthLogs');
  const q = query(logsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  
  return onSnapshot(q, (querySnapshot) => {
    const logs = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(logs);
  });
};

// Update Clinical Profile
export const updateClinicalProfile = async (profileData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to update clinical profile");

    const profileRef = doc(db, 'users', user.uid, 'clinicalProfile', 'latest');
    
    // In a real scenario, handle Avatar file upload to Firebase Storage here and get download URL
    let avatarUrl = profileData.avatarPreview || null;
    if (profileData.avatarFile) {
       // Mocking the Storage upload
       avatarUrl = URL.createObjectURL(profileData.avatarFile); 
    }
    
    const dataToSave = {
      name: profileData.name,
      age: profileData.age,
      occupation: profileData.occupation,
      avatarUrl: avatarUrl,
      updatedAt: serverTimestamp()
    };

    await setDoc(profileRef, dataToSave, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating clinical profile: ", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to Clinical Profile
export const subscribeToClinicalProfile = (callback) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const profileRef = doc(db, 'users', user.uid, 'clinicalProfile', 'latest');
  return onSnapshot(profileRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
};

// Update live metrics (throttle appropriately in the component)
export const updateLiveMetrics = async (metrics, status, session) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const liveRef = doc(db, 'users', user.uid, 'liveMetrics', 'current');
    await setDoc(liveRef, { metrics, status, session, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("Error updating live metrics: ", error);
  }
};

// Subscribe to live metrics
export const subscribeToLiveMetrics = (callback) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const liveRef = doc(db, 'users', user.uid, 'liveMetrics', 'current');
  return onSnapshot(liveRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
};
