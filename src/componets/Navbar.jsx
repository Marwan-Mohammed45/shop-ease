import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaDiscord,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaStore,
  FaBoxes,
  FaInfoCircle,
  FaSpinner,
  FaTimesCircle,
  FaArrowRight
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../Firebaseconfig";
import { Productsdata } from "../api/api";
import { signOut } from "firebase/auth";

const ProductCard = ({ product, onClick }) => (
  <motion.div 
    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 cursor-pointer"
    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
  >
    <div className="h-48 bg-gray-100 overflow-hidden">
      <img 
        src={product.image || "https://via.placeholder.com/300"} 
        alt={product.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300";
        }}
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-1 truncate">{product.title}</h3>
      <p className="text-gray-500 text-sm mb-2">{product.category}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-indigo-600">${product.price}</span>
        <button className="text-indigo-600 hover:text-indigo-800">
          <FaArrowRight />
        </button>
      </div>
    </div>
  </motion.div>
);

const SearchResultsPopup = ({ results, onClose, onProductSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 pb-10 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 my-8"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            Search Results ({results.length})
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <FaTimesCircle size={20} />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={() => onProductSelect(product)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const LogoutConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
      >
        <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cart = useSelector((state) => state.cart?.items || []);
  const wishlist = useSelector((state) => state.wishlist?.items || []);

  const socialLinks = [
    { icon: <FaFacebookF className="text-lg" />, url: "https://facebook.com" },
    { icon: <FaDiscord className="text-lg" />, url: "https://discord.com/channels/@nebula_coder" },
    { icon: <FaInstagram className="text-lg" />, url: "https://www.facebook.com/share/16WucazX6E/?mibextid=qi2Omg" },
  ];

  const navLinks = [
    { to: "/", text: "Home", icon: <FaHome /> },
    { to: "/shop", text: "Shop", icon: <FaStore /> },
    { to: "/categories", text: "Categories", icon: <FaBoxes /> },
    { to: "/about", text: "About", icon: <FaInfoCircle /> },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    
    // تحميل جميع المنتجات عند تحميل المكون
    loadAllProducts();
    
    return () => unsubscribe();
  }, []);

  // دالة لتحميل جميع المنتجات من API
  const loadAllProducts = async () => {
    try {
      setIsSearching(true);
      // استدعاء API الخاص بالمنتجات
      const products = await Productsdata();
      setAllProducts(products);
    } catch (error) {
      console.error("Failed to load products:", error);
      setSearchError("Failed to load products. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  // دالة البحث المحسنة
  const searchProducts = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    
    // فلترة المنتجات باستخدام خوارزمية أكثر تطوراً
    const results = allProducts.filter(product => {
      // البحث في العنوان والوصف والفئة
      const inTitle = product.title.toLowerCase().includes(lowerCaseQuery);
      const inDescription = product.description?.toLowerCase().includes(lowerCaseQuery) || false;
      const inCategory = product.category.toLowerCase().includes(lowerCaseQuery);
      
      // يمكن إضافة المزيد من شروط البحث هنا
      return inTitle || inDescription || inCategory;
    });

    setSearchResults(results);
    setShowResults(results.length > 0);
  };

  // دالة البحث مع Debounce
  const debouncedSearch = debounce(searchProducts, 300);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      searchProducts(searchText);
    }
  };

  const handleInstantSearch = (query) => {
    setSearchText(query);
    debouncedSearch(query);
  };

  const handleProductSelect = (product) => {
    setShowResults(false);
    setSearchText("");
    setMobileMenuOpen(false);
    navigate(`/products/${product.id}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setShowLogoutConfirm(false);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderUserSection = () => {
    if (user) {
      return (
        <div ref={dropdownRef} className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={toggleDropdown}
          >
            <span className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
              {user.displayName || user.email.split("@")[0]}
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              {user.displayName?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-100 w-56 z-50 overflow-hidden"
              >
                <button
                  onClick={() => {
                    closeDropdown();
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 font-medium transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }
    return (
      <Link
        to="/signin"
        className="hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
      >
        <FaUser className="text-lg" />
      </Link>
    );
  };

  return (
    <>
      {showLogoutConfirm && (
        <LogoutConfirmation
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {showResults && (
        <SearchResultsPopup
          results={searchResults}
          onClose={() => setShowResults(false)}
          onProductSelect={handleProductSelect}
        />
      )}

      {/* Combined Navigation Bar */}
      <div className="w-full fixed top-0 z-30">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">
                Free shipping on orders over $50
              </span>
              <span className="inline sm:hidden">Welcome to ShopEase</span>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-300 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              <span>
                <span className="text-indigo-600">Shop</span>
                <span className="text-black">Ease</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-xl mx-6 relative"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => handleInstantSearch(e.target.value)}
                  placeholder="Search products or categories..."
                  className="w-full px-5 py-2.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-r-full hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  {isSearching ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSearch />
                  )}
                </button>
              </div>

              {/* Instant search results dropdown */}
              {searchText && searchResults.length > 0 && !showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
                >
                  <div className="divide-y">
                    {searchResults.slice(0, 5).map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        className="p-3 cursor-pointer"
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={product.image || "https://via.placeholder.com/100"} 
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/100";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.title}</p>
                            <p className="text-sm text-gray-500 truncate">${product.price}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {searchResults.length > 5 && (
                      <div className="p-2 text-center bg-gray-50">
                        <button 
                          onClick={() => setShowResults(true)}
                          className="text-indigo-600 font-medium text-sm hover:underline"
                        >
                          View all {searchResults.length} results
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </form>

            {/* Navigation and Icons */}
            <div className="flex items-center gap-6">
              {/* Burger menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-gray-700 hover:text-indigo-600 transition-colors p-1 ml-2"
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>

              <div className="hidden lg:flex items-center gap-6">
                <nav className="flex gap-5 lg:gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`hover:text-indigo-600 font-medium ${
                        location.pathname === link.to
                          ? "text-indigo-600 underline underline-offset-4 decoration-2"
                          : "text-gray-800"
                      } transition-all`}
                    >
                      {link.text}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-4">
                  {renderUserSection()}

                  <Link
                    to="/wishlist"
                    className="relative hover:text-indigo-600 transition-colors p-1.5"
                  >
                    <FaHeart className="text-xl" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    className="relative hover:text-indigo-600 transition-colors p-1.5"
                  >
                    <FaShoppingCart className="text-xl" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
              onClick={toggleMobileMenu}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 w-full max-w-sm h-full bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">S</span>
                  </div>
                  <span className="text-xl font-bold text-white">
                    ShopEase Menu
                  </span>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="text-white hover:text-indigo-100 transition-colors p-1"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Search in Mobile Menu */}
                <div className="mb-6">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchText}
                      onChange={(e) => handleInstantSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <FaSpinner className="animate-spin" />
                      </div>
                    )}
                  </form>
                </div>

                {/* Mobile search results */}
                {searchText && searchResults.length > 0 && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-3">
                    <h3 className="font-medium mb-2">Search Results ({searchResults.length})</h3>
                    <div className="space-y-2">
                      {searchResults.slice(0, 3).map((product) => (
                        <motion.div
                          key={product.id}
                          whileTap={{ scale: 0.98 }}
                          className="p-2 bg-white rounded-md shadow-sm cursor-pointer"
                          onClick={() => {
                            handleProductSelect(product);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                              <img 
                                src={product.image || "https://via.placeholder.com/100"} 
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{product.title}</p>
                              <p className="text-sm text-gray-500">${product.price}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {searchResults.length > 3 && (
                        <button
                          onClick={() => {
                            setShowResults(true);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full py-2 text-indigo-600 font-medium text-sm hover:underline"
                        >
                          View all {searchResults.length} results
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* User Section */}
                <div className="mb-8">
                  {user ? (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                        {user.displayName?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {user.displayName || user.email.split("@")[0]}
                        </p>
                        <button
                          onClick={() => {
                            toggleMobileMenu();
                            setShowLogoutConfirm(true);
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 mt-1 font-medium"
                        >
                          <FaSignOutAlt size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/signin"
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                        <FaUser size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Welcome!</p>
                        <p className="text-indigo-600 font-medium">
                          Sign In / Register
                        </p>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Navigation */}
                <nav className="mb-8">
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={toggleMobileMenu}
                        className={`flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-indigo-50 ${
                          location.pathname === link.to
                            ? "bg-indigo-50 text-indigo-600 font-semibold"
                            : "text-gray-700"
                        } font-medium transition-colors`}
                      >
                        {link.icon}
                        <span>{link.text}</span>
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Quick Actions */}
                <div className="mb-8">
                  <div className="space-y-2">
                    <Link
                      to="/wishlist"
                      onClick={toggleMobileMenu}
                      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-indigo-50 group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <FaHeart className="text-gray-600 group-hover:text-indigo-600 text-lg" />
                        <span className="font-medium">Wishlist</span>
                      </div>
                      {wishlist.length > 0 && (
                        <span className="bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full text-sm font-bold">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/cart"
                      onClick={toggleMobileMenu}
                      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-indigo-50 group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <FaShoppingCart className="text-gray-600 group-hover:text-indigo-600 text-lg" />
                        <span className="font-medium">Shopping Cart</span>
                      </div>
                      {cart.length > 0 && (
                        <span className="bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full text-sm font-bold">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="space-y-3">
                    <a
                      href="mailto:support@shopease.com"
                      className="flex items-center gap-3 text-indigo-600 font-medium"
                    >
                      <FaEnvelope />
                      <span>Marwanelzazy8@gmail.com</span>
                    </a>
                    <a
                      href="tel:+15551234567"
                      className="flex items-center gap-3 text-indigo-600 font-medium"
                    >
                      <FaPhone />
                      <span>+20 1008973205</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;