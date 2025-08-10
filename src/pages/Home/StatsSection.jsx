import React, { useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { FaLandmark, FaUsers, FaHandsHelping } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const StatsSection = () => {
  const [startCount, setStartCount] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
    onChange: (inView) => {
      if (inView) setStartCount(true);
    },
  });

  const stats = [
    {
      id: 1,
      icon: <FaLandmark className="text-6xl text-pink-500 drop-shadow-md" />,
      end: 5000,
      label: "Artifacts Catalogued",
    },
    {
      id: 2,
      icon: <FaUsers className="text-6xl text-pink-500 drop-shadow-md" />,
      end: 1200,
      label: "Active Users",
    },
    {
      id: 3,
      icon: <FaHandsHelping className="text-6xl text-pink-500 drop-shadow-md" />,
      end: 300,
      label: "Contributors",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 px-6 md:px-16 lg:px-24 overflow-hidden bg-gradient-to-r from-rose-50 to-white"
    >
      {/* Soft Background Glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-200 rounded-full blur-[120px] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 rounded-full blur-[120px] opacity-30"></div>

      {/* Title */}
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 relative z-10 mb-14"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Our <span className="text-rose-600">Impact</span> in Numbers
      </motion.h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {stats.map(({ id, icon, end, label }) => (
          <motion.div
            key={id}
            className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-rose-300 hover:scale-105 group"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: id * 0.15 }}
            whileHover={{ rotate: 1 }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>

            {/* CountUp */}
            <h3 className="block text-5xl md:text-6xl font-extrabold text-gray-800 text-center">
              {startCount && inView ? (
                <CountUp end={end} duration={2.5} separator="," />
              ) : (
                "0"
              )}
            </h3>

            {/* Label */}
            <p className="mt-3 text-lg md:text-xl font-medium text-gray-600 text-center">
              {label}
            </p>

            {/* Underline Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
