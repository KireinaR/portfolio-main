import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      // account is only present on the initial sign-in; a stable
      // "provider:providerAccountId" key is what the guestbook rate
      // limiter and moderation queue use to identify a person.
      if (account) {
        token.provider = account.provider;
        token.uid = `${account.provider}:${account.providerAccountId}`;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.uid = token.uid;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
});
