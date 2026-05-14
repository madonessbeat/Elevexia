import { writable } from 'svelte/store';
import type { DashboardRole } from '$lib/types';

interface AuthState {
	role: DashboardRole | null;
}

function createAuthStore() {
	const stored =
		typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('elevexia_role') : null;

	const initial: AuthState = {
		role: (stored as DashboardRole | null) ?? null
	};

	const { subscribe, update } = writable<AuthState>(initial);

	return {
		subscribe,
		setRole(role: DashboardRole) {
			update(() => {
				if (typeof sessionStorage !== 'undefined') {
					sessionStorage.setItem('elevexia_role', role);
				}
				return { role };
			});
		},
		clearRole() {
			update(() => {
				if (typeof sessionStorage !== 'undefined') {
					sessionStorage.removeItem('elevexia_role');
				}
				return { role: null };
			});
		}
	};
}

export const authStore = createAuthStore();
