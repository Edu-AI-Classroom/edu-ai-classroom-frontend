'use client';

import {
	BarChart3,
	CheckSquare,
	FileText,
	FolderOpen,
	GraduationCap,
	Heart,
	Layers,
	Lightbulb,
	Users,
	Video,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/utils';
import { StickerIcon } from './sticker-icon';

type Role = 'teachers' | 'students';

const features = {
	teachers: [
		{
			icon: Layers,
			title: 'Drag & Drop Canvas',
			description:
				'Create beautiful lessons with our intuitive drag-and-drop builder and pre-built templates.',
			color: 'bg-[#C5B4E3]',
		},
		{
			icon: FolderOpen,
			title: 'Content Bank & Sharing',
			description:
				'Store, organize, and share lesson blocks. Access public content from other educators.',
			color: 'bg-[#A8D4E6]',
		},
		{
			icon: CheckSquare,
			title: 'Auto-Grading',
			description:
				'Save hours with automatic and semi-automatic grading for assignments and exams.',
			color: 'bg-[#A8D5BA]',
		},
		{
			icon: BarChart3,
			title: 'Progress Tracking',
			description: 'Monitor student performance with detailed analytics and insightful reports.',
			color: 'bg-[#F2C4CE]',
		},
	],
	students: [
		{
			icon: Lightbulb,
			title: 'Step-by-Step AI Guide',
			description:
				'Get helpful hints and explanations while working on assignments. Learn at your own pace.',
			color: 'bg-[#F5B041]',
		},
		{
			icon: Video,
			title: 'Meeting & Enrollment',
			description: 'Join online classes easily and enroll in courses with just a few clicks.',
			color: 'bg-[#C5B4E3]',
		},
		{
			icon: FileText,
			title: 'Easy Assignment Access',
			description: 'All your homework and exams in one place. Never miss a deadline again.',
			color: 'bg-[#A8D4E6]',
		},
	],
};

const roleIcons = {
	teachers: GraduationCap,
	students: Users,
	parents: Heart,
};

export function FeaturesSection() {
	const [activeRole, setActiveRole] = useState<Role>('teachers');

	return (
		<section id="features" className="py-20 md:py-28">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<span className="font-serif text-xl text-[#F5B041]">What we offer</span>
					<h2 className="mt-2 text-balance font-sans text-3xl font-extrabold text-charcoal md:text-4xl lg:text-5xl">
						Features for Everyone
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Teachify brings teachers, students, and parents together in one beautiful learning
						space.
					</p>
				</div>

				{/* Role Tabs */}
				<div className="mt-12 flex justify-center">
					<div className="inline-flex rounded-full bg-secondary p-1.5">
						{(['teachers', 'students'] as Role[]).map((role) => {
							const Icon = roleIcons[role];
							return (
								<button
									type="button"
									key={role}
									onClick={() => setActiveRole(role)}
									className={cn(
										'flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all',
										activeRole === role
											? 'bg-[#F5B041] text-charcoal shadow-md'
											: 'text-charcoal/60 hover:text-charcoal',
									)}
								>
									<Icon className="h-4 w-4" />
									<span className="capitalize">{role}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Feature Cards */}
				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{features[activeRole as keyof typeof features].map((feature, index) => {
						const Icon = feature.icon;
						const rotations = [-2, 1, -1, 2];
						return (
							<div
								key={feature.title}
								className="group relative rounded-2xl bg-card p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
								style={{ transform: `rotate(${rotations[index % 4]}deg)` }}
							>
								<div className="absolute -right-2 -top-2">
									<StickerIcon bgColor={feature.color} className="h-14 w-14">
										<Icon className="h-6 w-6 text-charcoal" />
									</StickerIcon>
								</div>
								<div className="pt-8">
									<h3 className="font-sans text-lg font-bold text-charcoal">{feature.title}</h3>
									<p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
