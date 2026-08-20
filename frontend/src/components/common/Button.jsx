import { Link } from 'react-router-dom';

export default function Button({ to, children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-body font-medium tracking-wide transition-colors duration-300 cursor-pointer';

  const variants = {
    primary:
      'bg-cult-ember text-cult-cream px-8 py-3.5 text-sm uppercase hover:bg-cult-deep-red',
    outline:
      'border border-cult-bronze text-cult-cream px-8 py-3.5 text-sm uppercase hover:border-cult-ember hover:text-cult-ember',
    ghost:
      'text-cult-warmgray px-4 py-2 text-sm uppercase hover:text-cult-cream',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
