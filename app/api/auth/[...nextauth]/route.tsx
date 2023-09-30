import AccountEntity from "@/entities/account-entity";
import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

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

    // Create a new user
    const newUser = await UserEntity.create({
      email,
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

export { handler as GET, handler as POST };
