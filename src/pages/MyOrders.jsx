
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
  Eye,
  Truck,
  ShieldCheck,
  ArrowUpRight,
  Gem,
  RotateCcw,
  Sparkles,
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

const normalizeStatus = (status) =>
  String(status || "UNKNOWN").trim().toUpperCase();

const formatStatus = (status) =>
  String(status || "UNKNOWN")
    .trim()
    .replaceAll("_", " ");

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "₹0.00";

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

const canCancelOrder = (status) =>
  ["PENDING", "CONFIRMED"].includes(normalizeStatus(status));

const getStatusMessage = (status) => {
  const messages = {
    PENDING: "Your order is waiting for confirmation.",
    CONFIRMED: "Your order has been confirmed.",
    QUALITY_CHECK: "Your jewellery is undergoing quality checks.",
    PACKED: "Your order is packed and preparing for dispatch.",
    SHIPPED: "Your order is on its way to you.",
    OUT_FOR_DELIVERY: "Your order is out for delivery.",
    DELIVERED: "Your order has been delivered. Enjoy your purchase!",
    CANCELLED: "This order has been cancelled.",
    RETURN_REQUESTED: "Your return request is being processed.",
    RETURNED: "This order has been returned.",
    REFUNDED: "Your refund has been processed.",
  };

  return messages[normalizeStatus(status)] ||
    "Check your order for the latest updates.";
};

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status);
  const style =
    STATUS_STYLES[normalized] ||
    "border-white/15 bg-white/5 text-gray-300";

  const Icon =
    normalized === "DELIVERED"
      ? CheckCircle2
      : normalized === "CANCELLED"
        ? X
        : normalized === "SHIPPED" ||
            normalized === "OUT_FOR_DELIVERY"
          ? Truck
          : Clock;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${style}`}
    >
      <Icon size={14} />
      <span className="break-words">{formatStatus(normalized)}</span>
    </span>
  );
}

function OrderProducts({ items, orderId, compact = false }) {
  if (!items.length) {
    return (
      <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-gray-500">
        Product details are unavailable for this order.
      </p>
    );
  }

  return (
    <div className="divide-y divide-white/[0.07]">
      {items.map((item, index) => (
        <div
          key={item.id ?? `${orderId}-${index}`}
          className={`flex items-center justify-between gap-3 ${
            compact ? "py-3" : "py-4"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/15 bg-gradient-to-br from-amber-400/10 to-transparent text-amber-300">
              <Gem size={19} strokeWidth={1.5} />
            </div>

            <div className="min-w-0">
              <p className="break-words text-sm font-semibold text-gray-100">
                {item.productName || "Jewellery product"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Quantity: {item.quantity ?? 1}
              </p>
            </div>
          </div>

          {item.price != null && (
            <p className="shrink-0 text-right text-sm font-semibold text-amber-300">
              {formatCurrency(
                Number(item.price) * Number(item.quantity ?? 1)
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function OrderDetailsModal({ order, onClose, onCancel }) {
  if (!order) return null;

  const status = normalizeStatus(order.status);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-heading"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-amber-400/20 bg-[#10100f] shadow-2xl shadow-black/60"
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                <Sparkles size={14} />
                LUXORA
              </div>

              <h2
                id="order-details-heading"
                className="mt-3 break-words text-2xl font-black sm:text-3xl"
              >
                Order #{order.id}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                <CalendarDays size={15} className="shrink-0 text-amber-400" />
                {formatDate(order.orderDate)}
              </p>
            </div>

            <button
              type="button"
              aria-label="Close order details"
              onClick={onClose}
              className="rounded-xl border border-white/10 p-2 text-gray-400 transition hover:border-amber-400/40 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-400/[0.08] to-transparent p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Total order value
                </p>
                <p className="mt-2 text-2xl font-black text-amber-400 sm:text-3xl">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
              <StatusBadge status={status} />
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              {getStatusMessage(status)}
            </p>
          </div>

          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Package size={19} className="text-amber-400" />
                Order items
              </h3>
              <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-gray-400">
                {items.length} {items.length === 1 ? "product" : "products"}
              </span>
            </div>

            <OrderProducts items={items} orderId={order.id} />
          </section>

          <section className="mt-7 border-t border-white/[0.08] pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              Your journey
            </p>
            <h3 className="mt-2 flex items-center gap-2 text-lg font-bold">
              <Truck size={19} className="text-amber-400" />
              Order tracking
            </h3>
            <div className="mt-5">
              <OrderTimeline status={status} />
            </div>
          </section>

          {canCancelOrder(status) && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-7 w-full rounded-xl border border-red-400/25 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
            >
              Request order cancellation
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-xl bg-amber-400 px-4 py-3 font-bold text-black transition hover:bg-amber-300"
          >
            Done
          </button>
        </div>
      </section>
    </div>
  );
}

function CancelConfirmation({ order, onBack, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancel-heading"
        className="w-full max-w-md rounded-3xl border border-red-400/20 bg-[#11100f] p-6 shadow-2xl sm:p-8"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
          <AlertCircle size={28} />
        </div>

        <h2
          id="cancel-heading"
          className="mt-5 text-center text-2xl font-black"
        >
          Cancel this order?
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-400">
          You selected order{" "}
          <span className="font-bold text-white">#{order.id}</span>.
          Review your order before proceeding.
        </p>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Order total
          </p>
          <p className="mt-1 text-xl font-bold text-amber-400">
            {formatCurrency(order.totalAmount)}
          </p>
          <div className="mt-3">
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
          <p className="text-sm leading-6 text-gray-300">
            This is a confirmation preview. Cancellation has not been
            submitted. Connect your existing cancellation endpoint before
            allowing customers to complete this action.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.05]"
          >
            Go back
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-400"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      fetchOrders(page, status, search, controller.signal);
    }, search ? 350 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [page, status, search, refreshKey, fetchOrders]);

  const handleStatusChange = (newStatus) => {
    setPage(0);
    setStatus(newStatus);
  };

  const handleSearchChange = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  const handleRetry = () => {
    setRefreshKey((current) => current + 1);
  };

  const closeModals = () => {
    setSelectedOrder(null);
    setShowCancelConfirm(false);
  };

  const openCancelConfirmation = (order) => {
    setSelectedOrder(order);
    setShowCancelConfirm(true);
  };

  const totalItems = orders.reduce(
    (sum, order) =>
      sum +
      (Array.isArray(order.items)
        ? order.items.reduce(
            (itemSum, item) => itemSum + Number(item.quantity ?? 1),
            0
          )
        : 0),
    0
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Premium page header */}
        <section className="relative mb-9 overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-[#20190c] via-[#11100e] to-[#090909]">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-amber-400/[0.09] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-orange-500/[0.05] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 p-6 sm:p-10 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/[0.08] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300 sm:text-xs">
                <Sparkles size={14} />
                Your personal collection
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                My <span className="text-amber-400">Orders</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                Every piece tells a story. Discover your purchases, follow
                their journey, and keep your LUXORA moments close.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-400 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-400" />
                  Secure order history
                </span>
                <span className="hidden h-4 w-px bg-white/15 sm:block" />
                <span className="inline-flex items-center gap-2">
                  <Truck size={16} className="text-amber-400" />
                  Track your purchases
                </span>
              </div>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-400/15 to-transparent text-amber-300 md:h-28 md:w-28 md:self-center">
              <ShoppingBag size={42} strokeWidth={1.2} />
            </div>
          </div>
        </section>

        {/* Summary strip */}
        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
              <Package size={16} className="text-amber-400" />
              Orders on page
            </div>
            <p className="mt-3 text-2xl font-black sm:text-3xl">
              {loading ? "—" : orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
              <Gem size={16} className="text-amber-400" />
              Items on page
            </div>
            <p className="mt-3 text-2xl font-black sm:text-3xl">
              {loading ? "—" : totalItems}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-amber-400/15 bg-amber-400/[0.035] p-4 sm:p-5 lg:col-span-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
              <IndianRupee size={16} className="text-amber-400" />
              Value on page
            </div>
            <p className="mt-3 break-words text-xl font-black text-amber-400 sm:text-2xl">
              {loading
                ? "—"
                : formatCurrency(
                    orders.reduce(
                      (sum, order) => sum + Number(order.totalAmount || 0),
                      0
                    )
                  )}
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="mb-6">
          <label
            htmlFor="order-search"
            className="mb-3 block text-sm font-semibold text-gray-300"
          >
            Find your order
          </label>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition focus-within:border-amber-400/50 focus-within:bg-white/[0.05] sm:max-w-2xl">
            <Search size={20} className="shrink-0 text-amber-400" />

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
                onClick={() => {
                  setSearch("");
                  setPage(0);
                }}
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
            Filter your orders
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
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    active
                      ? "border-amber-400 bg-amber-400 text-black shadow-lg shadow-amber-400/10"
                      : "border-white/10 bg-white/[0.025] text-gray-400 hover:border-amber-400/40 hover:text-amber-300"
                  }`}
                >
                  {itemStatus ? formatStatus(itemStatus) : "All Orders"}
                </button>
              );
            })}
          </div>
        </section>

        {/* Results toolbar */}
        {!loading && !error && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-200">
                {search || status ? "Filtered results" : "Your collection"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {orders.length} {orders.length === 1 ? "order" : "orders"} on
                this page
                {totalPages > 1 ? ` · Page ${page + 1} of ${totalPages}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-gray-300 transition hover:border-amber-400/30 hover:text-amber-300"
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
            <div className="mb-5 h-11 w-11 animate-spin rounded-full border-2 border-amber-400/20 border-t-amber-400" />
            <p className="font-semibold text-white">Loading your orders</p>
            <p className="mt-2 text-sm text-gray-500">
              Preparing your LUXORA collection...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-7 text-center sm:p-10"
            role="alert"
          >
            <AlertCircle className="mx-auto mb-4 text-red-400" size={38} />
            <h2 className="text-xl font-bold">Unable to load your orders</h2>
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
                size={35}
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
                ? "Try another search term or choose a different status."
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
                Explore collection
                <ArrowUpRight size={17} />
              </a>
            )}
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const normalizedStatus = normalizeStatus(order.status);
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <article
                  key={order.id}
                  className="group overflow-hidden rounded-3xl border border-amber-400/15 bg-gradient-to-br from-[#15130f] via-[#0e0e0e] to-[#090909] transition duration-300 hover:border-amber-400/30"
                >
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
                        <div className="mt-3 sm:flex sm:justify-end">
                          <StatusBadge status={normalizedStatus} />
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <section className="mt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Package size={19} className="text-amber-400" />
                        <h3 className="text-lg font-bold">
                          Ordered products
                        </h3>
                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-gray-400">
                          {items.length}
                        </span>
                      </div>

                      <OrderProducts
                        items={items}
                        orderId={order.id}
                        compact
                      />
                    </section>

                    {/* Timeline */}
                    <section className="mt-6 border-t border-white/[0.08] pt-6">
                      <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                          Your journey
                        </p>
                        <h3 className="mt-1 text-xl font-bold">
                          Order tracking
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {getStatusMessage(normalizedStatus)}
                        </p>
                      </div>

                      <OrderTimeline status={normalizedStatus} />
                    </section>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelConfirm(false);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/15"
                      >
                        <Eye size={17} />
                        View details
                      </button>

                      {canCancelOrder(normalizedStatus) && (
                        <button
                          type="button"
                          onClick={() => openCancelConfirmation(order)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-400/25 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                        >
                          <X size={17} />
                          Cancel order
                        </button>
                      )}

                      {normalizedStatus === "DELIVERED" && (
                        <span className="inline-flex items-center gap-2 text-xs text-emerald-300">
                          <CheckCircle2 size={15} />
                          Delivered successfully
                        </span>
                      )}

                      {normalizedStatus === "CANCELLED" && (
                        <span className="inline-flex items-center gap-2 text-xs text-red-300">
                          <X size={15} />
                          Order cancelled
                        </span>
                      )}

                      <div className="ml-auto inline-flex items-center gap-2 text-xs text-gray-500">
                        <ShieldCheck size={15} className="text-amber-400" />
                        Secure order history
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
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
              Page{" "}
              <span className="font-bold text-amber-300">{page + 1}</span>
              {" "}of{" "}
              <span className="font-bold text-amber-300">{totalPages}</span>
            </span>

            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages - 1, current + 1))
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold transition hover:border-amber-400/40 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </nav>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-white/[0.07] pt-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-amber-400/70">
            <Gem size={15} />
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              LUXORA
            </span>
            <Gem size={15} />
          </div>
          <p className="text-xs tracking-wide text-gray-600">
            Crafted for your moments that matter.
          </p>
        </footer>
      </main>

      {/* Order details dialog */}
      {selectedOrder && !showCancelConfirm && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={closeModals}
          onCancel={() => setShowCancelConfirm(true)}
        />
      )}

      {/* Cancellation confirmation dialog */}
      {selectedOrder && showCancelConfirm && (
        <CancelConfirmation
          order={selectedOrder}
          onBack={() => setShowCancelConfirm(false)}
          onClose={closeModals}
        />
      )}
    </div>
  );
}
