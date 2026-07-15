'use client';

import { MessageSquareText, Send, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	useCreateSiteFeedback,
	useSiteFeedback,
} from '@/hooks/queries/site-feedback/use-site-feedback-query';
import { cn } from '@/lib/utils/utils';

export function FeedbackSection() {
	const { data: feedback = [] } = useSiteFeedback(6);
	const createFeedback = useCreateSiteFeedback();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('TEACHER');
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');

	const averageRating = useMemo(() => {
		if (!feedback.length) return 0;
		return feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length;
	}, [feedback]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!name.trim() || !comment.trim()) return;

		await createFeedback.mutateAsync({
			name: name.trim(),
			email: email.trim() || undefined,
			role,
			rating,
			comment: comment.trim(),
		});

		setName('');
		setEmail('');
		setRole('TEACHER');
		setRating(5);
		setComment('');
	};

	return (
		<section className="grid-paper bg-[#FAF9F6] py-20 md:py-28">
			<div className="container mx-auto px-4">
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full border border-[#E0DCD5] bg-white px-4 py-2 text-sm font-semibold text-[#333] shadow-sm">
							<MessageSquareText className="h-4 w-4 text-[#F5B041]" />
							Community feedback
						</div>
						<h2 className="mt-5 max-w-2xl font-sans text-3xl font-extrabold text-charcoal md:text-4xl">
							What teachers, students and parents are saying
						</h2>
						<p className="mt-3 max-w-2xl text-base leading-relaxed text-[#666]">
							Share a quick rating after trying Teachify. Your feedback helps shape the product and
							gives the admin team a clearer view of what works.
						</p>

						<div className="mt-8 grid gap-4 sm:grid-cols-3">
							<div className="rounded-2xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#999]">
									Average rating
								</p>
								<p className="mt-2 font-sans text-3xl font-bold text-[#333]">
									{averageRating ? averageRating.toFixed(1) : '0.0'}
								</p>
							</div>
							<div className="rounded-2xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#999]">
									Reviews
								</p>
								<p className="mt-2 font-sans text-3xl font-bold text-[#333]">{feedback.length}</p>
							</div>
							<div className="rounded-2xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#999]">
									Top score
								</p>
								<p className="mt-2 font-sans text-3xl font-bold text-[#333]">5/5</p>
							</div>
						</div>

						<div className="mt-6 grid gap-4 md:grid-cols-2">
							{feedback.slice(0, 4).map((item) => (
								<div
									key={item.id}
									className="rounded-2xl border border-[#E0DCD5] bg-white p-5 shadow-sm"
								>
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="font-sans font-bold text-[#333]">{item.name}</p>
											<p className="text-xs font-medium uppercase tracking-[0.12em] text-[#999]">
												{item.role ?? 'Visitor'}
											</p>
										</div>
										<RatingStars rating={item.rating} readonly />
									</div>
									<p className="mt-4 line-clamp-4 text-sm leading-relaxed text-[#555]">
										{item.comment}
									</p>
								</div>
							))}
							{feedback.length === 0 && (
								<div className="rounded-2xl border border-dashed border-[#E0DCD5] bg-white/70 p-8 text-sm text-[#666] md:col-span-2">
									No public feedback yet. Be the first to leave a note.
								</div>
							)}
						</div>
					</div>

					<form
						onSubmit={handleSubmit}
						className="rounded-2xl border border-[#E0DCD5] bg-white p-6 shadow-lg"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5B041] shadow-sm">
								<Star className="h-6 w-6 text-[#333]" />
							</div>
							<div>
								<h3 className="font-sans text-xl font-bold text-[#333]">Rate Teachify</h3>
								<p className="text-sm text-[#666]">Takes less than a minute.</p>
							</div>
						</div>

						<div className="mt-6 space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="feedback-name">Name</Label>
									<Input
										id="feedback-name"
										value={name}
										onChange={(event) => setName(event.target.value)}
										placeholder="Your name"
										className="rounded-xl"
										maxLength={120}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="feedback-email">Email</Label>
									<Input
										id="feedback-email"
										type="email"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										placeholder="name@gmail.com"
										className="rounded-xl"
										maxLength={255}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="feedback-role">Role</Label>
								<select
									id="feedback-role"
									value={role}
									onChange={(event) => setRole(event.target.value)}
									className="h-10 w-full rounded-xl border border-[#E0DCD5] bg-white px-3 text-sm text-[#333] outline-none focus:border-[#F5B041]"
								>
									<option value="TEACHER">Teacher</option>
									<option value="STUDENT">Student</option>
									<option value="PARENT">Parent</option>
									<option value="ADMIN">Admin</option>
									<option value="VISITOR">Visitor</option>
								</select>
							</div>

							<div className="space-y-2">
								<Label>Rating</Label>
								<RatingStars rating={rating} onChange={setRating} />
							</div>

							<div className="space-y-2">
								<Label htmlFor="feedback-comment">Comment</Label>
								<Textarea
									id="feedback-comment"
									value={comment}
									onChange={(event) => setComment(event.target.value)}
									placeholder="What did Teachify help you do better?"
									className="min-h-32 rounded-xl"
									maxLength={1000}
									required
								/>
								<p className="text-right text-xs text-[#999]">{comment.length}/1000</p>
							</div>
						</div>

						<Button
							type="submit"
							disabled={createFeedback.isPending || !name.trim() || !comment.trim()}
							className="mt-6 w-full rounded-xl bg-[#333] text-white hover:bg-[#444]"
						>
							<Send className="mr-2 h-4 w-4" />
							Submit feedback
						</Button>
					</form>
				</div>
			</div>
		</section>
	);
}

function RatingStars({
	rating,
	onChange,
	readonly,
}: {
	rating: number;
	onChange?: (rating: number) => void;
	readonly?: boolean;
}) {
	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((value) => (
				<button
					key={value}
					type="button"
					disabled={readonly}
					onClick={() => onChange?.(value)}
					className={cn('rounded-md p-0.5 transition', !readonly && 'hover:scale-110')}
					aria-label={`Rate ${value} stars`}
				>
					<Star
						className={cn(
							'h-5 w-5',
							value <= rating ? 'fill-[#F5B041] text-[#F5B041]' : 'text-[#D8D2C8]',
						)}
					/>
				</button>
			))}
		</div>
	);
}
