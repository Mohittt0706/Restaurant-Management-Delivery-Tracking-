import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Toast from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { getGoogleCredential } from '../services/googleService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    if (role === 'MANAGER') navigate('/manager');
    else if (role === 'KITCHEN') navigate('/kitchen');
    else if (role === 'DELIVERY') navigate('/delivery-partner');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || submitting) {
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      const user = await login(email.trim(), password);
      setToast({ type: 'success', message: 'Login Successful' });
      setTimeout(() => redirectByRole(user?.role), 300);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Unable to connect to server. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      const idToken = await getGoogleCredential();
      const user = await googleLogin(idToken);
      setToast({ type: 'success', message: 'Login Successful' });
      setTimeout(() => redirectByRole(user?.role), 300);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cult-charcoal flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* Toast Notification */}
      <Toast
        isVisible={!!toast}
        onClose={() => setToast(null)}
        message={toast?.message}
        type={toast?.type}
        duration={3000}
      />

      {/* Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-cult-espresso border border-cult-bronze p-8 md:p-10 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream mb-2">
            LOGIN
          </h1>
          <p className="font-tagline italic text-cult-warmgray text-base md:text-lg">
            Where every bite becomes ritual
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block font-body text-xs uppercase tracking-widest text-cult-warmgray mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-3 text-sm font-body outline-none focus:border-cult-ember transition-colors duration-300 placeholder:text-cult-warmgray/40"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block font-body text-xs uppercase tracking-widest text-cult-warmgray mb-2"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream pl-4 pr-12 py-3 text-sm font-body outline-none focus:border-cult-ember transition-colors duration-300 placeholder:text-cult-warmgray/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 z-20 text-cult-warmgray hover:text-cult-ember p-1.5 cursor-pointer transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Forgot Password Link (UI Only Placeholder) */}
            <div className="flex justify-end mt-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-body text-xs text-cult-ember hover:underline transition-all duration-200"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-cult-ember text-cult-cream py-3.5 px-6 font-body text-sm uppercase tracking-widest font-medium hover:bg-cult-deep-red transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cult-ember/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-cult-ember"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>

          {/* OR Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cult-bronze" />
            </div>
            <span className="relative bg-cult-espresso px-4 font-body text-xs text-cult-warmgray uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="w-full border border-cult-bronze hover:border-cult-ember bg-transparent text-cult-cream py-3.5 px-6 font-body text-sm tracking-wide font-medium flex items-center justify-center gap-3 hover:bg-cult-charcoal/50 transition-all duration-300 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{submitting ? 'Signing in...' : 'Continue with Google'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}