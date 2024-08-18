import type { APIRoute } from 'astro';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const { verify, decode } = jwt;

interface postRequestData {
  name: string;
  public: boolean;
  color: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const data = (await request.json()) as postRequestData;

  if (!cookies.has('refresh') || !cookies.has('user')) {
    return new Response(null, {
      status: 400,
    });
  }

  const pass = import.meta.env.JWT_REFRESH_PASS;
  //@ts-expect-error
  const uid: string | null = verify(cookies.get('refresh')?.value, pass, (err, decoded) => {
    if (err) return null;

    //@ts-expect-error
    return decoded.uid as string;
  });

  if (!uid)
    return new Response(null, {
      status: 400,
    });

  //@ts-expect-error
  const user = decode(cookies.get('user')?.value) as WithId<PublicUserDoc>;

  if (uid !== user._id)
    return new Response(null, {
      status: 400,
    });

  const mongoPass = import.meta.env.MONGO_DB_GENERAL_PASS;
  const mongo = new MongoClient(`mongodb+srv://general:${mongoPass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
  const listDb = mongo.db('Public').collection<listDoc>('lists');
  let statusCode = 0;

  try {
    await listDb.insertOne({
      createdAt: new Date(),
      updatedAt: null,
      userId: new ObjectId(uid),
      name: data.name,
      likes: 0,
      books: [],
      public: data.public,
      color: data.color,
      views: 0,
    });

    statusCode = 201;
  } catch (error) {
    console.error(error);
    statusCode = 500;
  } finally {
    mongo.close();
    return new Response(null, {
      status: statusCode,
    });
  }
};

interface deleteRequestData {
  listId: string;
}

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const data = (await request.json()) as deleteRequestData;

  if (!cookies.has('refresh') || !cookies.has('user')) {
    return new Response(null, {
      status: 400,
    });
  }

  const pass = import.meta.env.JWT_REFRESH_PASS;
  //@ts-expect-error
  const uid: string | null = verify(cookies.get('refresh')?.value, pass, (err, decoded) => {
    if (err) return null;

    //@ts-expect-error
    return decoded.uid as string;
  });

  if (!uid)
    return new Response(null, {
      status: 400,
    });

  //@ts-expect-error
  const user = decode(cookies.get('user')?.value) as WithId<PublicUserDoc>;

  if (uid !== user._id)
    return new Response(null, {
      status: 400,
    });

  const mongoPass = import.meta.env.MONGO_DB_GENERAL_PASS;
  const mongo = new MongoClient(`mongodb+srv://general:${mongoPass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
  const listDb = mongo.db('Public').collection<listDoc>('lists');
  let statusCode = 0;

  try {
    await listDb.deleteOne({
      _id: new ObjectId(data.listId),
    });

    statusCode = 200;
  } catch (error) {
    console.error(error);
    statusCode = 500;
  } finally {
    mongo.close();
    return new Response(null, {
      status: statusCode,
    });
  }
};
