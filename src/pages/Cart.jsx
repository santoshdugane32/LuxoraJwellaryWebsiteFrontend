
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  AlertCircle,
  Gem,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const getCartKey = (user) => `cart_${user.id}`;

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const user = getUser();

  const loadCart = useCallback(async () => {
    const currentUser = getUser();

    if (!currentUser?.id) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const cartKey = getCartKey(currentUser);
    let saved = [];

    try {
      saved = JSON.parse(localStorage.getItem(cartKey) || "[]");

      if (!Array.isArray(saved)) {
        saved = [];
      }
    } catch {
      saved = [];
    }

    if (saved.length === 0) {
      setCartItems([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedCart = await Promise.all(
        saved.map(async (item) => {
          try {
            // Fetch the latest product information.
            const productResponse = await api.get(
              `/api/products/${item.id}`
            );

            let price = Number(item.price ?? productResponse.data.price ?? 0);

            // Fetch the calculated product price when available.
            try {
              const priceResponse = await api.get(
                `/api/product-price/${item.id}`
              );

              const priceData = priceResponse.data;
              const latestPrice =
                typeof priceData === "number" ||
                typeof priceData === "string"
                  ? Number(priceData)
                  : Number(
                      priceData?.price ??
                        priceData?.totalPrice ??
                        priceData?.amount
                    );

              if (Number.isFinite(latestPrice) && latestPrice >= 0) {
                price = latestPrice;
              }
            } catch (priceError) {
              console.warn(
                `Could not refresh price for product ${item.id}:`,
                priceError
              );
            }

            return {
              ...productResponse.data,
              id: productResponse.data.id ?? item.id,
              quantity: Math.max(
                1,
                Math.floor(Number(item.quantity) || 1)
              ),
              price: Number.isFinite(price) ? price : 0,
            };
          } catch (productError) {
            // Keep the saved item visible if its product cannot be fetched.
            console.warn(
              `Could not refresh product ${item.id}:`,
              productError
            );

            return {
              ...item,
              quantity: Math.max(
                1,
                Math.floor(Number(item.quantity) || 1)
              ),
              price: Number(item.price) || 0,
              unavailable: true,
            };
          }
        })
      );

      setCartItems(updatedCart);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    } catch (err) {
      console.error("Unable to load cart:", err);
      setCartItems(saved);
      setError("Some cart details could not be refreshed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const persistCart = (updatedCart) => {
    const currentUser = getUser();

    if (!currentUser?.id) {
      setCartItems([]);
      return false;
    }

    try {
      localStorage.setItem(
        getCartKey(currentUser),
        JSON.stringify(updatedCart)
      );

      setCartItems(updatedCart);
      return true;
    } catch (err) {
      console.error("Unable to save cart:", err);
      setError("Unable to save your cart. Please try again.");
      return false;
    }
  };

  const updateQuantity = (id, change) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);

    if (!item) return;

    const nextQuantity = item.quantity + change;

    if (nextQuantity <= 0) {
      removeItem(id);
      return;
    }

    // Respect stock when the product API provides a valid stock value.
    if (
      change > 0 &&
      item.stock != null &&
      Number.isFinite(Number(item.stock)) &&
      nextQuantity > Number(item.stock)
    ) {
      setError(`Only ${item.stock} units are currently available.`);
      return;
    }

    const updatedCart = cartItems.map((cartItem) =>
      cartItem.id === id
        ? { ...cartItem, quantity: nextQuantity }
        : cartItem
    );

    setError("");
    persistCart(updatedCart);
  };

  const increaseQty = (id) => updateQuantity(id, 1);

  const decreaseQty = (id) => updateQuantity(id, -1);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setError("");
    persistCart(updatedCart);
  };

  const clearCart = () => {
    const currentUser = getUser();

    if (!currentUser?.id) return;

    if (window.confirm("Remove all items from your cart?")) {
      persistCart([]);
      setError("");
    }
  };

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [cartItems]
  );

  const totalQuantity = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
      ),
    [cartItems]
  );

  const checkout = () => {
    if (!getUser()?.id) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (cartItems.length === 0) return;

    if (cartItems.some((item) => item.unavailable)) {
      setError(
        "Please remove unavailable products or refresh your cart before checkout."
      );
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Hero */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-[#1b160b] via-[#101010] to-black p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                <Gem size={14} />
                Curated for you
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                Your <span className="text-amber-400">Luxury Cart</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                Timeless designs, precious details, and pieces worth keeping.
                Your selected collection is waiting for you.
              </p>
            </div>

            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] text-amber-300 sm:flex">
              <ShoppingBag size={34} strokeWidth={1.4} />
            </div>
          </div>
        </section>

        {/* Error / information banner */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4"
          >
            <AlertCircle
              className="mt-0.5 shrink-0 text-amber-300"
              size={20}
            />

            <p className="flex-1 text-sm leading-6 text-gray-300">{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss message"
              className="text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div
            className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20"
            role="status"
          >
            <div className="mb-5 h-10 w-10 animate-spin rounded-full border-2 border-amber-400/20 border-t-amber-400" />
            <p className="font-semibold">Preparing your cart...</p>
            <p className="mt-2 text-sm text-gray-500">
              Refreshing product details and prices.
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty cart */
          <section className="rounded-3xl border border-amber-400/15 bg-gradient-to-b from-amber-400/[0.04] to-transparent px-5 py-16 text-center sm:py-20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/[0.06] text-amber-300">
              <ShoppingBag size={36} strokeWidth={1.4} />
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Your luxury cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
              Discover jewelry designed to make every moment memorable.
              Your next favorite piece is waiting.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-black transition hover:bg-amber-300"
            >
              Explore Collection
              <ArrowRight size={18} />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-3">
            {/* Products */}
            <section className="space-y-5 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Shopping Bag
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {totalQuantity} {totalQuantity === 1 ? "item" : "items"}{" "}
                    selected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-red-400/10 hover:text-red-300"
                >
                  <Trash2 size={15} />
                  Clear cart
                </button>
              </div>

              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-amber-400/15 bg-gradient-to-br from-[#171510] to-[#0b0b0b] transition duration-300 hover:border-amber-400/30"
                >
                  <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
                    {/* Product image */}
                    <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-2xl border border-amber-400/10 bg-black sm:h-32 sm:w-32">
                      <img
                        src={item.imageUrl || "/placeholder-jewelry.png"}
                        alt={item.name || "Jewelry product"}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "/placeholder-jewelry.png";
                        }}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />

                      <div className="absolute left-2 top-2 rounded-full border border-amber-400/20 bg-black/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                        LUXORA
                      </div>
                    </div>

                    {/* Product details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-lg font-bold sm:text-xl">
                        {item.name || "Jewelry product"}
                      </h3>

                      {item.category && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.category}
                        </p>
                      )}

                      <p className="mt-3 text-lg font-semibold text-amber-400">
                        {formatCurrency(item.price)}
                      </p>

                      {item.unavailable && (
                        <p className="mt-2 text-xs text-amber-300">
                          Product details could not be refreshed.
                        </p>
                      )}

                      {/* Quantity */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item.id)}
                            disabled={updatingId === item.id}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition hover:bg-amber-400 hover:text-black disabled:opacity-40"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-9 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQty(item.id)}
                            disabled={
                              updatingId === item.id ||
                              (item.stock != null &&
                                Number.isFinite(Number(item.stock)) &&
                                item.quantity >= Number(item.stock))
                            }
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition hover:bg-amber-400 hover:text-black disabled:opacity-40"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-gray-400 transition hover:bg-red-400/10 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Subtotal
                      </p>

                      <p className="mt-1 text-lg font-bold text-amber-300">
                        {formatCurrency(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl px-2 py-3 text-sm font-semibold text-amber-300 transition hover:text-amber-200"
              >
                <ArrowRight className="rotate-180" size={17} />
                Continue shopping
              </Link>
            </section>

            {/* Order summary */}
            <aside className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#19160f] to-[#0b0b0b] shadow-2xl shadow-black/30">
                <div className="h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-700" />

                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                    Your selection
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Order Summary
                  </h2>

                  <div className="mt-7 space-y-5">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-400">Products</span>
                      <span className="font-semibold">{cartItems.length}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-400">Total quantity</span>
                      <span className="font-semibold">{totalQuantity}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-400">Delivery</span>
                      <span className="font-semibold text-emerald-400">
                        FREE
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4 text-sm">
                      <span className="text-gray-400">Product pricing</span>
                      <span className="text-right text-gray-300">
                        As displayed
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold">Estimated total</span>
                        <span className="text-xl font-black text-amber-400 sm:text-2xl">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        Final charges and applicable taxes are confirmed
                        during checkout.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={checkout}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-5 py-4 font-bold text-black shadow-lg shadow-amber-500/10 transition hover:brightness-110 active:scale-[0.99]"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </button>

                  <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <ShieldCheck className="shrink-0 text-amber-400" size={18} />
                      Secure checkout
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <Truck className="shrink-0 text-amber-400" size={18} />
                      Delivery details at checkout
                    </div>

                    <button
                      type="button"
                      onClick={loadCart}
                      className="flex items-center gap-3 text-xs text-gray-400 transition hover:text-amber-300"
                    >
                      <RefreshCw className="shrink-0 text-amber-400" size={17} />
                      Refresh product prices
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        <footer className="mt-12 border-t border-white/[0.07] pt-6 text-center">
          <p className="text-xs tracking-wide text-gray-600">
            LUXORA · Crafted for moments that matter.
          </p>
        </footer>
      </main>
    </div>
  );
}
