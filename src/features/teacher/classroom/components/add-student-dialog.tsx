'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { AddStudentPayload } from '@/types/class';

interface AddStudentDialogProps {
	onSubmit: (payload: AddStudentPayload) => Promise<void>;
	isLoading: boolean;
}

export function AddStudentDialog({ onSubmit, isLoading }: AddStudentDialogProps) {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			alert('Please enter student email');
			return;
		}

		try {
			await onSubmit({ email: email.trim() });

			setEmail('');
			setOpen(false);
		} catch {
			// Error already handled by parent component
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="rounded-xl bg-gradient-to-r from-[#A8D5BA] to-[#7BC67B] text-white border-0 shadow-md hover:shadow-lg transition-all"
					size="sm"
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Student
				</Button>
			</DialogTrigger>

			<DialogContent className="rounded-3xl bg-white shadow-xl max-w-md border border-[#E0DCD5]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-[#333]">Add Student to Class</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-4">
					<div>
						<label htmlFor="student-email" className="block text-sm font-semibold text-[#666] mb-2">
							Student Email *
						</label>
						<Input
							id="student-email"
							type="email"
							placeholder="student@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
							disabled={isLoading}
						/>
					</div>

					<div className="bg-[#F0EDE8] rounded-xl p-3 text-xs text-[#666]">
						<p className="font-semibold mb-1">Note:</p>
						<p>The student must have a registered account with this email.</p>
					</div>

					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={() => setOpen(false)}
							disabled={isLoading}
							className="flex-1 px-4 py-2.5 rounded-xl border border-[#E0DCD5] text-[#666] font-semibold hover:bg-[#F9F8F6] transition-colors disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading || !email.trim()}
							className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A8D5BA] to-[#7BC67B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
						>
							{isLoading ? 'Adding...' : 'Add Student'}
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
