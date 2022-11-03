
const firebase = require("firebase");
// Required for side-effects
require("firebase/functions");
require("firebase/auth");

firebase.initializeApp({
  apiKey: 'AIzaSyChSD_9K4I9CzRf1iIPNw448_h7Fvmgm2w',
  authDomain: 'diabtrend-db.firebaseapp.com',
  databaseURL: 'https://diabtrend-db.firebaseio.com',
  projectId: 'diabtrend-db',
});

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();
const functions = firebase.functions();

// Your data request code:
let email = "example@diabtrend.com"
let password = "example1234"
let type = 'csv' // can also export 'xlsx'
let all = false // Either export all the data or by from-to date range 
let [fromDate, toData] = [new Date(2022,0,1).toISOString(), new Date(2023,0,1).toISOString()]

test = async () => { // Just wrapping everything in an async function.
  // 1. Authentication to access get the permissions of the specific user, so we can trigger his data export function
  const user = await firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => userCredential.user)
    .catch(console.log);
  console.log("User id:", user.uid)
  // 2. Call the cloud function
  const exportToCsvCallable = functions.httpsCallable('exportToCsv_open');
  const result = await exportToCsvCallable({
    all, date: fromDate, endData: toData, type,
  }).catch(console.log);
  const { base64 } = result.data;
  // 3. Save the resulting base64 file
  require("fs").writeFile("out.csv", base64, 'base64', console.log);
}

test()