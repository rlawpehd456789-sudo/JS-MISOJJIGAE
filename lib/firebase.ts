import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDGdQiDM3ExFNVAxOMPi9-hrceYisrPvrg",
  authDomain: "miso-1ee7b.firebaseapp.com",
  projectId: "miso-1ee7b",
  storageBucket: "miso-1ee7b.firebasestorage.app",
  messagingSenderId: "465431937526",
  appId: "1:465431937526:web:441dfef452919dea8447d7",
  measurementId: "G-QXCHCBF35H",
};

// Firebase 앱 초기화 (중복 초기화 방지)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Firebase 서비스 초기화
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Analytics는 클라이언트 사이드에서만 초기화
export const analytics: Analytics | null = 
  typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;

