import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  FaFacebookF,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
} from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, facebookProvider } from "../Firebaseconfig";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

// مكون input قابل لإعادة الاستخدام
const Input = React.memo(
  ({ icon: Icon, placeholder, name, type = "text", optional = false, value, onChange }) => {
    return (
      <motion.div className="relative mb-4">
        <span className="absolute left-3 top-3 text-gray-400">
          <Icon />
        </span>
        <input
          type={type}
          name={name}
          placeholder={optional ? `${placeholder} (Optional)` : placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
          required={!optional}
        />
      </motion.div>
    );
  }
);

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // الحركات
  const pageVariants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
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
        delay: 0.2,
      },
    },
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
        damping: 8,
      },
    }),
  };

  const buttonHover = {
    scale: 1.03,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  };

  const buttonTap = {
    scale: 0.98,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.firstName.trim().length < 3) {
      setError("First name must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (!isEmailValid(form.email)) {
      setError("Invalid email address");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!form.agree) {
      setError("You must agree to the terms");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebook = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, facebookProvider);
      navigate("/");
    } catch (error) {
      setError(error.message);
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
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8">
          <motion.div
            custom={0}
            variants={itemVariants}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <Link
              to="/signin"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Already have an account? Sign In
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

          <motion.div custom={2} variants={itemVariants} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-gray-500">OR</span>
            </div>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="space-y-4">
            <motion.div custom={3} variants={itemVariants} className="flex gap-3">
              <div className="flex-1">
                <Input
                  icon={FaUser}
                  placeholder="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <Input
                  icon={FaUser}
                  placeholder="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <Input
              icon={FaEnvelope}
              placeholder="Enter your Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              icon={FaPhone}
              placeholder="Enter your Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              optional
            />
            <Input
              icon={FaMapMarkerAlt}
              placeholder="Enter your Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              optional
            />
            <Input
              icon={FaLock}
              placeholder="Create a Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            <Input
              icon={FaLock}
              placeholder="Confirm your Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <motion.div
              custom={7}
              variants={itemVariants}
              className="flex items-center text-sm gap-2 mt-2"
            >
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </motion.div>

            <motion.button
              custom={8}
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
                  Create Account
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

export default SignUp;
