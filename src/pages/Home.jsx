import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GoldRateBox from "../components/GoldRateBox";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaGem,
  FaShieldAlt,
  FaUndo,
  FaTruck,
  FaStar,
} from "react-icons/fa";

const collections = [
  {
    eyebrow: "MADE TO BE ADMIRED",
    title: "Statement Rings",
    description: "Little details. Extraordinary presence.",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1100&q=90",
  },
  {
    eyebrow: "GOLDEN MOMENTS",
    title: "Gold Necklaces",
    description: "Graceful designs made to be treasured.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1100&q=90",
  },
  {
    eyebrow: "THE PERFECT FINISH",
    title: "Fine Earrings",
    description: "A little brilliance for every occasion.",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1100&q=90",
  },
];

const benefits = [
  {
    icon: FaGem,
    title: "Thoughtful Craftsmanship",
    text: "Designs chosen with care",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Payments",
    text: "Protected online checkout",
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
    <div className="min-h-screen overflow-hidden bg-[#090806] text-[#f8f2e8]">
      <Navbar />

      {/* Gold rate */}
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#d9bd82]/20 bg-[#11100c] p-1 shadow-[0_12px_45px_rgba(0,0,0,0.3)]">
          <GoldRateBox />
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:px-10 lg:py-20">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#d9bd82]/25 bg-[#d9bd82]/5 px-4 py-2">
            <FaStar className="text-xs text-[#e0c48c]" />
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#e6d0a1]">
              The art of fine jewelry
            </span>
          </div>

          <h1 className="max-w-xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl md:text-7xl xl:text-[82px]">
            Elegance
            <span className="block italic text-[#d9bd82]">
              made
            </span>
            personal.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-stone-400 sm:text-lg">
            Jewelry is more than an accessory. It is a reflection
            of your story, your confidence, and the moments you
            want to keep forever. Find your signature piece at LUXORA.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 rounded-full bg-[#d9bd82] px-7 py-4 text-sm font-semibold text-[#17120a] transition duration-300 hover:-translate-y-1 hover:bg-[#eed9a7]"
            >
              Discover the collection
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm text-stone-200 transition hover:border-[#d9bd82] hover:text-[#e5ca91]"
            >
              Shop LUXORA
            </Link>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-white/10 pt-7">
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
                Curated jewelry
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

        {/* Woman wearing jewelry — hero image */}
        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute -inset-5 rounded-[40px] bg-[#a47735]/15 blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-[#d9bd82]/25 bg-[#17130e]">
            <img
              src="https://images.pexels.com/photos/14261991/pexels-photo-14261991.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Indian woman wearing elegant gold jewelry"
              fetchPriority="high"
              className="h-[470px] w-full object-cover object-center sm:h-[580px] lg:h-[660px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/10" />

            <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/35 px-4 py-2 backdrop-blur-md sm:left-7 sm:top-7">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white">
                The LUXORA edit
              </p>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#e3c98f]">
                  Made for your moments
                </p>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
                  Your moment.
                  <span className="block italic text-[#e2c487]">
                    Your sparkle.
                  </span>
                </h2>
                <p className="mt-2 text-sm text-stone-300">
                  Find the piece that feels like you.
                </p>
              </div>

              <Link
                to="/products"
                aria-label="Explore LUXORA jewelry"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d9bd82] text-black transition hover:scale-105 hover:bg-[#eed9a7]"
              >
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9bd82]">
              Find what speaks to you
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
              Pieces to fall
              <span className="italic text-[#d9bd82]">
                {" "}in love with.
              </span>
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 border-b border-[#d9bd82]/50 pb-2 text-sm text-[#e4ca94] transition hover:border-white hover:text-white"
          >
            Explore all jewelry <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((item) => (
            <Link
              to="/products"
              key={item.title}
              className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#13110e] transition duration-500 hover:-translate-y-1 hover:border-[#d9bd82]/40"
            >
              <div className="relative h-[350px] overflow-hidden sm:h-[410px]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition group-hover:bg-[#d9bd82] group-hover:text-black">
                  <FaArrowRight size={13} />
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#e3ca95]">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-stone-300">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-[#e3ca95]">
                    Discover pieces <FaArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial feature */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-[28px] border border-[#d9bd82]/20 bg-[#15120d] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9bd82]">
              Beyond the ordinary
            </p>

            <h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Not just jewelry.
              <span className="block italic text-[#d9bd82]">
                A feeling.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-stone-400 sm:text-base">
              Celebrate who you are with designs that bring a little
              more beauty to everyday life and make special occasions
              unforgettable.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-[#d9bd82]/50 px-6 py-3.5 text-sm text-[#e5cb96] transition hover:bg-[#d9bd82] hover:text-black"
            >
              Find your signature piece <FaArrowRight size={12} />
            </Link>
          </div>

          <div className="relative min-h-[350px] overflow-hidden sm:min-h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1400&q=90"
              alt="Luxury jewelry styled for an editorial campaign"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-black/40 px-5 py-4 backdrop-blur-md sm:bottom-8 sm:left-8">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#e3ca95]">
                The art of gifting
              </p>
              <p className="mt-1 font-serif text-xl">
                Made to be remembered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9bd82]">
            The LUXORA promise
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            A better way to shop jewelry.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#17140f] to-[#100f0c] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d9bd82]/35"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9bd82]/25 bg-[#d9bd82]/10">
                <Icon className="text-[#d9bd82]" size={19} />
              </div>
              <h3 className="mt-5 text-sm font-semibold text-stone-100">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-stone-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-20 pt-10 text-center sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[#d9bd82]/20 bg-[radial-gradient(ellipse_at_top,rgba(166,123,49,0.15),transparent_65%)] px-6 py-14 sm:px-12 sm:py-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d9bd82]">
            Your story deserves to shine
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            Find the piece that
            <span className="block italic text-[#d9bd82]">
              feels like forever.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-stone-400">
            Explore the LUXORA collection and discover your next
            favorite piece.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#d9bd82] px-8 py-4 text-sm font-semibold text-[#17120a] transition hover:-translate-y-1 hover:bg-[#eed9a7]"
          >
            Shop LUXORA <FaArrowRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}