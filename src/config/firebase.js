import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBytETc_iH4TmeMv__3wiHthk2afvw4uRY",
  authDomain: "realtime-chat-ai.firebaseapp.com",
  projectId: "realtime-chat-ai",
  storageBucket: "realtime-chat-ai.appspot.com",
  messagingSenderId: "907294382292",
  appId: "1:907294382292:web:dcae7f5880189facecc341",
  measurementId: "G-WQFXHZJ036"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

export {firebaseApp, firebaseAnalytics, firebaseAuth};