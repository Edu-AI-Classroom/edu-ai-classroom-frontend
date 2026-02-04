// app/(landing)/layout.tsx
import { Footer } from '@/features/landing/footer';
import { Header } from '@/features/landing/header';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-cream">
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
}
