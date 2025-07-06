import React from "react";
import useTitle from "../../hooks/useTitle";
import Banner from "./Banner";
import FeaturedArtifacts from "./FeaturedArtifacts";
import ExtraSection1 from "./ExtraSection1";
import ExtraSection2 from "./ExtraSection2";
import AnimatedSection from "./AnimatedSection";

/**
 * Home component renders the main homepage layout,
 * setting the document title and displaying various sections.
 */
const Home = () => {
  // Set the browser tab title
  useTitle("Home");

  return (
    <div className="bg-rose-100 space-y-16">
      {/* Main banner section */}
      <Banner />

      {/* Showcase featured artifacts */}
      <FeaturedArtifacts />

      {/* Additional content sections */}
      <ExtraSection1 />
      <ExtraSection2 />

      {/* Section with animated content */}
      <AnimatedSection />
    </div>
  );
};

export default Home;
