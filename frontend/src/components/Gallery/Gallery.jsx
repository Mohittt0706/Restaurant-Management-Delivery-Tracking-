import { motion } from 'framer-motion';
import { staggerContainer, fadeIn } from '../../animations/variants';

const images = [
  { src: '/assets/images/gallery/gallery-1.jpg', alt: 'CULT dining' },
  { src: '/assets/images/gallery/gallery-2.jpg', alt: 'CULT plating' },
  { src: '/assets/images/gallery/gallery-3.jpg', alt: 'CULT interior' },
];

export default function Gallery() {
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
          <p className="font-tagline text-lg italic text-cult-gold mb-3">Visual Journey</p>
          <h2 className="font-display text-5xl md:text-6xl tracking-widest text-cult-cream mb-4">
            GALLERY
          </h2>
          <div className="w-16 h-px bg-cult-ember mx-auto" />
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {images.map((img, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className="relative overflow-hidden group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-cult-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <span className="font-body text-sm tracking-widest uppercase text-cult-cream">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
