import React, { useEffect, useRef, useState } from "react";

const Banner = () => {
  const slides = [
    "https://i.ibb.co/F4nbZCdF/banner1.jpg",
    "https://i.ibb.co/FbcBtkBJ/banner2.webp",
    "https://i.ibb.co/fzvwm7Kn/banner3.jpg",
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
    const delay = 4000; // 4 seconds per slide
    timeoutRef.current = setTimeout(nextSlide, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  return (
    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[600px] lg:h-[600px] overflow-hidden rounded-xl shadow-md">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <img src={slide} className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-between px-5">
        <button onClick={prevSlide} className="btn btn-circle z-30">
          ❮
        </button>
        {current < slides.length - 1 && (
          <button onClick={nextSlide} className="btn btn-circle z-30">
            ❯
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
