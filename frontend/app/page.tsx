// app/page.tsx

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C1810] to-[#3E2723] p-4">
      <motion.div
        className="w-full max-w-md bg-[#5D4037] shadow-2xl rounded-3xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <div className="p-4 rounded-2xl bg-[#3E2723]">
            <ClipboardCheck className="w-12 h-12 text-[#FFC107]" />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-[#FFC107] mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Todo App
        </motion.h1>

        <motion.p
          className="text-[#BCAAA4] mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Manage tasks with elegance and style
        </motion.p>

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/login">
            <motion.button
              className="w-full py-3 bg-[#FFC107] text-[#3E2723] font-bold rounded-xl text-lg shadow-lg hover:shadow-[#FFC107]/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </Link>
          <Link href="/signup">
            <motion.button
              className="w-full py-3 bg-[#8D6E63] text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}