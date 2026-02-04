// app/(auth)/layout.tsx
import { Footer } from '@/features/landing/components/footer';
import { Header } from '@/features/landing/components/header';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-cream">
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
}
