
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role === "ADMIN") {
      setCartCount(0);
      return;
    }

    const loadCart = () => {
      try {
        const cartKey = `cart_${user.id}`;
        const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

        setCartCount(
          Array.isArray(cart)
            ? cart.reduce(
                (total, item) => total + (Number(item.quantity) || 1),
                0
              )
            : 0
        );
      } catch {
        setCartCount(0);
      }
    };

    loadCart();

    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, [user]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [user]);

  const navClass = ({ isActive }) =>
    `text-sm transition ${
      isActive
        ? "text-[#e2c78c]"
        : "text-stone-300 hover:text-[#e2c78c]"
    }`;

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    closeMenus();
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#c5a366]/20 bg-[#080806]/95 text-[#f7f0e4] shadow-lg shadow-black/20 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenus}
          className="group shrink-0"
          aria-label="LUXORA home"
        >
          <span className="block font-serif text-3xl tracking-[0.13em] text-[#e5d5b5] transition group-hover:text-[#d9bd82] sm:text-4xl">
            LUXORA
          </span>
          <span className="mt-0.5 block text-center text-[8px] uppercase tracking-[0.48em] text-[#b9a57e]">
            Fine Jewelry
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          {/* Public for guests and normal users */}
          {user?.role !== "ADMIN" && (
            <NavLink to="/products" className={navClass}>
              Collections
            </NavLink>
          )}

          {user && user.role !== "ADMIN" && (
            <NavLink to="/my-orders" className={navClass}>
              My Orders
            </NavLink>
          )}

          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={navClass}>
              Admin Dashboard
            </NavLink>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          {!user && (
            <Link
              to="/login"
              className="text-sm text-stone-300 transition hover:text-[#e2c78c]"
            >
              Login
            </Link>
          )}

          {!user && (
            <Link
              to="/register"
              className="rounded-full border border-[#c5a366]/60 px-5 py-2.5 text-sm text-[#e5d5b5] transition hover:bg-[#d9bd82] hover:text-black"
            >
              Create Account
            </Link>
          )}

          {user && user.role !== "ADMIN" && (
            <Link
              to="/cart"
              aria-label={`Shopping cart, ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-stone-200 transition hover:border-[#d9bd82]/50 hover:text-[#d9bd82]"
            >
              <FaShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9bd82] px-1 text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-[#c5a366]/30 px-3 py-2 text-stone-200 transition hover:border-[#d9bd82]"
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                <FaUserCircle size={21} />
                <span className="max-w-28 truncate text-sm">
                  {user.name || "Account"}
                </span>
                <FaChevronDown size={10} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-[#c5a366]/25 bg-[#11100d] shadow-2xl">
                  <div className="border-b border-white/10 p-4">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name || "Account"}
                    </p>
                    <p className="mt-1 truncate text-xs text-stone-400">
                      {user.email}
                    </p>
                    <span className="mt-3 inline-block rounded-full bg-[#d9bd82]/10 px-3 py-1 text-[10px] uppercase tracking-wider text-[#e2c78c]">
                      {user.role}
                    </span>
                  </div>

                  {user.role !== "ADMIN" && (
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      className="block px-4 py-3 text-sm text-stone-300 transition hover:bg-white/5 hover:text-[#e2c78c]"
                    >
                      My Profile
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full border-t border-white/10 px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-950/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-3 md:hidden">
          {user && user.role !== "ADMIN" && (
            <Link
              to="/cart"
              onClick={closeMenus}
              aria-label={`Shopping cart, ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center text-stone-200"
            >
              <FaShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d9bd82] px-1 text-[9px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#e5d5b5]"
          >
            {mobileOpen ? <FaTimes size={19} /> : <FaBars size={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0c0b09] px-5 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            <NavLink
              to="/"
              end
              onClick={closeMenus}
              className={navClass}
            >
              Home
            </NavLink>

            {/* Guests can browse collections */}
            {user?.role !== "ADMIN" && (
              <NavLink
                to="/products"
                onClick={closeMenus}
                className={navClass}
              >
                Collections
              </NavLink>
            )}

            {user && user.role !== "ADMIN" && (
              <>
                <NavLink
                  to="/my-orders"
                  onClick={closeMenus}
                  className={navClass}
                >
                  My Orders
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={closeMenus}
                  className={navClass}
                >
                  My Profile
                </NavLink>
              </>
            )}

            {user?.role === "ADMIN" && (
              <NavLink
                to="/admin"
                onClick={closeMenus}
                className={navClass}
              >
                Admin Dashboard
              </NavLink>
            )}

            {!user ? (
              <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="text-sm text-stone-300"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="rounded-full bg-[#d9bd82] px-4 py-2 text-sm font-semibold text-black"
                >
                  Create Account
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="border-t border-white/10 pt-4 text-left text-sm text-red-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
