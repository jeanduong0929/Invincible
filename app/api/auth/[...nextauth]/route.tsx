import AccountEntity from "@/entities/account-entity";
import UserEntity from "@/entities/user-entity";
import GithubProvider from "next-auth/providers/github";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import NextAuth, { Session } from "next-auth";
import RoleEntity from "@/entities/role-entity";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: any;
    }): Promise<boolean> {
      const { providerId, providerType } = getProviderIdAndType(
        user,
        account,
        profile,
      );
      return signInHelper(user.email, providerId, providerType);
    },
    async jwt({ user, token }: { user: any; token: any }): Promise<JWT> {
      return jwtHelper(user, token);
    },
    async session({
      session,
      token,
    }: {
      session: any;
      token: any;
    }): Promise<Session> {
      return sessionHelper(session, token);
    },
  },
  pages: {
    signIn: "/login",
  },
});

/* ######################################## HELPER FUNCTIONS ######################################## */

const getProviderIdAndType = (
  user: any,
  account: any,
  profile: any,
): { providerId: string; providerType: string } => {
  let providerId,
    providerType = "";

  if (account.provider === "github") {
    providerId = profile.id;
    providerType = "github";
  } else {
    providerId = user.id;
    providerType = "credentials";
  }

  return { providerId, providerType };
};

const signInHelper = async (
  email: string,
  providerId: string,
  providerType: string,
): Promise<boolean> => {
  try {
    // Connect to the database
    await connectDB();

    // Check if account is already in the database
    const existingAccount = await AccountEntity.findOne({ providerId });
    if (existingAccount) {
      return true;
    }

    // Check if there is a user with the same email
    const existingUser = await AccountEntity.findOne({ email });

    // If there is a user with the same email, create a new account
    if (existingUser) {
      AccountEntity.create({
        providerId,
        providerType,
        userId: existingUser._id,
      });
    }

    // Find DEFAULT role
    let defaultRole = await RoleEntity.findOne({ name: "DEFAULT" });

    if (!defaultRole) {
      defaultRole = await RoleEntity.create({
        name: "DEFAULT",
      });
    }

    // Create a new user
    const newUser = await UserEntity.create({
      email,
      role: defaultRole._id,
    });

    // Create a new account
    await AccountEntity.create({
      providerId,
      providerType,
      userId: newUser._id,
    });

    // Return true if the user is successfully signed in
    return true;
  } catch (error: any) {
    // Return false if there is an error
    console.error("Error in signInHelper: ", error);
    return false;
  }
};

const jwtHelper = async (user: any, token: any): Promise<JWT> => {
  if (user) {
    // Find the user in the database
    const existingUser = await UserEntity.findOne({ email: user.email });

    // Find the role of the user
    const foundRole = await RoleEntity.findById(existingUser?.role);

    // Create a new token
    const jwtToken = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    // Add the token and ID to the jwt property
    token.jwt = jwtToken;
    token.id = existingUser._id;
    token.role = foundRole?.name;
    console.log("token: ", token);
  }

  // Return the token
  return token;
};

const sessionHelper = async (session: any, token: any): Promise<Session> => {
  if (session) {
    // Add the jwt token to the session
    session.jwt = token.jwt;
    session.id = token.id;
    session.role = token.role;
  }
  return session;
};

export { handler as GET, handler as POST };
