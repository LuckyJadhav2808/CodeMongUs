import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

export default function Button({ children, variant = 'primary', onClick, disabled, className = '', icon, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  };

  if (disabled) {
    return (
      <button className={`btn-disabled ${sizeClasses[size]} ${className}`} disabled>
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
}
