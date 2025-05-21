import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaEnvelope, FaLock } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, facebookProvider } from '../Firebaseconfig';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

// مكون الإدخال مع تحسينات التركيز
const Input = React.memo(({ icon: Icon, placeholder, name, type = 'text', value, onChange, variants, custom }) => {
  const inputFocus = {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.2 }
  };

  return (
    <motion.div variants={variants} custom={custom} className="relative mb-4">
      <span className="absolute left-3 top-3.5 text-gray-400">
        <Icon />
      </span>
      <motion.input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-sm"
        required
        whileFocus={inputFocus}
      />
    </motion.div>
  );
});

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // إعدادات الحركات
  const pageVariants = {
    initial: { opacity: 0 },
    enter: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
        when: "beforeChildren"
      }
    },
    exit: { opacity: 0 }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 150,
        damping: 8
      }
    })
  };

  const buttonHover = {
    scale: 1.03,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  const buttonTap = {
    scale: 0.98,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebook = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, facebookProvider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
    >
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8">
          <motion.div
            custom={0}
            variants={itemVariants}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h1>
            <Link 
              to="/Register" 
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Or create a new account
            </Link>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            custom={1}
            variants={itemVariants}
            className="space-y-3 mb-6"
          >
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium disabled:opacity-70"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </motion.button>

            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={handleFacebook}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium disabled:opacity-70"
            >
              <FaFacebookF className="text-xl text-blue-600" />
              Continue with Facebook
            </motion.button>
          </motion.div>

          <motion.div 
            custom={2}
            variants={itemVariants}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-gray-500">OR</span>
            </div>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={FaEnvelope}
              placeholder="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              variants={itemVariants}
              custom={3}
            />
            <Input
              icon={FaLock}
              placeholder="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              variants={itemVariants}
              custom={4}
            />

            <motion.div 
              custom={5}
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link to="" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </motion.div>

            <motion.button
              custom={6}
              variants={itemVariants}
              whileHover={buttonHover}
              whileTap={buttonTap}
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Sign In
                  <HiOutlineArrowRight className="text-lg" />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;