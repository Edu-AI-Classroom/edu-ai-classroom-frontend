import { CanvasSection } from '@/components/landing/canvas-section';
import { CTASection } from '@/components/landing/cta-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { StudentExperienceSection } from '@/components/landing/student-experience-section';
import { TrustSection } from '@/components/landing/trust-section';

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
