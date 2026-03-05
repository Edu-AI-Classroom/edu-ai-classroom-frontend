import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthUserResponse } from '@/types/auth';

interface AuthState {
	user: AuthUserResponse | null;
	token: string | null;
	isAuthenticated: boolean;
	hasHydrated: boolean;

	login: (data: { user: AuthUserResponse; token: string }) => void;
	logout: () => void;
	setToken: (token: string | null) => void;
	setUser: (user: AuthUserResponse | null) => void;
	setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			hasHydrated: false,

			login: ({ user, token }) =>
				set({
					user,
					token,
					isAuthenticated: true,
				}),

			// update token when refreshed
			setToken: (token) =>
				set({
					token,
					isAuthenticated: !!token,
				}),

			setUser: (user) =>
				set({
					user,
				}),

			logout: () =>
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				}),

			setHasHydrated: (value) => set({ hasHydrated: value }),
		}),
		{
			name: 'auth-store',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				token: state.token,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
