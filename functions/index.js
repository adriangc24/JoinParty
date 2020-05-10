const functions = require('firebase-functions');
const admin = require('firebase-admin');
require("dotenv").config();
const cors = require('cors');
var serviceAccount = require('./permissionsPrivateKey.json');
const express = require('express');
const app = express();
app.use(cors({ origin: true }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://joinparty-4e37b.firebaseio.com",
});

const firebase = require('firebase');
firebase.initializeApp({
  apiKey: process.env.apiKey,
  applicationId: process.env.applicationId,
  projectId: process.env.projectId,
  authDomain: process.env.authDomain,
  databaseURL: "https://joinparty-4e37b.firebaseio.com",
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId
});

const db = admin.firestore();

app.get('/prueba', (req, res) => {
  return res.send('OK, IT WORKS !');
});

app.post('/newUser', (req, res) => {
  admin.auth().createUser({
    email: req.body.email,
    password: req.body.password,
    displayName: req.body.username,
    //photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false
  })
    .then(function (userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.displayName);
      saveUserInfo(userRecord.uid, userRecord.displayName, userRecord.email);
      res.send('Succes User '+userRecord.uid+' created');
    })
    .catch(function (error) {
      console.log('Error creating new user:', error);
      res.send('Error creating new user: '+ error);
    });
});

app.post('/getUser', (req, res) => {
  admin.auth().getUserByEmail(req.body.email)
  .then(function(userRecord) {
    console.log('Successfully fetched user data:', userRecord.toJSON());
    res.send(serRecord.toJSON());
  })
  .catch(function(error) {
   console.log('Error fetching user data:', error);
   res.send('Error fetching user data:'+ error);
  });
});

function saveUserInfo(userId, name, email/*, imageUrl*/){
  console.log("--- Saving user "+email);
  firebase.database().ref('users/' + userId).set({
    name: name,
    email: email,
    //profile_picture : imageUrl
  });
}

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin
    .database()
    .ref('/messages')
    .push({ original: original });
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});

exports.app = functions.https.onRequest(app);
