import React from 'react';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPinterestP,
  FaShippingFast, FaCreditCard, FaShieldAlt, FaHeadset
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const featureVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150
      }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const socialVariants = {
    hover: {
      y: -3,
      scale: 1.1,
      color: "#818cf8",
      transition: { type: "spring", stiffness: 300 }
    },
    tap: { scale: 0.9 }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-[#0f172a] text-white px-6 py-10 text-sm"
    >
      {/* Features Row */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center border-b border-gray-700 pb-6"
      >
        {[
          { icon: <FaShippingFast className="mx-auto text-indigo-400 text-xl mb-1" />, 
            title: "Free Shipping", 
            desc: "On orders over $50" },
          { icon: <FaCreditCard className="mx-auto text-indigo-400 text-xl mb-1" />, 
            title: "Secure Payment", 
            desc: "100% secure checkout" },
          { icon: <FaShieldAlt className="mx-auto text-indigo-400 text-xl mb-1" />, 
            title: "Quality Guarantee", 
            desc: "Top-notch products" },
          { icon: <FaHeadset className="mx-auto text-indigo-400 text-xl mb-1" />, 
            title: "Support 24/7", 
            desc: "Always ready to help" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            variants={featureVariants}
            whileHover="hover"
            className="p-2"
          >
            {feature.icon}
            <p className="font-semibold">{feature.title}</p>
            <p className="text-gray-400 text-xs">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-between py-10 gap-10">
        {/* Company Info */}
        <motion.div 
          variants={itemVariants}
          className="flex-1"
        >
          <motion.h2 
            whileHover={{ scale: 1.02 }}
            className="text-xl font-bold mb-2"
          >
            ShopEase
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 mb-4 text-sm max-w-xs"
          >
            Your destination for quality and affordable products since 2023.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex space-x-4 text-gray-400 text-lg"
          >
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPinterestP].map((Icon, index) => (
              <motion.div
                key={index}
                variants={socialVariants}
                whileHover="hover"
                whileTap="tap"
                className="cursor-pointer"
              >
                <Icon />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Link Lists */}
        <motion.div 
          variants={containerVariants}
          className="flex-[2] flex flex-wrap justify-between gap-8"
        >
          <motion.ul 
            variants={itemVariants}
            className="space-y-2 min-w-[120px]"
          >
            <li className="font-bold mb-1">Quick Links</li>
            {['Home', 'Shop', 'About Us', 'Contact'].map((item, index) => (
              <motion.li 
                key={index}
                whileHover={{ x: 5 }}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <motion.ul 
            variants={itemVariants}
            className="space-y-2 min-w-[120px]"
          >
            <li className="font-bold mb-1">Customer Care</li>
            {['Account', 'Order Tracking', 'Wishlist', 'Help'].map((item, index) => (
              <motion.li 
                key={index}
                whileHover={{ x: 5 }}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <motion.ul 
            variants={itemVariants}
            className="space-y-2 min-w-[160px]"
          >
            <li className="font-bold mb-1">Newsletter</li>
            <li className="text-gray-400 text-xs">
              Subscribe for latest updates & offers.
            </li>
            <li>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex"
              >
                <input
                  type="email"
                  placeholder="Email"
                  className="px-2 py-1 w-full text-sm rounded-l-md bg-gray-800 text-white"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-500 px-3 py-1 text-sm rounded-r-md hover:bg-indigo-600"
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </li>
          </motion.ul>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="border-t border-gray-700 pt-4 text-center text-xs text-gray-500"
      >
        <p>© 2025 ShopEase. All rights reserved.</p>
        <p>Developed with by <span className="text-indigo-400 font-semibold">Marwan Mohamed</span></p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;