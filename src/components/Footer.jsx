
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[#c5a366]/20 bg-[#050504] text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-10 lg:py-16">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-block">
            <span className="block font-serif text-4xl tracking-[0.13em] text-[#e5d5b5]">
              LUXORA
            </span>
            <span className="mt-1 block text-center text-[8px] uppercase tracking-[0.48em] text-[#b9a57e]">
              Fine Jewelry
            </span>
          </Link>

          <p className="mt-6 max-w-xs text-sm leading-7 text-stone-500">
            Discover jewelry that celebrates your individuality.
            Thoughtful designs for meaningful moments and memories
            worth keeping.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:border-[#d9bd82]/60 hover:text-[#d9bd82]"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:border-[#d9bd82]/60 hover:text-[#d9bd82]"
            >
              <FaFacebookF size={14} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e3ca95]">
            Explore
          </h2>

          <ul className="mt-6 space-y-4 text-sm text-stone-500">
            <li>
              <Link to="/products" className="transition hover:text-white">
                All Jewelry
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition hover:text-white">
                Gold Jewelry
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition hover:text-white">
                Diamond Jewelry
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition hover:text-white">
                Bridal Collection
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer service */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e3ca95]">
            Customer Care
          </h2>

          <ul className="mt-6 space-y-4 text-sm text-stone-500">
            <li>
              <Link to="/my-orders" className="transition hover:text-white">
                Track My Orders
              </Link>
            </li>
            <li>
              <Link to="/profile" className="transition hover:text-white">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/cart" className="transition hover:text-white">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition hover:text-white">
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e3ca95]">
            Get in Touch
          </h2>

          <div className="mt-6 space-y-5 text-sm text-stone-500">
            <p className="flex items-start gap-3 leading-6">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-[#d9bd82]" />
              <span>Contact us for store and delivery information.</span>
            </p>

            <p className="flex items-center gap-3">
              <FaEnvelope className="shrink-0 text-[#d9bd82]" />
              <a
                href="mailto:luxora@gmail.com"
                className="break-all transition hover:text-white"
              >
                luxora@gmail.com
              </a>
            </p>

            <p className="flex items-center gap-3">
              <FaPhoneAlt className="shrink-0 text-[#d9bd82]" />
              <span>Contact details available on request.</span>
            </p>
          </div>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 text-sm text-[#d9bd82] transition hover:text-white"
          >
            Discover LUXORA <FaArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-stone-600 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>
            © {new Date().getFullYear()} LUXORA Jewelry. All rights reserved.
          </p>

          <p className="tracking-wide">
            Made for moments that matter.
          </p>
        </div>
      </div>
    </footer>
  );
}
