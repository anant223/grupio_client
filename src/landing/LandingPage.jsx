import HeroSection   from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StorySection  from "./StorySection";

const LandingPage = () => (
  <>
    <HeroSection/>
    <FeaturesSection />
    <StorySection name={"Anant"} avatar={null} />
  </>
);

export default LandingPage;