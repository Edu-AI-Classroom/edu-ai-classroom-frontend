'use client';

import { ChevronRight, FileCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import WorkspaceHeader from '@/components/common/workspace-header';
import { useAuthUser } from '@/hooks/queries/auth/use-auth-mutation';
import { useClassList } from '@/hooks/queries/class/use-class-query';

export default function TeacherDashboard() {
	const authUser = useAuthUser();
	const { data: classListResponse } = useClassList();
	const [hoveredCard, setHoveredCard] = useState<string | null>(null);

	const classes = classListResponse?.data ?? [];
	const classroomCount = classes.length;

	const teacherName = authUser?.userName ?? 'Teacher';
	const teacherRole = authUser?.role ?? 'TEACHER';
	const features = [
		{
			id: 'classroom',
			title: 'Classroom Management',
			description: 'Manage your classes, students, assignments, and grades all in one place.',
			icon: Users,
			href: '/classroom',
			color: '#F5B041',
			stats: `${classroomCount} Classes`,
		},
		{
			id: 'quizzes',
			title: 'Quiz Dashboard',
			description: 'Create quizzes, build questions, and track student performance.',
			icon: FileCheck,
			href: '/quizzes',
			color: '#A8D5BA',
			stats: 'Manage quizzes',
		},
	];

	return (
		<div className="bg-[#FAF9F6] grid-paper">
			{/* Header */}
			<WorkspaceHeader userName={teacherName} userRole={teacherRole} />

			{/* Main Content */}
			<main className="flex-1 min-h-[80vh]">
				<div className="max-w-6xl mx-auto px-6 py-10">
					{/* Feature Launchpad */}
					<section className="mb-12">
						<h2 className="font-sans font-bold text-lg text-[#333] mb-6 flex items-center gap-2">
							<span className="w-2 h-6 rounded-full bg-[#F5B041]" />
							Welcome back, teacher {teacherName}!
						</h2>

						<div className="grid md:grid-cols-3 gap-6">
							{features.map((feature) => (
								<Link
									key={feature.id}
									href={feature.href}
									className="group"
									onMouseEnter={() => setHoveredCard(feature.id)}
									onMouseLeave={() => setHoveredCard(null)}
								>
									<div
										className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#F5B041]/30"
										style={{
											transform:
												hoveredCard === feature.id
													? 'rotate(0deg) scale(1.02)'
													: `rotate(${feature.id === 'classroom' ? -1 : feature.id === 'canvas' ? 0.5 : -0.5}deg)`,
										}}
									>
										{/* Sticker Icon */}
										<div
											className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 sticker"
											style={{ backgroundColor: feature.color }}
										>
											<feature.icon className="w-7 h-7 text-[#333]" />
										</div>

										<h3 className="font-sans font-bold text-lg text-[#333] mb-2">
											{feature.title}
										</h3>
										<p className="text-sm text-[#666] mb-4 leading-relaxed">
											{feature.description}
										</p>

										<div className="flex items-center justify-between">
											<span className="text-xs font-semibold text-[#666] bg-[#F0EDE8] px-3 py-1 rounded-full">
												{feature.stats}
											</span>
											<ChevronRight className="w-5 h-5 text-[#666] group-hover:text-[#F5B041] group-hover:translate-x-1 transition-all" />
										</div>
									</div>
								</Link>
							))}
						</div>
					</section>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-[#E0DCD5]">
				<div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-[#666]">© 2026 Teachify. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<Link href="#" className="text-sm text-[#666] hover:text-[#333]">
							Help
						</Link>
						<Link href="#" className="text-sm text-[#666] hover:text-[#333]">
							Privacy
						</Link>
						<Link href="#" className="text-sm text-[#666] hover:text-[#333]">
							Terms
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
