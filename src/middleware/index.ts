import { defineMiddleware } from 'astro:middleware';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';

const { verify, sign, decode } = jwt;

interface RefreshResponse {
  verified: boolean;
  uid: string;
}

interface VerifyResponse {
  verified: boolean;
  setCookie: boolean;
  user?: UserDoc;
}

export const onRequest = defineMiddleware(async (context, next) => {
  switch (context.url.pathname) {
    case '/user':
      if (!context.cookies.has('user') || !context.cookies.has('refresh')) return context.redirect('/signin');

      const userResponse = await verifyUser(context.cookies.get('user')?.value, context.cookies.get('refresh')?.value);
      if (!userResponse.verified || !userResponse.user) return context.redirect('/signin');
      else if (userResponse.setCookie) {
        context.cookies.set('user', userResponse.user, { path: '/' });
      }

      context.locals.user = userResponse.user;

      return next();
    case '/search':
      if (!context.cookies.has('user') || !context.cookies.has('refresh')) return next();

      const searchResponse = await verifyUser(context.cookies.get('user')?.value, context.cookies.get('refresh')?.value);
      if (!searchResponse.verified || !searchResponse.user) return next();
      else if (searchResponse.setCookie) {
        context.cookies.set('user', searchResponse.user, { path: '/' });
      }

      context.locals.user = searchResponse.user;

      return next();
    default:
      return next();
  }
});

async function verifyUser(userJwt?: string, refreshJwt?: string): Promise<VerifyResponse> {
  let output: VerifyResponse = {
    verified: false,
    setCookie: false,
  };

  if (!userJwt || !refreshJwt) return output;

  //@ts-expect-error
  const verified = verify(userJwt, import.meta.env.JWT_PASS, (err, user: UserDoc) => {
    if (err) return null;
    else
      return {
        createdAt: user.createdAt,
        lastSignedIn: user.lastSignedIn,
        email: user.email,
        phone: user.phone,
        pass: user.pass,
        username: user.username,
        age: user.age,
        gender: user.gender,
        animal: user.animal,
        pfp: user.pfp,
      } as UserDoc;
  });

  if (!verified) {
    const response = verifyRefresh(refreshJwt);
    if (!response.verified) return output;

    const userToken = await createNewToken(response.uid).catch((err) => {
      console.error(err);
      return null;
    });

    if (!userToken) return output;

    const tempUser = decode(userToken) as UserDoc;
    const user = {
      createdAt: tempUser.createdAt,
      lastSignedIn: tempUser.lastSignedIn,
      email: tempUser.email,
      phone: tempUser.phone,
      pass: tempUser.pass,
      username: tempUser.username,
      age: tempUser.age,
      gender: tempUser.gender,
      animal: tempUser.animal,
      pfp: tempUser.pfp,
    };

    output.verified = true;
    output.setCookie = true;
    output.user = user;
  } else {
    output.verified = true;
    output.setCookie = false;
    output.user = verified;
  }

  return output;
}

async function createNewToken(uid: string): Promise<string | null> {
  const pass = import.meta.env.MONGO_DB_SIGNIN_PASS;
  const mongo = new MongoClient(`mongodb+srv://signin:${pass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
  const userDb = mongo.db('Gen').collection<UserDoc>('users');

  let userToken = '';

  try {
    const userDoc = await userDb.findOne({ _id: new ObjectId(uid) });
    if (!userDoc) return null;

    const user: UserDoc = {
      createdAt: userDoc.createdAt,
      lastSignedIn: userDoc.lastSignedIn,
      email: userDoc.email,
      phone: userDoc.phone,
      pass: userDoc.pass,
      username: userDoc.username,
      age: userDoc.age,
      gender: userDoc.gender,
      animal: userDoc.animal,
      pfp: userDoc.pfp,
    };
    userToken = sign(user, import.meta.env.JWT_PASS, { expiresIn: '10m' });
  } finally {
    mongo.close();
    return userToken;
  }
}

function verifyRefresh(token: string): RefreshResponse {
  let output: RefreshResponse = {
    verified: false,
    uid: '',
  };

  verify(token, import.meta.env.JWT_REFRESH_PASS, (err, decoded) => {
    if (err) return output;

    output.verified = true;
    //@ts-expect-error
    output.uid = decoded.uid;
    return output;
  });

  return output;
}
