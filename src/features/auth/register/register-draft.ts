export const REGISTER_DRAFT_KEY = 'register-flow-draft';

export function clearRegisterDraft() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(REGISTER_DRAFT_KEY);
}
