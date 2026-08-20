import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '../../animations/variants';
import Button from '../common/Button';

export default function AboutPreview() {
  return (
    <section className="py-20 bg-cult-espresso">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img
              src="/assets/images/about-preview.jpg"
              alt="CULT kitchen"
              className="w-full h-80 lg:h-[480px] object-cover"
            />
            <div className="absolute inset-0 border border-cult-bronze/20" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="font-tagline text-lg italic text-cult-gold mb-3">Our Story</p>
            <h2 className="font-display text-5xl md:text-6xl tracking-widest text-cult-cream mb-6">
              BEHIND THE FLAME
            </h2>
            <p className="font-body text-cult-warmgray leading-relaxed mb-4">
              Born from a passion for bold flavors and uncompromising quality, CULT
              is more than a restaurant — it is a statement. Every dish is a
              declaration of craft, every ingredient a deliberate choice.
            </p>
            <p className="font-body text-cult-warmgray leading-relaxed mb-8">
              Our kitchen operates at the intersection of tradition and rebellion,
              where classic techniques meet fearless innovation. This is dining
              without compromise.
            </p>
            <Button to="/about" variant="outline">
              Our Story
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
