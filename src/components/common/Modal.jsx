import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, children, title, className = '' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
          >
            <div className={`bg-surface-lowest border-3 border-on-surface rounded-3xl shadow-chunky-lg 
              max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto ${className}`}>
              {title && (
                <div className="px-8 pt-6 pb-4 border-b-3 border-on-surface">
                  <h2 className="font-display font-extrabold text-2xl text-on-surface">{title}</h2>
                </div>
              )}
              <div className="p-8">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
