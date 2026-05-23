'use client'

import { create } from 'zustand'
import { User } from 'firebase/auth'
import { UserProfile } from '@/types'
import { onAuthChange } from '@/lib/auth'
import { getUserProfile } from '@/lib/firestore'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  initialize: () => {
    const unsubscribe = onAuthChange(async (user) => {
      set({ user, loading: true })
      if (user) {
        try {
          const profile = await getUserProfile(user.uid)
          set({ profile, loading: false, initialized: true })
        } catch {
          set({ profile: null, loading: false, initialized: true })
        }
      } else {
        set({ profile: null, loading: false, initialized: true })
      }
    })
    return unsubscribe
  },
}))
