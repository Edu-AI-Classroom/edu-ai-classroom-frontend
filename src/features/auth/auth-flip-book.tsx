'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Star, Sun, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TeachifyIcon } from '@/components/common/Teachify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clearRegisterDraft } from '@/features/auth/register/register-draft';
import { useAuthMutations } from '@/hooks/queries/auth/use-auth-mutation';

type RegisterBasicInfo = {
	name: string;
	email: string;
	password: string;
};

interface AuthFlipBookProps {
	initialMode: 'login' | 'register';
	registerFormData?: RegisterBasicInfo;
	onRegisterFormDataChange?: (data: RegisterBasicInfo) => void;
	onRegisterNextStep?: (data: RegisterBasicInfo) => void;
	registerSubmitLabel?: string;
	disableModeSwitch?: boolean;
}

const spiralDots = Array.from({ length: 12 }, (_, index) => `spiral-dot-${index}`);

export function AuthFlipBook({
	initialMode,
	registerFormData,
	onRegisterFormDataChange,
	onRegisterNextStep,
	registerSubmitLabel,
	disableModeSwitch = false,
}: AuthFlipBookProps) {
	const router = useRouter();
	const [isSignup, setIsSignup] = useState(initialMode === 'register');
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [registerName, setRegisterName] = useState('');
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');
	const { clearAuthError, loginMutation } = useAuthMutations();

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const isLoginValid =
		emailRegex.test(loginEmail.trim()) &&
		loginPassword.trim().length >= 6 &&
		loginPassword.trim().length <= 12;
	const isRegisterValid =
		registerName.trim().length > 0 &&
		emailRegex.test(registerEmail.trim()) &&
		registerPassword.trim().length >= 6;

	const syncRegisterForm = (patch: Partial<RegisterBasicInfo>) => {
		const nextData = {
			name: patch.name ?? registerName,
			email: patch.email ?? registerEmail,
			password: patch.password ?? registerPassword,
		};
		onRegisterFormDataChange?.(nextData);
	};

	// Sync state if initialMode prop changes (though usually component remounts on route change)
	useEffect(() => {
		setIsSignup(initialMode === 'register');
		clearAuthError();
		if (initialMode === 'login') {
			clearRegisterDraft();
		}
	}, [initialMode, clearAuthError]);

	useEffect(() => {
		if (!registerFormData) return;
		setRegisterName(registerFormData.name);
		setRegisterEmail(registerFormData.email);
		setRegisterPassword(registerFormData.password);
	}, [registerFormData]);

	const toggleMode = () => {
		if (disableModeSwitch) return;
		const newMode = !isSignup;
		setIsSignup(newMode);
		clearAuthError();

		const path = newMode ? '/register' : '/login';
		router.push(path);
	};

	return (
		<div className="min-h-screen w-full bg-[#FAF9F6] grid-paper overflow-hidden flex items-center justify-center p-4 perspective-[2000px]">
			<div className="absolute top-10 left-10">
				<TeachifyIcon />
			</div>
			{/* 3D Container - The "Book" */}
			<motion.div
				className="relative w-full max-w-5xl aspect-video min-h-150 flex items-center justify-center preserve-3d"
				animate={{ rotateY: isSignup ? -180 : 0 }}
				transition={{
					duration: 0.8,
					type: 'spring',
					stiffness: 60,
					damping: 12,
				}}
				style={{ transformStyle: 'preserve-3d' }}
			>
				{/* ================= FRONT FACE (LOGIN) ================= */}
				<div
					className="absolute inset-0 w-full h-full backface-hidden"
					style={{ backfaceVisibility: 'hidden' }}
				>
					<div className="w-full h-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden border-4 border-[#3a3a3a]/10 bg-[#FAF9F6]">
						{/* Left Side: Mood Board (Front) */}
						<div className="relative flex flex-col items-center justify-center p-10 bg-white/50 pattern-dots md:border-r border-dashed border-gray-300">
							{/* Polaroid Image */}
							<div className="polaroid rotate-2 transition-transform hover:rotate-0 duration-500 bg-white p-4 shadow-xl max-w-sm w-full relative z-10 rounded-sm">
								<div className="aspect-4/3 bg-gray-100 w-full mb-4 rounded-sm flex items-center justify-center overflow-hidden border border-gray-100">
									<div className="flex flex-col items-center justify-center text-gray-400">
										<User className="w-16 h-16 mb-2 opacity-50" />
										<span className="font-sans text-sm">Classroom Photo</span>
									</div>
								</div>
								<div className="font-serif text-2xl text-center text-gray-600 rotate-1">
									Learning is an adventure!
								</div>
							</div>

							{/* Sticker Decorations */}
							<motion.div
								animate={{ scale: [1, 1.1, 1] }}
								transition={{ repeat: Infinity, duration: 4 }}
								className="sticker absolute top-[20%] left-[10%] -rotate-12 bg-white rounded-full p-3 shadow-lg border-4 border-white z-20"
							>
								<Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
							</motion.div>

							<div className="sticker absolute bottom-[20%] right-[10%] rotate-12 bg-white rounded-full p-3 shadow-lg border-4 border-white z-20">
								<BookOpen className="w-8 h-8 text-blue-400" />
							</div>
						</div>

						{/* Right Side: Login Form (Front) */}
						<div className="relative flex items-center justify-center p-8 bg-white">
							{/* Spiral Binding Visual on Left Edge */}
							<div className="absolute left-0 top-4 bottom-4 w-8 flex flex-col justify-evenly z-30">
								{spiralDots.map((dotId) => (
									<div
										key={dotId}
										className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-400 -ml-2 shadow-inner"
									/>
								))}
							</div>

							<div className="w-full max-w-sm">
								<div className="mb-8 text-center">
									<h1 className="text-3xl font-sans font-bold text-[#333333] mb-2">Login Here</h1>
									<p className="font-serif text-xl text-gray-500 -rotate-2">Welcome back!</p>
								</div>

								<form
									className="space-y-6"
									onSubmit={(event) => {
										event.preventDefault();
										clearAuthError();
										if (!isLoginValid) return;
										loginMutation.mutate({
											email: loginEmail,
											password: loginPassword,
										});
									}}
								>
									<div className="space-y-2">
										<Label htmlFor="email_login">Email Address</Label>
										<div className="relative group">
											<Input
												id="email_login"
												type="email"
												placeholder="student@school.edu"
												value={loginEmail}
												onChange={(event) => setLoginEmail(event.target.value)}
												className="pl-10 bg-gray-50 border-b-2 border-t-0 border-x-0 border-dashed border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-[#F4D06F] px-3 py-6"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="password_login">Password</Label>
										<div className="relative group">
											<Input
												id="password_login"
												type="password"
												placeholder="••••••••"
												value={loginPassword}
												onChange={(event) => setLoginPassword(event.target.value)}
												className="pl-10 bg-gray-50 border-b-2 border-t-0 border-x-0 border-dashed border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-[#F4D06F] px-3 py-6"
											/>
										</div>
									</div>
									<Button
										type="submit"
										disabled={loginMutation.isPending || !isLoginValid}
										className="w-full bg-[#F4D06F] text-[#333333] font-bold text-lg rounded-xl shadow-[4px_4px_0px_#ca8a04] hover:shadow-[2px_2px_0px_#ca8a04] hover:-translate-y-0.5 transition-all border-2 border-[#333] disabled:opacity-70 disabled:shadow-none disabled:hover:translate-y-0"
									>
										{loginMutation.isPending ? 'Logging in...' : 'Login'}
									</Button>
								</form>

								{/* Switcher */}
								<div className="mt-8 text-center relative">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t border-dashed border-gray-300"></span>
									</div>
									<div className="relative flex justify-center">
										<span className="bg-white px-4 text-sm text-gray-400 font-serif">or</span>
									</div>
								</div>

								{!disableModeSwitch && (
									<div className="mt-4 text-center">
										<button
											type="button"
											onClick={toggleMode}
											className="group flex items-center justify-center gap-2 mx-auto font-serif text-xl text-[#F4D06F] font-bold hover:underline decoration-wavy"
										>
											<span>You're new here? Sign up</span>
											<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* ================= BACK FACE (SIGNUP) ================= */}
				<div
					className="absolute inset-0 w-full h-full backface-hidden"
					style={{
						backfaceVisibility: 'hidden',
						transform: 'rotateY(180deg)',
					}}
				>
					<div className="w-full h-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden border-4 border-[#3a3a3a]/10 bg-[#FAF9F6] transform scale-x-[-1] md:scale-x-100">
						{/* Note: When flipped 180Y, the content is mirrored relative to the viewer. 
                 Since we apply rotateY(180deg) to the container, the content inside this div 
                 will appear correct if we construct it such that 'Left' here is essentially the 'Right' of the back cover.
                 Wait, if I rotateY(180), "Left" becomes "Right" relative to the view.
                 Usually, you design the back face normally, and apply rotateY(180) to it.
             */}

						{/* Left Side: Register Form (Back of the 'Book Title Page' which was on the right) */}
						<div className="relative flex items-center justify-center p-8 bg-white md:border-r border-dashed border-gray-300 order-2 md:order-1">
							{/* Spiral Binding Visual on Right Edge (because this is the back of the front page) */}
							<div className="absolute right-0 top-4 bottom-4 w-8 flex flex-col justify-evenly z-30 translate-x-1/2">
								{spiralDots.map((dotId) => (
									<div
										key={`${dotId}-right`}
										className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-400 shadow-inner"
									/>
								))}
							</div>

							<div className="w-full max-w-sm">
								<div className="mb-6 text-center">
									<h1 className="text-3xl font-sans font-bold text-[#333333] mb-2">Sign Up Here</h1>
									<p className="font-serif text-xl text-gray-500 rotate-1">Let's get started!</p>
								</div>

								<form
									className="space-y-4"
									onSubmit={(event) => {
										event.preventDefault();
										clearAuthError();
										if (!isRegisterValid) return;
										if (!onRegisterNextStep) return;

										onRegisterNextStep({
											name: registerName.trim(),
											email: registerEmail.trim(),
											password: registerPassword,
										});
									}}
								>
									<div className="space-y-2">
										<Label htmlFor="name">Full Name</Label>
										<Input
											id="name"
											placeholder="Your Name"
											value={registerName}
											onChange={(event) => {
												setRegisterName(event.target.value);
												syncRegisterForm({ name: event.target.value });
											}}
											className="bg-gray-50 border-b-2 border-t-0 border-x-0 border-dashed border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-[#F4D06F] px-3 py-6"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email_reg">Email Address</Label>
										<Input
											id="email_reg"
											type="email"
											placeholder="student@school.edu"
											value={registerEmail}
											onChange={(event) => {
												setRegisterEmail(event.target.value);
												syncRegisterForm({ email: event.target.value });
											}}
											className="bg-gray-50 border-b-2 border-t-0 border-x-0 border-dashed border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-[#F4D06F] px-3 py-6"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="pass_reg">Password</Label>
										<Input
											id="pass_reg"
											type="password"
											placeholder="••••••••"
											value={registerPassword}
											onChange={(event) => {
												setRegisterPassword(event.target.value);
												syncRegisterForm({ password: event.target.value });
											}}
											className="bg-gray-50 border-b-2 border-t-0 border-x-0 border-dashed border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-[#F4D06F] px-3 py-6"
										/>
									</div>
									<Button
										type="submit"
										className="w-full bg-[#8fb3FF] text-[#333333] font-bold text-lg rounded-xl shadow-[4px_4px_0px_#5b8bd9] hover:shadow-[2px_2px_0px_#5b8bd9] hover:-translate-y-0.5 transition-all border-2 border-[#333] mt-2 disabled:opacity-70 disabled:shadow-none disabled:hover:translate-y-0"
									>
										{registerSubmitLabel ?? 'Next Step'}
									</Button>
								</form>

								{!disableModeSwitch && (
									<div className="mt-8 text-center text-sm text-gray-500">
										<p className="mb-2">Already on the roll call?</p>
										<button
											type="button"
											onClick={toggleMode}
											className="group flex items-center justify-center gap-2 mx-auto font-serif text-xl text-[#8fb3FF] font-bold hover:underline decoration-wavy"
										>
											<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
											<span>Back to Login</span>
										</button>
									</div>
								)}
							</div>
						</div>

						{/* Right Side: Mood Board (Back) (Ideally this corresponds to the back of the front mood board) */}
						<div className="relative flex flex-col items-center justify-center p-10 bg-white/50 pattern-grid order-1 md:order-2">
							<div className="polaroid -rotate-2 transition-transform hover:rotate-0 duration-500 bg-white p-4 shadow-xl max-w-sm w-full relative z-10 rounded-sm">
								<div className="aspect-4/3 bg-gray-100 w-full mb-4 rounded-sm flex items-center justify-center overflow-hidden border border-gray-100">
									<div className="flex flex-col items-center justify-center text-gray-400">
										<Star className="w-16 h-16 mb-2 opacity-50" />
										<span className="font-sans text-sm">Certificate of Awesome</span>
									</div>
								</div>
								<div className="font-serif text-2xl text-center text-gray-600 -rotate-1">
									Start your journey.
								</div>
							</div>

							{/* Stickers */}
							<motion.div
								animate={{ rotate: [0, 10, 0] }}
								transition={{ repeat: Infinity, duration: 5 }}
								className="sticker absolute top-[10%] right-[15%] rotate-12 bg-white rounded-full p-2 shadow-lg border-4 border-white z-0 opacity-80"
							>
								<Sun className="w-10 h-10 text-orange-400 fill-orange-400" />
							</motion.div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
