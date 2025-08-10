import { motion } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight, FaStar } from "react-icons/fa";

const Testimonials = () => {
  const feedbacks = [
    {
      name: "Sarah Khan",
      role: "Collector",
      comment:
        "A great community for enthusiasts and professionals alike. I’ve connected with so many amazing people.",
      rating: 4,
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Arif Hossain",
      role: "Archaeologist",
      comment:
        "The attention to detail in the artifact listings is outstanding. Perfect for researchers like me!",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Maya Akter",
      role: "Museum Curator",
      comment:
        "I love how this platform is preserving culture and history for the next generation.",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/32.jpg",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-20 overflow-hidden">
      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-6 relative"
      >
        What Our <span className="text-rose-600">Users</span> Say
         
      </motion.h2>

      {/* News Ticker */}
      <div className="overflow-hidden whitespace-nowrap border-y border-rose-200 py-2 mb-12">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="text-rose-700 font-semibold text-lg"
        >
          🌹 Empowering communities | Preserving history | Connecting collectors | Inspiring the world 🌹
        </motion.div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {feedbacks.map(({ name, role, comment, rating, img }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03, rotate: 0.5 }}
            className="relative bg-white border border-rose-100 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Quotes */}
            <FaQuoteLeft className="absolute top-4 left-4 text-rose-300 text-2xl" />
            <FaQuoteRight className="absolute bottom-4 right-4 text-rose-300 text-2xl" />

            {/* Profile */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={img}
                alt={name}
                className="w-20 h-20 rounded-full border-4 border-rose-200 shadow-md"
              />
              <h4 className="text-lg font-semibold text-rose-700 mt-3">{name}</h4>
              <p className="text-gray-500 text-sm">{role}</p>
            </div>

            {/* Comment */}
            <p className="text-gray-600 italic text-center mb-4">"{comment}"</p>

            {/* Rating */}
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FaStar
                  key={idx}
                  className={`${
                    idx < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
