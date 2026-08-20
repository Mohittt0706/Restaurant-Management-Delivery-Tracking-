import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import FoodCard from '../components/menu/FoodCard';
import Footer from '../components/Footer/Footer';
import { useCart } from '../context/CartContext';
import { fadeInUp, staggerContainer } from '../animations/variants';

const API_BASE_URL = 'http://localhost:5000/api';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { itemCount } = useCart();

  const fetchMenuData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch menu items
      const menuRes = await fetch(`${API_BASE_URL}/menu`);
      if (!menuRes.ok) {
        throw new Error('Unable to load the menu.');
      }
      const menuJson = await menuRes.json();
      const rawItems = menuJson.data || [];

      // Normalize items
      const normalizedItems = rawItems.map((item) => ({
        ...item,
        categoryName: typeof item.category === 'object' ? item.category?.name : item.category,
      }));

      setMenuItems(normalizedItems);

      // Fetch categories
      try {
        const catRes = await fetch(`${API_BASE_URL}/categories`);
        if (catRes.ok) {
          const catJson = await catRes.json();
          const catNames = (catJson.data || []).map((c) => c.name);
          setCategories(['All', ...new Set(catNames)]);
        } else {
          const extractedCats = ['All', ...new Set(normalizedItems.map((i) => i.categoryName).filter(Boolean))];
          setCategories(extractedCats);
        }
      } catch (catErr) {
        const extractedCats = ['All', ...new Set(normalizedItems.map((i) => i.categoryName).filter(Boolean))];
        setCategories(extractedCats);
      }
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Unable to load the menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter(
          (item) => (item.categoryName || item.category) === activeCategory
        );

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
        {!loading && !error && (
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
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 border-4 border-cult-ember border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-body text-cult-warmgray text-sm tracking-widest uppercase">
              Loading menu...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-heading text-xl text-cult-cream mb-4">{error}</p>
            <button
              onClick={fetchMenuData}
              className="font-body text-xs tracking-widest uppercase px-6 py-3 bg-cult-ember text-cult-cream hover:bg-cult-deep-red transition-all duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Food Grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item) => (
                <FoodCard
                  key={item.id}
                  item={{
                    ...item,
                    category: item.categoryName || item.category,
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && !error && menuItems.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-body text-cult-warmgray py-16 text-lg"
          >
            No menu items available.
          </motion.p>
        )}

        {!loading && !error && menuItems.length > 0 && filteredItems.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-body text-cult-warmgray py-16"
          >
            No items in this category yet.
          </motion.p>
        )}
      </div>

      {/* Sticky Cart Strip */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-cult-espresso border-t border-cult-bronze/30 shadow-lg shadow-black/30"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag size={22} className="text-cult-ember" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cult-ember text-cult-cream text-[10px] font-body font-bold flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                </div>
                <span className="font-body text-sm text-cult-warmgray">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                </span>
              </div>
              <Link
                to="/cart"
                className="font-body text-xs tracking-widest uppercase px-6 py-3 bg-cult-ember text-cult-cream hover:bg-cult-deep-red transition-all duration-300"
              >
                View Cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
