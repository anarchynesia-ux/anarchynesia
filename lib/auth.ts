import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { ref, set, get } from 'firebase/database'
import { auth, githubProvider, googleProvider, db } from './firebase'

async function ensureUserProfile(user: User) {
  const userRef = ref(db, `users/${user.uid}`)
  const snap = await get(userRef)
  if (!snap.exists()) {
    await set(userRef, {
      uid: user.uid,
      username: user.displayName || user.email?.split('@')[0] || 'anonymous',
      avatar: user.photoURL || null,
      bio: '',
      email: user.email,
      createdAt: Date.now(),
    })
  }
}

export async function signInWithGitHub(): Promise<User> {
  const result = await signInWithPopup(auth, githubProvider)
  await ensureUserProfile(result.user)
  return result.user
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider)
  await ensureUserProfile(result.user)
  return result.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}
