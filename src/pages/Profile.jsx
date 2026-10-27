
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  UserRound,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Gem,
  CircleUserRound,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080806] text-[#f7f0e4]">
        <Navbar />

        <div className="flex min-h-[65vh] flex-col items-center justify-center px-5 text-center">
          <CircleUserRound
            size={52}
            className="mb-5 text-[#c5a366]"
            strokeWidth={1.2}
          />

          <h1 className="font-serif text-3xl">Your LUXORA Account</h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-400">
            Please log in to view your profile and account information.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-7 rounded-full bg-gradient-to-r from-[#c5a366] to-[#ead6a4] px-8 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const initials = (user.name || "L")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-[#080806] text-[#f7f0e4]">
      <Navbar />

      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 top-32 h-96 w-96 rounded-full bg-[#b89551]/[0.06] blur-[100px]" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#b89551]/[0.04] blur-[100px]" />
      </div>

      <main className="relative mx-auto max-w-5xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-[#d9bd82]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Page heading */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b9a57e]">
            LUXORA · Personal Account
          </p>

          <h1 className="mt-3 font-serif text-4xl font-normal sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-stone-400">
            Your account details, all in one place.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile identity panel */}
          <section className="overflow-hidden rounded-2xl border border-[#c5a366]/25 bg-[#11100d]">
            <div className="h-28 bg-gradient-to-r from-[#49391e] via-[#b89551] to-[#49391e]" />

            <div className="-mt-12 px-6 pb-7">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#11100d] bg-gradient-to-br from-[#ead6a4] to-[#9f793c] font-serif text-3xl text-black shadow-xl">
                {initials || "L"}
              </div>

              <h2 className="mt-5 break-words font-serif text-2xl">
                {user.name || "LUXORA Customer"}
              </h2>

              <p className="mt-2 break-all text-sm text-stone-400">
                {user.email || "No email available"}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#c5a366]/25 bg-[#c5a366]/[0.08] px-3 py-2">
                <Gem size={14} className="text-[#d9bd82]" />
                <span className="text-xs tracking-wide text-[#e5d5b5]">
                  LUXORA Member
                </span>
              </div>
            </div>
          </section>

          {/* Account information */}
          <section className="rounded-2xl border border-[#c5a366]/20 bg-[#11100d] p-6 sm:p-8">
            <div className="mb-7 border-b border-white/10 pb-5">
              <h2 className="font-serif text-2xl">Account Information</h2>
              <p className="mt-2 text-sm text-stone-500">
                Details associated with your account.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c5a366]/10">
                  <UserRound size={20} className="text-[#d9bd82]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-stone-500">
                    Full Name
                  </p>
                  <p className="mt-2 break-words text-base text-[#f7f0e4]">
                    {user.name || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c5a366]/10">
                  <Mail size={20} className="text-[#d9bd82]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-stone-500">
                    Email Address
                  </p>
                  <p className="mt-2 break-all text-base text-[#f7f0e4]">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c5a366]/10">
                  <ShieldCheck size={20} className="text-[#d9bd82]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-stone-500">
                    Account Role
                  </p>
                  <p className="mt-2 text-base text-emerald-400">
                    {user.role || "USER"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-[#c5a366]/20 bg-[#c5a366]/[0.04] p-4">
              <p className="text-sm text-[#e5d5b5]">
                Thank you for choosing LUXORA.
              </p>
              <p className="mt-2 text-xs leading-6 text-stone-500">
                Discover jewelry crafted to complement your personal style.
                Explore our collection whenever you are ready.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-4 rounded-full border border-[#c5a366]/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#e5d5b5] transition hover:bg-[#d9bd82] hover:text-black"
              >
                Explore Collection
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
