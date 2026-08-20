import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function FoodCard({ item }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      variants={fadeInUp}
      className="group bg-cult-espresso border border-cult-bronze/30 overflow-hidden hover:border-cult-ember/40 transition-all duration-300 flex flex-col"
    >
      <Link to={`/menu/${item.id}`} className="block">
        <div className="relative h-60 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cult-charcoal/80 to-transparent" />
          <span className="absolute top-4 left-4 font-body text-xs tracking-widest uppercase text-cult-gold bg-cult-charcoal/80 px-3 py-1">
            {item.category}
          </span>
          {!item.availability && (
            <div className="absolute inset-0 bg-cult-charcoal/60 flex items-center justify-center">
              <span className="font-body text-sm tracking-widest uppercase text-cult-warmgray bg-cult-charcoal/80 px-4 py-2">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/menu/${item.id}`}>
          <h3 className="font-heading text-xl text-cult-cream group-hover:text-cult-ember transition-colors duration-300 mb-1">
            {item.name}
          </h3>
        </Link>
        <p className="font-body text-sm text-cult-warmgray leading-relaxed mb-4 flex-1">
          {item.shortDescription}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-body text-lg text-cult-ember font-semibold">
            ₹{item.price}
          </span>
          <div className="flex gap-2">
            <Link
              to={`/menu/${item.id}`}
              className="font-body text-xs tracking-widest uppercase text-cult-warmgray border border-cult-bronze/40 px-4 py-2 hover:text-cult-cream hover:border-cult-ember/60 transition-all duration-300"
            >
              Details
            </Link>
            <button
              onClick={() => addToCart(item, 1)}
              disabled={!item.availability}
              className="font-body text-xs tracking-widest uppercase text-cult-cream bg-cult-ember px-4 py-2 hover:bg-cult-deep-red transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ShoppingCart size={14} />
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
