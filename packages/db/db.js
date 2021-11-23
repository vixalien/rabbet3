const initApp = require("./init");

const firestore = require("firebase/firestore");
// import { getFirestore, collection, query, where, getDocs, getDoc, setDoc, doc, addDoc } as firestore from "firebase/firestore";
const { onAuthStateChanged, getAuth } = require("firebase/auth");
const isEqual = require("./isequal");

let query = async (COLLECTION, ...queries) => {
	const db = firestore.getFirestore();
	const q = firestore.query(firestore.collection(db, COLLECTION), ...queries);
	const querySnapshot = await firestore.getDocs(q);
	return (querySnapshot.docs || [])
		.map(doc => {
			let data = doc.data();
			data.uid = doc.id;
			return data;
		});
}

let deleteAll = async (COLLECTION, ...queries) => {
	const db = firestore.getFirestore();
	const q = firestore.query(firestore.collection(db, COLLECTION), ...queries);
	const querySnapshot = await firestore.getDocs(q);
	return Promise.all((querySnapshot.docs || [])
		.map(doc => firestore.deleteDoc(doc.ref)));
}

let get = async (COLLECTION, id) => {
	const db = firestore.getFirestore();
	return firestore.getDoc(firestore.doc(db, COLLECTION, id));
}


let set = async (COLLECTION, id, data, merge = false) => {
	const db = firestore.getFirestore();
	return firestore.setDoc(firestore.doc(db, COLLECTION, id), data, { merge });
}

let add = async (COLLECTION, data) => {
	const db = firestore.getFirestore();
	return firestore.addDoc(firestore.collection(db, COLLECTION), data);
}

let getRealUser = (user) => {
	return get("users", user.uid).then(data => {
		let db_data = data.data();
		db_data.uid = user.uid;
		return db_data;
	});
}

let cache_user = "____unset";

let onCurrentUserChange = (fn) => {
	let auth = getAuth();
	let getUser = async (user) => {
		if(isEqual(user, cache_user)) return;
		cache_user = user;
		if (user) return getRealUser(user);
		else return null;
	};
	return onAuthStateChanged(auth, user => getUser(user).then(fn));
}

let getCurrentUser = async (auth) => {
	if (!auth) auth = getAuth();
	return auth.currentUser;
};

// let useCurrentUser = (auth) => {
// 	let [loading, setLoading] = useState(true);
// 	let [currentUser, setCurrentUser] = useState(null);

// 	let load = () => getCurrentUser(auth)
// 		.then(setCurrentUser)
// 		.catch(setCurrentUser)
// 		.finally(() => setLoading(false));
// 	load();
// 	return [loading, currentUser, setCurrentUser, load];
// }

module.exports = { query, set, get, where: firestore.where, getCurrentUser, getRealUser, add, onCurrentUserChange, deleteAll };