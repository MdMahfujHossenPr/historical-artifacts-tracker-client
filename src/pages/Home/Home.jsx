import Banner from "./Banner";
import FeaturedArtifacts from "./FeaturedArtifacts";
import ExtraSection1 from "./ExtraSection1";
import ExtraSection2 from "./ExtraSection2";
import AnimatedSection from "./AnimatedSection";
import Testimonials from "./Testimonials"; //new     
import StatsSection from "./StatsSection"; //new    
        
const Home = () => {
  return (
    <div className="bg-rose-50 space-y-16">
      <Banner />
      <StatsSection />
      <FeaturedArtifacts />
      <Testimonials />
      <ExtraSection1 />
      <ExtraSection2 />
      <AnimatedSection />
    </div>
  );
};

export default Home;
