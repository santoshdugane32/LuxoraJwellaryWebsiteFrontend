
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Package,
  ShoppingBag,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/api";
import OrderTimeline from "../components/OrderTimeline";

const PAGE_SIZE = 5;

const ORDER_STATUSES = [
  "",
  "PENDING",
  "CONFIRMED",
  "QUALITY_CHECK",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_STYLES = {
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  CONFIRMED: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  QUALITY_CHECK: "border-purple-400/30 bg-purple-400/10 text-purple-300",
  PACKED: "border-indigo-400/30 bg-indigo-400/10 text-indigo-300",
  SHIPPED: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  OUT_FOR_DELIVERY: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  DELIVERED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  CANCELLED: "border-red-400/30 bg-red-400/10 text-red-300",
  RETURN_REQUESTED: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  RETURNED: "border-purple-400/30 bg-purple-400/10 text-purple-300",
  REFUNDED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
};

const formatStatus = (status) =>
  String(status || "UNKNOWN")
    .trim()
    .replaceAll("_", " ");

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₹0.00";
  }

  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchOrders = useCallback(
    async (pageNo, statusValue, searchValue, signal) => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/orders/user", {
          params: {
            page: pageNo,
            size: PAGE_SIZE,
            status: statusValue || undefined,
            search: searchValue.trim() || undefined,
          },
          signal,
        });

        const data = response.data;

        // Supports Spring Boot Page responses and plain arrays.
        const orderList = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];

        setOrders(orderList);

        setTotalPages(
          Array.isArray(data)
            ? 1
            : Math.max(0, Number(data?.totalPages) || 0)
        );
      } catch (err) {
        if (
          err.code === "ERR_CANCELED" ||
          err.name === "CanceledError"
        ) {
          return;
        }

        console.error("Failed to fetch orders:", err);

        setOrders([]);
        setTotalPages(0);

        setError(
          err.response?.status === 401
            ? "Your session may have expired. Please log in again."
            : err.response?.status === 403
              ? "You do not have permission to view these orders."
              : err.response?.data?.message ||
                "Unable to load your orders. Please try again."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Fetch orders when the page, status or search query changes.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      fetchOrders(page, status, search, controller.signal);
    }, search ? 350 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [page, status, search, fetchOrders]);

  const handleStatusChange = (newStatus) => {
    setPage(0);
    setStatus(newStatus);
  };

  const handleSearchChange = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  const handleRetry = () => {
    fetchOrders(page, status, search);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Page heading */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-[#19140b] via-[#0d0d0d] to-black p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                <Package size={14} />
                Your collection
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                My <span className="text-amber-400">Orders</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                Follow your purchases, explore your order details, and
                track every step of your LUXORA experience.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/10 text-amber-300">
              <ShoppingBag size={30} strokeWidth={1.5} />
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="mb-6">
          <label
            htmlFor="order-search"
            className="mb-3 block text-sm font-semibold text-gray-300"
          >
            Find an order
          </label>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-amber-400/50 sm:max-w-xl">
            <Search className="shrink-0 text-amber-400" size={20} />

            <input
              id="order-search"
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search order ID or product..."
              className="min-w-0 flex-1 bg-transparent py-4 text-sm text-white outline-none placeholder:text-gray-500"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="rounded-full p-1 text-gray-400 transition hover:text-amber-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </section>

        {/* Status filters */}
        <section className="mb-8">
          <p className="mb-3 text-sm font-semibold text-gray-400">
            Filter by status
          </p>

          <div className="flex flex-wrap gap-2">
            {ORDER_STATUSES.map((itemStatus) => {
              const active = status === itemStatus;

              return (
                <button
                  key={itemStatus || "ALL"}
                  type="button"
                  onClick={() => handleStatusChange(itemStatus)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition duration-200 sm:px-4 sm:text-sm ${
                    active
                      ? "border-amber-400 bg-amber-400 text-black shadow-lg shadow-amber-400/10"
                      : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-amber-400/50 hover:text-amber-300"
                  }`}
                >
                  {itemStatus ? formatStatus(itemStatus) : "All Orders"}
                </button>
              );
            })}
          </div>
        </section>

        {/* Result count */}
        {!loading && !error && (
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {orders.length} {orders.length === 1 ? "order" : "orders"} on
              this page
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-amber-300 transition hover:bg-amber-400/10"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] px-5 py-16"
            role="status"
            aria-live="polite"
          >
            <div className="mb-5 h-10 w-10 animate-spin rounded-full border-2 border-amber-400/20 border-t-amber-400" />

            <p className="font-semibold text-white">Loading your orders</p>

            <p className="mt-2 text-sm text-gray-500">
              Preparing your LUXORA collection...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-7 text-center sm:p-10"
            role="alert"
          >
            <AlertCircle className="mx-auto mb-4 text-red-400" size={36} />

            <h2 className="text-xl font-bold">Something went wrong</h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-black transition hover:bg-amber-300"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl border border-amber-400/15 bg-gradient-to-b from-amber-400/[0.05] to-transparent px-5 py-16 text-center sm:py-20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/[0.07]">
              <ShoppingBag
                className="text-amber-300"
                size={34}
                strokeWidth={1.4}
              />
            </div>

            <h2 className="text-2xl font-bold">
              {search || status
                ? "No matching orders"
                : "Your story starts here"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
              {search || status
                ? "Try another search term or select a different order status."
                : "You haven't placed any orders yet. Discover something special in our collection."}
            </p>

            {(search || status) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  setPage(0);
                }}
                className="mt-6 rounded-xl border border-amber-400/30 px-5 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/10"
              >
                Clear filters
              </button>
            )}

            {!search && !status && (
              <a
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-black transition hover:bg-amber-300"
              >
                Explore Collection
                <ShoppingBag size={17} />
              </a>
            )}
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const normalizedStatus = String(order.status || "UNKNOWN")
                .trim()
                .toUpperCase();

              const statusStyle =
                STATUS_STYLES[normalizedStatus] ||
                "border-white/15 bg-white/5 text-gray-300";

              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-amber-400/15 bg-gradient-to-br from-[#15130f] via-[#0e0e0e] to-[#090909] transition duration-300 hover:border-amber-400/30"
                >
                  {/* Gold accent */}
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

                  <div className="p-5 sm:p-7 lg:p-8">
                    {/* Order header */}
                    <div className="flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                          Order details
                        </p>

                        <h2 className="mt-2 break-words text-2xl font-black sm:text-3xl">
                          Order #{order.id}
                        </h2>

                        <p className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                          <CalendarDays
                            className="shrink-0 text-amber-400"
                            size={16}
                          />
                          {formatDate(order.orderDate)}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Order total
                        </p>

                        <p className="mt-1 break-words text-2xl font-black text-amber-400 sm:text-3xl">
                          {formatCurrency(order.totalAmount)}
                        </p>

                        <span
                          className={`mt-3 inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle}`}
                        >
                          {normalizedStatus === "DELIVERED" ? (
                            <CheckCircle2 size={14} />
                          ) : normalizedStatus === "CANCELLED" ? (
                            <X size={14} />
                          ) : (
                            <Clock size={14} />
                          )}

                          <span className="break-words">
                            {formatStatus(normalizedStatus)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Ordered products */}
                    <section className="mt-6">
                      <div className="mb-4 flex items-center gap-2">
                        <Package className="text-amber-400" size={19} />

                        <h3 className="text-lg font-bold">
                          Ordered Products
                        </h3>

                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-gray-400">
                          {items.length}
                        </span>
                      </div>

                      {items.length > 0 ? (
                        <div className="divide-y divide-white/[0.08]">
                          {items.map((item, index) => (
                            <div
                              key={item.id ?? `${order.id}-${index}`}
                              className="flex items-center justify-between gap-4 py-4"
                            >
                              <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.06] text-amber-300">
                                  <ShoppingBag size={18} />
                                </div>

                                <div className="min-w-0">
                                  <p className="break-words font-semibold text-gray-100">
                                    {item.productName || "Jewelry product"}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-500">
                                    Quantity: {item.quantity ?? 1}
                                  </p>
                                </div>
                              </div>

                              {item.price != null && (
                                <p className="shrink-0 text-right text-sm font-semibold text-amber-300">
                                  {formatCurrency(
                                    Number(item.price) *
                                      Number(item.quantity ?? 1)
                                  )}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-xl bg-white/[0.03] p-4 text-sm text-gray-500">
                          Product details are unavailable for this order.
                        </p>
                      )}
                    </section>

                    {/* Order timeline */}
                    <section className="mt-7 border-t border-white/[0.08] pt-6">
                      <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                          Your journey
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          Order Tracking
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Follow the progress of your order.
                        </p>
                      </div>

                      <OrderTimeline status={normalizedStatus} />
                    </section>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            aria-label="Order pages"
          >
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:border-amber-400/40 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-sm text-gray-300">
              Page <span className="font-bold text-amber-300">{page + 1}</span>{" "}
              of{" "}
              <span className="font-bold text-amber-300">{totalPages}</span>
            </span>

            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages - 1, current + 1)
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:border-amber-400/40 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </nav>
        )}

        {/* Footer */}
        <div className="mt-12 border-t border-white/[0.07] pt-6 text-center">
          <p className="text-xs tracking-wide text-gray-600">
            LUXORA · Crafted for your moments that matter.
          </p>
        </div>
      </main>
    </div>
  );
}
