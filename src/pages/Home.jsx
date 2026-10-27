
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
    position: "left center",
    category: "Rings",
  },
  {
    eyebrow: "EVERYDAY LUXURY",
    title: "Gold Necklaces",
    description: "Understated beauty, crafted to be treasured.",
    position: "center center",
    category: "Necklaces",
  },
  {
    eyebrow: "THE FINISHING TOUCH",
    title: "Fine Earrings",
    description: "A little brilliance for every occasion.",
    position: "right center",
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

      {/* Hero section */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-2 lg:gap-12 lg:px-10">
        <div className="relative z-10">
          <p className="mb-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#d5b878] sm:text-xs">
            <span className="h-px w-9 bg-[#d5b878]" />
            Made for your moments
          </p>

          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl xl:text-[78px]">
            The art of
            <span className="block italic text-[#d9bd82]">
              timeless
            </span>
            elegance.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-stone-400 sm:text-lg sm:leading-8">
            Discover thoughtfully curated jewelry that celebrates
            your individuality. From everyday elegance to life's
            unforgettable occasions.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 rounded-full bg-[#d9bd82] px-7 py-4 text-sm font-semibold text-[#17120a] transition hover:bg-[#eed9a7]"
            >
              Explore Collection
              <FaArrowRight size={13} />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm text-stone-200 transition hover:border-[#d9bd82] hover:text-[#d9bd82]"
            >
              Discover LUXORA
              <FaPlay size={10} />
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 border-t border-white/10 pt-6">
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

        {/* Hero jewelry image */}
        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute -inset-3 rounded-[45%] bg-[#a47735]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-t-[45%] rounded-b-2xl border border-[#d9bd82]/25">
            <img
              src="/images/luxora-hero.png"
              alt="Luxury gold and diamond pendant"
              fetchPriority="high"
              className="h-[400px] w-full object-cover object-center sm:h-[540px] lg:h-[620px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />

            <div className="absolute bottom-6 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
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
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-16 sm:px-8 lg:px-10">
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
              className="group relative isolate overflow-hidden border border-[#d9bd82]/20 bg-[#100f0c]"
            >
              {/* Each card displays a different panel of the triptych */}
              <div className="relative h-[330px] overflow-hidden sm:h-[400px]">
                <div
                  role="img"
                  aria-label={item.title}
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('/images/luxora-collections.png')",
                    backgroundSize: "300% 100%",
                    backgroundPosition: item.position,
                    backgroundRepeat: "no-repeat",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
              </div>

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
                  Explore collection
                  <FaArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden border border-[#c5a366]/20 bg-[#100e0a] md:grid-cols-2">
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
              src="/images/luxora-editorial.png"
              alt="Fine jewelry styled for a special occasion"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/images/luxora-hero.png";
              }}
              className="h-full min-h-[300px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:min-h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 border-y border-white/10 py-9 md:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 sm:gap-4">
              <Icon
                className="mt-1 shrink-0 text-[#d9bd82]"
                size={22}
              />

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

      {/* Final call to action */}
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
