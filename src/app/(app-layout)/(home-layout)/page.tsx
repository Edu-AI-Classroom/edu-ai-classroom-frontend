import { CanvasSection } from '@/features/landing/canvas-section';
import { CTASection } from '@/features/landing/cta-section';
import { FeaturesSection } from '@/features/landing/features-section';
import { HeroSection } from '@/features/landing/hero-section';
import { HowItWorksSection } from '@/features/landing/how-it-works-section';
import { StudentExperienceSection } from '@/features/landing/student-experience-section';
import { TrustSection } from '@/features/landing/trust-section';

export default function Home() {
	return (
		<>
			<HeroSection />
			<FeaturesSection />
			<HowItWorksSection />
			<CanvasSection />
			<TrustSection />
			<StudentExperienceSection />
			<CTASection />
		</>
	);
}
