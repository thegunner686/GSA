import * as Firebase from "firebase";
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCkdWMm71XSFuWNl3kw2Pjvx2bXAJUCL4g",
    authDomain: "genderandsexualitiesalliance.firebaseapp.com",
    databaseURL: "https://genderandsexualitiesalliance.firebaseio.com",
    projectId: "genderandsexualitiesalliance",
    storageBucket: "genderandsexualitiesalliance.appspot.com",
    messagingSenderId: "191985754960"
  };
  export default Firebase.initializeApp(config);