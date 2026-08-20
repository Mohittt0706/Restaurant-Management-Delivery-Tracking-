import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, fadeIn } from '../../animations/variants';
import Button from '../common/Button';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background — gradient since image is a placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-cult-charcoal via-cult-espresso to-cult-bronze/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-cult-charcoal/90 via-cult-charcoal/50 to-transparent" />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full"
      >
        <div className="max-w-2xl">
          {/* Tagline */}
          <motion.p
            variants={fadeIn}
            className="font-tagline text-lg md:text-xl italic text-cult-gold mb-4 tracking-wide"
          >
            Underground Dining Experience
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="font-display text-7xl md:text-8xl lg:text-9xl leading-none tracking-widest text-cult-cream mb-6"
          >
            CULT
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-2xl md:text-3xl lg:text-4xl text-cult-cream/90 mb-5 font-light"
          >
            Where Bold Meets
            <span className="text-cult-ember block mt-1">Sophisticated</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="font-body text-base md:text-lg text-cult-warmgray max-w-md mb-10 leading-relaxed"
          >
            A curated dining experience crafted from passion, precision, and the
            finest ingredients. Welcome to the underground.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeInUp}>
            <Button to="/menu" variant="primary">
              Explore Menu
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cult-charcoal to-transparent" />
    </section>
  );
}
