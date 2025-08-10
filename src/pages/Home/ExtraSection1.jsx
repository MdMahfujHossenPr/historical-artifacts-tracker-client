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
    color: "from-amber-500 to-yellow-400",
  },
  {
    icon: <FaAward size={26} />,
    title: "Global Recognition",
    description:
      "Your name stands beside some of the most historical discoveries in history.",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: <FaLightbulb size={26} />,
    title: "Inspire Others",
    description:
      "Encourage students, historians, and curious minds to explore the past.",
    color: "from-rose-500 to-pink-400",
  },
];

const ExtraSection2 = () => {
  return (
    <section className="py-16 relative overflow-hidden text-white">
      <div className="px-4">
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
              className="rounded-xl bg-white/10 backdrop-blur-xl p-[1px] hover:scale-105 transition-transform duration-300"
            >
              <div className="h-full p-6 bg-white/10 rounded-xl shadow-xl text-center border-2 border-white">
                <div
                  className={`mx-auto w-14 h-14 rounded-full bg-gradient-to-br ${val.color} flex items-center justify-center mb-4 text-white shadow-md`}
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

      {/* Decorative blur */}
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72  rounded-full " />
    </section>
  );
};

export default ExtraSection2;
