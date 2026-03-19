import { ClearRegisterDraftOnMount } from '@/features/auth/register/components/clear-register-draft-on-mount';
import { CanvasSection } from '@/features/landing/components/canvas-section';
import { CTASection } from '@/features/landing/components/cta-section';
import { FeaturesSection } from '@/features/landing/components/features-section';
import { HeroSection } from '@/features/landing/components/hero-section';
import { HowItWorksSection } from '@/features/landing/components/how-it-works-section';
import { StudentExperienceSection } from '@/features/landing/components/student-experience-section';
import { TrustSection } from '@/features/landing/components/trust-section';

export default function Home() {
	return (
		<>
			<ClearRegisterDraftOnMount />
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
