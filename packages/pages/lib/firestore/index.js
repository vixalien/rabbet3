require('dotenv').config();
const Firestore = require('@google-cloud/firestore');
const { atob } = require("../btoa");

// initialize db
let credentials = JSON.parse(atob(process.env.GOOGLE_STORAGE_JSON));
const db = new Firestore({
  projectId: credentials.project_id,
  credentials,
});

let query = async (COLLECTION, q = a => a, one = false) => {
  let snapshot = db.collection(COLLECTION);
  let result = await q(snapshot).get();
  result.exists = result.exists ||! result.empty;
  result.get = () => get(result, one);
  return result;
}

let find = (COLLECTION, q) => query(COLLECTION, q, true);

let get = async (snapshot, one) => {
  if (!snapshot.forEach) return snapshot.data();
  let obj = {};
  snapshot.forEach((doc) => {
    obj[doc.id] = doc.data();
  });
  if (one) {
    let _id = Object.keys(obj)[0]
    let data = obj[_id] || {};
    data._id = _id;
    return data;
  };
  return obj;
}

module.exports = { query, get, find };