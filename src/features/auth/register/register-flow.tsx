'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { TeachifyIcon } from '@/components/common/Teachify';
import { Button } from '@/components/ui/button';
import { AuthFlipBook } from '@/features/auth/auth-flip-book';
import { useAuthMutations } from '@/hooks/queries/auth/use-auth-mutation';
import { RoleSelectionStep } from './components/role-selection-step';
import { StudentOnboardingStep } from './components/student-onboarding-step';
import { WelcomeStep } from './components/welcome-step';
import { clearRegisterDraft, REGISTER_DRAFT_KEY } from './register-draft';
import type { RegisterFormData, RegisterStep } from './types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM: RegisterFormData = {
	name: '',
	email: '',
	password: '',
	role: null,
	gradeLevel: '',
	mentorQuery: '',
	mentorName: '',
	parentEmail: '',
};

export function RegisterFlow() {
	const [step, setStep] = useState<RegisterStep>(1);
	const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM);
	const [stepError, setStepError] = useState<string | null>(null);
	const [isHydrated, setIsHydrated] = useState(false);
	const { clearAuthError, registerMutation } = useAuthMutations();

	const isStudentFlow = formData.role === 'STUDENT';
	const totalSteps = isStudentFlow ? 6 : 3;

	const clearDraft = () => {
		clearRegisterDraft();
	};

	useEffect(() => {
		if (typeof window === 'undefined') return;
		try {
			const rawDraft = localStorage.getItem(REGISTER_DRAFT_KEY);
			if (!rawDraft) {
				setIsHydrated(true);
				return;
			}

			const parsedDraft = JSON.parse(rawDraft) as {
				step?: RegisterStep;
				formData?: RegisterFormData;
			};

			if (parsedDraft.formData) {
				setFormData({ ...INITIAL_FORM, ...parsedDraft.formData });
			}

			if (parsedDraft.step) {
				setStep(parsedDraft.step);
			}
		} catch {
			clearRegisterDraft();
		} finally {
			setIsHydrated(true);
		}
	}, []);

	useEffect(() => {
		if (!isHydrated || typeof window === 'undefined') return;
		localStorage.setItem(
			REGISTER_DRAFT_KEY,
			JSON.stringify({
				step,
				formData,
			}),
		);
	}, [formData, isHydrated, step]);

	const primaryLabel = useMemo(() => {
		if (step === totalSteps) {
			return registerMutation.isPending ? 'Creating Your Account...' : 'Complete Registration';
		}
		return 'Next Step';
	}, [registerMutation.isPending, step, totalSteps]);

	const isNextDisabled = registerMutation.isPending || (step === 2 && !formData.role);

	const updateForm = (field: keyof RegisterFormData, value: string) => {
		setStepError(null);
		clearAuthError();
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleBasicInfoNext = (data: { name: string; email: string; password: string }) => {
		setStepError(null);
		clearAuthError();
		setFormData((prev) => ({
			...prev,
			name: data.name,
			email: data.email,
			password: data.password,
		}));
		setStep(2);
	};

	useEffect(() => {
		if (!isStudentFlow && step > 3) {
			setStep(3);
		}
	}, [isStudentFlow, step]);

	const validateCurrentStep = () => {
		if (step === 2) {
			if (!formData.role) return 'Please select a role.';
			return null;
		}

		if (isStudentFlow && step === 3) {
			if (!formData.gradeLevel) return 'Please select a grade level.';
			return null;
		}

		if (isStudentFlow && step === 5) {
			if (formData.parentEmail && !EMAIL_REGEX.test(formData.parentEmail.trim())) {
				return 'Invalid parent email.';
			}
		}

		return null;
	};

	const goNext = () => {
		const error = validateCurrentStep();
		if (error) {
			setStepError(error);
			return;
		}

		if (step < totalSteps) {
			if (!isStudentFlow && step === 2) {
				setStep(3);
				return;
			}

			setStep((prev) => (prev + 1) as RegisterStep);
			return;
		}

		if (!formData.role) {
			setStepError('Please select a role.');
			return;
		}

		registerMutation.mutate(
			{
				role: formData.role,
				name: formData.name.trim(),
				email: formData.email.trim(),
				password: formData.password,
			},
			{
				onSuccess: () => {
					clearDraft();
				},
			},
		);
	};

	const goBack = () => {
		setStepError(null);
		clearAuthError();

		if (step === 2) {
			setStep(1);
			return;
		}

		if (!isStudentFlow && step === 3) {
			setStep(2);
			return;
		}

		setStep((prev) => Math.max(1, prev - 1) as RegisterStep);
	};

	if (!isHydrated) {
		return null;
	}

	if (step === 1) {
		return (
			<AuthFlipBook
				initialMode="register"
				disableModeSwitch
				registerSubmitLabel="Next Step"
				registerFormData={{
					name: formData.name,
					email: formData.email,
					password: formData.password,
				}}
				onRegisterFormDataChange={(data) => {
					setFormData((prev) => ({
						...prev,
						name: data.name,
						email: data.email,
						password: data.password,
					}));
				}}
				onRegisterNextStep={handleBasicInfoNext}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-[#FAF9F6] grid-paper flex flex-col">
			<div className="w-full px-4 py-6 md:px-8">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between">
					<TeachifyIcon />
					<p className="text-sm text-[#666]">
						Step {step}/{totalSteps}
					</p>
				</div>
				<div className="mx-auto mt-4 h-2 w-full max-w-6xl rounded-full bg-[#F0EDE8]">
					<div
						className="h-full rounded-full bg-[#F5B041] transition-all"
						style={{ width: `${(step / totalSteps) * 100}%` }}
					/>
				</div>
			</div>

			<div className="flex-1 flex items-center justify-center px-4 pb-4">
				{step === 2 && (
					<RoleSelectionStep
						selectedRole={formData.role}
						onSelectRole={(role) => {
							setStepError(null);
							clearAuthError();
							setFormData((prev) => ({ ...prev, role }));
						}}
					/>
				)}

				{isStudentFlow && (step === 3 || step === 4 || step === 5) && (
					<StudentOnboardingStep
						data={formData}
						onChange={updateForm}
						screen={step === 3 ? 1 : step === 4 ? 2 : 3}
					/>
				)}

				{((!isStudentFlow && step === 3) || (isStudentFlow && step === 6)) && (
					<div className="w-full max-w-4xl">
						<WelcomeStep role={formData.role} name={formData.name} />
					</div>
				)}
			</div>

			<div className="w-full px-4 pb-6 md:px-8 md:pb-8">
				<div className="mx-auto w-full max-w-6xl">
					{stepError && (
						<p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{stepError}</p>
					)}

					<div className="flex items-center justify-between gap-3">
						<Button type="button" variant="outline" onClick={goBack}>
							Previous Step
						</Button>

						<div className="flex items-center gap-3">
							{isStudentFlow && step === 4 && (
								<Button type="button" variant="ghost" onClick={goNext}>
									I'll do this later
								</Button>
							)}
							<Button
								type="button"
								onClick={goNext}
								disabled={isNextDisabled}
								className="bg-[#F5B041] text-[#333] hover:bg-[#E5A030]"
							>
								{primaryLabel}
							</Button>
						</div>
					</div>

					<p className="mt-6 text-center text-sm text-[#666]">
						Already have an account?{' '}
						<Link href="/login" className="font-semibold text-[#333] underline">
							Sign in here
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
