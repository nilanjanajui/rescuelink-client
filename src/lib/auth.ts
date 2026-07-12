import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt, admin as adminPlugin } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { createAccessControl } from 'better-auth/plugins/access';

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

const statement = {
  mission: ['create', 'update', 'delete', 'view'],
  user: ['ban', 'list'],
} as const;

const ac = createAccessControl(statement);
const tenant = ac.newRole({ mission: ['view'] });
const user = ac.newRole({ mission: ['create', 'update', 'delete', 'view'] });
const admin = ac.newRole({
  mission: ['create', 'update', 'delete', 'view'],
  user: ['ban', 'list'],
});

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (userData, ctx) => {
          if (ctx?.path?.includes('/callback/google')) {
            return { data: { ...userData, role: 'Tenant' } };
          }
          return { data: { ...userData, role: userData.role ?? 'user' } };
        },
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: (session) => ({
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
        }),
      },
    }),
    adminPlugin({ ac, roles: { tenant, user, admin }, defaultRole: 'user' }),
    nextCookies(),
  ],
});
