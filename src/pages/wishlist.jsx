import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaRegHeart,
  FaInfoCircle,
  FaStar,
  FaShippingFast
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addToCart, toggleWishlist } from '../Reducer/appslice';

const Wishlist = () => {
  const wishlist = useSelector((state) => state.appReducer.wishlist || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = Object.values(wishlist);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        img: product.img,
        price: product.price,
        title: product.title,
        category: product.category,
        quantity: 1,
      })
    );
    toast.success(`${product.title} added to cart`);
  };

  const handleToggleWishlist = (product, e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    toast.success(`Removed from wishlist`);
  };

  const navigateToProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar key="half" className="text-yellow-400 text-sm" style={{ clipPath: 'inset(0 50% 0 0)' }} />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 text-sm" />);
    }

    return stars;
  };

  if (wishlistItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="text-center p-8 max-w-md">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-indigo-500 text-6xl mb-4 inline-block"
          >
            <FaHeart />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">
            Save your favorite items here to easily find them later
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all"
          >
            Start Shopping
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-indigo-700 mb-2 text-center"
        >
          Your Favorites
        </motion.h1>
        <p className="text-gray-600 text-center mb-8">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
        </p>

        <AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlistItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg border border-gray-100 cursor-pointer relative group"
                onClick={() => navigateToProduct(product.id)}
              >
                <div className="relative pt-[100%] bg-white">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                  />

                  <button
                    onClick={(e) => handleToggleWishlist(product, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 text-red-500 hover:bg-opacity-100 transition-all z-10"
                  >
                    <FaHeart className="text-lg" />
                  </button>

                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                      {Math.round(product.discountPercentage)}% OFF
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-12 mb-2 hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-center mb-2">
                    <div className="flex mr-1">
                      {renderStars(product.rating?.rate || 4)}
                    </div>
                    <span className="text-xs text-blue-600 ml-1">
                      ({product.rating?.count || 124})
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all"
                    >
                      <FaShoppingCart className="text-sm" />
                      <span>Add to Cart</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToProduct(product.id);
                      }}
                      className="w-full bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all"
                    >
                      <FaInfoCircle className="text-sm" />
                      <span>Details</span>
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <FaShippingFast className="mr-1" />
                      <span>Free Shipping</span>
                    </div>
                    <span className="text-green-700 font-medium">In Stock</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;