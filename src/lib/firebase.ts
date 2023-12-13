import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable } from 'svelte/store';

// configuración de tu aplicación firebase
const firebaseConfig = {
	apiKey: 'AIzaSyDwXBcOaygmwcBRL9F-EZGyVRVBoF8t3V4',
	authDomain: 'my-firebase-svelte-app.firebaseapp.com',
	projectId: 'my-firebase-svelte-app',
	storageBucket: 'my-firebase-svelte-app.appspot.com',
	messagingSenderId: '727679435258',
	appId: '1:727679435258:web:2fc66114cf3a2224c6a443'
};

// inicializar firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

// store para el firebase user
function userStore(){
	let unsubscribe: () => void;

	if(!auth || !globalThis.window){
		console.warn("Auth is not initialized or not in browser")
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		}
	}

	const { subscribe } = writable(auth?.currentUser ?? null,(set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
		})
		return () => unsubscribe();
	});
	return {
		subscribe,
	}
}

export const user = userStore();
