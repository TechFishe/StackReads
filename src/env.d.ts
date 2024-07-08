/// <reference types="astro/client" />

import type { Timestamp } from 'firebase-admin/firestore';

interface ImportMetaEnv {
  readonly FIREBASE_PRIVATE_KEY_ID: string;
  readonly FIREBASE_PRIVATE_KEY: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_CLIENT_EMAIL: string;
  readonly FIREBASE_CLIENT_ID: string;
  readonly FIREBASE_AUTH_URI: string;
  readonly FIREBASE_TOKEN_URI: string;
  readonly FIREBASE_AUTH_CERT_URL: string;
  readonly FIREBASE_CLIENT_CERT_URL: string;
  readonly PUBLIC_BOOK_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface SignUpData {
  uid: string;
  email: string;
  phone: string;
  pass: string;
  username: string;
  age: number;
  gender: string;
  animal: string;
  pfp: string;
}
