const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const words = [];

exports.helloWorld = functions.https.onRequest((request, response) => {
    words.push('apple');
    response.send('words');
});
