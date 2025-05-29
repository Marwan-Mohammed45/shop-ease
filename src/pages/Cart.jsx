import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../Reducer/appslice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTrash, 
  FaChevronLeft, 
  FaChevronRight, 
  FaShoppingCart, 
  FaCreditCard,
  FaMoneyBillWave,
  FaTruck
} from "react-icons/fa";
import { toast } from "react-toastify";

// استيراد أيقونات الدفع
import paypalLogo from '../images/paypal.png';
import mastercardLogo from '../images/download.png';
import paymobLogo from '../images/download (1).png';

const Cart = () => {
  const cartItems = useSelector((state) => state.appReducer?.cart || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = React.useState(1); // 1: Cart, 2: Payment, 3: Confirmation
  const [selectedPayment, setSelectedPayment] = React.useState(null);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else if (newQuantity > 10) {
      toast.info("Maximum quantity is 10");
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart({ id }));
    toast.success("Item removed from cart");
  };

  const proceedToPayment = () => {
    if (cartItems.length > 0) {
      setCheckoutStep(2);
    }
  };

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
  };

  const processPayment = () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    // محاكاة عملية الدفع
    toast.success(`Payment processed successfully with ${selectedPayment}`);
    
    // تأخير عملية التأكيد لتعطي شعوراً بالانتظار
    setTimeout(() => {
      dispatch(clearCart());
      setCheckoutStep(3);
    }, 1500);
  };

  const continueShopping = () => {
    navigate("/");
  };

  // شريط تتبع الطلب
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
      <div 
        className="bg-indigo-600 h-2.5 rounded-full" 
        style={{ width: `${checkoutStep * 33.33}%` }}
      ></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* شريط التقدم */}
        <div className="mb-6 pt-5">
          <div className="flex justify-between items-center mb-2">
            <div className={`flex flex-col items-center ${checkoutStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${checkoutStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm">Cart</span>
            </div>
            <div className={`flex flex-col items-center ${checkoutStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${checkoutStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm">Payment</span>
            </div>
            <div className={`flex flex-col items-center ${checkoutStep >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${checkoutStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm">Confirmation</span>
            </div>
          </div>
          <ProgressBar />
        </div>

        {checkoutStep === 1 ? (
          cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* عناصر السلة */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-24 h-24 object-contain cursor-pointer"
                            onClick={() => navigate(`/products/${item.id}`)}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h2 
                              className="text-md font-medium text-gray-900 hover:text-indigo-600 cursor-pointer"
                              onClick={() => navigate(`/products/${item.id}`)}
                            >
                              {item.title}
                            </h2>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <p className="text-indigo-500 text-sm mt-1 font-medium">{item.categ}</p>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-md font-bold text-gray-900">
                                ${item.price.toFixed(2)}
                              </span>
                              {item.discountPercentage > 0 && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ${(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center">
                              <span className="text-sm text-gray-700 mr-2">Qty:</span>
                              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <FaChevronLeft className="text-xs" />
                                </button>
                                <span className="px-2 py-1 border-x border-gray-200 bg-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <FaChevronRight className="text-xs" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* ملخص الطلب */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2 border-gray-200">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({cartItems.length} items):</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg text-indigo-700">
                        <span>Order Total:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={proceedToPayment}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto text-center border border-gray-100"
            >
              <div className="text-indigo-400 text-6xl mb-4">
                <FaShoppingCart className="inline-block" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Your shopping cart is waiting. Give it purpose.
              </p>
              <button
                onClick={continueShopping}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-all"
              >
                Continue Shopping
              </button>
            </motion.div>
          )
        ) : checkoutStep === 2 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* بطاقة ائتمان */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'credit_card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                onClick={() => handlePaymentSelection('credit_card')}
              >
                <div className="flex items-center">
                  <FaCreditCard className="text-indigo-500 text-xl mr-3" />
                  <div>
                    <h3 className="font-medium">Credit/Debit Card</h3>
                    <p className="text-sm text-gray-600">Pay with Visa, Mastercard, etc.</p>
                  </div>
                </div>
                {selectedPayment === 'credit_card' && (
                  <div className="mt-4 space-y-3">
                    <input 
                      type="text" 
                      placeholder="Card Number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input 
                        type="text" 
                        placeholder="CVV" 
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PayPal */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                onClick={() => handlePaymentSelection('paypal')}
              >
                <div className="flex items-center">
                  <img src={paypalLogo} alt="PayPal" className="h-6 mr-3" />
                  <div>
                    <h3 className="font-medium">PayPal</h3>
                    <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                  </div>
                </div>
              </div>

              {/* Mastercard */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'mastercard' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                onClick={() => handlePaymentSelection('mastercard')}
              >
                <div className="flex items-center">
                  <img src={mastercardLogo} alt="Mastercard" className="h-6 mr-3" />
                  <div>
                    <h3 className="font-medium">Mastercard</h3>
                    <p className="text-sm text-gray-600">Pay directly with Mastercard</p>
                  </div>
                </div>
              </div>

              {/* Paymob */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'paymob' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                onClick={() => handlePaymentSelection('paymob')}
              >
                <div className="flex items-center">
                  <img src={paymobLogo} alt="Paymob" className="h-6 mr-3" />
                  <div>
                    <h3 className="font-medium">Paymob</h3>
                    <p className="text-sm text-gray-600">Secure payment with Paymob</p>
                  </div>
                </div>
              </div>

              {/* الدفع عند الاستلام */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'cash' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                onClick={() => handlePaymentSelection('cash')}
              >
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-indigo-500 text-xl mr-3" />
                  <div>
                    <h3 className="font-medium">Cash on Delivery</h3>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Order Total:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <button
                onClick={processPayment}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              >
                Complete Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto text-center border border-gray-100">
            <div className="text-green-500 text-6xl mb-4 flex justify-center">
              <FaTruck className="text-green-500 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Order is on the Way!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order #{
                Math.floor(Math.random() * 1000000) + 100000
              } has been confirmed and is being prepared for delivery.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-medium mb-2 text-indigo-700">Delivery Details</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span> Your order is being processed
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Estimated Delivery:</span> Within 3-5 business days
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Payment Method:</span> {selectedPayment}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total Paid:</span> ${calculateSubtotal().toFixed(2)}
              </p>
            </div>
            
            <button
              onClick={continueShopping}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-all"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;