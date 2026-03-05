'use client';

import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClassMutations } from '@/hooks/queries/class/use-class-mutation';
import type { CreateClassroomPayload } from '@/types/class';
import { CLASS_FORM_MESSAGES, CLASS_SUBJECT_OPTIONS } from './class-form.config';

type ClassModalMode = 'create' | 'edit';

type ClassModalInitialValues = {
	className?: string;
	gradeLevel?: NonNullable<CreateClassroomPayload['gradeLevel']> | null;
	subjectId?: NonNullable<CreateClassroomPayload['subjectId']> | null;
};

interface CreateClassModalProps {
	inline?: boolean;
	mode?: ClassModalMode;
	triggerLabel?: string;
	triggerClassName?: string;
	title?: string;
	description?: string;
	submitLabel?: string;
	initialValues?: ClassModalInitialValues;
	isSubmitting?: boolean;
	externalError?: string | null;
	onSubmit?: (payload: CreateClassroomPayload, helpers: { close: () => void }) => void;
	onCreated?: () => void;
}

export function CreateClassModal({
	inline = false,
	mode = 'create',
	triggerLabel = 'Create New Class',
	triggerClassName,
	title,
	description,
	submitLabel,
	initialValues,
	isSubmitting,
	externalError,
	onSubmit,
	onCreated,
}: CreateClassModalProps) {
	const { createClassMutation, classError, clearClassError } = useClassMutations();

	const isEditMode = mode === 'edit';

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [className, setClassName] = useState('');
	const [selectedGrade, setSelectedGrade] = useState<NonNullable<
		CreateClassroomPayload['gradeLevel']
	> | null>(null);
	const [selectedSubjectId, setSelectedSubjectId] = useState<NonNullable<
		CreateClassroomPayload['subjectId']
	> | null>(null);
	const [classNameError, setClassNameError] = useState(false);
	const [subjectError, setSubjectError] = useState(false);
	const [gradeError, setGradeError] = useState(false);

	const resolvedTitle =
		title ?? (isEditMode ? 'Update Class Information' : 'Start a New Learning Adventure!');
	const resolvedDescription =
		description ??
		(isEditMode ? 'Review and edit your classroom details.' : 'Create your new classroom here.');
	const resolvedSubmitLabel = submitLabel ?? (isEditMode ? 'Save Changes' : 'Create Class!');
	const submitting = isSubmitting ?? createClassMutation.isPending;
	const resolvedError = externalError ?? classError;

	const normalizedInitialValues = useMemo(
		() => ({
			className: initialValues?.className ?? '',
			gradeLevel: initialValues?.gradeLevel ?? null,
			subjectId: initialValues?.subjectId ?? null,
		}),
		[initialValues?.className, initialValues?.gradeLevel, initialValues?.subjectId],
	);

	useEffect(() => {
		if (!inline && !isDialogOpen) return;

		setClassName(normalizedInitialValues.className);
		setSelectedGrade(normalizedInitialValues.gradeLevel);
		setSelectedSubjectId(normalizedInitialValues.subjectId);
	}, [inline, isDialogOpen, normalizedInitialValues]);

	const resetCreateClassForm = () => {
		setClassName(normalizedInitialValues.className);
		setSelectedGrade(normalizedInitialValues.gradeLevel);
		setSelectedSubjectId(normalizedInitialValues.subjectId);
		setClassNameError(false);
		setSubjectError(false);
		setGradeError(false);
		clearClassError();
	};

	const handleDialogOpenChange = (open: boolean) => {
		setIsDialogOpen(open);
		if (!open) {
			resetCreateClassForm();
		}
	};

	const closeModal = () => {
		if (!inline) {
			handleDialogOpenChange(false);
		}
	};

	const handleSubmit = () => {
		const trimmedName = className.trim();
		const isNameValid = trimmedName.length > 0;
		const isSubjectValid = selectedSubjectId !== null;
		const isGradeValid = selectedGrade !== null;

		setClassNameError(!isNameValid);
		setSubjectError(!isSubjectValid);
		setGradeError(!isGradeValid);

		if (!isNameValid || !isSubjectValid || !isGradeValid || !selectedSubjectId || !selectedGrade) {
			return;
		}

		const payload: CreateClassroomPayload = {
			className: trimmedName,
			gradeLevel: selectedGrade,
			subjectId: selectedSubjectId,
		};

		if (onSubmit) {
			onSubmit(payload, { close: closeModal });
			return;
		}

		createClassMutation.mutate(payload, {
			onSuccess: () => {
				closeModal();
				onCreated?.();
			},
		});
	};

	const formContent = (
		<motion.div
			initial={inline ? false : { opacity: 0, scale: 0.92, y: 24, rotate: -2 }}
			animate={inline ? undefined : { opacity: 1, scale: 1, y: 0, rotate: -1 }}
			transition={{ type: 'spring', stiffness: 240, damping: 16 }}
			className="relative rounded-3xl border-[3px] border-[#333] bg-[#FFFCF5] p-8 shadow-[8px_10px_0_#33333322]"
			style={{
				backgroundImage:
					'radial-gradient(circle at 1px 1px, rgba(51,51,51,0.08) 1px, transparent 1px), linear-gradient(170deg, rgba(255,255,255,0.7), rgba(245,176,65,0.08))',
				backgroundSize: '5px 5px, 100% 100%',
			}}
		>
			<div className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 -rotate-3 rounded-sm bg-[#F2C4CE]/90 shadow-sm" />

			{inline ? (
				<div className="mb-6 text-left">
					<h3 className="font-sans text-3xl font-bold text-[#333]">{resolvedTitle}</h3>
					<p className="text-[#666]">{resolvedDescription}</p>
				</div>
			) : (
				<DialogHeader className="mb-6 text-left">
					<DialogTitle className="font-sans text-3xl font-bold text-[#333]">
						{resolvedTitle}
					</DialogTitle>
					<DialogDescription className="text-[#666]">{resolvedDescription}</DialogDescription>
				</DialogHeader>
			)}

			<div className="space-y-8">
				<div className="space-y-1">
					<Label htmlFor="className" className="text-md font-semibold text-[#333]">
						Name Your Class
					</Label>
					<div className="relative">
						<Input
							id="className"
							type="text"
							required
							maxLength={50}
							value={className}
							onChange={(event) => {
								setClassName(event.target.value);
								if (classNameError) setClassNameError(false);
							}}
							placeholder="Enter a fun name..."
							className="rounded-none border-0 border-b-2 border-dashed border-[#333]/35 bg-transparent px-0 py-2 text-lg focus-visible:border-[#F5B041] focus-visible:ring-0"
						/>
						{classNameError && (
							<span className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#E57373] px-2 py-0.5 text-xs font-bold text-white">
								!
							</span>
						)}
					</div>
					{classNameError && (
						<p className="text-sm text-[#C62828]">{CLASS_FORM_MESSAGES.classNameRequired}</p>
					)}
				</div>

				<div className="space-y-3">
					<Label className="text-sm font-semibold text-[#333]">Which level are we teaching?</Label>
					<div className="flex flex-wrap gap-2">
						{Array.from({ length: 12 }, (_, index) => index + 1).map((grade) => {
							const isSelected = selectedGrade === grade;
							return (
								<button
									type="button"
									key={grade}
									onClick={() => {
										setSelectedGrade(grade);
										if (gradeError) setGradeError(false);
									}}
									className={`relative h-10 w-10 rounded-full border-2 text-sm font-semibold transition-all ${
										isSelected
											? 'border-[#F5B041] bg-[#F5B041]/15 text-[#333] shadow-[0_0_0_6px_rgba(245,176,65,0.18)]'
											: 'border-[#333]/30 bg-white text-[#666] hover:border-[#F5B041]/60'
									}`}
								>
									{grade}
									{isSelected && (
										<Check className="absolute -top-1 -right-1 h-4 w-4 text-[#2E7D32]" />
									)}
								</button>
							);
						})}
					</div>
					{gradeError && (
						<p className="text-sm text-[#C62828]">{CLASS_FORM_MESSAGES.gradeRequired}</p>
					)}
				</div>

				<div className="space-y-3">
					<Label className="text-sm font-semibold text-[#333]">Select the Subject</Label>
					<div className="grid gap-3 sm:grid-cols-3">
						{CLASS_SUBJECT_OPTIONS.map((subject) => {
							const isSelected = selectedSubjectId === subject.id;
							const IconLeft = subject.IconLeft;
							const IconRight = subject.IconRight;
							return (
								<label
									key={subject.id}
									className={`cursor-pointer rounded-2xl border-2 bg-white p-4 transition-all ${
										isSelected
											? 'border-[#333] ring-4 ring-[#F5B041]/35 shadow-md'
											: 'border-[#333]/20 hover:border-[#333]/45'
									}`}
								>
									<input
										type="radio"
										name="subject"
										className="sr-only"
										checked={isSelected}
										onChange={() => {
											setSelectedSubjectId(subject.id);
											if (subjectError) setSubjectError(false);
										}}
									/>
									<div className="mb-3 flex items-center justify-center gap-2">
										<IconLeft className="h-6 w-6 text-[#333]" />
										<IconRight className="h-6 w-6 text-[#333]" />
									</div>
									<p className="text-center text-sm font-semibold text-[#333]">{subject.label}</p>
									<p className="mt-1 text-center text-xs text-[#666]">{subject.hint}</p>
								</label>
							);
						})}
					</div>
					{subjectError && (
						<p className="text-sm text-[#C62828]">{CLASS_FORM_MESSAGES.subjectRequired}</p>
					)}
				</div>

				{resolvedError && (
					<p className="rounded-xl bg-[#E57373]/15 px-3 py-2 text-sm text-[#C62828]">
						{resolvedError}
					</p>
				)}
			</div>

			<DialogFooter className="mt-8">
				{!inline && (
					<Button
						type="button"
						variant="outline"
						onClick={() => handleDialogOpenChange(false)}
						className="rounded-xl border-[#333]/25"
					>
						Cancel
					</Button>
				)}
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={submitting}
					className="rounded-xl bg-[#F5B041] font-bold text-[#333] hover:bg-[#E5A030]"
				>
					{submitting ? 'Saving...' : resolvedSubmitLabel}
				</Button>
			</DialogFooter>
		</motion.div>
	);

	if (inline) {
		return formContent;
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
			<DialogTrigger asChild>
				<Button
					className={
						triggerClassName ??
						'bg-[#F5B041] hover:bg-[#E5A030] text-[#333] font-semibold rounded-xl'
					}
				>
					<Plus className="w-4 h-4 mr-2" />
					{triggerLabel}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-3xl border-0 bg-transparent p-0 shadow-none">
				{formContent}
			</DialogContent>
		</Dialog>
	);
}
