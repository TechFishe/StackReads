import { defineMiddleware } from 'astro:middleware';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId, type WithId } from 'mongodb';

const { verify, sign } = jwt;

interface RefreshResponse {
  verified: boolean;
  uid: string;
}

export const onRequest = defineMiddleware((context, next) => {
  switch (context.url.pathname) {
    case '/user':
      if (!context.cookies.has('user') || !context.cookies.has('refresh')) return context.redirect('/signin');
      //@ts-expect-error
      verify(context.cookies.get('user')?.value, import.meta.env.JWT_PASS, async (err, user: UserDoc) => {
        if (err) {
          //@ts-expect-error
          const response = verifyRefresh(context.cookies.get('refresh')?.value);
          if (!response.verified) return context.redirect('/signin');

          try {
            const pass = import.meta.env.MONGO_DB_SIGNIN_PASS;
            const mongo = new MongoClient(`mongodb+srv://signin:${pass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
            const userDb = mongo.db('Gen').collection<UserDoc>('users');

            const userDoc = await userDb.findOne({ _id: new ObjectId(response.uid) });
            if (!userDoc) return context.redirect('/signin');

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
            const userToken = sign(user, import.meta.env.JWT_PASS, { expiresIn: '10m' });
            context.cookies.set('user', userToken, { path: '/' });

            context.locals.user = user;
          } catch (err) {
            return context.redirect('/signin');
          }
        } else {
          context.locals.user = user;
        }
      });
    default:
      next();
  }
});

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
