import { motion } from "framer-motion";

const PHONE = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;

const DEFAULT_MESSAGE =
  "Hello Decorden! I'm interested in your furniture and would like to know more.";

export function WhatsAppButton() {
  if (!PHONE) return null;

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      whileHover={{ scale: 1.08 }}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-7 sm:right-7"
    >
      {/* Tooltip label (desktop only) */}
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-charcoal opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Chat with us
      </span>

      {/* Button */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)]">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />

        <svg
          viewBox="0 0 32 32"
          className="relative h-7 w-7 fill-current"
          aria-hidden="true"
        >
          <path d="M16.003 3C8.83 3 3 8.83 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.72A12.94 12.94 0 0 0 16.003 29C23.17 29 29 23.17 29 16S23.17 3 16.003 3zm0 23.7c-1.95 0-3.86-.53-5.53-1.52l-.4-.24-3.96 1.02 1.06-3.86-.26-.4A10.66 10.66 0 0 1 5.3 16c0-5.9 4.8-10.7 10.7-10.7S26.7 10.1 26.7 16s-4.8 10.7-10.7 10.7zm5.87-8c-.32-.16-1.9-.94-2.2-1.04-.3-.1-.52-.16-.74.16-.22.32-.85 1.04-1.04 1.26-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.57.16-.19.22-.32.32-.54.1-.22.05-.4-.03-.57-.08-.16-.74-1.78-1.01-2.43-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.32-1.14 1.12-1.14 2.72 0 1.6 1.17 3.15 1.33 3.37.16.22 2.3 3.5 5.56 4.92.78.34 1.38.54 1.85.69.78.25 1.49.21 2.05.13.63-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37z" />
        </svg>
      </span>
    </motion.a>
  );
}