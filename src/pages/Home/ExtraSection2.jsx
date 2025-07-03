import React from "react";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { FaUsers, FaAward, FaLightbulb } from "react-icons/fa";
import { motion } from "framer-motion";

const values = [
  {
    icon: <FaUsers size={26} />,
    title: "Build Legacy",
    description:
      "Your artifact contributions will be remembered for generations to come.",
    color: "from-[#facc15] to-[#fbbf24]",
    bg: "bg-yellow-400/20",
  },
  {
    icon: <FaAward size={26} />,
    title: "Global Recognition",
    description:
      "Your name stands beside some of the most historical discoveries in history.",
    color: "from-[#34d399] to-[#10b981]",
    bg: "bg-emerald-400/20",
  },
  {
    icon: <FaLightbulb size={26} />,
    title: "Inspire Others",
    description:
      "Encourage students, historians, and curious minds to explore the past.",
    color: "from-[#fb7185] to-[#f472b6]",
    bg: "bg-pink-400/20",
  },
];

const ExtraSection2 = () => {
  return (
    <section className="py-16 relative overflow-hidden text-white">
      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle
          heading="🌍 Become a History Maker"
          subheading="Why your contribution matters"
        />

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`rounded-xl border-2 border-white p-[1px] hover:scale-105 transition-transform duration-300 ${val.bg}`}
            >
              <div className="h-full p-6 rounded-xl text-center text-black">
                <div
                  className={`mx-auto w-14 h-14 rounded-full bg-gradient-to-br ${val.color} flex items-center justify-center mb-4 text-black shadow-lg`}
                >
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  {val.title}
                </h3>
                <p className="text-black">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optional decorative blurred elements */}
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full blur-3xl opacity-20" />
    </section>
  );
};

export default ExtraSection2;
