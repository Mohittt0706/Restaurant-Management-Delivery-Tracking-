import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import { menuItems } from '../../data/menuItems';
import DishCard from './DishCard';

export default function MenuHighlights() {
  const featured = menuItems.slice(0, 4);

  return (
    <section className="py-20 bg-cult-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-tagline text-lg italic text-cult-gold mb-3">Curated Selection</p>
          <h2 className="font-display text-5xl md:text-6xl tracking-widest text-cult-cream mb-4">
            MENU HIGHLIGHTS
          </h2>
          <div className="w-16 h-px bg-cult-ember mx-auto" />
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featured.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
