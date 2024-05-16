import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyAE-Ow9ia8vuToTRErJw9ZsHtOKXH7ukko',
	authDomain: 'todolist-22ca8.firebaseapp.com',
	projectId: 'todolist-22ca8',
	storageBucket: 'todolist-22ca8.appspot.com',
	messagingSenderId: '834361352057',
	appId: '1:834361352057:web:ee1bf3cdeec6ebfc53d9a8',
	databaseURL: 'https://todolist-22ca8-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
