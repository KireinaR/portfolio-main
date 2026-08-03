'use server';

import { signIn, signOut } from '@/auth';

export async function signInGithub() {
  await signIn('github', { redirectTo: '/guestbook' });
}

export async function signInGoogle() {
  await signIn('google', { redirectTo: '/guestbook' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/guestbook' });
}
