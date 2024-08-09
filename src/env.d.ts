/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: WithId<UserDoc>;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_BOOK_API: string;
  readonly MONGO_DB_ADMIN_PASS: string;
  readonly MONGO_DB_SEARCH_PASS: string;
  readonly MONGO_DB_SIGNIN_PASS: string;
  readonly JWT_PASS: string;
  readonly JWT_REFRESH_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ErrorInfo {
  text: string;
}

interface SearchData {
  title: string;
  author: string;
  uid: string | null;
}

interface SearchDoc {
  timestamp: Date;
  knownUser: boolean;
  title: string;
  author: string;
  uid: ObjectId | null;
}

interface SignUpData {
  email: string;
  phone: string;
  pass: string;
  username: string;
  age: number;
  gender: string;
  animal: string;
  pfp: {
    uri: string;
    eyebrowNum: number;
    eyeNum: number;
    mouthNum: number;
    bgColor: string;
  };
}

interface SignInData {
  email: string;
  pass: string;
  remember: boolean;
}

interface UserDoc {
  createdAt: Date;
  lastSignedIn: Date | null;
  email: string;
  phone: string;
  pass: string;
  username: string;
  age: number;
  gender: string;
  animal: string;
  pfp: {
    uri: string;
    eyebrowNum: number;
    eyeNum: number;
    mouthNum: number;
    bgColor: string;
  };
}
