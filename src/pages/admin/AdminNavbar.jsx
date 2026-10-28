
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const navItems = [
    { label: "Dashboard", path: "/admin", icon: "⌂" },
    { label: "Add Product", path: "/admin/add-product", icon: "+" },
    { label: "Products", path: "/admin/products", icon: "◇" },
    { label: "Orders", path: "/admin/orders", icon: "▤" },
];

export default function AdminNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    const linkClass = (path) =>
        `relative flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
            isActive(path)
                ? "bg-amber-400/[0.09] text-amber-300"
                : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
        }`;

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-amber-400/15 bg-[#090909]/95 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">

                {/* Brand */}
                <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="group flex shrink-0 items-center gap-3"
                    aria-label="LUXORA Admin Dashboard"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/[0.07] text-2xl text-amber-300 transition group-hover:bg-amber-400/[0.13]">
                        ♛
                    </div>

                    <div>
                        <div className="text-xl font-semibold tracking-[0.18em] text-amber-300 sm:text-2xl">
                            LUXORA
                        </div>
                        <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                            Administration
                        </div>
                    </div>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={linkClass(item.path)}
                        >
                            <span className="text-base text-amber-400">
                                {item.icon}
                            </span>

                            {item.label}

                            {isActive(item.path) && (
                                <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-amber-400" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 lg:flex">
                    <div className="mr-1 flex items-center gap-2 rounded-full border border-white/[0.07] px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-zinc-400">
                            Admin panel
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        className="rounded-lg border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-400/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                        ↗ <span className="ml-1">Logout</span>
                    </button>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-xl text-amber-300 transition hover:bg-white/[0.05] lg:hidden"
                >
                    {menuOpen ? "×" : "☰"}
                </button>
            </div>

            {/* Mobile navigation */}
            {menuOpen && (
                <div className="border-t border-white/[0.07] bg-[#0b0b0b] px-4 py-4 sm:px-6 lg:hidden">
                    <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeMenu}
                                className={linkClass(item.path)}
                            >
                                <span className="w-5 text-center text-lg text-amber-400">
                                    {item.icon}
                                </span>
                                {item.label}

                                {isActive(item.path) && (
                                    <span className="ml-auto text-xs text-amber-300">
                                        CURRENT
                                    </span>
                                )}
                            </Link>
                        ))}

                        <div className="my-2 border-t border-white/[0.07]" />

                        <button
                            onClick={logout}
                            className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-red-400/[0.08]"
                        >
                            <span className="w-5 text-center">↗</span>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
