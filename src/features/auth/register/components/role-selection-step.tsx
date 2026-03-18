'use client';

import { useState } from 'react';
import type { RegisterRole } from '../types';

type RoleSelectionStepProps = {
	selectedRole: RegisterRole | null;
	onSelectRole: (role: RegisterRole) => void;
};

export function RoleSelectionStep({ selectedRole, onSelectRole }: RoleSelectionStepProps) {
	const [hoveredCard, setHoveredCard] = useState<RegisterRole | null>(null);
	const isTeacherSelected = selectedRole === 'TEACHER';
	const isStudentSelected = selectedRole === 'STUDENT';

	return (
		<div className="relative space-y-10">
			<div className="absolute -top-4 right-130 text-2xl opacity-50">📌</div>
			<div className="absolute -top-3 left-135 text-xl opacity-40">📎</div>
			<div className="absolute bottom-70 left-110 text-2xl opacity-40 rotate-12">✏️</div>

			<div className="space-y-2 text-center">
				<h1 className="font-handwritten text-4xl md:text-5xl text-card-foreground mb-4 text-center animate-fade-in">
					Tell us who you are!
				</h1>
				<p className="text-muted-foreground text-lg mb-16 font-handwritten animate-fade-in">
					Pick your card to get started
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<button
					type="button"
					onMouseEnter={() => setHoveredCard('TEACHER')}
					onMouseLeave={() => setHoveredCard(null)}
					onClick={() => onSelectRole('TEACHER')}
					className="group relative focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-lg"
				>
					{/* Washi tape decoration */}
					<div
						className={`absolute -top-4 left-6 z-10 w-20 h-7 rounded-sm transition-all duration-300 ${
							hoveredCard === 'TEACHER' || isTeacherSelected
								? 'opacity-100 scale-100'
								: 'opacity-0 scale-75'
						}`}
						style={{
							background: 'linear-gradient(135deg, var(--golden-yellow), var(--pastel-pink))',
							transform: `rotate(-8deg) ${hoveredCard === 'TEACHER' || isTeacherSelected ? 'scale(1)' : 'scale(0.75)'}`,
						}}
					/>

					<div
						className={`polaroid w-64 md:w-72 cursor-pointer transition-all duration-300 ease-out ${
							isTeacherSelected ? 'ring-2 ring-primary/60' : ''
						}`}
						style={{
							transform:
								hoveredCard === 'TEACHER' || isTeacherSelected
									? 'rotate(2deg) translateY(-8px)'
									: 'rotate(-2deg)',
						}}
					>
						<div className="bg-linear-to-br from-pastel-green to-pastel-blue rounded-md h-48 flex items-center justify-center mb-4">
							<div className="text-7xl flex gap-3">
								<span className="inline-block hover-scale">☕</span>
								<span className="inline-block hover-scale">🖊️</span>
							</div>
						</div>
						<p className="font-handwritten text-2xl text-card-foreground text-center pb-2">
							I am a Teacher
						</p>
					</div>
				</button>

				<button
					type="button"
					onMouseEnter={() => setHoveredCard('STUDENT')}
					onMouseLeave={() => setHoveredCard(null)}
					onClick={() => onSelectRole('STUDENT')}
					className="group relative focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-lg"
				>
					{/* Washi tape decoration */}
					<div
						className={`absolute -top-4 right-6 z-10 w-20 h-7 rounded-sm transition-all duration-300 ${
							hoveredCard === 'STUDENT' || isStudentSelected
								? 'opacity-100 scale-100'
								: 'opacity-0 scale-75'
						}`}
						style={{
							background: 'linear-gradient(135deg, var(--pastel-green), var(--pastel-blue))',
							transform: `rotate(6deg) ${hoveredCard === 'STUDENT' || isStudentSelected ? 'scale(1)' : 'scale(0.75)'}`,
						}}
					/>

					<div
						className={`polaroid w-64 md:w-72 cursor-pointer transition-all duration-300 ease-out ${
							isStudentSelected ? 'ring-2 ring-primary/60' : ''
						}`}
						style={{
							transform:
								hoveredCard === 'STUDENT' || isStudentSelected
									? 'rotate(-2deg) translateY(-8px)'
									: 'rotate(1.5deg)',
						}}
					>
						<div className="bg-linear-to-br from-pastel-purple to-pastel-pink rounded-md h-48 flex items-center justify-center mb-4">
							<div className="text-7xl flex gap-3">
								<span className="inline-block hover-scale">🎒</span>
								<span className="inline-block hover-scale">📖</span>
							</div>
						</div>
						<p className="font-handwritten text-2xl text-card-foreground text-center pb-2">
							I am a Student
						</p>
					</div>
				</button>
			</div>
		</div>
	);
}
