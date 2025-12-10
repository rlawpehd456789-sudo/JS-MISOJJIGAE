import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase 설정 (환경 변수 또는 기본값 사용)
const getFirebaseConfig = () => {
  // 환경 변수에서 가져오거나 기본값 사용
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGdQiDM3ExFNVAxOMPi9-hrceYisrPvrg";
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "miso-1ee7b.firebaseapp.com";
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "miso-1ee7b";
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "miso-1ee7b.firebasestorage.app";
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "465431937526";
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:465431937526:web:441dfef452919dea8447d7";
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-QXCHCBF35H";

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };
};

const firebaseConfig = getFirebaseConfig();

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

