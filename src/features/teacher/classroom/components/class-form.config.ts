import { BookOpen, Globe2, MessageCircle, PenTool, Ruler, Square } from 'lucide-react';
import type { CreateClassroomPayload } from '@/types/class';

export type ClassSubjectOption = {
	id: NonNullable<CreateClassroomPayload['subjectId']>;
	label: string;
	hint: string;
	IconLeft: typeof Ruler;
	IconRight: typeof Square;
};

export const CLASS_SUBJECT_OPTIONS: ClassSubjectOption[] = [
	{
		id: 1,
		label: 'Mathematics',
		hint: 'Numbers, logic, and problem-solving',
		IconLeft: Ruler,
		IconRight: Square,
	},
	{
		id: 2,
		label: 'Literature',
		hint: 'Stories, poetry, and expression',
		IconLeft: PenTool,
		IconRight: BookOpen,
	},
	{
		id: 3,
		label: 'English',
		hint: 'Communication and global fluency',
		IconLeft: MessageCircle,
		IconRight: Globe2,
	},
] as const;

export const CLASS_FORM_MESSAGES = {
	classNameRequired: 'Every adventure needs a name!',
	subjectRequired: 'Which subject do you teaching in this class?',
	gradeRequired: 'Please choose a grade level.',
} as const;

export const parseGradeLevel = (value: string) => {
	const matched = value.match(/\d+/);
	if (!matched) return undefined;

	const parsed = Number(matched[0]);
	return Number.isNaN(parsed) ? undefined : parsed;
};

export const mapSubjectNameToId = (value: string) => {
	const normalized = value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, ' ');

	// Accept direct numeric values when subject name is serialized as id.
	if (normalized === '1' || normalized === '2' || normalized === '3') {
		return Number(normalized);
	}

	const subjectByLabel = CLASS_SUBJECT_OPTIONS.find((subject) => {
		const normalizedLabel = subject.label
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
		return normalized === normalizedLabel || normalized.includes(normalizedLabel);
	});
	if (subjectByLabel) return subjectByLabel.id;

	if (normalized.includes('math') || normalized.includes('toan')) return 1;
	if (normalized.includes('literature') || normalized === 'lit' || normalized.includes('van')) {
		return 2;
	}
	if (normalized.includes('english') || normalized.includes('anh')) return 3;

	return undefined;
};
