import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer/Footer';
import { fadeIn, fadeInUp, staggerContainer } from '../animations/variants';

export default function CartPage() {
  const {
    items,
    specialPreference,
    cutleryRequired,
    total,
    increment,
    decrement,
    removeItem,
    setSpecialPreference,
    setCutlery,
    resetCart,
  } = useCart();

  const [orderStatus, setOrderStatus] = useState('idle'); // idle | placing | success

  const handlePlaceOrder = () => {
    setOrderStatus('placing');
    setTimeout(() => {
      setOrderStatus('success');
    }, 1500);
  };

  const handleReset = () => {
    resetCart();
    setOrderStatus('idle');
  };

  if (orderStatus === 'success') {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 bg-cult-ember/20 border border-cult-ember/40 flex items-center justify-center mx-auto mb-8">
            <Check size={36} className="text-cult-ember" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream mb-4">
            ORDER PLACED
          </h1>
          <p className="font-heading text-lg text-cult-gold italic mb-2">
            Successfully!
          </p>
          <p className="font-body text-cult-warmgray mb-10">
            Thank you for your order. We&apos;ll have it ready for you shortly.
          </p>
          <button
            onClick={handleReset}
            className="font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember px-8 py-3.5 hover:bg-cult-deep-red transition-colors duration-300"
          >
            Start New Order
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-cult-warmgray hover:text-cult-cream transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              Menu
            </Link>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream"
          >
            YOUR CART
          </motion.h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center py-24"
          >
            <ShoppingBag size={48} className="text-cult-bronze mx-auto mb-6" />
            <p className="font-heading text-xl text-cult-cream mb-2">
              Your cart is empty.
            </p>
            <p className="font-body text-cult-warmgray mb-8">
              Explore our menu and discover something extraordinary.
            </p>
            <Link
              to="/menu"
              className="font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember px-8 py-3.5 hover:bg-cult-deep-red transition-colors duration-300 inline-block"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-5 py-6 border-b border-cult-bronze/20"
                  >
                    {/* Image */}
                    <Link
                      to={`/menu/${item.productId}`}
                      className="shrink-0 w-24 h-24 md:w-28 md:h-28 overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <Link
                          to={`/menu/${item.productId}`}
                          className="font-heading text-lg text-cult-cream hover:text-cult-ember transition-colors truncate"
                        >
                          {item.name}
                        </Link>
                        <span className="font-body text-cult-ember font-semibold whitespace-nowrap">
                          ₹{item.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center border border-cult-bronze/30">
                          <button
                            onClick={() => decrement(item.productId)}
                            disabled={item.quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-cult-cream hover:bg-cult-bronze/20 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 h-9 flex items-center justify-center font-body text-sm text-cult-cream border-x border-cult-bronze/30">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increment(item.productId)}
                            className="w-9 h-9 flex items-center justify-center text-cult-cream hover:bg-cult-bronze/20 transition-colors duration-200"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-body text-sm text-cult-warmgray">
                            Subtotal: <span className="text-cult-cream font-medium">₹{item.subtotal}</span>
                          </span>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-cult-warmgray hover:text-red-500 transition-colors duration-200 p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Special Preference */}
              <div className="mt-10">
                <label className="block font-body text-xs tracking-widest uppercase text-cult-warmgray mb-3">
                  Special Preference
                </label>
                <textarea
                  value={specialPreference}
                  onChange={(e) => setSpecialPreference(e.target.value)}
                  placeholder="Less spicy, no onions, extra cheese..."
                  rows={3}
                  className="w-full bg-cult-espresso border border-cult-bronze/30 text-cult-cream font-body text-sm px-4 py-3 placeholder:text-cult-warmgray/50 focus:outline-none focus:border-cult-ember/60 transition-colors duration-300 resize-none"
                />
              </div>

              {/* Cutlery */}
              <div className="mt-8">
                <p className="font-body text-xs tracking-widest uppercase text-cult-warmgray mb-3">
                  Cutlery
                </p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="cutlery"
                      checked={!cutleryRequired}
                      onChange={() => setCutlery(false)}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                        !cutleryRequired
                          ? 'border-cult-ember bg-cult-ember'
                          : 'border-cult-bronze/50 group-hover:border-cult-warmgray'
                      }`}
                    >
                      {!cutleryRequired && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cult-cream" />
                      )}
                    </span>
                    <span className="font-body text-sm text-cult-cream">
                      No Cutlery
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="cutlery"
                      checked={cutleryRequired}
                      onChange={() => setCutlery(true)}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                        cutleryRequired
                          ? 'border-cult-ember bg-cult-ember'
                          : 'border-cult-bronze/50 group-hover:border-cult-warmgray'
                      }`}
                    >
                      {cutleryRequired && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cult-cream" />
                      )}
                    </span>
                    <span className="font-body text-sm text-cult-cream">
                      Add Cutlery
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-cult-espresso border border-cult-bronze/30 p-6 sticky top-28">
                <h2 className="font-display text-xl tracking-widest text-cult-cream mb-6">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between font-body text-sm"
                    >
                      <span className="text-cult-warmgray truncate mr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-cult-cream whitespace-nowrap">
                        ₹{item.subtotal}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cult-bronze/20 pt-4 space-y-3">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-cult-warmgray">Subtotal</span>
                    <span className="text-cult-cream">₹{total}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-cult-warmgray">Delivery</span>
                    <span className="text-cult-warmgray">—</span>
                  </div>
                  <div className="border-t border-cult-bronze/20 pt-3 flex justify-between">
                    <span className="font-display text-lg tracking-widest text-cult-cream">
                      TOTAL
                    </span>
                    <span className="font-body text-xl text-cult-ember font-semibold">
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderStatus === 'placing'}
                  className="w-full font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember py-4 mt-8 hover:bg-cult-deep-red transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {orderStatus === 'placing' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
