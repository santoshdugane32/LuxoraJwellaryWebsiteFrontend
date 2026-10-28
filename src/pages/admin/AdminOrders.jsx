
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import AdminNavbar from "./AdminNavbar";

const ORDER_STATUSES = [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "QUALITY_CHECK", label: "Quality Check" },
    { value: "PACKED", label: "Packed" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "RETURN_REQUESTED", label: "Return Requested" },
    { value: "RETURNED", label: "Returned" },
    { value: "REFUNDED", label: "Refunded" },
];

const statusStyles = {
    PENDING: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    CONFIRMED: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    QUALITY_CHECK: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    PACKED: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
    SHIPPED: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    OUT_FOR_DELIVERY: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    DELIVERED: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    CANCELLED: "border-red-400/20 bg-red-400/10 text-red-300",
    RETURN_REQUESTED: "border-orange-400/20 bg-orange-400/10 text-orange-300",
    RETURNED: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    REFUNDED: "border-teal-400/20 bg-teal-400/10 text-teal-300",
};

const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

function StatusBadge({ status }) {
    const label =
        ORDER_STATUSES.find((item) => item.value === status)?.label ||
        status ||
        "Unknown";

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                statusStyles[status] ||
                "border-white/10 bg-white/5 text-zinc-300"
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [pendingStatuses, setPendingStatuses] = useState({});
    const [updatingIds, setUpdatingIds] = useState([]);
    const [notice, setNotice] = useState(null);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        setLoadError("");

        try {
            const response = await api.get("/api/admin/orders");

            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Load orders error:", error);

            if (error.response?.status === 401) {
                setLoadError("Your session may have expired. Please log in again.");
            } else if (error.response?.status === 403) {
                setLoadError("Only an authorized administrator can access orders.");
            } else {
                setLoadError("Unable to load orders. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const filteredOrders = useMemo(() => {
        const term = search.trim().toLowerCase();

        return orders.filter((order) => {
            const matchesSearch =
                !term ||
                String(order.id).includes(term) ||
                String(order.userEmail || "").toLowerCase().includes(term);

            const matchesStatus =
                statusFilter === "ALL" || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    const counts = useMemo(() => ({
        total: orders.length,
        pending: orders.filter((o) => o.status === "PENDING").length,
        delivered: orders.filter((o) => o.status === "DELIVERED").length,
        cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    }), [orders]);

    const updateStatus = async (id) => {
        const status = pendingStatuses[id];

        if (!status) return;

        const currentOrder = orders.find((order) => order.id === id);

        if (!currentOrder || currentOrder.status === status) {
            setNotice({
                type: "error",
                text: "Choose a different status before updating.",
            });
            return;
        }

        setUpdatingIds((previous) => [...previous, id]);
        setNotice(null);

        try {
            await api.put(`/api/admin/orders/${id}/${status}`);

            setOrders((previous) =>
                previous.map((order) =>
                    order.id === id ? { ...order, status } : order
                )
            );

            setPendingStatuses((previous) => {
                const next = { ...previous };
                delete next[id];
                return next;
            });

            setNotice({
                type: "success",
                text: `Order #${id} updated to ${
                    ORDER_STATUSES.find((item) => item.value === status)?.label ||
                    status
                }.`,
            });
        } catch (error) {
            console.error("Update order status error:", error);

            const message =
                error.response?.status === 401
                    ? "Your session may have expired. Please log in again."
                    : error.response?.status === 403
                    ? "You don't have permission to update this order."
                    : error.response?.data?.message ||
                      "Failed to update order status. Please try again.";

            setNotice({ type: "error", text: message });
        } finally {
            setUpdatingIds((previous) =>
                previous.filter((item) => item !== id)
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <AdminNavbar />

            <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
                {/* Page heading */}
                <section className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300">
                            Order Management
                        </span>
                    </div>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Customer <span className="text-amber-400">Orders</span>
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-zinc-400">
                                Review purchases, manage fulfilment and keep
                                every order moving.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadOrders}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-amber-400/30 hover:text-amber-300 disabled:opacity-50 sm:self-auto"
                        >
                            <span>{loading ? "↻" : "⟳"}</span>
                            Refresh Orders
                        </button>
                    </div>
                </section>

                {/* Summary statistics */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            label: "Total Orders",
                            value: counts.total,
                            icon: "▤",
                            color: "text-amber-300",
                        },
                        {
                            label: "Pending",
                            value: counts.pending,
                            icon: "◷",
                            color: "text-amber-300",
                        },
                        {
                            label: "Delivered",
                            value: counts.delivered,
                            icon: "✓",
                            color: "text-emerald-300",
                        },
                        {
                            label: "Cancelled",
                            value: counts.cancelled,
                            icon: "×",
                            color: "text-red-300",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-zinc-400">
                                    {item.label}
                                </p>
                                <span className={`text-xl ${item.color}`}>
                                    {item.icon}
                                </span>
                            </div>
                            <p className="mt-4 text-3xl font-semibold">
                                {loading ? "—" : item.value}
                            </p>
                        </div>
                    ))}
                </section>

                {/* Search and filter */}
                <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[#111111] p-4 sm:p-5">
                    <div className="grid gap-4 md:grid-cols-[1fr_240px]">
                        <div>
                            <label
                                htmlFor="order-search"
                                className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                            >
                                Search orders
                            </label>
                            <input
                                id="order-search"
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by order ID or customer email..."
                                className="w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-400/50"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="status-filter"
                                className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                            >
                                Filter by status
                            </label>
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
                            >
                                <option value="ALL">All statuses</option>
                                {ORDER_STATUSES.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-zinc-500">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                </section>

                {/* Feedback */}
                {notice && (
                    <div
                        role={notice.type === "error" ? "alert" : "status"}
                        aria-live="polite"
                        className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                            notice.type === "success"
                                ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                                : "border-red-400/20 bg-red-400/[0.07] text-red-300"
                        }`}
                    >
                        {notice.type === "success" ? "✓ " : "! "}
                        {notice.text}
                    </div>
                )}

                {/* Orders list */}
                {loading ? (
                    <div className="rounded-2xl border border-white/[0.08] bg-[#111111] px-6 py-20 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-400/20 border-t-amber-400" />
                        <p className="mt-4 text-sm text-zinc-400">
                            Loading customer orders...
                        </p>
                    </div>
                ) : loadError ? (
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.04] px-6 py-14 text-center">
                        <p className="text-sm text-red-300">{loadError}</p>
                        <button
                            type="button"
                            onClick={loadOrders}
                            className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:border-amber-400/30"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border border-white/[0.08] bg-[#111111] px-6 py-16 text-center">
                        <div className="text-4xl text-amber-400/60">▤</div>
                        <h2 className="mt-4 text-lg font-semibold text-white">
                            {orders.length === 0
                                ? "No orders yet"
                                : "No matching orders"}
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500">
                            {orders.length === 0
                                ? "Customer orders will appear here when available."
                                : "Try another search term or status filter."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const selectedStatus =
                                pendingStatuses[order.id] ?? order.status;

                            const isUpdating = updatingIds.includes(order.id);

                            return (
                                <article
                                    key={order.id}
                                    className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] transition hover:border-amber-400/20"
                                >
                                    <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-lg font-semibold text-white">
                                                    Order #{order.id}
                                                </span>
                                                <StatusBadge status={order.status} />
                                            </div>

                                            <p className="mt-3 break-all text-sm text-zinc-400">
                                                <span className="mr-2 text-zinc-600">
                                                    CUSTOMER
                                                </span>
                                                {order.userEmail || "Email unavailable"}
                                            </p>

                                            <div className="mt-4">
                                                <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                    Order total
                                                </p>
                                                <p className="mt-1 text-2xl font-semibold text-amber-300">
                                                    {formatINR(order.totalAmount)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full rounded-xl border border-white/[0.06] bg-black/20 p-4 lg:max-w-[370px]">
                                            <label
                                                htmlFor={`status-${order.id}`}
                                                className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                                            >
                                                Update order status
                                            </label>

                                            <select
                                                id={`status-${order.id}`}
                                                value={selectedStatus}
                                                disabled={isUpdating}
                                                onChange={(e) =>
                                                    setPendingStatuses((previous) => ({
                                                        ...previous,
                                                        [order.id]: e.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-lg border border-white/10 bg-[#090909] px-3 py-3 text-sm text-white outline-none focus:border-amber-400/50 disabled:opacity-50"
                                            >
                                                {ORDER_STATUSES.map((status) => (
                                                    <option
                                                        key={status.value}
                                                        value={status.value}
                                                    >
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                disabled={
                                                    isUpdating ||
                                                    selectedStatus === order.status
                                                }
                                                onClick={() => updateStatus(order.id)}
                                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-300 to-yellow-600 px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : "Save Status Change →"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                                </article>
                            );
                        })}
                    </div>
                )}

                <footer className="mt-10 border-t border-white/[0.07] py-5 text-center text-xs text-zinc-600">
                    LUXORA · Order Management
                </footer>
            </main>
        </div>
    );
}
