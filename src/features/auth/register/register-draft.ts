import type { RegisterAuthMethod, RegisterFormData, RegisterStep } from './types';

export const REGISTER_DRAFT_KEY = 'register-flow-draft';

export interface RegisterFlowDraft {
	step?: RegisterStep;
	formData?: RegisterFormData;
	authMethod?: RegisterAuthMethod;
	googleAccessToken?: string;
}

export function getRegisterDraft(): RegisterFlowDraft | null {
	if (typeof window === 'undefined') return null;

	const rawDraft = localStorage.getItem(REGISTER_DRAFT_KEY);
	if (!rawDraft) return null;

	return JSON.parse(rawDraft) as RegisterFlowDraft;
}

export function saveRegisterDraft(draft: RegisterFlowDraft) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(REGISTER_DRAFT_KEY, JSON.stringify(draft));
}

export function clearRegisterDraft() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(REGISTER_DRAFT_KEY);
}
