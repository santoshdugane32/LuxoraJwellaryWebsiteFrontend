
import { useEffect, useState } from "react";
import axios from "axios";
import { Package, RefreshCw, ShoppingBag } from "lucide-react";
import OrderTimeline from "../components/OrderTimeline";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const token = user?.token;

        if (!token) {
          if (isMounted) {
            setError("Please log in to view your orders.");
          }
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!isMounted) return;

        const result = response.data;
        const orderList = Array.isArray(result)
          ? result
          : Array.isArray(result?.content)
          ? result.content
          : [];

        setOrders(orderList);
      } catch (err) {
        console.error("Failed to fetch orders:", err);

        if (isMounted) {
          setError(
            err.response?.status === 401 ||
              err.response?.status === 403
              ? "Your session may have expired. Please log in again."
              : "Unable to load your orders. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatPrice = (amount) => {
    const value = Number(amount);

    if (!Number.isFinite(value)) return "0.00";

    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatStatus = (status) =>
    typeof status === "string" && status.trim()
      ? status.trim().replaceAll("_", " ").toUpperCase()
      : "UNKNOWN";

  const handleRetry = () => {
    // Re-run the component's data-loading effect by reloading the page.
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="border-b border-amber-400/10 bg-gradient-to-b from-amber-400/5 to-transparent px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400">
            LUXORA • YOUR COLLECTION
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 md:text-base">
            Track your purchases and follow every stage of your
            jewelry delivery.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-amber-400" />

            <p className="mt-5 text-sm text-gray-400">
              Loading your orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-400">{error}</p>

            <button
              onClick={handleRetry}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 px-5 py-2.5 text-sm text-amber-300 transition hover:bg-amber-400/10"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty orders */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-amber-400/15 bg-neutral-950 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
              <ShoppingBag className="text-amber-400" size={28} />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
              Your next favorite piece is waiting for you.
              Explore the collection to get started.
            </p>

            <a
              href="/products"
              className="mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Explore Collection
            </a>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-7">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </p>
            </div>

            {orders.map((order) => {
              const status = formatStatus(order.status);
              const isCancelled = status === "CANCELLED";
              const isDelivered = status === "DELIVERED";

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-amber-400/15 bg-neutral-950 shadow-xl shadow-black/20"
                >
                  {/* Order top section */}
                  <div className="flex flex-col gap-5 border-b border-white/5 p-5 sm:flex-row sm:items-start sm:justify-between md:p-7">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/5">
                          <Package className="text-amber-400" size={21} />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            Order #{order.id}
                          </h2>

                          <p className="mt-1 text-xs text-gray-500">
                            Ordered on {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>

                      {isDelivered && order.deliveredAt && (
                        <p className="mt-4 text-sm text-emerald-400">
                          Delivered on {formatDate(order.deliveredAt)}
                        </p>
                      )}

                      {isCancelled && order.cancelledAt && (
                        <p className="mt-4 text-sm text-red-400">
                          Cancelled on {formatDate(order.cancelledAt)}
                        </p>
                      )}
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        Order Total
                      </p>

                      <p className="mt-2 text-2xl font-semibold text-amber-300">
                        ₹{formatPrice(order.totalAmount)}
                      </p>

                      <span
                        className={`mt-3 inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold ${
                          isCancelled
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : isDelivered
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-amber-400/25 bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* Reusable order timeline */}
                  <div className="p-4 md:p-6">
                    <OrderTimeline status={status} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
