import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, toggleWishlist } from '../Reducer/appslice';
import { Productsdata } from '../api/api';
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaInfoCircle,
  FaExclamationTriangle,
  FaShippingFast,
  FaChevronRight,
} from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.appReducer?.wishlist || {});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productsData = await Productsdata();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load products. Please try again later.');
        alert('Failed to load products!');
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
      img: product.thumbnail || product.image,
      price: product.price,
      title: product.title,
      category: product.category,
    }));
    alert(wishlist[product.id] ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: product.id,
      img: product.thumbnail || product.image,
      price: product.price,
      title: product.title,
      category: product.category,
      quantity: 1,
    }));
    alert(`${product.title} added to cart`);
  };

  const navigateToProductDetails = (productId, e) => {
    e.stopPropagation();
    navigate(`/products/${productId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-xs" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar
          key="half"
          className="text-yellow-400 text-xs"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 text-xs" />);
    }

    return stars;
  };

  const loadMoreProducts = () => {
    setVisibleProducts(prev => prev + 8);
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
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-yellow-500 text-6xl mb-4"
        >
          <FaExclamationTriangle />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Error loading products</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Reload Page
        </motion.button>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse', delay: i * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 h-full flex flex-col"
              >
                <div className="bg-gray-200 h-48 w-full animate-pulse"></div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="bg-gray-200 h-4 w-3/4 mb-2 animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-1/2 mb-3 animate-pulse"></div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-gray-200 h-3 w-3 mr-1 animate-pulse"></div>
                    ))}
                  </div>
                  <div className="bg-gray-200 h-5 w-1/3 mb-4 animate-pulse"></div>
                  <div className="mt-auto bg-gray-200 h-8 w-full rounded animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Featured Products</h1>
          <div className="flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            <span>See all deals</span>
            <FaChevronRight className="ml-1 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, visibleProducts).map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md border border-gray-200 cursor-pointer relative flex flex-col h-full"
            >
              <div
                className="relative pt-[70%] bg-white group"
                onClick={(e) => navigateToProductDetails(product.id, e)}
              >
                <img
                  src={product.thumbnail || product.image}
                  alt={product.title}
                  className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={(e) => handleWishlist(product, e)}
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    wishlist[product.id] 
                      ? 'bg-red-100 text-red-500' 
                      : 'bg-white text-gray-400 hover:text-red-500'
                  } transition-colors z-10 shadow-md hover:shadow-lg`}
                >
                  {wishlist[product.id] ? <FaHeart /> : <FaRegHeart />}
                </button>
                {product.discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                    {Math.round(product.discountPercentage)}% OFF
                  </div>
                )}
              </div>

              <div className="p-4 flex-grow flex flex-col">
                <h3
                  className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors"
                  onClick={(e) => navigateToProductDetails(product.id, e)}
                >
                  {product.title}
                </h3>

                {product.rating && (
                  <div className="flex items-center mb-2">
                    <div className="flex mr-1">{renderStars(product.rating)}</div>
                    <span className="text-xs text-blue-600 ml-1">
                      {Number(product.rating).toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">({Math.floor(Math.random() * 1000)})</span>
                  </div>
                )}

                <div className="mb-3">
                  <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  {product.discountPercentage > 0 && (
                    <span className="text-xs text-gray-500 line-through ml-2">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>

                {product.category && (
                  <div className="text-xs text-gray-500 mb-3">
                    <span>Category: </span>
                    <span className="font-medium capitalize">{product.category}</span>
                  </div>
                )}

                <div className="text-xs text-green-600 font-medium mb-4">
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>

                <div className="mt-auto">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md"
                  >
                    <FaShoppingCart className="text-sm" />
                    <span>Add to Cart</span>
                  </motion.button>
                </div>
              </div>

              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center">
                    <FaShippingFast className="mr-1" />
                    <span>FREE Delivery</span>
                  </div>
                  <span className="font-medium">Tomorrow</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleProducts < products.length && (
          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadMoreProducts}
              className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              Load More Products
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;