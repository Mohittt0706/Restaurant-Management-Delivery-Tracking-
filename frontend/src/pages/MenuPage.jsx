import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuItems, categories } from '../data/menuItems';
import FoodCard from '../components/menu/FoodCard';
import Footer from '../components/Footer/Footer';
import { fadeInUp, staggerContainer } from '../animations/variants';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="font-tagline italic text-cult-gold text-lg mb-3"
          >
            Curated Selection
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-5xl md:text-6xl tracking-widest text-cult-cream mb-4"
          >
            OUR MENU
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="font-body text-cult-warmgray max-w-md mx-auto"
          >
            Each dish is a carefully composed experience, designed to satisfy and inspire.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-xs tracking-widest uppercase px-6 py-2.5 border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-cult-ember text-cult-cream border-cult-ember'
                  : 'bg-transparent text-cult-warmgray border-cult-bronze/40 hover:text-cult-cream hover:border-cult-ember/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Food Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-body text-cult-warmgray py-16"
          >
            No items in this category yet.
          </motion.p>
        )}
      </div>
      <Footer />
    </main>
  );
}
