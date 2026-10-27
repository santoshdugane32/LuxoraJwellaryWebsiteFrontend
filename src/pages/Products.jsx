
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("Gold");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lux_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      localStorage.setItem("lux_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/products/explore", {
        params: {
          category,
          keyword: search.trim(),
        },
      });

      const result = Array.isArray(res.data) ? res.data : [];

      const data = await Promise.all(
        result.map(async (product) => {
          try {
            const priceRes = await api.get(
              `/api/product-price/${product.id}`
            );

            return {
              ...product,
              price: Number(priceRes.data) || 0,
            };
          } catch {
            return {
              ...product,
              price: Number(product.price) || 0,
            };
          }
        })
      );

      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#080806] text-[#f7f0e4]">
      <Navbar />

      {/* Hero heading */}
      <section className="px-5 pb-10 pt-14 text-center sm:pt-20">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#c5a366]">
          Discover LUXORA
        </p>

        <h1 className="font-serif text-4xl font-light tracking-[0.08em] sm:text-6xl">
          THE ART OF <span className="text-[#d9bd82]">ELEGANCE</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-400 sm:text-base">
          Explore thoughtfully designed jewelry that celebrates
          your individuality and timeless beauty.
        </p>

        <div className="mx-auto mt-8 h-px w-20 bg-[#c5a366]" />
      </section>

      {/* Search */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-[#c5a366]/30 bg-white/[0.04] px-5 py-3 transition focus-within:border-[#d9bd82]">
          <Search size={19} className="shrink-0 text-[#c5a366]" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rings, necklaces, earrings..."
            aria-label="Search jewelry"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-stone-500"
          />
        </div>

        {/* Category filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Gold", "Silver", "Diamond"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full border px-6 py-2.5 text-sm transition duration-300 ${
                category === item
                  ? "border-[#d9bd82] bg-[#d9bd82] text-black"
                  : "border-white/15 text-stone-300 hover:border-[#d9bd82] hover:text-[#e5d5b5]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Product status */}
      <section className="mx-auto min-h-[280px] max-w-7xl px-5 pb-24 pt-12 sm:px-8">
        {loading && (
          <p className="py-16 text-center text-sm tracking-wide text-stone-400">
            Discovering your collection...
          </p>
        )}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-red-300">{error}</p>
            <button
              type="button"
              onClick={fetchProducts}
              className="mt-4 rounded-full border border-[#c5a366]/50 px-5 py-2 text-sm text-[#e5d5b5] hover:bg-[#d9bd82] hover:text-black"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-16 text-center text-stone-400">
            No jewelry found. Try another search or category.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                {category} Collection
              </p>

              <p className="text-xs text-stone-500">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="group animate-[fadeIn_0.6s_ease_both] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition duration-500 hover:-translate-y-1 hover:border-[#c5a366]/40 hover:shadow-[0_16px_45px_rgba(197,163,102,0.08)]"
                >
                  <div className="relative overflow-hidden bg-[#14130f]">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="block w-full"
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={
                        wishlist.includes(product.id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      aria-pressed={wishlist.includes(product.id)}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#f7f0e4] shadow-lg transition hover:scale-110"
                    >
                      <Heart
                        size={19}
                        className={
                          wishlist.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-stone-600"
                        }
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#b9a57e]">
                      {product.category || category}
                    </p>

                    <h2 className="mt-2 line-clamp-2 min-h-12 font-serif text-xl text-[#f7f0e4]">
                      {product.name}
                    </h2>

                    <p className="mt-3 text-lg font-medium text-[#d9bd82]">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="mt-5 w-full rounded-full border border-[#c5a366]/60 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#e5d5b5] transition hover:bg-[#d9bd82] hover:text-black"
                    >
                      Explore Piece
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
