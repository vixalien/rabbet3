import db from "../db";

import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, getAdditionalUserInfo, getAuth } from "firebase/auth";

let withGoogle = () => {
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/userinfo.email');
	provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
	return signInWithPopup(auth, provider)
		.then(async (result) => {
			const user = result.user;
			if(getAdditionalUserInfo(result).isNewUser) {
				await db.set("users", user.uid, { displayName: user.displayName, username: user.uid }, true)
			}
			return await db.getRealUser(user);
			// ...
		});
};

let logout = () => {
	const auth = getAuth();
	return auth.signOut();
}

let login = { withGoogle };

export { login, logout };