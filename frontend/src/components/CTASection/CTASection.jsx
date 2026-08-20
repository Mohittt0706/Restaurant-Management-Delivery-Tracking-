import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';
import Button from '../common/Button';

export default function CTASection() {
  return (
    <section className="py-24 bg-cult-espresso relative overflow-hidden">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cult-ember/40 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-tagline text-lg italic text-cult-gold mb-4"
        >
          Ready to Experience CULT?
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-display text-5xl md:text-6xl tracking-widest text-cult-cream mb-6"
        >
          YOUR TABLE AWAITS
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-body text-cult-warmgray mb-10 max-w-lg mx-auto leading-relaxed"
        >
          Walk in or reserve your spot. The underground is always open for those
          who dare to taste something extraordinary.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button to="/menu" variant="primary">
            Explore Menu
          </Button>
          <Button to="/about" variant="outline">
            Our Story
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
