import React from "react";
import Banner from "./Banner";
import FeaturedArtifacts from "./FeaturedArtifacts";
import ExtraSection1 from "./ExtraSection1";
import ExtraSection2 from "./ExtraSection2";
import AnimatedSection from "./AnimatedSection";

const Home = () => {
 <title>Home</title>

  return (
    <div className="bg-rose-100 space-y-16">
      <Banner />
      <FeaturedArtifacts />
      <ExtraSection1 />
      <ExtraSection2 />
      <AnimatedSection />
    </div>
  );
};

export default Home;
