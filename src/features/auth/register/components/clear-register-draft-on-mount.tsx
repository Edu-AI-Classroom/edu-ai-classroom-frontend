'use client';

import { useEffect } from 'react';
import { clearRegisterDraft } from '../register-draft';

export function ClearRegisterDraftOnMount() {
	useEffect(() => {
		clearRegisterDraft();
	}, []);

	return null;
}
