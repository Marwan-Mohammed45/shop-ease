import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../Reducer/appslice"; // تأكد من المسار الصحيح
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaTruck, FaTrashAlt } from "react-icons/fa"; // استيراد الأيقونات

const CartInvoice = () => {
  const products = useSelector((state) => state.appReducer?.Products || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // حساب الإجمالي
  const calculateTotal = () => {
    return products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  };

  // التعامل مع تأكيد الطلب
  const handleConfirmOrder = () => {
    dispatch(clearCart());
    alert("Your order is being processed. You will receive a confirmation email soon!");
  };

  // العودة إلى صفحة التسوق
  const handleStartShopping = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {products.length > 0 ? (
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-800">Invoice Details</h2>
            <div className="mt-8">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-6 border-b pb-6 mb-6">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{product.title}</h3>
                    <p className="text-gray-500 mt-2">{product.desc}</p>
                    <div className="mt-4 text-lg font-semibold text-gray-900">
                      ${product.price} x {product.quantity}
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart({ id: product.id }))}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none transition duration-200"
                  >
                    <FaTrashAlt /> Remove
                  </button>
                </div>
              ))}
            </div>

            {/* حساب المجموع */}
            <div className="flex justify-between items-center mt-6 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800">Total:</h3>
              <span className="text-2xl font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
            </div>

            {/* إضافة خيارات الدفع */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800">Payment Methods</h3>
              <div className="mt-4 space-y-4">
                <button className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300 shadow-lg hover:shadow-xl">
                  <FaCreditCard className="inline mr-2" />
                  Pay with Credit/Debit Card
                </button>
                <button className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none transition duration-300 shadow-lg hover:shadow-xl">
                  <FaTruck className="inline mr-2" />
                  Pay on Delivery
                </button>
              </div>
            </div>

            {/* زر تأكيد الطلب */}
            <div className="mt-8 text-center">
              <button
                onClick={handleConfirmOrder}
                className="py-3 px-6 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16 bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Oops! Your Cart is Empty</h2>
          <p className="text-xl text-gray-600 mb-6">Looks like you haven’t added anything to your cart yet. Let’s change that!</p>
          <button
            onClick={handleStartShopping}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default CartInvoice;
