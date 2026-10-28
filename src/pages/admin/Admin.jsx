
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminNavbar from "./AdminNavbar";

const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

function MetricCard({ label, value, icon, detail }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-400/40">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-400/[0.05] blur-2xl transition group-hover:bg-amber-400/10" />

            <div className="relative flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-zinc-400">
                        {label}
                    </p>

                    <h2 className="mt-4 break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        {value}
                    </h2>

                    <p className="mt-3 text-xs text-zinc-500">{detail}</p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.07] text-2xl text-amber-300">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function StatusCard({ label, count, color, description }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#111111] p-5">
            <div>
                <p className="text-sm text-zinc-400">{label}</p>
                <p className={`mt-2 text-3xl font-semibold ${color}`}>
                    {count}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                    {description}
                </p>
            </div>

            <div className={`h-10 w-1 rounded-full ${color.replace("text-", "bg-")}`} />
        </div>
    );
}

export default function Admin() {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [revenue, setRevenue] = useState(0);

    const [pending, setPending] = useState(0);
    const [delivered, setDelivered] = useState(0);
    const [cancelled, setCancelled] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            setLoading(true);
            setError("");

            try {
                const productsRes = await api.get("/api/products");

                if (active) {
                    setTotalProducts(
                        Array.isArray(productsRes.data)
                            ? productsRes.data.length
                            : 0
                    );
                }
            } catch (err) {
                console.error("Products error:", err);
                if (active) {
                    setError("Unable to load product statistics.");
                }
            }

            try {
                const ordersRes = await api.get("/api/admin/orders");
                const orders = Array.isArray(ordersRes.data)
                    ? ordersRes.data
                    : [];

                if (!active) return;

                setTotalOrders(orders.length);

                setRevenue(
                    orders
                        .filter((order) => order.status === "DELIVERED")
                        .reduce(
                            (sum, order) =>
                                sum + (Number(order.totalAmount) || 0),
                            0
                        )
                );

                setPending(
                    orders.filter((o) => o.status === "PENDING").length
                );

                setDelivered(
                    orders.filter((o) => o.status === "DELIVERED").length
                );

                setCancelled(
                    orders.filter((o) => o.status === "CANCELLED").length
                );
            } catch (err) {
                console.error("Orders error:", err);

                if (active) {
                    setError((previous) =>
                        previous
                            ? `${previous} Unable to load order statistics.`
                            : "Unable to load order statistics. Check your admin access."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const quickActions = [
        {
            to: "/admin/add-product",
            icon: "＋",
            title: "Add Product",
            description: "Introduce a new piece to your collection.",
            action: "Create product",
        },
        {
            to: "/admin/products",
            icon: "◇",
            title: "Manage Products",
            description: "Update jewellery, pricing and inventory.",
            action: "View inventory",
        },
        {
            to: "/admin/orders",
            icon: "▤",
            title: "Manage Orders",
            description: "Review orders and track fulfilment.",
            action: "View orders",
        },
    ];

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <AdminNavbar />

            <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
                {/* Header */}
                <section className="relative mb-9 overflow-hidden rounded-2xl border border-amber-400/15 bg-gradient-to-br from-[#19150c] via-[#100f0c] to-[#0c0c0c] p-6 sm:p-9 lg:p-10">
                    <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-amber-400/[0.08] blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300">
                                    LUXORA MANAGEMENT
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                                Admin <span className="text-amber-400">Dashboard</span>
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                                An overview of your jewellery business,
                                orders and inventory — all in one place.
                            </p>
                        </div>

                        <div className="relative flex items-center gap-3 self-start rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 sm:self-auto">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-xl text-amber-300">
                                ♛
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    Administrator
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Store overview
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300"
                    >
                        {error}
                    </div>
                )}

                {/* Main statistics */}
                <section className="mb-10">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Business Overview
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Your store at a glance
                            </p>
                        </div>

                        <span className="text-xs text-zinc-500">
                            {loading ? "Updating…" : "Current data"}
                        </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <MetricCard
                            label="Total Products"
                            value={loading ? "—" : totalProducts}
                            icon="◇"
                            detail="Products in your catalogue"
                        />

                        <MetricCard
                            label="Total Orders"
                            value={loading ? "—" : totalOrders}
                            icon="▤"
                            detail="Orders recorded by the store"
                        />

                        <MetricCard
                            label="Delivered Revenue"
                            value={loading ? "—" : formatINR(revenue)}
                            icon="₹"
                            detail="Total value of delivered orders"
                        />
                    </div>
                </section>

                {/* Order status */}
                <section className="mb-10">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-white">
                            Order Fulfilment
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Track the current status of customer orders
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <StatusCard
                            label="Pending Orders"
                            count={loading ? "—" : pending}
                            color="text-amber-400"
                            description="Awaiting further processing"
                        />

                        <StatusCard
                            label="Delivered Orders"
                            count={loading ? "—" : delivered}
                            color="text-emerald-400"
                            description="Successfully delivered"
                        />

                        <StatusCard
                            label="Cancelled Orders"
                            count={loading ? "—" : cancelled}
                            color="text-rose-400"
                            description="Orders cancelled"
                        />
                    </div>
                </section>

                {/* Quick actions */}
                <section className="mb-8">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-white">
                            Quick Actions
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Get straight to the tasks that matter
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {quickActions.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="group rounded-2xl border border-white/[0.08] bg-[#111111] p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-[#15130e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.07] text-2xl text-amber-300 transition group-hover:bg-amber-400/15">
                                        {item.icon}
                                    </div>

                                    <span className="text-xl text-zinc-600 transition group-hover:translate-x-1 group-hover:text-amber-400">
                                        →
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-white">
                                    {item.title}
                                </h3>

                                <p className="mt-2 min-h-10 text-sm leading-6 text-zinc-400">
                                    {item.description}
                                </p>

                                <div className="mt-5 border-t border-white/[0.07] pt-4 text-xs font-semibold tracking-wide text-amber-400">
                                    {item.action} →
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <footer className="border-t border-white/[0.07] py-5 text-center text-xs text-zinc-600">
                    LUXORA · Crafted for elegance
                </footer>
            </main>
        </div>
    );
}
