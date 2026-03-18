'use client';

import { ArrowLeft, BookOpen, Clock, Loader2, Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import WorkspaceHeader from '@/components/common/workspace-header';
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
import type { ClassroomUiData } from '@/features/teacher/classroom/classroom.mapper';
import { useAuthUser } from '@/hooks/queries/auth/use-auth-mutation';
import { useClassMutations } from '@/hooks/queries/class/use-class-mutation';

interface StudentClassListViewProps {
	classes: ClassroomUiData[];
	onSelectClass: (classId: number) => void;
}

export default function StudentClassListView({
	classes,
	onSelectClass,
}: StudentClassListViewProps) {
	const authUser = useAuthUser();
	const [searchQuery, setSearchQuery] = useState('');
	const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
	const [classCode, setClassCode] = useState('');
	const { joinClassMutation, classError, clearClassError } = useClassMutations();

	const studentName = authUser?.userName ?? 'Student';

	const handleJoinClass = () => {
		if (!classCode.trim()) return;
		clearClassError();
		joinClassMutation.mutate(
			{ classCode: classCode.trim() },
			{
				onSuccess: () => {
					setIsJoinDialogOpen(false);
					setClassCode('');
				},
			},
		);
	};

	const filteredClasses = classes.filter(
		(c) =>
			c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.subject.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className=" bg-[#FAF9F6] grid-paper">
			{/* Header */}
			<WorkspaceHeader userName={studentName} userRole="STUDENT" />

			{/* Main Content */}
			<main className="flex-1 min-h-[80vh] max-w-6xl mx-auto px-6 py-10">
				{/* Back Link & Title */}
				<div className="mb-8">
					<Link
						href="/student"
						className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#333] mb-4"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Dashboard
					</Link>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="font-sans font-bold text-3xl text-[#333]">My Classes</h1>
							<p className="font-serif text-lg text-[#666]">
								Select a class to access materials and assignments
							</p>
						</div>
						<div className="flex items-center gap-3">
							<Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
								<DialogTrigger asChild>
									<Button className="bg-[#F5B041] hover:bg-[#F39C12] text-white rounded-xl gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
										<Plus className="w-5 h-5" />
										Join Class
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md rounded-2xl border-[#E0DCD5]">
									<DialogHeader>
										<DialogTitle className="text-2xl font-bold">Join Classroom</DialogTitle>
										<DialogDescription className="text-muted-foreground">
											Enter the class code shared by your teacher to join.
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="classCode" className="font-semibold text-[#333]">
												Class Code
											</Label>
											<Input
												id="classCode"
												placeholder="e.g. 123"
												value={classCode}
												onChange={(e) => setClassCode(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === 'Enter') handleJoinClass();
												}}
												className="rounded-xl border-[#E0DCD5] focus:ring-[#F5B041] focus:border-[#F5B041]"
											/>
											{classError && (
												<p className="text-sm text-red-500 font-medium">{classError}</p>
											)}
										</div>
									</div>
									<DialogFooter>
										<Button
											variant="ghost"
											onClick={() => {
												setIsJoinDialogOpen(false);
												clearClassError();
											}}
											className="rounded-xl"
										>
											Cancel
										</Button>
										<Button
											onClick={handleJoinClass}
											disabled={joinClassMutation.isPending || !classCode.trim()}
											className="bg-[#F5B041] hover:bg-[#F39C12] text-white rounded-xl gap-2"
										>
											{joinClassMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
											Join Now
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</div>

				{/* Search */}
				<div className="relative mb-8 max-w-md">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
					<Input
						placeholder="Search classes..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 rounded-xl bg-white border-[#E0DCD5]"
					/>
				</div>

				{/* Class Grid */}
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredClasses.map((classItem) => (
						<button
							type="button"
							key={classItem.id}
							onClick={() => onSelectClass(classItem.id)}
							className="text-left group"
						>
							<div
								className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#F5B041]/30"
								style={{
									transform: `rotate(${classItem.rotation}deg)`,
								}}
							>
								{/* Color Badge */}
								<div
									className="absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
									style={{ backgroundColor: classItem.color }}
								>
									<BookOpen className="w-4 h-4 text-[#333]" />
								</div>

								<div className="mb-4">
									<h3 className="font-sans font-bold text-xl text-[#333] group-hover:text-[#F5B041] transition-colors">
										{classItem.name}
									</h3>
									<p className="text-sm text-[#666]">{classItem.subject}</p>
									<p className="text-xs text-[#999] font-medium mt-1">{classItem.grade}</p>
								</div>

								<div className="flex flex-col gap-2 text-sm text-[#666] mb-4">
									<div className="flex items-center gap-2">
										<Users className="w-4 h-4" />
										<span>{classItem.studentCount} classmates</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
											<span className="text-xs font-semibold text-blue-700">
												{classItem.teacherName ? classItem.teacherName.charAt(0) : 'T'}
											</span>
										</div>
										<span className="truncate">{classItem.teacherName || 'Teacher'}</span>
									</div>
								</div>

								{/* Indicators */}
								<div className="flex flex-wrap gap-2">
									{classItem.upcomingDeadlines > 0 && (
										<span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[#E57373]/20 text-[#C62828]">
											<Clock className="w-3 h-3" />
											{classItem.upcomingDeadlines} assignments due
										</span>
									)}
								</div>
							</div>
						</button>
					))}
				</div>

				{filteredClasses.length === 0 && (
					<div className="text-center py-16">
						<div className="w-16 h-16 rounded-full bg-[#F0EDE8] flex items-center justify-center mx-auto mb-4">
							<Search className="w-8 h-8 text-[#999]" />
						</div>
						<p className="text-[#666]">
							{classes.length === 0
								? 'You are not enrolled in any classes yet.'
								: 'No classes found matching your search.'}
						</p>
					</div>
				)}
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
