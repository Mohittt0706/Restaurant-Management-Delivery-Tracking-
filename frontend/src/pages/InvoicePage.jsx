import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';
import { getInvoice } from '../services/orderService';
import Footer from '../components/Footer/Footer';
import { fadeInUp, staggerContainer } from '../animations/variants';

export default function InvoicePage() {
  const navigate = useNavigate();
  const params = useParams();
  const { orderId: contextOrderId, orderNumber: contextOrderNumber, invoiceData: contextInvoice, resetCheckout } = useCheckout();
  const [downloading, setDownloading] = useState(false);
  const [fetchedInvoice, setFetchedInvoice] = useState(null);
  const [loading, setLoading] = useState(!contextInvoice && !!params.orderId);
  const [error, setError] = useState(null);

  const targetOrderId = params.orderId || contextOrderId;

  useEffect(() => {
    if (!contextInvoice && targetOrderId) {
      setLoading(true);
      getInvoice(targetOrderId)
        .then((data) => {
          setFetchedInvoice(data);
          setError(null);
        })
        .catch((err) => setError(err.message || 'Unable to load invoice.'))
        .finally(() => setLoading(false));
    }
  }, [contextInvoice, targetOrderId]);

  const activeInvoice = contextInvoice || fetchedInvoice;

  if (loading) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex flex-col items-center justify-center">
        <Loader2 size={32} className="text-cult-ember animate-spin mb-4" />
        <p className="font-body text-sm text-cult-warmgray tracking-widest uppercase">Loading Invoice...</p>
      </main>
    );
  }

  if (!activeInvoice) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <p className="font-heading text-xl text-cult-cream mb-2">{error || 'No invoice data found.'}</p>
          <p className="font-body text-cult-warmgray mb-8">Place an order to view your invoice.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/menu"
              className="font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember px-8 py-3.5 hover:bg-cult-deep-red transition-colors duration-300 inline-block"
            >
              Browse Menu
            </Link>
            <Link
              to="/order-history"
              className="font-body text-sm tracking-widest uppercase text-cult-cream border border-cult-bronze px-8 py-3.5 hover:border-cult-warmgray transition-colors duration-300 inline-block"
            >
              Order History
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const invoiceData = activeInvoice;

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setDownloading(false);
        return;
      }

      const itemsHtml = invoiceData.items
        .map(
          (item) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #3A2E22;font-family:Inter,sans-serif;font-size:13px;color:#F5EFE6;">${item.name}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #3A2E22;font-family:Inter,sans-serif;font-size:13px;color:#A89E92;text-align:center;">${item.quantity}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #3A2E22;font-family:Inter,sans-serif;font-size:13px;color:#F5EFE6;text-align:right;">&#8377;${item.unitPrice}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #3A2E22;font-family:Inter,sans-serif;font-size:13px;color:#E8642C;text-align:right;font-weight:600;">&#8377;${item.total}</td>
          </tr>`
        )
        .join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CULT Invoice - ${invoiceData.invoiceNumber}</title>
          <style>
            body { margin:0; padding:40px; background:#0D0B0A; color:#F5EFE6; font-family:Inter,sans-serif; }
          </style>
        </head>
        <body>
          <div style="max-width:600px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:6px;margin:0;color:#F5EFE6;">CULT</h1>
              <p style="font-family:'Playfair Display',serif;font-size:14px;color:#C89B3C;font-style:italic;margin:4px 0 0;">INVOICE</p>
            </div>

            <div style="display:flex;justify-content:space-between;margin-bottom:24px;font-size:13px;">
              <div>
                <span style="color:#A89E92;">Invoice:</span> <span style="color:#F5EFE6;font-weight:600;">${invoiceData.invoiceNumber}</span>
              </div>
              <div>
                <span style="color:#A89E92;">Order:</span> <span style="color:#E8642C;font-weight:600;">#${invoiceData.orderNumber || invoiceData.orderId}</span>
              </div>
            </div>

            <div style="border:1px solid #3A2E22;padding:16px;margin-bottom:24px;">
              <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#A89E92;margin:0 0 8px;">CUSTOMER</p>
              <p style="font-size:13px;color:#F5EFE6;margin:2px 0;">${invoiceData.customer.name}</p>
              <p style="font-size:13px;color:#A89E92;margin:2px 0;">${invoiceData.customer.phone}</p>
              <p style="font-size:13px;color:#A89E92;margin:2px 0;">${invoiceData.customer.address}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <thead>
                <tr style="border-bottom:1px solid #3A2E22;">
                  <th style="padding:10px 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#A89E92;text-align:left;">ITEM</th>
                  <th style="padding:10px 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#A89E92;text-align:center;">QTY</th>
                  <th style="padding:10px 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#A89E92;text-align:right;">PRICE</th>
                  <th style="padding:10px 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#A89E92;text-align:right;">TOTAL</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div style="border-top:1px solid #3A2E22;padding-top:16px;">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
                <span style="color:#A89E92;">Subtotal</span>
                <span style="color:#F5EFE6;">&#8377;${invoiceData.subtotal}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
                <span style="color:#A89E92;">Tax (5%)</span>
                <span style="color:#F5EFE6;">&#8377;${invoiceData.tax}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:12px;">
                <span style="color:#A89E92;">Delivery Fee</span>
                <span style="color:#F5EFE6;">&#8377;${invoiceData.deliveryFee}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;border-top:1px solid #3A2E22;padding-top:12px;">
                <span style="color:#F5EFE6;font-family:'Bebas Neue',sans-serif;letter-spacing:3px;">TOTAL</span>
                <span style="color:#E8642C;">&#8377;${invoiceData.totalAmount}</span>
              </div>
            </div>

            <div style="margin-top:16px;text-align:center;">
              <p style="font-size:12px;color:#A89E92;">Payment: ${invoiceData.paymentMethod} &mdash; <span style="color:${invoiceData.paymentStatus === 'PAID' ? '#C89B3C' : '#E8642C'};font-weight:600;">${invoiceData.paymentStatus}</span></p>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      setDownloading(false);
    }, 500);
  };

  const handleNewOrder = () => {
    resetCheckout();
    navigate('/menu');
  };

  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-10"
        >
          <motion.div
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-cult-ember/20 border border-cult-ember/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} className="text-cult-ember" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream mb-3">
              ORDER CONFIRMED
            </h1>
            <p className="font-tagline italic text-cult-gold text-lg">
              Your order has been placed successfully!
            </p>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <div className="bg-cult-espresso border border-cult-bronze/30 p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cult-bronze/20 pb-6 mb-6 gap-4">
              <div>
                <h2 className="font-display text-2xl tracking-widest text-cult-cream">INVOICE</h2>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-body text-xs text-cult-warmgray">
                  Invoice: <span className="font-mono text-cult-cream font-bold">{invoiceData.invoiceNumber}</span>
                </p>
                <p className="font-body text-xs text-cult-warmgray">
                  Order: <span className="font-mono text-cult-ember font-bold">#{invoiceData.orderNumber || orderId}</span>
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="mb-6">
              <p className="font-body text-[10px] tracking-widest uppercase text-cult-warmgray mb-3">Customer</p>
              <div className="space-y-1 text-sm font-body">
                <p className="text-cult-cream">{invoiceData.customer.name}</p>
                <p className="text-cult-warmgray">{invoiceData.customer.phone}</p>
                <p className="text-cult-warmgray">{invoiceData.customer.address}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <p className="font-body text-[10px] tracking-widest uppercase text-cult-warmgray mb-3">Items</p>
              <div className="border border-cult-bronze/20 divide-y divide-cult-bronze/20">
                {invoiceData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center px-4 py-3">
                    <span className="font-body text-sm text-cult-cream">
                      {item.name} &times; {item.quantity}
                    </span>
                    <span className="font-body text-sm text-cult-ember font-semibold">
                      &#8377;{item.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-cult-bronze/20 pt-4 space-y-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-cult-warmgray">Subtotal</span>
                <span className="text-cult-cream">&#8377;{invoiceData.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cult-warmgray">Tax (5%)</span>
                <span className="text-cult-cream">&#8377;{invoiceData.tax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cult-warmgray">Delivery Fee</span>
                <span className="text-cult-cream">&#8377;{invoiceData.deliveryFee}</span>
              </div>
              <div className="border-t border-cult-bronze/20 pt-3 flex justify-between">
                <span className="font-display text-lg tracking-widest text-cult-cream">TOTAL</span>
                <span className="font-body text-xl text-cult-ember font-semibold">
                  &#8377;{invoiceData.totalAmount}
                </span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mt-6 flex items-center gap-2">
              <span className="font-body text-xs text-cult-warmgray">Payment Status:</span>
              <span
                className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold border ${
                  invoiceData.paymentStatus === 'PAID'
                    ? 'bg-cult-gold/20 text-cult-gold border-cult-gold/40'
                    : 'bg-cult-ember/20 text-cult-ember border-cult-ember/40'
                }`}
              >
                {invoiceData.paymentStatus}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex-1 py-3 bg-cult-ember text-cult-cream uppercase text-xs font-body tracking-widest hover:bg-cult-deep-red flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>
              <Link
                to={`/orders/${invoiceData.orderId || targetOrderId}/tracking`}
                className="flex-1 py-3 border border-cult-bronze text-cult-cream uppercase text-xs font-body tracking-widest hover:border-cult-warmgray text-center"
              >
                Track Order
              </Link>
              <button
                onClick={handleNewOrder}
                className="flex-1 py-3 border border-cult-bronze text-cult-cream uppercase text-xs font-body tracking-widest hover:border-cult-warmgray text-center cursor-pointer"
              >
                New Order
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
