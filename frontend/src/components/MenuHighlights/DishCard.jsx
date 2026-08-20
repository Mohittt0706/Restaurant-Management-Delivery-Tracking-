import { motion } from 'framer-motion';
import { fadeInUp, fadeIn } from '../../animations/variants';

export default function DishCard({ dish }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group bg-cult-espresso border border-cult-bronze/30 overflow-hidden hover:border-cult-ember/40 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cult-charcoal/80 to-transparent" />
        <span className="absolute top-4 left-4 font-body text-xs tracking-widest uppercase text-cult-gold bg-cult-charcoal/80 px-3 py-1">
          {dish.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading text-xl text-cult-cream group-hover:text-cult-ember transition-colors duration-300">
            {dish.name}
          </h3>
          <span className="font-body text-lg text-cult-ember font-semibold whitespace-nowrap ml-3">
            ${dish.price}
          </span>
        </div>
        <p className="font-body text-sm text-cult-warmgray leading-relaxed">
          {dish.description}
        </p>
      </div>
    </motion.div>
  );
}
