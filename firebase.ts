/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// Config loaded directly from provisioned firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyDb-xsTDV7aJ9S3OacgQmaggCoCli8Ew1A",
  authDomain: "silicon-aviary-wcwq9.firebaseapp.com",
  projectId: "silicon-aviary-wcwq9",
  storageBucket: "silicon-aviary-wcwq9.firebasestorage.app",
  messagingSenderId: "127907591287",
  appId: "1:127907591287:web:d515fe1dc3b3f46a50c272"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom database ID specified in the config and enable long polling
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-hudx-3927f1f5-bf94-46ba-9da1-67b3a2810d75");
