
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import GoldRateBox from "../components/GoldRateBox";
import {
  FaArrowRight,
  FaGem,
  FaShieldAlt,
  FaUndo,
  FaTruck,
  FaPlay,
} from "react-icons/fa";

const collections = [
  {
    eyebrow: "TIMELESS CLASSICS",
    title: "Diamond Rings",
    description: "Elegant pieces for life's most precious moments.",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
    category: "Rings",
  },
  {
    eyebrow: "EVERYDAY LUXURY",
    title: "Gold Necklaces",
    description: "Understated beauty, crafted to be treasured.",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1000&auto=format&fit=crop",
    category: "Necklaces",
  },
  {
    eyebrow: "THE FINISHING TOUCH",
    title: "Fine Earrings",
    description: "A little brilliance for every occasion.",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1000&auto=format&fit=crop",
    category: "Earrings",
  },
];

const benefits = [
  {
    icon: FaGem,
    title: "Quality Craftsmanship",
    text: "Carefully selected designs",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Checkout",
    text: "Protected online payments",
  },
  {
    icon: FaUndo,
    title: "Easy Returns",
    text: "Subject to our return policy",
  },
  {
    icon: FaTruck,
    title: "Reliable Delivery",
    text: "Delivery details at checkout",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#080806] text-[#f7f0e4]">
      <Navbar />

      {/* Gold rate panel */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <GoldRateBox />
      </div>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10">
        <div className="relative z-10">
          <p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-[#d5b878]">
            <span className="h-px w-9 bg-[#d5b878]" />
            Made for your moments
          </p>

          <h1 className="font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl md:text-7xl xl:text-[82px]">
            The art of
            <span className="mt-1 block italic text-[#d9bd82]">
              timeless
            </span>
            elegance.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-stone-400 sm:text-lg">
            Discover thoughtfully curated jewelry that celebrates
            your individuality. From everyday elegance to life's
            unforgettable occasions.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 rounded-full bg-[#d9bd82] px-7 py-3.5 text-sm font-semibold text-[#17120a] transition hover:bg-[#eed9a7]"
            >
              Explore Collection
              <FaArrowRight size={13} />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3.5 text-sm text-stone-200 transition hover:border-[#d9bd82] hover:text-[#d9bd82]"
            >
              Discover LUXORA
              <FaPlay size={10} />
            </Link>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 border-t border-white/10 pt-6">
            <div className="pr-3">
              <p className="font-serif text-2xl text-[#e3ca95] sm:text-3xl">
                24K
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Gold rate tracking
              </p>
            </div>

            <div className="border-l border-white/10 px-4">
              <p className="font-serif text-2xl text-[#e3ca95] sm:text-3xl">
                Fine
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Curated designs
              </p>
            </div>

            <div className="border-l border-white/10 pl-4">
              <p className="font-serif text-2xl text-[#e3ca95] sm:text-3xl">
                Secure
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Online checkout
              </p>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-4 rounded-[45%] bg-[#a47735]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-t-[48%] rounded-b-2xl border border-[#d9bd82]/20">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop"
              alt="Elegant gold jewelry collection"
              className="h-[430px] w-full object-cover sm:h-[560px] lg:h-[650px]"
              fetchPriority="high"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/5" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#e5c98d]">
                  The signature edit
                </p>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                  Beauty in every detail
                </h2>
              </div>

              <Link
                to="/products"
                aria-label="Explore the jewelry collection"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/30 transition hover:bg-[#d9bd82] hover:text-black"
              >
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-2 border border-[#d9bd82]/30 bg-[#11100d]/95 px-4 py-3 sm:-left-6 sm:px-6 sm:py-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400">
              Designed to be treasured
            </p>
            <p className="mt-1 font-serif text-lg text-[#e3ca95]">
              Your story. Your sparkle.
            </p>
          </div>
        </div>
      </section>

      {/* Collection introduction */}
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d5b878]">
              Find your signature
            </p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
              Explore our collections
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-[#d9bd82] transition hover:text-white"
          >
            View all jewelry <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {collections.map((item) => (
            <Link
              to="/products"
              key={item.title}
              className="group relative overflow-hidden border border-white/10 bg-[#100f0c]"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-[330px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[400px]"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#e3ca95]">
                  {item.eyebrow}
                </p>

                <h3 className="mt-3 font-serif text-3xl">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-stone-300">
                  {item.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm text-[#e3ca95]">
                  Explore collection <FaArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="relative grid overflow-hidden border border-[#c5a366]/20 bg-[#100e0a] md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d5b878]">
              A little more extraordinary
            </p>

            <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight sm:text-5xl">
              Jewelry that feels
              <span className="block italic text-[#d9bd82]">
                uniquely yours.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">
              Find meaningful pieces for celebrations, thoughtful
              gifts, and the moments you want to remember forever.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex w-fit items-center gap-3 border-b border-[#d9bd82]/60 pb-2 text-sm text-[#e3ca95] transition hover:border-white hover:text-white"
            >
              Find your piece <FaArrowRight size={12} />
            </Link>
          </div>

          <div className="min-h-[300px] overflow-hidden sm:min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop"
              alt="Fine jewelry styled for a special occasion"
              loading="lazy"
              className="h-full min-h-[300px] w-full object-cover transition duration-700 hover:scale-105 sm:min-h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 border-y border-white/10 py-9 md:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 sm:gap-4">
              <Icon className="mt-1 shrink-0 text-[#d9bd82]" size={22} />

              <div>
                <h3 className="text-sm font-medium text-stone-100">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="px-5 py-16 text-center sm:px-8 sm:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-[#d5b878]">
          The LUXORA experience
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
          Make every moment
          <span className="block italic text-[#d9bd82]">
            unforgettable.
          </span>
        </h2>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#d9bd82] px-8 py-4 text-sm font-semibold text-[#17120a] transition hover:bg-[#eed9a7]"
        >
          Shop the collection <FaArrowRight size={13} />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
