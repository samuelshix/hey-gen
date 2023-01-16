import { addCookieToRes, CLIENT_URL, upsertUser } from "./config";
import axios from "axios";
import { Request, Response } from "express";

// add your client id and secret here:
const TWITTER_OAUTH_CLIENT_ID = "X3ZMX1o3dnFUaC1RY3Utcnc5N3I6MTpjaQ";
const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;

// the url where we get the twitter access token from
const TWITTER_OAUTH_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const REVOKE_TOKEN_URL = "https://api.twitter.com/2/oauth2/revoke";
// we need to encrypt our twitter client id and secret here in base 64 (stated in twitter documentation)
const BasicAuthToken = Buffer.from(`${TWITTER_OAUTH_CLIENT_ID}:${TWITTER_OAUTH_CLIENT_SECRET}`, "utf8").toString(
  "base64"
);

// filling up the query parameters needed to request for getting the token
export const twitterOauthTokenParams = {
  client_id: TWITTER_OAUTH_CLIENT_ID,
  code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
  redirect_uri: `http://www.localhost:3001/oauth/twitter`,
  grant_type: "authorization_code",
};

export const twitterRevokeTokenParams = {
  client_id: TWITTER_OAUTH_CLIENT_ID,
}
// the shape of the object we should recieve from twitter in the request
type TwitterTokenResponse = {
  token_type: "bearer";
  expires_in: 7200;
  access_token: string;
  scope: string;
};

// type RevokeTokenResponse = {
//   token_type: "bearer";
//   expires_in: 7200;
// }
// export async function getRevokeTwitterOAuthToken() {
//   try {
//     const res = await axios.post<TwitterTokenResponse>(
//       REVOKE_TOKEN_URL,
//       new URLSearchParams({ ...twitterOauthTokenParams }).toString(),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: `Basic ${BasicAuthToken}`,
//         },
//       })
//     return res.data
//   } catch (error) {
//     return null;
//   }
// }
// the main step 1 function, getting the access token from twitter using the code that the twitter sent us
export async function getTwitterOAuthToken(code: string) {
  try {
    // POST request to the token url to get the access token
    const res = await axios.post<TwitterTokenResponse>(
      TWITTER_OAUTH_TOKEN_URL,
      new URLSearchParams({ ...twitterOauthTokenParams, code }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${BasicAuthToken}`,
        },
      });
    return res.data;
  } catch (err) {
    return null;
  }
}

// the shape of the response we should get
export interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

export interface Tweet {
  id: string;
  text: string;
}
// getting the twitter user from access token
export async function getTwitterUser(accessToken: string): Promise<TwitterUser | null> {
  try {
    // request GET https://api.twitter.com/2/users/me
    const res = await axios.get<{ data: TwitterUser }>("https://api.twitter.com/2/users/me", {
      headers: {
        "Content-type": "application/json",
        // put the access token in the Authorization Bearer token
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.data ?? null;
  } catch (err) {
    return null;
  }
}

export async function writeTweet(accessToken: string, text: string): Promise<Tweet | null> {
  try {
    const res = await axios.post<{ data: Tweet }>(`https://api.twitter.com/2/tweets?text=${text}`, {
      headers: {
        "Content-type": "application/json",
        // put the access token in the Authorization Bearer token
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.data ?? null;
  } catch (err) {
    return null;
  }
}
// export async function revokeOauth(req: Request<any>, res: Response) {
//   const revokeOauthToken = await getRevokeTwitterOAuthToken();

//   if (!revokeOauthToken) return res.redirect(CLIENT_URL);

//   return res.redirect(CLIENT_URL);

// }

// the function which will be called when twitter redirects to the server at https://www.localhost:3001/oauth/twitter
export async function twitterOauth(req: Request<any, any, any, { code: string }>, res: Response) {
  const code = req.query.code;

  // 1. get the access token with the code
  const twitterOAuthToken = await getTwitterOAuthToken(code);

  if (!twitterOAuthToken) {
    // redirect if no auth token
    return res.redirect(CLIENT_URL);
  }

  // 2. get the twitter user using the access token
  const twitterUser = await getTwitterUser(twitterOAuthToken.access_token);

  if (!twitterUser) {
    // redirect if no twitter user
    return res.redirect(CLIENT_URL);
  }

  // 3. upsert the user in our db
  const user = await upsertUser(twitterUser);

  // 4. create cookie so that the server can validate the user
  addCookieToRes(res, user, twitterOAuthToken.access_token);

  // 5. finally redirect to the client
  return res.redirect(CLIENT_URL);
}