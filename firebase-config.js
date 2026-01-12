  const firebaseConfig = {
    apiKey: "AIzaSyBclB1sZTkXqOz4_DV2WP_DgBb6SU8aozo",
    authDomain: "backend-project-80fdd.firebaseapp.com",
    projectId: "backend-project-80fdd",
    storageBucket: "backend-project-80fdd.appspot.com",
    messagingSenderId: "395523486676",
    appId: "1:395523486676:web:8391a880d265408161dc41",
    measurementId: "G-YT90JJDNE9"
  };
  
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
 