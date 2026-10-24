import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getUser, getCartKey } from "../utils/cartUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Checkout() {

    const navigate = useNavigate();
    const location = useLocation();

    const [cart, setCart] = useState([]);

    const user = getUser();

    const CART_KEY = getCartKey();

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

    }, []);

    useEffect(() => {

        if (!user) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        if (location.state?.buyNow) {

            setCart(
                location.state.products.map(item => ({
                    ...item,
                    quantity: Number(item.quantity || 1),
                    price: Number(item.price || 0)
                }))
            );

        } else {

            const savedCart =
                JSON.parse(localStorage.getItem(CART_KEY)) || [];

            setCart(
                savedCart.map(item => ({
                    ...item,
                    quantity: Number(item.quantity || 1),
                    price: Number(item.price || 0)
                }))
            );

        }

    }, [location]);
    const total = cart.reduce(

        (sum, item) =>

            sum + item.price * item.quantity,

        0

    );

    console.log("========== CHECKOUT ==========");
    console.log("Cart:", cart);

    cart.forEach(item => {
        console.log(
            "Product:",
            item.name,
            "Price:",
            item.price,
            "Qty:",
            item.quantity,
            "Subtotal:",
            item.price * item.quantity
        );
    });

    console.log("TOTAL =", total);

    const placeOrder = async () => {

        if (loading) return;

        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again");
            navigate("/login");
            return;
        }

        setLoading(true);

        try {

            // ==========================
            // 1. SAVE ORDER FIRST
            // ==========================

            const orderRes = await axios.post(

                `${API_BASE_URL}/api/orders`,

                {

                    totalAmount: total,

                    items: cart.map(item => ({

                        productId: item.id,

                        quantity: item.quantity

                    }))

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const savedOrder = orderRes.data;

            // ==========================
            // 2. CREATE RAZORPAY ORDER
            // ==========================

            const paymentRes = await axios.post(

                `${API_BASE_URL}/api/payment/create-order`,

                {

                    orderId: savedOrder.id,

                    amount: Math.round(total)

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const razorpayOrder = paymentRes.data;

            console.log(razorpayOrder.id);

            console.log(razorpayOrder.amount);

            // ==========================
            // 3. OPEN RAZORPAY
            // ==========================

            if (!window.Razorpay) {

                setLoading(false);

                alert("Razorpay SDK failed to load.");

                return;

            }

            console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY);

            const options = {

                key: import.meta.env.VITE_RAZORPAY_KEY,

                amount: razorpayOrder.amount,

                currency: razorpayOrder.currency,

                order_id: razorpayOrder.id,

                name: "LUXORA",

                description: "Jewellery Purchase",

                image: "/logo.png",

                prefill: {

                    name: user?.name,

                    email: user?.email

                },

                theme: {

                    color: "#D4AF37"

                },

                modal: {

                    ondismiss: function () {

                        setLoading(false);

                        alert("Payment cancelled.");

                    }

                },
                handler: async function (response) {

                    try {

                        // ==========================
                        // VERIFY PAYMENT
                        // ==========================

                        await axios.post(

                            `${API_BASE_URL}/api/payment/verify`,

                            {

                                orderId: savedOrder.id,

                                razorpayOrderId: response.razorpay_order_id,

                                razorpayPaymentId: response.razorpay_payment_id,

                                razorpaySignature: response.razorpay_signature

                            },

                            {

                                headers: {

                                    Authorization: `Bearer ${token}`

                                }

                            }

                        );

                        if (!location.state?.buyNow) {

                            localStorage.removeItem(CART_KEY);

                        }

                        window.dispatchEvent(

                            new Event("cartUpdated")

                        );

                        navigate("/payment-success", {

                            state: {

                                orderId: savedOrder.id

                            }

                        });

                        setLoading(false);

                        // navigate("/my-orders");

                    }

                    catch (error) {

                        setLoading(false);

                        console.log("ERROR URL:",
                            error.config?.url
                        );

                        console.log("STATUS:",
                            error.response?.status
                        );

                        console.log("RESPONSE:",
                            error.response?.data
                        );



                        alert(

                            error.response?.data ||

                            "Payment verification failed."

                        );

                    }

                }

            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {

                setLoading(false);

                console.log(response.error);

                alert(response.error.description);

            });

            razorpay.open();

        }

        catch (error) {

            setLoading(false);

            console.log("ERROR URL:",
                error.config?.url
            );

            console.log("STATUS:",
                error.response?.status
            );

            console.log("RESPONSE:",
                error.response?.data
            );



            if (error.response?.status === 400) {

                alert(error.response.data.message || error.response.data);

                return;
            }

            if (error.response?.status === 401) {

                localStorage.removeItem("token");

                alert("Session expired. Please login again.");

                navigate("/login");

                return;
            }

            if (error.response?.status === 403) {

                alert("You are not authorized.");

                return;
            }

            alert(error.response?.data?.message || "Unable to place order.");
        }
    };
    return (

        <div className="min-h-screen bg-black text-white">

            <Navbar />

            <div className="max-w-4xl mx-auto p-10">

                <h1 className="text-4xl font-bold mb-8">

                    Checkout

                </h1>

                {cart.length === 0 ? (

                    <p className="text-gray-400">

                        Cart is empty

                    </p>

                ) : (

                    <>

                        <div className="space-y-4">

                            {cart.map(item => (

                                <div

                                    key={item.id}

                                    className="
                                    flex
                                    justify-between
                                    items-center
                                    bg-white/5
                                    p-5
                                    rounded-xl
                                    border
                                    border-white/10
                                    "

                                >

                                    <div className="flex items-center gap-4">

                                        <img

                                            src={item.imageUrl || "/no-image.png"}

                                            className="w-20 h-20 rounded-lg object-cover"

                                            alt={item.name}

                                        />

                                        <div>

                                            <h2>{item.name}</h2>

                                            <p>Qty : {item.quantity}</p>

                                        </div>

                                    </div>

                                    <h2 className="text-yellow-400 text-xl font-bold">

                                        ₹{(item.price * item.quantity)
                                            .toLocaleString("en-IN")}

                                    </h2>

                                </div>

                            ))}

                        </div>

                        <div className="mt-8 bg-white/5 p-6 rounded-xl">

                            <p className="text-gray-400">

                                Items : {cart.length}

                            </p>

                            <h2 className="text-3xl font-bold text-yellow-400">

                                Total : ₹{total.toLocaleString("en-IN")}

                            </h2>


                            <button

                                disabled={loading}

                                onClick={placeOrder}

                                className={`

                                    mt-6
                                    w-full
                                    bg-gradient-to-r
                                    from-yellow-400
                                    to-yellow-600
                                    text-black
                                    font-bold
                                    py-4
                                    rounded-xl
                                    transition

                                    ${loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:scale-105"
                                    }

    `}
                            >

                                {loading ? "Processing..." : "Pay Securely"}

                            </button>

                        </div>

                    </>

                )}

            </div>

        </div >

    );

}