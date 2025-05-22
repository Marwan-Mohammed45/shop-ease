import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaTruck, FaShieldAlt, FaReply, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Productsdata } from '../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleWishlist } from '../Reducer/appslice';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const wishlist = useSelector(state => state.ecommerce?.wishlist || {});
  
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: null,
    currentImage: 0,
    quantity: 1
  });

  const fetchProduct = useCallback(async () => {
    setState(prev => ({...prev, loading: true, error: null}));
    
    try {
      const products = await Productsdata();
      const foundProduct = products.find(p => p.id.toString() === id);
      
      if (foundProduct) {
        const productImages = Array.isArray(foundProduct.images) && foundProduct.images.length > 0
          ? foundProduct.images
          : [foundProduct.image];
        
        setState(prev => ({
          ...prev,
          product: {
            ...foundProduct,
            images: productImages,
            discountPercentage: foundProduct.discountPercentage || 0
          },
          loading: false
        }));
      } else {
        setState(prev => ({...prev, error: 'Product not found', loading: false}));
      }
    } catch (error) {
      setState(prev => ({...prev, error: 'Failed to load product details', loading: false}));
      toast.error('Failed to load product details');
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleToggleWishlist = useCallback(() => {
    if (!state.product) return;
    dispatch(toggleWishlist({
      id: state.product.id,
    img: state.product.thumbnail || state.product.image,
    price: state.product.price,
    title: state.product.title,
    category: state.product.category,
    quantity: state.quantity
    }));
    toast.success(wishlist[state.product.id] ? 'Removed from wishlist' : 'Added to wishlist');
  }, [dispatch, state.product, wishlist]);

  const handleAddToCart = useCallback(() => {
    if (!state.product) return;
    
    dispatch(addToCart({
      id: state.product.id,
    img: state.product.thumbnail || state.product.image,
    price: state.product.price,
    title: state.product.title,
    category: state.product.category,
    quantity: state.quantity
    }));
    
    setState(prev => ({...prev, quantity: 1}));
    toast.success(`${state.quantity} ${state.product.title} added to cart`);
  }, [dispatch, state.product, state.quantity]);

  const nextImage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentImage: (prev.currentImage < prev.product.images.length - 1) 
        ? prev.currentImage + 1 
        : 0
    }));
  }, []);

  const prevImage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentImage: (prev.currentImage > 0) 
        ? prev.currentImage - 1 
        : prev.product.images.length - 1
    }));
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (state.error || !state.product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
      >
        <div className="text-red-500 text-5xl mb-4">
          <FaExclamationTriangle />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {state.error ? 'Oops! Something went wrong' : 'Product Not Found'}
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          {state.error || 'The product you are looking for does not exist.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaChevronLeft className="mr-1" />
          Back to products
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-96 bg-white rounded-lg overflow-hidden border border-gray-200">
                <motion.img
                  key={state.currentImage}
                  src={state.product.images[state.currentImage]}
                  alt={state.product.title}
                  className="w-full h-full object-contain p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500?text=Image+Not+Available';
                  }}
                />
                
                {state.product.images.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    >
                      <FaChevronLeft />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    >
                      <FaChevronRight />
                    </motion.button>
                  </>
                )}
              </div>
              
              {state.product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {state.product.images.map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setState(prev => ({...prev, currentImage: index}))}
                      className={`flex-shrink-0 w-16 h-16 rounded border ${state.currentImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} overflow-hidden bg-white`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100?text=Image+Not+Available';
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <motion.h1 
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {state.product.title}
                </motion.h1>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleWishlist}
                  className="text-2xl p-2"
                  aria-label={wishlist[state.product.id] ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wishlist[state.product.id] ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400 hover:text-red-500" />
                  )}
                </motion.button>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-t border-b border-gray-200 py-4"
              >
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${state.product.price.toFixed(2)}
                  </span>
                  {state.product.discountPercentage > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ${(state.product.price / (1 - state.product.discountPercentage / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                        Save {Math.round(state.product.discountPercentage)}%
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">About this item:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>{state.product.description}</li>
                  <li>High-quality materials</li>
                  <li>Easy to use and maintain</li>
                  <li>1-year manufacturer warranty</li>
                </ul>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center">
                  <FaTruck className="text-gray-500 mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">FREE Delivery</span> on orders over $50
                  </span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-gray-500 mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">30-Day Return Policy</span> if unsatisfied
                  </span>
                </div>
              </motion.div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded">
                  <button 
                    onClick={() => setState(prev => ({...prev, quantity: Math.max(1, prev.quantity - 1)}))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    disabled={state.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{state.quantity}</span>
                  <button 
                    onClick={() => setState(prev => ({...prev, quantity: prev.quantity + 1}))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors flex items-center justify-center"
                >
                  <FaShoppingCart className="mr-2" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Product Details Section */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                <table className="w-full text-sm text-gray-700">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 font-medium">Brand</td>
                      <td className="py-2">ShopEase</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 font-medium">Category</td>
                      <td className="py-2 capitalize">{state.product.category}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 font-medium">Model</td>
                      <td className="py-2">#{Math.floor(Math.random() * 10000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Shipping & Returns</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <FaTruck className="flex-shrink-0 mt-1 mr-2 text-gray-500" />
                    <p>Standard delivery: 2-5 business days</p>
                  </div>
                  <div className="flex items-start">
                    <FaReply className="flex-shrink-0 mt-1 mr-2 text-gray-500" />
                    <p>Easy 30-day returns</p>
                  </div>
                  <div className="flex items-start">
                    <FaShieldAlt className="flex-shrink-0 mt-1 mr-2 text-gray-500" />
                    <p>Secure payment options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductDetails);