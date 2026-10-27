
import { useEffect, useState } from "react";
import axios from "axios";
import { FaCoins, FaSyncAlt } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GoldRateBox() {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchRate = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/gold-rate`,
          { timeout: 10000 }
        );

        if (active) {
          setRate(res.data);
          setError(false);
        }
      } catch (err) {
        console.error("Unable to fetch gold rate:", err);

        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRate();

    return () => {
      active = false;
    };
  }, []);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(value);

  const updatedAt = rate?.updatedAt
    ? new Date(rate.updatedAt)
    : null;

  const hasValidDate =
    updatedAt && !Number.isNaN(updatedAt.getTime());

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#b89554]/25 bg-[#0b0a08] shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-[#b89554]/[0.07] via-transparent to-[#b89554]/[0.04] pointer-events-none" />

      <div className="relative flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c6a568]/30 bg-[#c6a568]/10">
            <FaCoins className="text-[#d8bd83]" size={19} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d8bd83]">
              Market Watch
            </p>
            <h2 className="mt-1 text-sm font-medium text-white sm:text-base">
              Today's Gold Rate
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-stone-400">
            Loading latest saved rates...
          </p>
        ) : rate?.gold24k != null && rate?.gold22k != null ? (
          <div className="grid grid-cols-2 gap-3 md:flex md:items-center md:gap-7">
            <div className="border-l border-[#b89554]/30 pl-3">
              <p className="text-xs tracking-wide text-stone-400">
                24K Gold / gram
              </p>
              <p className="mt-1 text-xl font-semibold text-[#e4c989] sm:text-2xl">
                ₹{formatPrice(rate.gold24k)}
              </p>
            </div>

            <div className="border-l border-[#b89554]/30 pl-3">
              <p className="text-xs tracking-wide text-stone-400">
                22K Gold / gram
              </p>
              <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                ₹{formatPrice(rate.gold22k)}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-stone-300">
              {error
                ? "Gold rates are temporarily unavailable."
                : "No gold-rate data is available yet."}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Please try again later.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-white/10 pt-3 md:border-t-0 md:border-l md:pl-5 md:pt-0">
          <FaSyncAlt
            size={12}
            className={loading ? "animate-spin text-[#d8bd83]" : "text-[#d8bd83]"}
          />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-500">
              Last updated
            </p>
            <p className="mt-1 text-xs text-stone-300">
              {hasValidDate
                ? updatedAt.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
                : "Time unavailable"}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#c6a568]/50 to-transparent" />
    </section>
  );
}
