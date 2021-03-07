This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setting your firebase for the messenger clone web app

Step 1: Go to visit firebase docs https://firebase.google.com/docs/web/setup#config-object (Follow step 2 and step 3)

Step 2: Create a directory called "firebase" under src/components directory and then create a file called "config.js"

Step 3: Copy the code below to "config.js" file and replace the API_KEY, PROJECT_ID, SENDER_ID, APP_ID, MEASUREMENT_ID with the web app you just created followed in step 1

```javascript
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PROJECT_ID.firebaseio.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  measurementId: "G-MEASUREMENT_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };
```

Step 4: Go to your firebase web app console, click the "Build" section in sidebar,click Authentication enable Email/Password and Facebook sign-in method. After that, follow the "Before you begin" second and third step in this [URL](https://firebase.google.com/docs/auth/web/facebook-login#:~:text=Enable%20Facebook%20Login%3A,Secret%20you%20got%20from%20Facebook.) to enable Facebook Login in your web app

Step 5: In the same "Build" section in sidebar, click "Cloud Firestore" and then click "Start collection" with Collection ID: users, Document ID: click Auto-ID, Field 1: avatar(string), Field 2: displayName(string)

Step 6: Click the "Rules" besides the "Data", choose production mode and change "allow read, write: if false" to "allow read, write, create: if request.auth != null"

Last Step: Congrats! Now Follow the scripts and notes below and you are ready to go. Enjoy!

## Available Scripts

In the project directory, you can run:

### `npm install`

Install the node_modules for the web app dependencies

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Notes

Please make sure your running machine has following version of tools:

1. Node.js, v12.18.3 or above
2. npm, 6.14.11 or above
