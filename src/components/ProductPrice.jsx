
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function ProductPrice() {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${API_BASE_URL}/api/product-price/1`
        );

        // Supports a numeric response or an object containing the price.
        const rawPrice =
          typeof res.data === "object" && res.data !== null
            ? res.data.price ??
              res.data.totalPrice ??
              res.data.amount
            : res.data;

        const numericPrice = Number(rawPrice);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
          throw new Error("Invalid price received from the server.");
        }

        if (!cancelled) {
          setPrice(numericPrice);
        }
      } catch (err) {
        console.error("Failed to fetch product price:", err);

        if (!cancelled) {
          setError("Unable to load product price. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPrice();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-yellow-500/30 bg-black p-5 text-white shadow-lg">
      <h2 className="mb-3 text-lg font-semibold text-gray-300">
        Product Price
      </h2>

      {loading ? (
        <div className="animate-pulse text-gray-400">
          Calculating price...
        </div>
      ) : error ? (
        <div className="space-y-3">
          <p className="text-sm text-red-400">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-yellow-500/50 px-4 py-2 text-sm text-yellow-400 transition hover:bg-yellow-500/10"
          >
            Retry
          </button>
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-yellow-400">
          {price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h1>
      )}
    </div>
  );
}
