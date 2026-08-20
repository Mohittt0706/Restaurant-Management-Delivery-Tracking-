import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer } from '../animations/variants';
import Footer from '../components/Footer/Footer';

const values = [
  {
    title: 'Bold Flavors',
    description: 'We push boundaries with fearless combinations that challenge convention.',
  },
  {
    title: 'Premium Craft',
    description: 'Every ingredient is hand-selected. Every dish is meticulously prepared.',
  },
  {
    title: 'No Compromise',
    description: 'Quality is non-negotiable. We accept nothing less than extraordinary.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/images/about-preview.jpg"
            alt="CULT interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-cult-charcoal/75" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10"
        >
          <p className="font-tagline text-lg italic text-cult-gold mb-3">Our Story</p>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-widest text-cult-cream mb-4">
            BEHIND THE FLAME
          </h1>
          <div className="w-16 h-px bg-cult-ember" />
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-body text-cult-warmgray text-lg leading-relaxed mb-6"
            >
              Born from a passion for bold flavors and uncompromising quality, CULT
              is more than a restaurant — it is a statement. Founded in 2024, our
              kitchen operates at the intersection of tradition and rebellion.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-body text-cult-warmgray text-lg leading-relaxed"
            >
              Every dish is a declaration of craft, every ingredient a deliberate
              choice. We believe dining should be an experience — one that excites,
              challenges, and leaves a lasting impression.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-cult-espresso">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeIn}
                className="text-center p-8 border border-cult-bronze/20"
              >
                <h3 className="font-heading text-2xl text-cult-cream mb-3">{v.title}</h3>
                <p className="font-body text-sm text-cult-warmgray leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
