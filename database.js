const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(
    "wings-of-fire-de54e-firebase-adminsdk-ue7x2-ba31389277.json"
  ),
  databaseURL: "https://stratego-892eb.firebaseio.com"
});
var db = admin.firestore();
var usersref = db.collection("users");
let FieldValue = admin.firestore.FieldValue;

var newq = function(n, data) {
  let docRef = usersref.doc(n);
  data.createdAt = new Date().toISOString();
  data.updatedAt = new Date().toISOString();
  docRef.set(data);
};
var update = function(n, data) {
  let dRef = usersref.doc(n);
  data.updatedAt = FieldValue.serverTimestamp();
  dRef.update(data);
};

module.exports = module.exports = {FV:FieldValue,usersref:usersref,newq:newq,update:update}