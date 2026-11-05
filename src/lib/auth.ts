import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
// JWT plugin is available if a token flow is needed later:
// import { jwt } from "better-auth/plugins";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Add it to .env (the app cannot reach MongoDB without it)."
  );
}

const client = new MongoClient(mongodbUri);
export const db = client.db("rentora_studio");

 
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleEnabled = Boolean(googleClientId && googleClientSecret);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: mongodbAdapter(db, {
        client,
    }),
    socialProviders: {
        ...(googleEnabled
            ? {
                  google: {
                      clientId: googleClientId as string,
                      clientSecret: googleClientSecret as string,
                  },
              }
            : {}),
    },
    emailAndPassword: {
        enabled: true,
        // Matches the sign-up form rule set (minimum 6 characters).
        minPasswordLength: 6,
    },
    // plugins: [
    //     jwt(),
    // ],
    // session:{
    //     cookieCache:{
    //         enabled:true,
    //         strategy:'jwt',
    //         maxAge: 7 * 24 * 60 * 60
    //     }
    // }
});

export const isGoogleAuthEnabled = googleEnabled;
