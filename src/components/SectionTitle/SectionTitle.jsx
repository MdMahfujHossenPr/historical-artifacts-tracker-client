import React from "react";

const SectionTitle = ({ heading, subheading }) => {
  return (
    <div className="text-center my-12">
      <h2 className="text-3xl md:text-4xl font-bold text-rose-800 tracking-wide">
        {heading}
      </h2>
      <p className="text-rose-500 mt-2 text-sm md:text-base">{subheading}</p>
      <div className="w-24 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 mx-auto mt-4 rounded-full animate-pulse"></div>
    </div>
  );
};

export default SectionTitle;
