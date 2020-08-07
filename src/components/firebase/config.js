import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBIPV2d-XBpMjb_h0KIagkqHeiTMGYbBKY",
  authDomain: "yikming-s-social-card.firebaseapp.com",
  databaseURL: "https://yikming-s-social-card.firebaseio.com",
  projectId: "yikming-s-social-card",
  storageBucket: "yikming-s-social-card.appspot.com",
  messagingSenderId: "815469169464",
  appId: "1:815469169464:web:38379019a814b5d9d60fcd",
  measurementId: "G-5MW1506ZTF"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };