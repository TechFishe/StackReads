import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

const { verify, decode } = jwt;

type ReturnFeilds = 'uid' | 'pfp' | 'all';

export const GET: APIRoute = async ({ cookies, params }) => {
  const { returnFeild } = params;

  if (!cookies.has('refresh') || !cookies.has('user') || !returnFeild) {
    return new Response(null, {
      status: 400,
    });
  }

  const pass = import.meta.env.JWT_REFRESH_PASS;
  //@ts-expect-error
  const uid = verify(cookies.get('refresh')?.value, pass, (err, decoded) => {
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

  switch (returnFeild as ReturnFeilds) {
    case 'uid':
      return new Response(
        JSON.stringify({
          uid: user._id,
        }),
        {
          status: 200,
        }
      );

    case 'pfp':
      return new Response(
        JSON.stringify({
          pfp: user.pfp,
        }),
        {
          status: 200,
        }
      );

    case 'all':
      return new Response(JSON.stringify(user), {
        status: 200,
      });
  }
};
