import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import Footer from '../components/Footer/Footer';
import { fadeInUp, staggerContainer } from '../animations/variants';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, specialPreference, cutleryRequired } = useCart();
  const { setCustomerDetails } = useCheckout();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!phone.trim()) errs.phone = 'Phone number is required.';
    else if (!/^\+?[\d\s-]{7,15}$/.test(phone.trim())) errs.phone = 'Enter a valid phone number.';
    if (!address.trim()) errs.deliveryAddress = 'Delivery address is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!validate() || processing) return;

    setProcessing(true);
    setCustomerDetails({
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    navigate('/payment');
    setProcessing(false);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <p className="font-heading text-xl text-cult-cream mb-2">Your cart is empty.</p>
          <p className="font-body text-cult-warmgray mb-8">
            Add items to your cart before checking out.
          </p>
          <Link
            to="/menu"
            className="font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember px-8 py-3.5 hover:bg-cult-deep-red transition-colors duration-300 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-cult-warmgray hover:text-cult-cream transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              Cart
            </Link>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream"
          >
            CHECKOUT
          </motion.h1>
        </motion.div>

        <form onSubmit={handleContinue}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            <div className="lg:col-span-2 space-y-10">
              {/* Customer Details */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <h2 className="font-display text-xl tracking-widest text-cult-cream mb-6 flex items-center gap-2">
                  <span className="text-cult-ember">&#9654;</span> CUSTOMER DETAILS
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block font-body text-xs tracking-widest uppercase text-cult-warmgray mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-cult-espresso border border-cult-bronze/30 text-cult-cream font-body text-sm px-4 py-3 placeholder:text-cult-warmgray/50 focus:outline-none focus:border-cult-ember/60 transition-colors duration-300"
                    />
                    {errors.fullName && (
                      <p className="font-body text-xs text-cult-deep-red mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-body text-xs tracking-widest uppercase text-cult-warmgray mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-cult-espresso border border-cult-bronze/30 text-cult-cream font-body text-sm px-4 py-3 placeholder:text-cult-warmgray/50 focus:outline-none focus:border-cult-ember/60 transition-colors duration-300"
                    />
                    {errors.phone && (
                      <p className="font-body text-xs text-cult-deep-red mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Delivery Address */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <h2 className="font-display text-xl tracking-widest text-cult-cream mb-6 flex items-center gap-2">
                  <span className="text-cult-ember">&#9654;</span> DELIVERY ADDRESS
                </h2>
                <div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, apartment, city..."
                    rows={3}
                    className="w-full bg-cult-espresso border border-cult-bronze/30 text-cult-cream font-body text-sm px-4 py-3 placeholder:text-cult-warmgray/50 focus:outline-none focus:border-cult-ember/60 transition-colors duration-300 resize-none"
                  />
                  {errors.deliveryAddress && (
                    <p className="font-body text-xs text-cult-deep-red mt-1">{errors.deliveryAddress}</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-1">
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
                        {item.name} &times; {item.quantity}
                      </span>
                      <span className="text-cult-cream whitespace-nowrap">
                        &#8377;{item.subtotal}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cult-bronze/20 pt-4 space-y-2 text-xs font-body">
                  {specialPreference && (
                    <div className="flex justify-between">
                      <span className="text-cult-warmgray">Special Preference</span>
                      <span className="text-cult-cream text-right max-w-[60%] truncate">{specialPreference}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-cult-warmgray">Cutlery</span>
                    <span className="text-cult-cream">{cutleryRequired ? 'Required' : 'Not Required'}</span>
                  </div>
                </div>

                <div className="border-t border-cult-bronze/20 pt-4 mt-4 space-y-3">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-cult-warmgray">Subtotal</span>
                    <span className="text-cult-cream">&#8377;{total}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-cult-warmgray">Delivery</span>
                    <span className="text-cult-cream">&#8377;30</span>
                  </div>
                  <div className="border-t border-cult-bronze/20 pt-3 flex justify-between">
                    <span className="font-display text-lg tracking-widest text-cult-cream">TOTAL</span>
                    <span className="font-body text-xl text-cult-ember font-semibold">
                      &#8377;{total + 30}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember py-4 mt-8 hover:bg-cult-deep-red transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
}
