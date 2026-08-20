import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment, getInvoice } from '../services/orderService';
import Footer from '../components/Footer/Footer';
import { fadeInUp, staggerContainer } from '../animations/variants';
import Toast from '../components/common/Toast';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, total, specialPreference, cutleryRequired, resetCart } = useCart();
  const {
    fullName,
    phone,
    address,
    paymentMethod,
    setPaymentMethod,
    setOrderConfirmed,
    setInvoiceData,
  } = useCheckout();

  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  if (!address || items.length === 0) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <p className="font-heading text-xl text-cult-cream mb-2">No checkout data found.</p>
          <p className="font-body text-cult-warmgray mb-8">Please start from your cart.</p>
          <Link
            to="/cart"
            className="font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember px-8 py-3.5 hover:bg-cult-deep-red transition-colors duration-300 inline-block"
          >
            Go to Cart
          </Link>
        </div>
      </main>
    );
  }

  const totalWithDelivery = total + 30;

  const handlePlaceOrder = async (method) => {
    if (processing) return;
    setProcessing(true);
    setToast(null);

    try {
      const addressText = address;
      const notes = specialPreference || undefined;

      const order = await createOrder({
        addressText,
        paymentMethod: method,
        notes,
      });

      setOrderConfirmed({ orderId: order.id, orderNumber: order.orderNumber });

      if (method === 'RAZORPAY') {
        const rpOrder = await createRazorpayOrder(order.id);

        const options = {
          key: rpOrder.keyId,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: 'CULT',
          description: `Order ${order.orderNumber}`,
          order_id: rpOrder.razorpayOrderId,
          handler: async function (response) {
            try {
              await verifyRazorpayPayment({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              const invoiceData = await getInvoiceData(order.id);
              setInvoiceData(invoiceData);
              resetCart();
              navigate('/invoice');
            } catch (err) {
              setToast({
                type: 'error',
                message: err.message || 'Payment verification failed. Please try again.',
              });
              setProcessing(false);
            }
          },
          prefill: {
            name: fullName,
            contact: phone,
          },
          theme: {
            color: '#E8642C',
          },
          modal: {
            ondismiss: function () {
              setToast({ type: 'error', message: 'Payment was cancelled. Please try again.' });
              setProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setToast({
            type: 'error',
            message: response.error?.description || 'Payment failed. Please try again.',
          });
          setProcessing(false);
        });
        rzp.open();
      } else {
        const invoiceData = await getInvoiceData(order.id);
        setInvoiceData(invoiceData);
        resetCart();
        navigate('/invoice');
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Unable to process order. Please try again.',
      });
      setProcessing(false);
    }
  };

  const getInvoiceData = async (orderId) => {
    try {
      return await getInvoice(orderId);
    } catch {
      return {
        invoiceNumber: `INV-${orderId}`,
        orderId,
        orderNumber: '',
        customer: { name: fullName, phone, address },
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
          total: i.subtotal,
        })),
        subtotal: total,
        tax: Math.round(total * 0.05 * 100) / 100,
        deliveryFee: 30,
        totalAmount: totalWithDelivery,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
      };
    }
  };

  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      <Toast
        isVisible={!!toast}
        onClose={() => setToast(null)}
        message={toast?.message}
        type={toast?.type}
        duration={4000}
      />
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
            <Link
              to="/checkout"
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-cult-warmgray hover:text-cult-cream transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              Checkout
            </Link>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream"
          >
            PAYMENT
          </motion.h1>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-8">
          {/* Order Total */}
          <div className="bg-cult-espresso border border-cult-bronze/30 p-8 text-center">
            <p className="font-body text-xs tracking-widest uppercase text-cult-warmgray mb-2">
              Order Total
            </p>
            <p className="font-display text-4xl text-cult-ember">
              &#8377;{totalWithDelivery}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <p className="font-body text-xs tracking-widest uppercase text-cult-warmgray">
              Select Payment Method
            </p>

            {/* Razorpay */}
            <button
              type="button"
              onClick={() => setPaymentMethod('RAZORPAY')}
              disabled={processing}
              className={`w-full text-left p-6 border transition-all duration-300 cursor-pointer disabled:opacity-60 ${
                paymentMethod === 'RAZORPAY'
                  ? 'bg-cult-espresso border-cult-ember'
                  : 'bg-cult-espresso border-cult-bronze/30 hover:border-cult-ember/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-cult-bronze/30 flex items-center justify-center shrink-0">
                  <CreditCard size={22} className="text-cult-ember" />
                </div>
                <div>
                  <p className="font-body text-sm font-bold text-cult-cream uppercase tracking-wider">
                    Pay Now
                  </p>
                  <p className="font-body text-xs text-cult-warmgray mt-0.5">
                    Secure online payment
                  </p>
                </div>
              </div>
            </button>

            {/* Cash on Delivery */}
            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              disabled={processing}
              className={`w-full text-left p-6 border transition-all duration-300 cursor-pointer disabled:opacity-60 ${
                paymentMethod === 'COD'
                  ? 'bg-cult-espresso border-cult-ember'
                  : 'bg-cult-espresso border-cult-bronze/30 hover:border-cult-ember/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-cult-bronze/30 flex items-center justify-center shrink-0">
                  <Banknote size={22} className="text-cult-ember" />
                </div>
                <div>
                  <p className="font-body text-sm font-bold text-cult-cream uppercase tracking-wider">
                    Cash on Delivery
                  </p>
                  <p className="font-body text-xs text-cult-warmgray mt-0.5">
                    Pay when your order arrives
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Pay Button */}
          <button
            onClick={() => paymentMethod && handlePlaceOrder(paymentMethod)}
            disabled={!paymentMethod || processing}
            className="w-full font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember py-4 hover:bg-cult-deep-red transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : paymentMethod === 'RAZORPAY' ? (
              'Pay Now'
            ) : paymentMethod === 'COD' ? (
              'Confirm Order'
            ) : (
              'Select Payment Method'
            )}
          </button>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
