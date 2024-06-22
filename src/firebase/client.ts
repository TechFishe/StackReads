import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyC-Rnlf3laerl4GMhIN70aBGefw4hupLNQ',
  authDomain: 'stackreads.firebaseapp.com',
  projectId: 'stackreads',
  storageBucket: 'stackreads.appspot.com',
  messagingSenderId: '625312293894',
  appId: '1:625312293894:web:a28a04b670f4b7e481cf87',
  measurementId: 'G-ZNGYYW1MZC',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
