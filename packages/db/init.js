// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQysbbCt4-eRhOlZifFuv6o_Aa0YifILw",
  authDomain: "rabbetv4.firebaseapp.com",
  projectId: "rabbetv4",
  storageBucket: "rabbetv4.appspot.com",
  messagingSenderId: "226169996755",
  appId: "1:226169996755:web:6ca92d496834226ba35b26"
};

let init = () => initializeApp(firebaseConfig);

module.exports = init;