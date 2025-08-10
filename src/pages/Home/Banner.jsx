import React, { useEffect, useRef, useState } from "react";

const Banner = () => {
  const slides = [
    {
      image: "https://i.ibb.co/F4nbZCdF/banner1.jpg",
      heading: "Explore Historical Artifacts",
      subheading: "Discover stories behind every artifact",
    },
    {
      image: "https://i.ibb.co/FbcBtkBJ/banner2.webp",
      heading: "Preserve Our Heritage",
      subheading: "Join us in protecting history for future generations",
    },
    {
      image: "https://i.ibb.co/fzvwm7Kn/banner3.jpg",
      heading: "Learn & Share Knowledge",
      subheading: "Connect with enthusiasts and experts worldwide",
    },
  ];

  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const delay = 4000;
    timeoutRef.current = setTimeout(nextSlide, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  return (
    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[600px] lg:h-[600px] overflow-hidden shadow-md select-none">
      {slides.map(({ image, heading, subheading }, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-10 pointer-events-none"
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-center items-center px-6 text-center">
            <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-extrabold drop-shadow-xl mb-2 tracking-wide">
              {heading}
            </h2>
            <p className="text-gray-200 text-lg sm:text-xl md:text-2xl drop-shadow-md max-w-3xl tracking-wide">
              {subheading}
            </p>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-80 text-3xl rounded-full w-12 h-12 flex items-center justify-center shadow-md transition duration-300 text-rose-600 hover:text-rose-900"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-80 text-3xl rounded-full w-12 h-12 flex items-center justify-center shadow-md transition duration-300 text-rose-600 hover:text-rose-900"
      >
        ❯
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current ? "bg-rose-600 scale-125" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
