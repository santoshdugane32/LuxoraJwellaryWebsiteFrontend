
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LiveRates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRates = useCallback(async () => {
    try {
      setError("");

      const res = await axios.get(
        `${API_BASE_URL}/api/gold-rate`
      );

      setData(res.data);
    } catch (err) {
      console.error("Rate fetch error:", err);
      setError("Unable to fetch gold rates. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();

    const interval = setInterval(fetchRates, 60000);

    return () => clearInterval(interval);
  }, [fetchRates]);

  // Safely read gold prices from the API
  const gold24k = Number(data?.gold24k) || 0;
  const gold22k = Number(data?.gold22k) || 0;

  // These are estimates, NOT verified live market prices.
  const silverRate = gold24k
    ? (gold24k / 82).toFixed(2)
    : "--";

  const diamondRate = gold24k
    ? (gold24k * 0.08).toFixed(2)
    : "--";

  const formatPrice = (price) =>
    price > 0
      ? price.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })
      : "--";

  return (
    <section className="px-5 md:px-12 lg:px-20 mt-8 mb-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-7">
          <p className="text-amber-400 uppercase tracking-[0.3em] text-xs mb-2">
            LUXORA MARKET WATCH
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Precious Metal Rates
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Stay informed before choosing your next piece.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-400 text-center mb-5">
            Loading gold rates...
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="text-center mb-5">
            <p className="text-red-400 text-sm mb-3">{error}</p>

            <button
              onClick={fetchRates}
              className="text-amber-400 hover:text-amber-300 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Gold */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-500/15 via-neutral-900 to-neutral-950 p-6 shadow-xl">
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-400/10 blur-2xl" />

            <div className="relative">
              <p className="text-amber-400 text-xs uppercase tracking-widest">
                Precious Metal
              </p>

              <h3 className="text-white text-xl font-semibold mt-2">
                Gold
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                API-reported rate
              </p>

              <div className="border-t border-amber-400/15 mt-5 pt-4">
                <p className="text-gray-400 text-sm">24 Karat</p>
                <p className="text-amber-300 text-2xl font-semibold mt-1">
                  ₹{formatPrice(gold24k)}
                  <span className="text-gray-400 text-sm font-normal">
                    {" "}/ gram*
                  </span>
                </p>

                <p className="text-gray-400 text-sm mt-4">22 Karat</p>
                <p className="text-white text-lg font-medium mt-1">
                  ₹{formatPrice(gold22k)}
                  <span className="text-gray-400 text-sm font-normal">
                    {" "}/ gram*
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Silver */}
          <div className="rounded-2xl border border-gray-500/20 bg-gradient-to-br from-gray-400/10 via-neutral-900 to-neutral-950 p-6 shadow-xl">
            <p className="text-gray-300 text-xs uppercase tracking-widest">
              Estimated Value
            </p>

            <h3 className="text-white text-xl font-semibold mt-2">
              Silver
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Indicative estimate only
            </p>

            <div className="border-t border-white/10 mt-5 pt-4">
              <p className="text-gray-400 text-sm">Estimated rate</p>

              <p className="text-white text-2xl font-semibold mt-1">
                ₹{silverRate}
                <span className="text-gray-400 text-sm font-normal">
                  {" "}/ gram
                </span>
              </p>

              <p className="text-gray-500 text-xs mt-4 leading-relaxed">
                Calculated from the gold rate using a rough ratio.
                This is not a live silver market quote.
              </p>
            </div>
          </div>

          {/* Diamond */}
          <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 via-neutral-900 to-neutral-950 p-6 shadow-xl">
            <p className="text-purple-300 text-xs uppercase tracking-widest">
              Indicative Estimate
            </p>

            <h3 className="text-white text-xl font-semibold mt-2">
              Diamond
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Not a market quotation
            </p>

            <div className="border-t border-white/10 mt-5 pt-4">
              <p className="text-gray-400 text-sm">Illustrative value</p>

              <p className="text-white text-2xl font-semibold mt-1">
                ₹{diamondRate}
                <span className="text-gray-400 text-sm font-normal">
                  {" "}/ carat*
                </span>
              </p>

              <p className="text-gray-500 text-xs mt-4 leading-relaxed">
                The calculation is not a valid diamond pricing method.
                Actual prices depend on the 4Cs, certification,
                shape, and market conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-xs text-gray-500">
          <p>
            *Confirm the unit returned by your backend API.
          </p>

          <p>
            Last updated:{" "}
            {data?.updatedAt
              ? new Date(data.updatedAt).toLocaleString("en-IN")
              : "Not available"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default LiveRates;
