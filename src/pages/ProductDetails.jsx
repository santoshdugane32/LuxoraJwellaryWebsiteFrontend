
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [fly, setFly] = useState(false);
  const [flyStyle, setFlyStyle] = useState({});
  const [showAdded, setShowAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lux_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productRes = await axios.get(
          `${API_BASE_URL}/api/products/${id}`
        );

        if (!active) return;

        const fetchedProduct = productRes.data;
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.imageUrl || "");

        try {
          const priceRes = await axios.get(
            `${API_BASE_URL}/api/product-price/${id}`
          );

          if (active) {
            const returnedPrice =
              typeof priceRes.data === "object"
                ? priceRes.data.price
                : priceRes.data;

            setPrice(Number(returnedPrice) || 0);
          }
        } catch (priceError) {
          console.error("Unable to fetch product price:", priceError);

          if (active) {
            setPrice(Number(fetchedProduct.price) || 0);
          }
        }
      } catch (err) {
        console.error("Unable to fetch product:", err);

        if (active) {
          setProduct(null);
          setError("Unable to load this product. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const toggleWishlist = () => {
    if (!product) return;

    setWishlist((previous) => {
      const updated = previous.includes(product.id)
        ? previous.filter((item) => item !== product.id)
        : [...previous, product.id];

      localStorage.setItem("lux_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  const requireLogin = () => {
    const user = getLoggedInUser();

    if (!user) {
      navigate("/login");
      return null;
    }

    if (user.role === "ADMIN") {
      alert("Please log in with a customer account to place an order.");
      return null;
    }

    return user;
  };

  const addToCart = () => {
    if (!product || adding || Number(product.stock) <= 0) return;

    const user = requireLogin();
    if (!user) return;

    const cartKey = `cart_${user.id}`;

    try {
      let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

      if (!Array.isArray(cart)) cart = [];

      const existing = cart.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existing) {
        if (Number(existing.quantity) >= Number(product.stock)) {
          alert("You have reached the available stock for this product.");
          return;
        }

        cart = cart.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: Number(item.quantity || 1) + 1 }
            : item
        );
      } else {
        cart.push({
          ...product,
          price,
          quantity: 1,
        });
      }

      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      // Optional flying image animation toward the cart icon.
      const imageRect = imageRef.current?.getBoundingClientRect();
      const cartIcon = document.getElementById("cart-icon");
      const cartRect = cartIcon?.getBoundingClientRect();

      if (imageRect && cartRect) {
        setFlyStyle({
          left: `${imageRect.left + imageRect.width / 2}px`,
          top: `${imageRect.top + imageRect.height / 2}px`,
          "--moveX": `${
            cartRect.left + cartRect.width / 2 -
            (imageRect.left + imageRect.width / 2)
          }px`,
          "--moveY": `${
            cartRect.top + cartRect.height / 2 -
            (imageRect.top + imageRect.height / 2)
          }px`,
        });

        setFly(true);
      }

      setAdding(true);
      setShowAdded(true);

      setTimeout(() => {
        setFly(false);
        setAdding(false);
        setShowAdded(false);
      }, 1200);
    } catch (err) {
      console.error("Unable to update cart:", err);
      alert("Unable to add this product to your cart.");
    }
  };

  const buyNow = () => {
    if (!product || Number(product.stock) <= 0) return;

    const user = requireLogin();
    if (!user) return;

    navigate("/checkout", {
      state: {
        buyNow: true,
        products: [
          {
            ...product,
            price,
            quantity: 1,
          },
        ],
        total: price,
      },
    });
  };

  const shareProduct = async () => {
    const shareData = {
      title: product?.name || "LUXORA Jewelry",
      text: `Discover ${product?.name} at LUXORA.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Product link copied!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Unable to share product:", err);
      }
    }
  };

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080806] text-[#f7f0e4]">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[#c5a366]/20 border-t-[#d9bd82]" />
            <p className="font-serif text-xl text-[#e5d5b5]">
              Discovering your piece...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#080806] text-[#f7f0e4]">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
          <p className="font-serif text-3xl">Product unavailable</p>
          <p className="mt-3 max-w-md text-sm text-stone-400">
            {error || "We couldn't find the jewelry piece you requested."}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-7 rounded-full border border-[#c5a366]/60 px-6 py-3 text-sm text-[#e5d5b5] transition hover:bg-[#d9bd82] hover:text-black"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  const inStock = Number(product.stock) > 0;
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="min-h-screen bg-[#080806] text-[#f7f0e4]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 pt-7 sm:px-8">
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-[#d9bd82]"
        >
          <ArrowLeft size={16} />
          Back to Collections
        </button>
      </div>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pb-20 pt-7 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-10">
        {/* Product image */}
        <section>
          <div className="group relative overflow-hidden rounded-2xl border border-[#c5a366]/20 bg-[#12110e]">
            <img
              ref={imageRef}
              src={selectedImage || product.imageUrl}
              alt={product.name}
              className="h-[380px] w-full object-contain p-5 transition duration-700 group-hover:scale-[1.03] sm:h-[560px] sm:p-8"
            />

            <div className="absolute left-5 top-5 rounded-full border border-[#c5a366]/30 bg-black/70 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#e5d5b5]">
              LUXORA Fine Jewelry
            </div>

            <div className="absolute right-4 top-4 flex gap-2">
              <button
                type="button"
                onClick={toggleWishlist}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                aria-pressed={isWishlisted}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c5a366]/30 bg-black/70 transition hover:border-[#d9bd82]"
              >
                <Heart
                  size={19}
                  className={
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-[#e5d5b5]"
                  }
                />
              </button>

              <button
                type="button"
                onClick={shareProduct}
                aria-label="Share product"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c5a366]/30 bg-black/70 text-[#e5d5b5] transition hover:border-[#d9bd82]"
              >
                <Share2 size={18} />
              </button>
            </div>

            {Number(product.stock) <= 0 && (
              <div className="absolute bottom-5 left-5 rounded-full bg-red-950/90 px-4 py-2 text-xs text-red-200">
                Currently unavailable
              </div>
            )}

            {/* Gallery arrows are useful when multiple image URLs are added */}
            <button
              type="button"
              onClick={() => setSelectedImage(product.imageUrl || "")}
              aria-label="Show product image"
              className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#c5a366]/30 bg-black/70 text-[#e5d5b5] transition hover:bg-[#d9bd82] hover:text-black"
            >
              <ChevronLeft size={18} />
              <ChevronRight size={18} />
            </button>
          </div>

          <p className="mt-4 text-center text-xs tracking-wide text-stone-500">
            Designed to make every occasion memorable.
          </p>
        </section>

        {/* Product information */}
        <section className="flex flex-col justify-center py-3">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b9a57e]">
            {product.category || "Fine Jewelry"}
          </p>

          <h1 className="mt-4 font-serif text-4xl font-normal leading-tight text-[#f7f0e4] sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-medium text-[#d9bd82]">
              {formatPrice(price)}
            </p>
            <span className="text-xs text-stone-500">INR</span>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-stone-400">
            Discover the elegance of {product.name}, a jewelry piece
            designed to complement your personal style. Explore its
            specifications below before making your selection.
          </p>

          {/* Product specifications */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
              <p className="text-xs text-stone-500">Weight</p>
              <p className="mt-2 text-xl text-[#f7f0e4]">
                {product.weightInGrams != null
                  ? `${product.weightInGrams} g`
                  : "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
              <p className="text-xs text-stone-500">Purity</p>
              <p className="mt-2 text-xl text-[#d9bd82]">
                {product.purity != null
                  ? `${product.purity}K`
                  : "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
              <p className="text-xs text-stone-500">Making Charge</p>
              <p className="mt-2 text-xl text-[#f7f0e4]">
                {product.makingChargePercent != null
                  ? `${product.makingChargePercent}%`
                  : "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
              <p className="text-xs text-stone-500">Availability</p>
              <p
                className={`mt-2 text-lg ${
                  inStock ? "text-emerald-400" : "text-red-300"
                }`}
              >
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={addToCart}
              disabled={!inStock || adding}
              className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#d9bd82] px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-[#e8d5a7] disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
            >
              <ShoppingBag size={18} />
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={buyNow}
              disabled={!inStock}
              className="min-h-14 rounded-full border border-[#c5a366]/50 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#e5d5b5] transition hover:bg-[#d9bd82] hover:text-black disabled:cursor-not-allowed disabled:border-stone-700 disabled:text-stone-500"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-7 flex items-start gap-3 border-t border-white/10 pt-6">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#c5a366]"
            />
            <div>
              <p className="text-sm text-[#e5d5b5]">
                Shop with confidence
              </p>
              <p className="mt-1 text-xs leading-6 text-stone-500">
                Review your order details and final payable amount at checkout.
                Applicable taxes and charges depend on your store's pricing
                configuration.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Flying image animation */}
      {fly && (
        <img
          src={product.imageUrl}
          alt=""
          aria-hidden="true"
          style={flyStyle}
          className="pointer-events-none fixed z-[9999] h-16 w-16 rounded-full border-2 border-[#d9bd82] object-cover shadow-2xl animate-flyCart"
        />
      )}

      {/* Success message */}
      {showAdded && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-[#c5a366]/30 bg-[#15140f] px-6 py-3 text-sm text-[#e5d5b5] shadow-2xl"
        >
          Added to your cart
        </div>
      )}
    </div>
  );
}
