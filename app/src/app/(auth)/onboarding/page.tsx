import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

/**
 * Onboarding (4 steps: level/subjects/grades → school → greeting → catch-up).
 * Lives in the (auth) route group — doesn't get the app shell's TabBar/SideNav.
 */
export default function OnboardingPage() {
  return <OnboardingClient />;
}
