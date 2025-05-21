import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Home from "./componets/Home.jsx";
import Sign from "./pages/Sign.jsx";
import Cart from "./pages/Cart.jsx";
import Footer from "./componets/footer.jsx";
import CartInvoice from "./pages/CartInvoice.jsx";
import Navbar from "./componets/Navbar.jsx";
import { Productsdata } from "./api/api.js";
import Register from "./pages/Signup.jsx";
import Wishlist from "./pages/wishlist.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

// Layout with Navbar and Footer
const Layout = () => {
  return (
    <>
      <Navbar />
      <br />
      <br />
      <br />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} loader={Productsdata} />
        <Route path="cart" element={<Cart />} />
        <Route path="invoice" element={<CartInvoice />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="products/:id" element={<ProductDetails />} />
        
        {/* Add this catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth routes without Layout */}
      <Route path="/signin" element={<Sign />} />
      <Route path="/register" element={<Register />} />
      
      {/* Global 404 catch */}
      <Route path="*" element={<NotFound />} />
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;