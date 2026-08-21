import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Shield, ShoppingBag, Clock, History, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer/Footer';
import { fadeInUp, staggerContainer } from '../animations/variants';

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-cult-bronze/20 last:border-b-0">
      <div className="w-10 h-10 bg-cult-charcoal border border-cult-bronze flex items-center justify-center shrink-0">
        <Icon size={16} className="text-cult-ember" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[10px] tracking-widest uppercase text-cult-warmgray mb-1">
          {label}
        </p>
        <p className="font-body text-sm text-cult-cream truncate">
          {value || 'Not available'}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-body text-xs text-cult-warmgray tracking-widest uppercase">Loading profile...</p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
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
            MY PROFILE
          </motion.h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="bg-cult-espresso border border-cult-bronze/30 p-8 text-center">
              <div className="w-20 h-20 bg-cult-ember/20 border border-cult-ember/40 flex items-center justify-center mx-auto mb-5">
                <User size={32} className="text-cult-ember" />
              </div>
              <h2 className="font-heading text-xl text-cult-cream mb-1">{user.name}</h2>
              <p className="font-body text-xs text-cult-warmgray mb-1">{user.email}</p>
              <span className="inline-block mt-3 px-3 py-1 text-[10px] uppercase font-mono font-bold bg-cult-ember/20 text-cult-ember border border-cult-ember/30 rounded">
                {user.role || 'Customer'}
              </span>
            </div>
          </motion.div>

          {/* Details + Quick Links */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-8"
          >
            {/* Account Details */}
            <div className="bg-cult-espresso border border-cult-bronze/30 p-8">
              <h3 className="font-display text-lg tracking-widest text-cult-cream mb-6">
                ACCOUNT DETAILS
              </h3>
              <div>
                <ProfileField icon={User} label="Full Name" value={user.name} />
                <ProfileField icon={Mail} label="Email Address" value={user.email} />
                <ProfileField icon={Phone} label="Phone Number" value={user.phone} />
                <ProfileField icon={Shield} label="Account Role" value={user.role} />
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-cult-espresso border border-cult-bronze/30 p-8">
              <h3 className="font-display text-lg tracking-widest text-cult-cream mb-6">
                QUICK LINKS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/order-history"
                  className="flex items-center gap-3 p-4 border border-cult-bronze/30 hover:border-cult-ember/40 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-cult-charcoal border border-cult-bronze flex items-center justify-center shrink-0 group-hover:border-cult-ember/40 transition-colors">
                    <History size={16} className="text-cult-ember" />
                  </div>
                  <div>
                    <p className="font-body text-xs font-bold text-cult-cream uppercase tracking-wider">Order History</p>
                    <p className="font-body text-[10px] text-cult-warmgray">View past orders</p>
                  </div>
                </Link>

                <Link
                  to="/orders/latest/tracking"
                  className="flex items-center gap-3 p-4 border border-cult-bronze/30 hover:border-cult-ember/40 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-cult-charcoal border border-cult-bronze flex items-center justify-center shrink-0 group-hover:border-cult-ember/40 transition-colors">
                    <Clock size={16} className="text-cult-ember" />
                  </div>
                  <div>
                    <p className="font-body text-xs font-bold text-cult-cream uppercase tracking-wider">Active Order</p>
                    <p className="font-body text-[10px] text-cult-warmgray">Track current order</p>
                  </div>
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-3 p-4 border border-cult-bronze/30 hover:border-cult-ember/40 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-cult-charcoal border border-cult-bronze flex items-center justify-center shrink-0 group-hover:border-cult-ember/40 transition-colors">
                    <ShoppingBag size={16} className="text-cult-ember" />
                  </div>
                  <div>
                    <p className="font-body text-xs font-bold text-cult-cream uppercase tracking-wider">My Cart</p>
                    <p className="font-body text-[10px] text-cult-warmgray">View cart items</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-4 border border-cult-bronze/30 hover:border-red-500/40 transition-colors duration-200 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-cult-charcoal border border-cult-bronze flex items-center justify-center shrink-0 group-hover:border-red-500/40 transition-colors">
                    <LogOut size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className="font-body text-xs font-bold text-red-400 uppercase tracking-wider">Logout</p>
                    <p className="font-body text-[10px] text-cult-warmgray">Sign out of account</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
