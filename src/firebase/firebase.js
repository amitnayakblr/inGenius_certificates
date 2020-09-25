import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyApZYEdRRp3L83Yx9xNbx3wRaodL3MpTqY",
  authDomain: "ingenius-certificates.firebaseapp.com",
  databaseURL: "https://ingenius-certificates.firebaseio.com",
  projectId: "ingenius-certificates",
  storageBucket: "ingenius-certificates.appspot.com",
  messagingSenderId: "763816642098",
  appId: "1:763816642098:web:8e93737eea5f431e2d9e2b",
  measurementId: "G-CZMWLKSW53"
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
export const db = baseDb;
