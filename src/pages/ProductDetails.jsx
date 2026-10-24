import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
} from "lucide-react";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const imageRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(0);

  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);

  const [fly, setFly] = useState(false);

  const [flyStyle, setFlyStyle] = useState({});

  const [showAdded, setShowAdded] = useState(false);

  // Premium Gallery

  const [selectedImage, setSelectedImage] = useState("");

  const [images, setImages] = useState([]);

  const CART_KEY = "cart";

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);

        const productRes = await axios.get(
          `${API_BASE_URL}/api/products/${id}`
        );

        setProduct(productRes.data);

        const priceRes = await axios.get(
          `${API_BASE_URL}/api/product-price/${id}`
        );

        setPrice(Number(priceRes.data));

        // Gallery Images

        const img = productRes.data.imageUrl;

        setImages([
          img,
          img,
          img,
          img
        ]);

        setSelectedImage(img);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  const previousImage = () => {

    const index = images.indexOf(selectedImage);

    if (index === 0) {

      setSelectedImage(images[images.length - 1]);

    } else {

      setSelectedImage(images[index - 1]);

    }

  };

  const nextImage = () => {

    const index = images.indexOf(selectedImage);

    if (index === images.length - 1) {

      setSelectedImage(images[0]);

    } else {

      setSelectedImage(images[index + 1]);

    }

  };
  const addToCart = () => {
    if (!product) return;

    // Check login
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to add products to cart.");
      navigate("/login");
      return;
    }

    // User-specific cart
    const CART_KEY = `cart_${user.id}`;

    // Flying animation
    const imgRect = imageRef.current?.getBoundingClientRect();
    const cartRect = document
      .getElementById("cart-icon")
      ?.getBoundingClientRect();

    if (imgRect && cartRect) {
      const startX = imgRect.left + imgRect.width / 2;
      const startY = imgRect.top + imgRect.height / 2;

      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      setFlyStyle({
        left: `${startX}px`,
        top: `${startY}px`,
        "--moveX": `${endX - startX}px`,
        "--moveY": `${endY - startY - 40}px`,
      });
    }

    setAdding(true);
    setFly(true);
    setShowAdded(true);

    // Load current user's cart
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      cart = cart.map((item) =>
        item.id === product.id
          ? {
            ...item,
            quantity: item.quantity + 1,
          }
          : item
      );
    } else {
      cart.push({
        ...product,
        price,
        quantity: 1,
      });
    }

    // Save this user's cart
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    // ✅ Notify Navbar to refresh the cart count
    window.dispatchEvent(new Event("cartUpdated"));

    const cartIcon = document.getElementById("cart-icon");

    cartIcon?.classList.add("animate-bounce");

    setTimeout(() => {
      setFly(false);
      setAdding(false);
      setShowAdded(false);

      cartIcon?.classList.remove("animate-bounce");
    }, 1200);
  };

  const buyNow = () => {
    if (!product) return;

    navigate("/checkout", {
      state: {
        buyNow: true,
        products: [
          {
            ...product,
            price,
            quantity: 1,
          },
        ],
        total: price,
      },
    });
  };
  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white">

        <Navbar />

        <div className="text-center pt-32">

          Loading Luxury Product...

        </div>

      </div>

    );

  }

  if (!product) {

    return (

      <div className="min-h-screen bg-black text-white">

        <Navbar />

        <div className="text-center pt-32">

          Product Not Found

        </div>

      </div>

    );

  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 p-10">

        {/* IMAGE SECTION */}
        <div className="relative group">
          <div className="overflow-hidden rounded-[40px] bg-white p-8 shadow-2xl border border-yellow-500/20">
            <img
              ref={imageRef}
              src={product.imageUrl}
              alt={product.name}
              className="
              w-full h-[650px] object-cover
              transition duration-700
              group-hover:scale-110
              group-hover:rotate-1
             "
            />
          </div>

          <div className="absolute top-4 left-4 bg-yellow-500 text-black px-5 py-2 rounded-full text-sm font-bold">
            Premium Collection
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">

          <h1 className="
            text-5xl
            font-semibold
            tracking-tight
            text-white
            leading-tight
            ">
            {product.name}
          </h1>

          <p className="text-yellow-400 text-5xl mt-6 font-bold">
            ₹ {price.toLocaleString("en-IN")}
          </p>

          {/* PRODUCT INFO */}
          <div className="grid grid-cols-2 gap-5 mt-10">

            <div className="rounded-2xl bg-zinc-900 p-5 border border-zinc-700">

              <p className="text-gray-400 text-sm">
                Weight
              </p>

              <p className="text-2xl font-bold mt-2">
                {product.weightInGrams} g
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 p-5 border border-zinc-700">

              <p className="text-gray-400 text-sm">
                Purity
              </p>

              <p className="text-2xl font-bold mt-2 text-yellow-400">
                {product.purity}K
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 p-5 border border-zinc-700">

              <p className="text-gray-400 text-sm">
                Making Charge
              </p>

              <p className="text-2xl font-bold mt-2">
                {product.makingChargePercent}%
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 p-5 border border-zinc-700">

              <p className="text-gray-400 text-sm">
                Availability
              </p>

              <p className="text-green-400 text-xl font-bold mt-2">
                {product.stock} In Stock
              </p>

            </div>

          </div>

          {/* DESCRIPTION */}
          <p className="mt-8 text-gray-400 text-lg leading-9">

            Designed with exceptional craftsmanship and
            crafted from premium {product.purity}K gold,
            this elegant jewellery piece is perfect for
            daily wear as well as special occasions.

          </p>


          {/* ACTION BUTTONS */}
          <div className="mt-10 flex gap-4">

            <button
              onClick={addToCart}
              disabled={product.stock <= 0 || adding}
              className={`
                flex-1 py-4 rounded-2xl font-bold text-xl
                transition-all duration-300
                shadow-xl
                shadow-yellow-500/20
                ${product.stock > 0
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:scale-105"
                  : "bg-gray-600"
                }
              `}
            >
              {adding ? "Adding..." : "🛒 Add to Cart"}
            </button>

            <button
              onClick={buyNow}
              disabled={product.stock <= 0}
              className="
                flex-1
                py-4
                rounded-2xl
                font-bold
                text-xl

                bg-gradient-to-r
                from-[#1E1E1E]
                to-[#2D2D2D]

                text-yellow-400

                border
                border-yellow-500/40

                hover:from-yellow-500
                hover:to-yellow-400

                hover:text-black

                hover:scale-105

                transition-all
                duration-300

                shadow-xl
                shadow-yellow-500/20
                ">
              ⚡ Buy Now
            </button>

          </div>

          {/* EXTRA BUTTONS */}



          {/* CART FLY ANIMATION */}
          {fly && (
            <img
              src={product.imageUrl}
              alt=""
              style={flyStyle}
              className="
              fixed
              w-20
              h-20
              object-cover
              rounded-full
              border-2
              border-yellow-400
              shadow-2xl
              z-[9999]
              animate-flyCart
            "
            />
          )}

          {/* SUCCESS TOAST */}
          {showAdded && (
            <div className="fixed bottom-6 left-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-[9999]">
              ✅ Added to Cart
            </div>
          )}


        </div>
      </div>
    </div >
  );
}