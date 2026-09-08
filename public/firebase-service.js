// Firebase Client Initialization
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

let firebaseApp = null;
let auth = null;
let db = null;
let config = null;

export const ADMIN_EMAIL = 'devarajanpm79@gmail.com';

const FALLBACK_CONFIG = {
  projectId: "gen-lang-client-0766099170",
  appId: "1:1085534225523:web:6f1efe4873636aa16e1606",
  apiKey: "AIzaSyAVi3fWqXUGdAGvM-h6Mnqr11pfYDJRz9c",
  authDomain: "gen-lang-client-0766099170.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-strategysimplero-10f34428-0730-4269-8371-5624243e66d2",
  storageBucket: "gen-lang-client-0766099170.firebasestorage.app",
  messagingSenderId: "1085534225523",
  measurementId: "",
  oAuthClientId: "1085534225523-3icapaa74998lhme7fk5j9v9jr187c8a.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

export async function initFirebase() {
  if (firebaseApp && auth && db) return { app: firebaseApp, auth, db };
  
  try {
    try {
      const res = await fetch('/firebase-applet-config.json');
      if (res.ok) {
        config = await res.json();
      } else {
        config = FALLBACK_CONFIG;
      }
    } catch {
      config = FALLBACK_CONFIG;
    }
    
    if (!config || !config.apiKey) {
      config = FALLBACK_CONFIG;
    }
    
    firebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();
    auth = getAuth(firebaseApp);
    
    // Pass firestoreDatabaseId if custom database is defined in config
    if (config.firestoreDatabaseId) {
      db = getFirestore(firebaseApp, config.firestoreDatabaseId);
    } else {
      db = getFirestore(firebaseApp);
    }
    
    return { app: firebaseApp, auth, db };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    throw err;
  }
}

export function getFirebaseAuth() {
  return auth;
}

export function getFirebaseDb() {
  return db;
}

/**
 * Ensures a user record exists in Firestore upon sign in.
 * If user email matches ADMIN_EMAIL, automatically marks role as admin and status as approved.
 */
export async function syncUserProfile(user) {
  if (!user || !db) return null;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  
  const isSuperAdmin = (user.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
  
  if (!snap.exists()) {
    const newProfile = {
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Trader',
      photoURL: user.photoURL || '',
      role: isSuperAdmin ? 'admin' : 'member',
      status: isSuperAdmin ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedAt: isSuperAdmin ? new Date().toISOString() : null,
      approvedBy: isSuperAdmin ? 'system_superadmin' : null,
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    const currentData = snap.data();
    // If super admin email but not admin role, elevate
    if (isSuperAdmin && (currentData.role !== 'admin' || currentData.status !== 'approved')) {
      const updates = {
        role: 'admin',
        status: 'approved',
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(userRef, updates);
      return { ...currentData, ...updates };
    }
    return currentData;
  }
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle() {
  if (!auth) await initFirebase();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const profile = await syncUserProfile(result.user);
  return { user: result.user, profile };
}

/**
 * Sign in with Email & Password
 */
export async function loginWithEmail(email, password) {
  if (!auth) await initFirebase();
  const result = await signInWithEmailAndPassword(auth, email, password);
  const profile = await syncUserProfile(result.user);
  return { user: result.user, profile };
}

/**
 * Register with Email & Password
 */
export async function registerWithEmail(email, password, displayName = '') {
  if (!auth) await initFirebase();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && result.user) {
    try {
      await updateProfile(result.user, { displayName });
    } catch (e) {
      console.warn('Could not update profile displayName:', e);
    }
  }
  const profile = await syncUserProfile(result.user);
  return { user: result.user, profile };
}

/**
 * Sign Out
 */
export async function logout() {
  if (!auth) await initFirebase();
  return signOut(auth);
}

/**
 * Listen to real-time auth and user profile changes
 */
export function onAuthStatusChanged(callback) {
  let unsubDoc = null;
  return onAuthStateChanged(auth, async (user) => {
    if (unsubDoc) {
      unsubDoc();
      unsubDoc = null;
    }
    
    if (!user) {
      callback({ user: null, profile: null, loading: false });
      return;
    }
    
    const isSuperAdmin = (user.email || '').trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();

    // Immediately emit for super admin so no approval screen ever shows up
    if (isSuperAdmin) {
      callback({
        user,
        profile: {
          email: user.email,
          displayName: user.displayName || 'Administrator',
          photoURL: user.photoURL || '',
          role: 'admin',
          status: 'approved',
          approvedBy: 'system_superadmin'
        },
        loading: false
      });
    }
    
    // Initial fetch and subscribe to user's profile document for instant status changes
    try {
      await syncUserProfile(user);
      const userRef = doc(db, 'users', user.uid);
      unsubDoc = onSnapshot(userRef, (docSnap) => {
        let profile = docSnap.exists() ? docSnap.data() : null;
        if (isSuperAdmin && profile) {
          profile.role = 'admin';
          profile.status = 'approved';
        }
        callback({ user, profile, loading: false });
      }, (err) => {
        console.error('User doc snapshot error:', err);
        callback({
          user,
          profile: isSuperAdmin ? { email: user.email, role: 'admin', status: 'approved' } : null,
          loading: false,
          error: err
        });
      });
    } catch (err) {
      console.error('Auth state profile sync error:', err);
      callback({
        user,
        profile: isSuperAdmin ? { email: user.email, role: 'admin', status: 'approved' } : null,
        loading: false,
        error: err
      });
    }
  });
}

/**
 * Admin: Listen to all user records in real-time
 */
export function subscribeToAllUsers(callback) {
  if (!db) return () => {};
  const usersRef = collection(db, 'users');
  return onSnapshot(usersRef, (snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    callback(users);
  }, (err) => {
    console.error('Error fetching all users for admin:', err);
  });
}

/**
 * Admin: Approve a user
 */
export async function approveUser(userId, adminEmail) {
  if (!db) return;
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, {
    status: 'approved',
    approvedAt: new Date().toISOString(),
    approvedBy: adminEmail || ADMIN_EMAIL,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Admin: Reject / Revoke a user
 */
export async function rejectUser(userId, adminEmail) {
  if (!db) return;
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, {
    status: 'rejected',
    approvedAt: null,
    approvedBy: adminEmail || ADMIN_EMAIL,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Admin: Toggle user role (admin <-> member)
 */
export async function setUserRole(userId, newRole) {
  if (!db) return;
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, {
    role: newRole,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Admin: Delete user profile
 */
export async function deleteUserProfile(userId) {
  if (!db) return;
  const userRef = doc(db, 'users', userId);
  return deleteDoc(userRef);
}


