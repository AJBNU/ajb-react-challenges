import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBDP2_MuM4aL6Z4DAz8PUGaz-cxgXd7aRA',
  authDomain: 'ajb-react-challenges.firebaseapp.com',
  databaseURL: 'https://ajb-react-challenges-default-rtdb.firebaseio.com',
  projectId: 'ajb-react-challenges',
  storageBucket: 'ajb-react-challenges.firebasestorage.app',
  messagingSenderId: '479644241938',
  appId: '1:479644241938:web:c74ad06efd7bda6a0188cb',
  measurementId: 'G-CEX7B0SZ2Y',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const realtimeDatabase = getDatabase(app);
