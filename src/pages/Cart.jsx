import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const loadCart = async () => {

    // Get logged-in user
    const user = JSON.parse(localStorage.getItem("user"));

    // If user is not logged in
    if (!user) {
      setCartItems([]);
      return;
    }

    // User-specific cart
    const CART_KEY = `cart_${user.id}`;

    const saved = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    if (saved.length === 0) {
      setCartItems([]);
      return;
    }

    try {

      const updatedCart = await Promise.all(

        saved.map(async (item) => {

          const productRes = await axios.get(
            `${API_BASE_URL}/api/products/${item.id}`
          );

          const priceRes = await axios.get(
            `${API_BASE_URL}/api/product-price/${item.id}`
          );

          return {
            ...productRes.data,
            quantity: item.quantity,
            price: Number(priceRes.data),
          };

        })

      );

      setCartItems(updatedCart);

      // Save latest cart for this user
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(updatedCart)
      );

    } catch (err) {

      console.error(err);

      setCartItems(saved);

    }

  };

  useEffect(() => {
    loadCart();
  }, []);

  const saveCart = async (data) => {
    try {
      const updated = await Promise.all(
        data.map(async (item) => {
          const productRes = await axios.get(
            `${API_BASE_URL}/api/products/${item.id}`
          );

          const priceRes = await axios.get(
            `${API_BASE_URL}/api/product-price/${item.id}`
          );

          return {
            ...productRes.data,
            quantity: item.quantity,
            price: Number(priceRes.data),
          };
        })
      );

      setCartItems(updated);
      const user = JSON.parse(localStorage.getItem("user"));

      const cartKey = `cart_${user.id}`;

      localStorage.setItem(cartKey, JSON.stringify(updated));
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (id) => {
    const updated = cartItems.filter((item) => item.id !== id);

    setCartItems(updated);
    const user = JSON.parse(localStorage.getItem("user"));

    const cartKey = `cart_${user.id}`;

    localStorage.setItem(cartKey, JSON.stringify(updated));
  };

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  }

  const increaseQty = async (id) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    await saveCart(updated);
  };

  const decreaseQty = async (id) => {
    const updated = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    await saveCart(updated);
  };

  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">
          Luxury Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">🛒</div>

            <h2 className="text-4xl font-bold mb-4">
              Your Luxury Cart is Empty
            </h2>

            <p className="text-gray-400 mb-8">
              Discover timeless jewellery crafted with elegance.
            </p>

            <Link to="/products">
              <button
                className="
                  px-8 py-4 rounded-2xl
                  bg-gradient-to-r
                  from-yellow-300
                  via-yellow-500
                  to-yellow-600
                  text-black font-bold
                  hover:scale-105
                  transition-all duration-300
                "
              >
                Explore Collection
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">

            {/* PRODUCTS */}
            <div className="md:col-span-2 space-y-6">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="
                    flex gap-6
                    bg-gradient-to-r
                    from-zinc-900
                    to-black
                    border border-yellow-500/20
                    p-5 rounded-3xl
                    hover:border-yellow-500/50
                    hover:shadow-xl
                    hover:shadow-yellow-500/10
                    transition-all duration-300
                  "
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="
                      w-32 h-32
                      object-cover
                      rounded-2xl
                      border border-yellow-500/20
                    "
                  />

                  <div className="flex-1">

                    <h2 className="text-2xl font-semibold">
                      {item.name}
                    </h2>

                    <p className="text-yellow-400 text-xl mt-2">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="flex items-center gap-4 mt-5">

                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="
                          w-10 h-10 rounded-full
                          bg-white/10
                          hover:bg-yellow-500
                          hover:text-black
                          transition
                        "
                      >
                        −
                      </button>

                      <span className="text-xl font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="
                          w-10 h-10 rounded-full
                          bg-white/10
                          hover:bg-yellow-500
                          hover:text-black
                          transition
                        "
                      >
                        +
                      </button>

                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="
                        mt-4 text-red-400
                        hover:text-red-300
                        transition
                      "
                    >
                      🗑 Remove Item
                    </button>

                  </div>

                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-yellow-400">
                      ₹
                      {(item.price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {/* SUMMARY */}
            <div
              className="
                sticky top-28
                h-fit
                bg-gradient-to-b
                from-zinc-900
                to-black
                border border-yellow-500/20
                rounded-3xl
                p-8
                shadow-2xl
              "
            >
              <h2 className="text-3xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{cartItems.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-400">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST Included</span>
                  <span>✓</span>
                </div>

                <hr className="border-white/10" />

                <div className="flex justify-between text-3xl font-bold">
                  <span>Total</span>

                  <span className="text-yellow-400">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

              </div>

              <Link to="/checkout">
                <button
                  className="
                    w-full mt-8 py-4
                    rounded-2xl
                    font-bold text-lg
                    text-black
                    bg-gradient-to-r
                    from-yellow-300
                    via-yellow-500
                    to-yellow-600
                    hover:scale-105
                    transition-all duration-300
                    shadow-lg shadow-yellow-500/30
                  "
                >
                  Proceed to Checkout →
                </button>
              </Link>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}