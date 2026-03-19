'use client';

import { Search, X } from 'lucide-react';
import { useTeacherSearch } from '@/hooks/queries/auth/use-auth-query';
import type { RegisterFormData } from '../types';

const GRADE_OPTIONS = [
	// "Kindergarten",
	'1st Grade',
	'2nd Grade',
	'3rd Grade',
	'4th Grade',
	'5th Grade',
	'6th Grade',
	'7th Grade',
	'8th Grade',
	'9th Grade',
	'10th Grade',
	'11th Grade',
	'12th Grade',
];

type StudentOnboardingStepProps = {
	data: RegisterFormData;
	onChange: (field: keyof RegisterFormData, value: string) => void;
	screen: 1 | 2 | 3;
};

export function StudentOnboardingStep({ data, onChange, screen }: StudentOnboardingStepProps) {
	const parentEmailInvalid =
		data.parentEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.parentEmail);
	const { data: teacherResponse, isFetching } = useTeacherSearch(data.mentorQuery);
	const teacherResults = (teacherResponse?.data ?? []).filter((user) => user.role === 'TEACHER');

	return (
		<div className="w-full max-w-3xl">
			<div className="flex gap-2 mb-6 justify-center">
				{[1, 2, 3].map((step) => (
					<div
						key={step}
						className={`h-2 rounded-full transition-all duration-300 ${
							step === screen
								? 'w-12 bg-primary'
								: step < screen
									? 'w-8 bg-primary/50'
									: 'w-8 bg-border'
						}`}
					/>
				))}
			</div>

			<div className="index-card p-6 md:p-8 min-h-115 flex flex-col notebook-margin bg-background">
				{screen === 1 && (
					<div className="flex flex-col h-full animate-slide-in-right">
						<h2 className="font-handwritten text-4xl text-foreground mb-2">
							What grade are you in? 📖
						</h2>
						<p className="text-muted-foreground mb-6 text-sm">Select your current grade level</p>

						<div className="grid grid-cols-2 gap-2 max-h-55 overflow-y-auto pr-1">
							{GRADE_OPTIONS.map((grade) => (
								<button
									type="button"
									key={grade}
									onClick={() => onChange('gradeLevel', grade)}
									className={`text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-semibold ${
										data.gradeLevel === grade
											? 'border-primary bg-primary/10 text-foreground shadow-sm'
											: 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted'
									}`}
								>
									{grade}
								</button>
							))}
						</div>
					</div>
				)}

				{screen === 2 && (
					<div className="flex flex-col h-full animate-slide-in-right">
						<h2 className="font-handwritten text-4xl text-foreground mb-2">Who invited you? 🔍</h2>
						<p className="text-muted-foreground mb-6 text-md">
							Find the teacher who brought you to Teachify (optional)
						</p>

						<div className="relative mb-4">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<input
								type="text"
								value={data.mentorQuery}
								onChange={(event) => {
									onChange('mentorQuery', event.target.value);
									onChange('mentorName', '');
								}}
								placeholder="Search by Name or Email..."
								className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
							/>
						</div>

						{isFetching && (
							<p className="text-muted-foreground text-sm text-center py-3 opacity-70">
								Searching teachers...
							</p>
						)}

						{!isFetching && data.mentorQuery.length >= 2 && teacherResults.length > 0 && (
							<div className="space-y-2 max-h-60 overflow-y-auto">
								{teacherResults.map((teacher) => {
									const teacherDisplay = teacher.userName ?? teacher.email ?? '';
									return (
										<button
											type="button"
											key={teacher.userId}
											onClick={() => {
												onChange('mentorName', teacherDisplay);
												onChange('mentorQuery', teacherDisplay);
											}}
											className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
												data.mentorName === teacherDisplay
													? 'border-primary bg-primary/10'
													: 'border-border bg-card hover:border-primary/40'
											}`}
										>
											<p className="text-sm font-semibold text-foreground">
												{teacher.userName ?? 'Unknown Teacher'}
											</p>
											<p className="text-xs text-muted-foreground">{teacher.email ?? ''}</p>
										</button>
									);
								})}
							</div>
						)}

						{!isFetching && data.mentorQuery.length >= 2 && teacherResults.length === 0 && (
							<p className="text-muted-foreground text-sm text-center py-8 opacity-60">
								No teachers found matching "{data.mentorQuery}".
							</p>
						)}

						<p className="text-muted-foreground text-xs opacity-60 mt-4">
							This step is optional — you can continue without selecting a mentor.
						</p>
					</div>
				)}

				{screen === 3 && (
					<div className="flex flex-col h-full animate-slide-in-right">
						<h2 className="font-handwritten text-4xl text-foreground mb-2">
							Bring your parents along! 👨‍👩‍👧
						</h2>
						<p className="text-muted-foreground mb-8 text-md">
							Add your parent's email so they can celebrate your progress.
						</p>

						<div className="mb-2">
							<div className="relative">
								<input
									type="email"
									value={data.parentEmail}
									onChange={(event) => onChange('parentEmail', event.target.value)}
									placeholder="parent@email.com"
									className={`w-full bg-transparent border-b-2 px-1 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none transition-all text-lg ${
										parentEmailInvalid
											? 'border-destructive wiggly-underline'
											: 'border-border focus:border-primary'
									}`}
								/>
								{parentEmailInvalid && (
									<X className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
								)}
							</div>

							{parentEmailInvalid && (
								<div className="sticky-note mt-4 text-sm flex items-center gap-2">
									<span className="text-destructive font-bold">✗</span>
									<span>Oops! This doesn't look like a valid email.</span>
								</div>
							)}
						</div>

						<p className="text-muted-foreground text-sm opacity-60 mt-auto">
							This is optional — you can always add it later in settings.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
