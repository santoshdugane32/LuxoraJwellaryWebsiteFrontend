import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GoldRateBox() {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    fetchRate();
  }, []);

  const fetchRate = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/gold-rate`);
      setRate(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FIXED CONDITION
  if (!rate?.gold24k) {
    return <div className="text-gray-400">Loading rates...</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">

      <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
        <p className="text-yellow-400 font-bold">Gold 24K</p>
        <p className="text-white">₹{rate.gold24k}</p>
      </div>

      <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
        <p className="text-orange-300 font-bold">Gold 22K</p>
        <p className="text-white">₹{rate.gold22k}</p>
      </div>

      <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
        <p className="text-blue-300 font-bold">Updated</p>
        <p className="text-white text-sm">
          {new Date(rate.updatedAt).toLocaleString()}
        </p>
      </div>

    </div>
  );
}