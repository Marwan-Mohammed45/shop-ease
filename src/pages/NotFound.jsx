import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaFrown, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1.1, 1.1, 1],
          }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <FaFrown className="text-6xl text-indigo-500" /> {/* Changed to indigo */}
        </motion.div>

        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 text-lg"
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FaArrowLeft className="text-white" /> {/* New blue arrow icon */}
            <span>Go Home</span>
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FaSearch className="text-indigo-600" />
            <span>Browse Products</span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="mt-12 text-gray-400 text-sm"
      >
        Still lost? Contact our support team.
      </motion.div>
    </motion.div>
  );
};

export default NotFound;