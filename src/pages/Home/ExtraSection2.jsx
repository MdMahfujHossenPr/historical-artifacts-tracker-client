// src/components/ExtraSection2.jsx

import React from "react";

const artifactHighlights = [
  {
    id: 1,
    name: "Rosetta Stone",
    role: "Ancient Artifact",
    description:
      "The Rosetta Stone was key to deciphering Egyptian hieroglyphs, unlocking the secrets of an ancient civilization.",
    date: "Discovered: 1799",
    readingTime: "Important Milestone",
    image: "https://i.ibb.co/ymmKft0h/rosetta-stone.jpg",
  },
  {
    id: 2,
    name: "Antikythera Mechanism",
    role: "Ancient Analog Computer",
    description:
      "An ancient Greek device used to predict astronomical positions and eclipses, showcasing early scientific ingenuity.",
    date: "Discovered: 1901",
    readingTime: "Scientific Marvel",
    image: "https://i.ibb.co/rKkgYXR8/antikythera.jpg",
  },
  {
    id: 3,
    name: "Terracotta Army",
    role: "Burial Artifacts",
    description:
      "Thousands of life-sized sculptures buried with China's first Emperor Qin Shi Huang to protect him in the afterlife.",
    date: "Discovered: 1974",
    readingTime: "Cultural Heritage",
    image: "https://i.ibb.co/rKJKdF2L/terracotta-army.jpg",
  },
  {
    id: 4,
    name: "Dead Sea Scrolls",
    role: "Ancient Manuscripts",
    description:
      "A collection of Jewish texts dating back to the 3rd century BCE, offering insights into early biblical history.",
    date: "Discovered: 1947",
    readingTime: "Historical Treasure",
    image: "https://i.ibb.co/CD4d9KH/dead-sea-scrolls.jpg",
  },
  {
    id: 5,
    name: "Venus of Willendorf",
    role: "Prehistoric Sculpture",
    description:
      "A small figurine symbolizing fertility, crafted around 28,000–25,000 BCE during the Paleolithic era.",
    date: "Discovered: 1908",
    readingTime: "Prehistoric Wonder",
    image: "https://i.ibb.co/p6xqCnYk/venus-willendorf.jpg",
  },
  {
    id: 6,
    name: "Sutton Hoo Helmet",
    role: "Anglo-Saxon Armor",
    description:
      "An ornate warrior’s helmet from the 7th century, representing early medieval craftsmanship in England.",
    date: "Discovered: 1939",
    readingTime: "Archaeological Icon",
    image: "https://i.ibb.co/YF9SHry9/sutton-hoo.jpg",
  },
];

export default function ExtraSection2() {
  return (
    <section className="mt-12 px-4">
      <h2 className="text-3xl font-bold text-cyan-800 mb-12 text-center">
        Key Highlights of Historical Artifacts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artifactHighlights.map(
          ({ id, name, role, description, date, readingTime, image }) => (
            <article
              key={id}
              className="flex flex-col sm:flex-row items-center gap-6 rounded-lg border-4 border-white bg-rose-100 p-6 shadow-lg hover:shadow-xl transition duration-300 text-black"
            >
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={image}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-cyan-700"
                />
              </div>

              {/* Text */}
              <div className="sm:flex-1">
                <h3 className="text-xl font-bold mb-1">{name}</h3>
                <p className="text-cyan-700 font-semibold mb-2">{role}</p>
                <p className="text-sm mb-4">{description}</p>

                <dl className="flex gap-8 text-xs font-medium text-cyan-900">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5h18v11.25M3 18.75h18" />
                    </svg>
                    <dd>{date}</dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 6v12m0-12a9 9 0 1 1-6 2.25M6 3.75V6" />
                    </svg>
                    <dd>{readingTime}</dd>
                  </div>
                </dl>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}
