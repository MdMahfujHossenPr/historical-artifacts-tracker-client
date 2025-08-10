import React from "react";
import { motion } from "framer-motion";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { FaBookOpen, FaHistory, FaMonument, FaLandmark } from "react-icons/fa";

const items = [
  {
    icon: <FaBookOpen size={28} />,
    title: "Document the Past",
    desc: "Accurately preserve ancient texts, artifacts, and findings in a global archive.",
    color: "from-amber-500 to-yellow-400",
  },
  {
    icon: <FaHistory size={28} />,
    title: "Understand Civilizations",
    desc: "Help decode the stories of old civilizations through your insights.",
    color: "from-rose-500 to-pink-400",
  },
  {
    icon: <FaMonument size={28} />,
    title: "Preserve Monuments",
    desc: "Highlight lost or lesser-known monuments for the world to explore.",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: <FaLandmark size={28} />,
    title: "Build Historical Bridges",
    desc: "Connect modern researchers to forgotten artifacts through your input.",
    color: "from-indigo-500 to-purple-400",
  },
];

const AnimatedSection = () => {
  return (
    <section className="py-16 text-white overflow-hidden">
      <div className="px-4">
        <SectionTitle
          heading="✨ Your Role in History"
          subheading="How your contribution shapes tomorrow"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="rounded-xl backdrop-blur-md border-2 p-6 text-center shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                {item.title}
              </h3>
              <p className="text-black text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative blur balls */}
      <div className="absolute -top-10 -left-10 w-48 h-48  rounded-full  " />
      <div className="absolute -bottom-16 -right-10 w-72 h-72  rounded-full  " />
    </section>
  );
};

export default AnimatedSection;
