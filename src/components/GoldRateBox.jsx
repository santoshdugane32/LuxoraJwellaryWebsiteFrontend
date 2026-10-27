
import { useEffect, useState } from "react";
import axios from "axios";
import { FaCoins, FaSyncAlt, FaClock } from "react-icons/fa";

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

  const hasRates =
    rate?.gold24k != null && rate?.gold22k != null;

  return (
    <section className="relative isolate overflow-hidden rounded-[24px] border border-[#d9bd82]/20 bg-[#100f0c] shadow-[0_15px_50px_rgba(0,0,0,0.22)]">
      {/* Subtle gold glow */}
      <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full bg-[#c6a568]/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-48 w-48 rounded-full bg-[#c6a568]/[0.06] blur-3xl" />

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[0.8fr_1.4fr_0.9fr] lg:items-center lg:gap-6 lg:p-7">
        {/* Heading */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d9bd82]/25 bg-[#d9bd82]/10">
            <FaCoins className="text-[#e3ca95]" size={21} />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#d9bd82]">
              LUXORA Market Watch
            </p>
            <h2 className="mt-1 font-serif text-xl text-[#f8f2e8] sm:text-2xl">
              Gold rates
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Daily reference · Per gram
            </p>
          </div>
        </div>

        {/* Rates */}
        {loading ? (
          <div className="flex min-h-[92px] items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5">
            <FaSyncAlt className="animate-spin text-[#d9bd82]" />
            <p className="text-sm text-stone-400">
              Loading latest saved rates...
            </p>
          </div>
        ) : hasRates ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#d9bd82]/20 bg-gradient-to-br from-[#d9bd82]/[0.10] to-transparent p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#e5c98d]" />
                <p className="text-xs font-medium text-stone-300">
                  24K Gold
                </p>
              </div>

              <p className="mt-3 font-serif text-2xl text-[#e8ce94] sm:text-3xl">
                ₹{formatPrice(rate.gold24k)}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">
                99.9% purity
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-stone-400" />
                <p className="text-xs font-medium text-stone-300">
                  22K Gold
                </p>
              </div>

              <p className="mt-3 font-serif text-2xl text-[#f8f2e8] sm:text-3xl">
                ₹{formatPrice(rate.gold22k)}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">
                91.6% purity
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[92px] items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5">
            <div>
              <p className="text-sm text-stone-200">
                {error
                  ? "Gold rates are temporarily unavailable."
                  : "No gold-rate data is available yet."}
              </p>
              <p className="mt-2 text-xs text-stone-500">
                Please try again later.
              </p>
            </div>
          </div>
        )}

        {/* Update information */}
        <div className="flex items-center gap-3 border-t border-white/[0.08] pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
            {loading ? (
              <FaSyncAlt className="animate-spin text-[#d9bd82]" size={14} />
            ) : (
              <FaClock className="text-[#d9bd82]" size={15} />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
              Last updated
            </p>
            <p className="mt-1 text-sm text-stone-200">
              {hasValidDate
                ? updatedAt.toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Time unavailable"}
            </p>
            <p className="mt-1 text-[10px] text-stone-500">
              Reference rates · Check final product pricing
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#d9bd82]/40 to-transparent" />
    </section>
  );
}
