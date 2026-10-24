import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LiveRates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();

    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchRates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/gold-rate`);
      setData(res.data);
    } catch (err) {
      console.log("Rate fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // SAFE DERIVED VALUES
  // -------------------------
  const gold24k = data?.gold24k ?? 0;
  const gold22k = data?.gold22k ?? 0;

  // Silver (realistic market relation ~1/80 to 1/85 of gold, not fixed %)
  const silverRate = gold24k ? (gold24k / 82).toFixed(2) : "--";

  // Diamond (VERY ROUGH market estimate, not % of gold in real life)
  const diamondRate = gold24k ? (gold24k * 0.08).toFixed(2) : "--";

  return (
    <div className="px-8 md:px-20 mt-6">

      {/* LOADING STATE */}
      {loading && (
        <p className="text-gray-400 text-center mb-4">
          Loading live rates...
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-4">

        {/* GOLD */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-5 rounded-xl shadow-lg backdrop-blur-md">
          <h3 className="text-yellow-400 font-bold text-lg">
            Gold (India Live)
          </h3>

          <p className="text-white text-xl font-semibold">
            ₹ {gold24k || "--"} / 24K
          </p>

          <p className="text-white">
            ₹ {gold22k || "--"} / 22K
          </p>
        </div>

        {/* SILVER */}
        <div className="bg-gradient-to-r from-gray-500/10 to-gray-700/10 border border-gray-400/20 p-5 rounded-xl shadow-lg backdrop-blur-md">
          <h3 className="text-gray-300 font-bold text-lg">
            Silver (Estimated)
          </h3>

          <p className="text-white text-xl font-semibold">
            ₹ {silverRate} / gram
          </p>

          <p className="text-gray-400 text-sm">
            Market ratio-based estimate (1/82 of gold)
          </p>
        </div>

        {/* DIAMOND */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-5 rounded-xl shadow-lg backdrop-blur-md">
          <h3 className="text-blue-300 font-bold text-lg">
            Diamond (Estimated)
          </h3>

          <p className="text-white text-xl font-semibold">
            ₹ {diamondRate} / carat
          </p>

          <p className="text-gray-400 text-sm">
            Approximation only (real pricing depends on 4C)
          </p>
        </div>

      </div>

      {/* LAST UPDATED */}
      <p className="text-gray-400 text-sm mt-3 text-center">
        Last Updated:{" "}
        {data?.updatedAt
          ? new Date(data.updatedAt).toLocaleString()
          : "No data"}
      </p>
    </div>
  );
}

export default LiveRates;