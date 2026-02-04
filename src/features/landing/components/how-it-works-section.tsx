'use client';

import { ArrowRight, BookOpen, PenTool, Send, TrendingUp } from 'lucide-react';
import { StickerIcon } from './sticker-icon';

const steps = [
	{
		icon: PenTool,
		title: 'Create',
		description:
			'Design lessons, assignments, and exams using our intuitive Canvas with drag-and-drop templates.',
		color: 'bg-[#C5B4E3]',
		number: '01',
	},
	{
		icon: Send,
		title: 'Assign',
		description:
			'Share your content with classes. Students get instant access to their personalized learning materials.',
		color: 'bg-[#A8D4E6]',
		number: '02',
	},
	{
		icon: BookOpen,
		title: 'Learn',
		description:
			'Students complete work with AI guidance. Step-by-step hints help them understand concepts deeply.',
		color: 'bg-[#A8D5BA]',
		number: '03',
	},
	{
		icon: TrendingUp,
		title: 'Track',
		description:
			'Monitor progress with detailed analytics. Teachers and parents stay informed every step of the way.',
		color: 'bg-[#F5B041]',
		number: '04',
	},
];

export function HowItWorksSection() {
	return (
		<section id="how-it-works" className="relative py-20 md:py-28 grid-paper">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<span className="font-serif text-xl text-[#F5B041]">Simple & Easy</span>
					<h2 className="mt-2 text-balance font-sans text-3xl font-extrabold text-charcoal md:text-4xl lg:text-5xl">
						How It Works
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Four simple steps to transform your teaching and learning experience.
					</p>
				</div>

				{/* Steps */}
				<div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div key={step.title} className="relative">
								{/* Connector Arrow (hidden on mobile and last item) */}
								{index < steps.length - 1 && (
									<div className="absolute right-0 top-12 hidden translate-x-1/2 lg:block">
										<ArrowRight className="h-6 w-6 text-border" />
									</div>
								)}

								<div className="relative rounded-2xl bg-card p-6 shadow-lg">
									{/* Step Number */}
									<span className="absolute -left-2 -top-2 font-serif text-5xl font-bold text-[#F5B041]/30">
										{step.number}
									</span>

									{/* Icon */}
									<div className="flex justify-center">
										<StickerIcon bgColor={step.color} className="h-20 w-20">
											<Icon className="h-10 w-10 text-charcoal" />
										</StickerIcon>
									</div>

									{/* Content */}
									<div className="mt-6 text-center">
										<h3 className="font-sans text-xl font-bold text-charcoal">{step.title}</h3>
										<p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
