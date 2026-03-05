'use client';

import { BookOpen, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getAvatarColor } from '@/lib/user/avatar';
import { getRoleRedirectPath } from '@/lib/user/routes-by-role';
import { useAuthStore } from '@/stores/auth-store';

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const router = useRouter();
	const { token, user, logout } = useAuthStore();
	const isAuthenticated = !!token;
	const displayName = user?.userName ?? '';
	const initials = displayName.trim().charAt(0).toUpperCase();
	const avatarColor = getAvatarColor(user?.userId ?? displayName);

	const handleLogout = () => {
		logout();
		router.replace('/login');
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-cream/95 backdrop-blur supports-backdrop-filter:bg-cream/80">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5B041]">
						<BookOpen className="h-5 w-5 text-charcoal" />
					</div>
					<span className="font-sans text-xl font-bold text-charcoal">Teachify</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-8 md:flex">
					<a
						href="#features"
						className="text-sm font-semibold text-charcoal/80 transition-colors hover:text-charcoal"
					>
						Features
					</a>
					<a
						href="#how-it-works"
						className="text-sm font-semibold text-charcoal/80 transition-colors hover:text-charcoal"
					>
						How It Works
					</a>
					<a
						href="#canvas"
						className="text-sm font-semibold text-charcoal/80 transition-colors hover:text-charcoal"
					>
						Canvas
					</a>
					<a
						href="#students"
						className="text-sm font-semibold text-charcoal/80 transition-colors hover:text-charcoal"
					>
						Students
					</a>
					{isAuthenticated && user ? (
						<Button variant="ghost" className="font-semibold text-charcoal" onClick={handleLogout}>
							Log out
						</Button>
					) : null}
				</nav>

				{/* CTA Buttons */}
				<div className="hidden items-center gap-3 md:flex">
					{isAuthenticated && user ? (
						<>
							<Link
								href={getRoleRedirectPath(user.role)}
								className="flex items-center gap-3 rounded-full border border-border/60 bg-white/70 px-3 py-1.5 shadow-sm transition hover:shadow-md"
							>
								<Avatar className="size-8">
									{user.profilePicture ? (
										<AvatarImage src={user.profilePicture} alt={displayName} />
									) : (
										<AvatarFallback
											style={{ backgroundColor: avatarColor }}
											className="text-sm font-semibold text-[#333]"
										>
											{initials || 'U'}
										</AvatarFallback>
									)}
								</Avatar>
								<span className="text-sm font-semibold text-charcoal">{displayName || 'User'}</span>
							</Link>
							<Button
								variant="ghost"
								className="font-semibold text-charcoal"
								onClick={handleLogout}
							>
								Log out
							</Button>
						</>
					) : (
						<>
							<Button variant="ghost" className="font-semibold text-charcoal" asChild>
								<Link href="/login">Log In</Link>
							</Button>
							<Button
								className="rounded-full bg-[#F5B041] font-semibold text-charcoal hover:bg-[#F5B041]/90"
								asChild
							>
								<Link href="/register">Get Started</Link>
							</Button>
						</>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					type="button"
					className="md:hidden"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					{mobileMenuOpen ? (
						<X className="h-6 w-6 text-charcoal" />
					) : (
						<Menu className="h-6 w-6 text-charcoal" />
					)}
				</button>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="border-t border-border bg-cream md:hidden">
					<nav className="container mx-auto flex flex-col gap-4 p-4">
						<a href="#features" className="font-semibold text-charcoal">
							Features
						</a>
						<a href="#how-it-works" className="font-semibold text-charcoal">
							How It Works
						</a>
						<a href="#canvas" className="font-semibold text-charcoal">
							Canvas
						</a>
						<a href="#students" className="font-semibold text-charcoal">
							Students
						</a>
						<hr className="border-border" />
						{isAuthenticated && user ? (
							<>
								<Link
									href={getRoleRedirectPath(user.role)}
									className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/70 px-3 py-2 shadow-sm"
								>
									<Avatar className="size-9">
										{user.profilePicture ? (
											<AvatarImage src={user.profilePicture} alt={displayName} />
										) : (
											<AvatarFallback
												style={{ backgroundColor: avatarColor }}
												className="text-sm font-semibold text-[#333]"
											>
												{initials || 'U'}
											</AvatarFallback>
										)}
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm font-semibold text-charcoal">
											{displayName || 'User'}
										</span>
										<span className="text-xs text-charcoal/70">Go to dashboard</span>
									</div>
								</Link>
								<Button
									variant="ghost"
									className="w-full justify-start font-semibold text-charcoal"
									onClick={handleLogout}
								>
									Log out
								</Button>
							</>
						) : (
							<>
								<Button
									variant="ghost"
									className="w-full justify-start font-semibold text-charcoal"
									asChild
								>
									<Link href="/login">Log In</Link>
								</Button>
								<Button
									className="w-full rounded-full bg-[#F5B041] font-semibold text-charcoal hover:bg-[#F5B041]/90"
									asChild
								>
									<Link href="/register">Get Started</Link>
								</Button>
							</>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}
