import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, toggleWishlist } from '../Reducer/appslice';
import { Productsdata } from '../api/api';
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaShippingFast,
  FaRegHeart,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.appReducer?.wishlist || {});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productsData = await Productsdata();
        setProducts(productsData);
        setVisibleProducts([]);
        setTimeout(() => {
          setVisibleProducts(productsData);
          setAnimationTrigger(true);
        }, 100);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load products. Please try again later.');
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWishlist = (product, e) => {
    e.stopPropagation();
    dispatch(toggleWishlist({
      id: product.id,
      img: product.image,
      price: product.price,
      title: product.title,
      category: product.category
    }));
    toast.success(wishlist[product.id] ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        img: product.image,
        price: product.price,
        title: product.title,
        category: product.category,
        quantity: 1,
      })
    );
    toast.success(`${product.title} added to cart`);
  };

  const navigateToProductDetails = (productId, e) => {
    e.stopPropagation();
    navigate(`/products/${productId}`);
  };

  const renderStars = (ratingValue) => {
    const rate = typeof ratingValue === 'object' ? ratingValue.rate : ratingValue;
    const stars = [];
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;

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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-yellow-500 text-6xl mb-4"
        >
          <FaExclamationTriangle />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Refresh Page
        </motion.button>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  repeatType: 'reverse',
                  delay: i * 0.1
                }}
                className="bg-gray-100 rounded-lg h-80"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {visibleProducts.map((product, index) => {
              const ratingValue = typeof product.rating === 'object' ? product.rating.rate : product.rating;
              const ratingCount = typeof product.rating === 'object' ? product.rating.count : product.ratingCount;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer relative group"
                >
                  <div
                    className="relative pt-[100%] bg-white"
                    onClick={(e) => navigateToProductDetails(product.id, e)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                    />

                    <button
                      onClick={(e) => handleWishlist(product, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        wishlist[product.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      } transition-colors z-10`}
                    >
                      {wishlist[product.id] ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="group-hover:text-red-500" />
                      )}
                    </button>

                    {product.discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                        {Math.round(product.discountPercentage)}% off
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 
                      className="text-sm font-medium text-gray-900 line-clamp-2 h-12 mb-2 hover:text-blue-600 transition-colors"
                      onClick={(e) => navigateToProductDetails(product.id, e)}
                    >
                      {product.title}
                    </h3>

                    {ratingValue && (
                      <div className="flex items-center mb-2">
                        <div className="flex mr-1">{renderStars(ratingValue)}</div>
                        <span className="text-xs text-blue-600 ml-1">
                          {Number(ratingValue).toFixed(1)} ({ratingCount || 0})
                        </span>
                      </div>
                    )}

                    <div className="mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-2">
                          ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all"
                      >
                        <FaShoppingCart className="text-sm" />
                        <span>Add to Cart</span>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => navigateToProductDetails(product.id, e)}
                        className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all"
                      >
                        <FaInfoCircle className="text-sm" />
                        <span>More Details</span>
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
              );
            })}
          </div>
        </AnimatePresence>

        {products.length === 0 && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <h3 className="text-lg font-medium text-gray-700">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;