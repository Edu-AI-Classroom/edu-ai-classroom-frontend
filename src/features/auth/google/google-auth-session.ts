export type GoogleAuthIntent = 'login' | 'register';

const GOOGLE_AUTH_INTENT_KEY = 'google-auth-intent';

export function setGoogleAuthIntent(intent: GoogleAuthIntent) {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(GOOGLE_AUTH_INTENT_KEY, intent);
}

export function consumeGoogleAuthIntent(): GoogleAuthIntent {
	if (typeof window === 'undefined') return 'login';

	const intent = sessionStorage.getItem(GOOGLE_AUTH_INTENT_KEY);
	sessionStorage.removeItem(GOOGLE_AUTH_INTENT_KEY);

	return intent === 'register' ? 'register' : 'login';
}
