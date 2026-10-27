
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getUser, getCartKey } from "../utils/cartUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

let razorpayScriptPromise;

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      let script = document.getElementById("razorpay-checkout-script");

      if (!script) {
        script = document.createElement("script");
        script.id = "razorpay-checkout-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
      }

      const onLoad = () => {
        cleanup();
        resolve(Boolean(window.Razorpay));
      };

      const onError = () => {
        cleanup();
        razorpayScriptPromise = null;
        resolve(false);
      };

      const cleanup = () => {
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
      };

      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);

      // Handle a script that loaded before the listeners were attached.
      if (window.Razorpay) {
        cleanup();
        resolve(true);
      }
    });
  }

  return razorpayScriptPromise;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getUser();
  const CART_KEY = getCartKey();
  const checkoutLock = useRef(false);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartReady, setCartReady] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isBuyNow = Boolean(location.state?.buyNow);

  // Load Buy Now products or the user's saved cart.
  useEffect(() => {
    let active = true;

    const loadCart = () => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        let items = [];

        if (isBuyNow) {
          items = Array.isArray(location.state?.products)
            ? location.state.products
            : [];
        } else {
          const savedCart = localStorage.getItem(CART_KEY);
          const parsedCart = savedCart ? JSON.parse(savedCart) : [];
          items = Array.isArray(parsedCart) ? parsedCart : [];
        }

        const normalizedItems = items.map((item) => ({
          ...item,
          quantity: Math.max(1, Number(item.quantity) || 1),
          price: Math.max(0, Number(item.price) || 0),
        }));

        if (active) {
          setCart(normalizedItems);
          setErrorMessage("");
          setPricingError("");
        }
      } catch (error) {
        console.error("Unable to load checkout cart:", error);

        if (active) {
          setCart([]);
          setErrorMessage(
            "Unable to load your cart. Please try again."
          );
        }
      } finally {
        if (active) setCartReady(true);
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, [CART_KEY, isBuyNow, location.state, navigate, user]);

  // Refresh displayed prices from the backend.
  // These prices are for display only; the backend must recalculate
  // and validate the total when the order is created.
  useEffect(() => {
    if (!cart.length) {
      setPricingLoading(false);
      setPricingError("");
      return;
    }

    let active = true;
    setPricingLoading(true);
    setPricingError("");

    const fetchPrices = async () => {
      try {
        const updatedItems = await Promise.all(
          cart.map(async (item) => {
            if (!item.id) {
              throw new Error("A product is missing its ID.");
            }

            const response = await axios.get(
              `${API_BASE_URL}/api/product-price/${item.id}`
            );

            const backendPrice = Number(response.data);

            if (
              !Number.isFinite(backendPrice) ||
              backendPrice <= 0
            ) {
              throw new Error(
                `Invalid price returned for ${item.name || "a product"}.`
              );
            }

            return {
              ...item,
              price: backendPrice,
            };
          })
        );

        if (active) {
          setCart(updatedItems);
        }
      } catch (error) {
        console.error(
          "Unable to refresh product prices:",
          error.response?.data || error.message
        );

        if (active) {
          setPricingError(
            "Live prices could not be refreshed. The final amount will be calculated by LUXORA before payment."
          );
        }
      } finally {
        if (active) setPricingLoading(false);
      }
    };

    fetchPrices();

    return () => {
      active = false;
    };
  }, [cart.length, API_BASE_URL]);

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const placeOrder = async () => {
    if (checkoutLock.current) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (!API_BASE_URL) {
      setErrorMessage(
        "API configuration is missing. Please contact support."
      );
      return;
    }

    if (!cart.length) {
      setErrorMessage(
        "Your cart is empty. Add a product before checkout."
      );
      return;
    }

    if (
      cart.some(
        (item) =>
          !item.id ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) < 1
      )
    ) {
      setErrorMessage(
        "Some cart items have invalid details. Please review your cart."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please log in again.");
      navigate("/login");
      return;
    }

    if (!RAZORPAY_KEY) {
      setErrorMessage(
        "Payment configuration is missing. Please contact support."
      );
      return;
    }

    checkoutLock.current = true;
    setLoading(true);
    setErrorMessage("");

    try {
      // 1. Ensure Razorpay has loaded before starting checkout.
      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load Razorpay. Check your internet connection and try again."
        );
      }

      // 2. Ask the backend to calculate and save the actual order total.
      // Never trust the frontend total as the payment amount.
      const orderRes = await axios.post(
        `${API_BASE_URL}/api/orders`,
        {
          items: cart.map((item) => ({
            productId: item.id,
            quantity: Number(item.quantity),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedOrder = orderRes.data;

      if (!savedOrder?.id) {
        throw new Error(
          "The server did not return an order ID."
        );
      }

      // 3. Backend creates the Razorpay order using the saved
      // order total. The frontend amount is not authoritative.
      const paymentRes = await axios.post(
        `${API_BASE_URL}/api/payment/create-order`,
        {
          orderId: savedOrder.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpayOrder = paymentRes.data;

      if (
        !razorpayOrder?.id ||
        !Number.isFinite(Number(razorpayOrder.amount)) ||
        Number(razorpayOrder.amount) <= 0
      ) {
        throw new Error(
          "The server returned invalid payment details."
        );
      }

      // 4. Open Razorpay's secure payment window.
      const options = {
        key: RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        order_id: razorpayOrder.id,
        name: "LUXORA",
        description: "Jewelry Purchase",
        image: "/logo.png",

        prefill: {
          name: user.name || "",
          email: user.email || "",
        },

        theme: {
          color: "#D4AF37",
        },

        modal: {
          ondismiss: () => {
            checkoutLock.current = false;
            setLoading(false);
          },
        },

        // 5. Verify payment on the backend.
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${API_BASE_URL}/api/payment/verify`,
              {
                orderId: savedOrder.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data?.success !== true) {
              throw new Error(
                verifyRes.data?.message ||
                  "Payment verification is not complete."
              );
            }

            // Clear the normal cart only after backend verification.
            // Buy Now must not remove the user's existing cart.
            if (!isBuyNow) {
              localStorage.removeItem(CART_KEY);
            }

            window.dispatchEvent(new Event("cartUpdated"));

            navigate("/payment-success", {
              replace: true,
              state: {
                orderId: savedOrder.id,
              },
            });
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error.response?.data || error.message
            );

            setErrorMessage(
              "We couldn't confirm your payment. Please check your order status before trying again."
            );

            checkoutLock.current = false;
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error(
          "Razorpay payment failed:",
          response.error
        );

        setErrorMessage(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        checkoutLock.current = false;
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "Checkout error:",
        error.response?.data || error.message
      );

      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 401) {
        localStorage.removeItem("token");
        alert("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (status === 403) {
        setErrorMessage(
          "You are not authorized to place this order. Please log in again."
        );
      } else if (status === 400 || status === 409) {
        setErrorMessage(
          data?.message ||
            data?.detail ||
            (typeof data === "string"
              ? data
              : "Please check your order details and payment status.")
        );
      } else {
        setErrorMessage(
          data?.message ||
            error.message ||
            "Unable to start checkout. Please try again."
        );
      }

      checkoutLock.current = false;
      setLoading(false);
    }
  };

  if (!cartReady) {
    return (
      <div className="min-h-screen bg-[#080806] text-[#f7f0e4]">
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#c5a366]/20 border-t-[#d9bd82]" />
            <p className="mt-4 text-sm text-stone-400">
              Preparing your checkout...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080806] text-[#f7f0e4]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <button
          type="button"
          onClick={() =>
            navigate(
              isBuyNow
                ? `/product/${cart[0]?.id || ""}`
                : "/cart"
            )
          }
          className="mb-8 inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-[#d9bd82]"
        >
          <ArrowLeft size={16} />
          {isBuyNow ? "Back to Product" : "Back to Cart"}
        </button>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b9a57e]">
            LUXORA · Secure Checkout
          </p>

          <h1 className="mt-3 font-serif text-4xl font-normal sm:text-5xl">
            Complete your order
          </h1>

          <p className="mt-3 text-sm text-stone-400">
            Review your selection before proceeding to secure payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Order items */}
          <section className="rounded-2xl border border-[#c5a366]/20 bg-[#11100d] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  className="text-[#d9bd82]"
                  size={21}
                />
                <h2 className="font-serif text-2xl">
                  Your selection
                </h2>
              </div>

              <span className="text-xs text-stone-500">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-sm leading-6 text-red-200"
              >
                {errorMessage}
              </div>
            )}

            {pricingError && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100"
              >
                {pricingError}
              </div>
            )}

            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag
                  size={35}
                  className="mx-auto text-stone-600"
                />

                <p className="mt-4 text-lg text-stone-300">
                  Your cart is empty
                </p>

                <p className="mt-2 text-sm text-stone-500">
                  Discover a piece from our jewelry collection.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="mt-6 rounded-full bg-[#d9bd82] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e8d5a7]"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-white/[0.07] pb-5 last:border-0 last:pb-0"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#191813] sm:h-28 sm:w-28">
                      <img
                        src={item.imageUrl || "/no-image.png"}
                        alt={item.name || "Jewelry"}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <h3 className="truncate font-serif text-lg sm:text-xl">
                        {item.name || "Jewelry"}
                      </h3>

                      {item.category && (
                        <p className="mt-1 text-xs text-stone-500">
                          {item.category}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-stone-400">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 text-sm text-[#d9bd82]">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <p className="font-medium text-[#e5d5b5]">
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Payment summary */}
          <aside className="h-fit rounded-2xl border border-[#c5a366]/30 bg-[#11100d] p-6 sm:p-7">
            <h2 className="font-serif text-2xl">
              Order summary
            </h2>

            <div className="mt-7 space-y-4">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-stone-400">
                  Subtotal
                </span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-stone-400">
                  Shipping
                </span>
                <span className="text-stone-400">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-300">
                    Estimated total
                  </span>

                  <span className="text-2xl font-medium text-[#d9bd82]">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="mt-2 text-right text-[11px] text-stone-500">
                  {pricingLoading
                    ? "Refreshing current product prices..."
                    : "Final payable amount is calculated by the backend."}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={
                loading ||
                pricingLoading ||
                cart.length === 0 ||
                total <= 0
              }
              onClick={placeOrder}
              className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c5a366] to-[#ead6a4] px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading || pricingLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  {pricingLoading
                    ? "Updating prices..."
                    : "Processing..."}
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Pay Securely
                </>
              )}
            </button>

            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
              <div className="flex items-start gap-3">
                <LockKeyhole
                  size={18}
                  className="mt-0.5 shrink-0 text-[#c5a366]"
                />

                <div>
                  <p className="text-sm text-stone-200">
                    Secure payment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    Payments are processed through Razorpay.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-[#c5a366]"
                />

                <div>
                  <p className="text-sm text-stone-200">
                    Protected checkout
                  </p>

                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    Your order is submitted to LUXORA before payment begins.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-[#c5a366]"
                />

                <div>
                  <p className="text-sm text-stone-200">
                    Payment verification
                  </p>

                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    The success page appears only after the backend
                    confirms verification.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
