import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      // account/profile are only present on the initial sign-in; a stable
      // "provider:providerAccountId" key is what the guestbook rate
      // limiter and moderation queue use to identify a person.
      if (account) {
        token.provider = account.provider;
        token.uid = `${account.provider}:${account.providerAccountId}`;
        // GitHub's handle (distinct from the display name) - Google has
        // no equivalent, so this stays unset for Google sign-ins.
        token.username = account.provider === 'github' ? profile?.login : undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.uid = token.uid;
        session.user.provider = token.provider;
        session.user.username = token.username;
      }
      return session;
    },
  },
});
