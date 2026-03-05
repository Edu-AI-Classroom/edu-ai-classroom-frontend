'use client';

import { useEffect, useState } from 'react';
import type { RegisterRole } from '../types';

type WelcomeStepProps = {
	role: RegisterRole | null;
	name: string;
};

export function WelcomeStep({ role, name }: WelcomeStepProps) {
	const isTeacher = role === 'TEACHER';
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setShowContent(true), 250);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="relative overflow-hidden rounded-2xl min-h-90 p-6">
			<div
				className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 ${
					showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
				}`}
			>
				<div className="relative mb-6">
					<div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-golden-yellow flex items-center justify-center sticker-glow">
						<span className="text-5xl md:text-6xl">{isTeacher ? '👩‍🏫' : '🎓'}</span>
					</div>
					<div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-pastel-purple flex items-center justify-center shadow-lg">
						<span className="text-2xl">⭐</span>
					</div>
				</div>

				<h2 className="font-handwritten text-5xl text-foreground mb-3">Welcome to Teachify!</h2>
				<p className="text-muted-foreground text-base md:text-xl max-w-lg leading-relaxed">
					{isTeacher
						? `${name || 'Teacher'}, your smart classroom is ready.`
						: `${name || 'Student'}, your learning journey starts now.`}
				</p>
				<p className="mt-3 text-md text-muted-foreground opacity-70">
					Enter Complete Registration” to complete your setup.
				</p>
			</div>
		</div>
	);
}
