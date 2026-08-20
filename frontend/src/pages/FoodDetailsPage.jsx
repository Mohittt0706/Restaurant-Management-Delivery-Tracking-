import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer/Footer';
import { fadeIn, fadeInUp } from '../animations/variants';

const API_BASE_URL = 'http://localhost:5000/api';

export default function FoodDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/menu/${id}`);
        if (!res.ok) {
          throw new Error('Dish not found');
        }
        const json = await res.json();
        const data = json.data;
        setItem({
          ...data,
          category: typeof data.category === 'object' ? data.category?.name : data.category,
        });
      } catch (err) {
        console.error('Error loading dish details:', err);
        setError('DISH NOT FOUND');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cult-ember border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-body text-cult-warmgray text-sm tracking-widest uppercase">
          Loading dish details...
        </p>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl tracking-widest text-cult-cream mb-6">
          DISH NOT FOUND
        </h1>
        <Link
          to="/menu"
          className="font-body text-sm tracking-widest uppercase text-cult-ember hover:text-cult-deep-red transition-colors"
        >
          Back to Menu
        </Link>
        <Footer />
      </main>
    );
  }

  const handleDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncrease = () => {
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Back Link */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-cult-warmgray hover:text-cult-cream transition-colors duration-300 mb-10"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="relative overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-80 md:h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cult-charcoal/60 to-transparent" />
            <span className="absolute top-4 left-4 font-body text-xs tracking-widest uppercase text-cult-gold bg-cult-charcoal/80 px-3 py-1">
              {item.category}
            </span>
          </motion.div>

          {/* Details */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col"
          >
            <h1 className="font-heading text-3xl md:text-4xl text-cult-cream mb-3">
              {item.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-body text-2xl text-cult-ember font-semibold">
                ₹{item.price}
              </span>
              <span
                className={`font-body text-xs tracking-widest uppercase px-3 py-1 ${
                  item.availability
                    ? 'text-cult-gold bg-cult-gold/10 border border-cult-gold/30'
                    : 'text-cult-warmgray bg-cult-warmgray/10 border border-cult-warmgray/30'
                }`}
              >
                {item.availability ? 'Available' : 'Sold Out'}
              </span>
            </div>

            <p className="font-body text-cult-warmgray leading-relaxed mb-10">
              {item.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-8">
              <p className="font-body text-xs tracking-widest uppercase text-cult-warmgray mb-3">
                Quantity
              </p>
              <div className="inline-flex items-center border border-cult-bronze/40">
                <button
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="w-12 h-12 flex items-center justify-center text-cult-cream hover:bg-cult-bronze/20 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="w-16 h-12 flex items-center justify-center font-body text-lg text-cult-cream border-x border-cult-bronze/40">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-12 h-12 flex items-center justify-center text-cult-cream hover:bg-cult-bronze/20 transition-colors duration-200"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!item.availability}
              className={`font-body text-sm tracking-widest uppercase px-8 py-4 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                addedFeedback
                  ? 'bg-green-700 text-cult-cream'
                  : 'bg-cult-ember text-cult-cream hover:bg-cult-deep-red'
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check size={18} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart — ₹{item.price * quantity}
                </>
              )}
            </button>

            {/* View Cart Link */}
            {addedFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Link
                  to="/cart"
                  className="font-body text-sm tracking-widest uppercase text-cult-ember hover:text-cult-deep-red transition-colors"
                >
                  View Cart →
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
