import { FirebaseOptions } from 'firebase/app';

export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: 'demo-api-key',
    authDomain: 'demo-fir-example-app.firebaseapp.com',
    projectId: 'demo-fir-example-app',
    storageBucket: 'demo-fir-example-app.appspot.com',
    messagingSenderId: '0',
    appId: '1:0:web:demo'
  } satisfies FirebaseOptions
};
