import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) return;

        axios.get(`${API_BASE_URL}/api/orders/my-orders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            const data = res.data;
            setOrders(data?.content || data);
        })
        .catch((err) => {
            console.log(err);
        });

    }, []);

    const steps = [
        {
            key: "PENDING",
            label: "Order Placed",
            field: "orderDate"
        },
        {
            key: "CONFIRMED",
            label: "Order Confirmed",
            field: "confirmedAt"
        },
        {
            key: "QUALITY_CHECK",
            label: "Quality Check",
            field: "qualityCheckedAt"
        },
        {
            key: "PACKED",
            label: "Packed",
            field: "packedAt"
        },
        {
            key: "SHIPPED",
            label: "Shipped",
            field: "shippedAt"
        },
        {
            key: "OUT_FOR_DELIVERY",
            label: "Out For Delivery",
            field: "outForDeliveryAt"
        },
        {
            key: "DELIVERED",
            label: "Delivered",
            field: "deliveredAt"
        }
    ];

    const formatDate = (date) => {

        if (!date) return "";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    return (

        <div className="min-h-screen bg-black text-white p-10">

            <h1 className="text-5xl font-bold mb-10">
                My Orders
            </h1>

            {orders.length === 0 ? (

                <p className="text-gray-400">
                    No orders found
                </p>

            ) : (

                orders.map(order => {

                    const currentIndex =
                        steps.findIndex(s => s.key === order.status);

                    return (

                        <div
                            key={order.id}
                            className="bg-white/10 border border-yellow-500/20 rounded-2xl p-6 mb-8"
                        >

                            <div className="flex justify-between">

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        Order #{order.id}
                                    </h2>

                                    <p className="text-gray-400 mt-2">
                                        Ordered On :
                                        <br />
                                        {formatDate(order.orderDate)}
                                    </p>

                                    {order.status === "DELIVERED" &&
                                        order.deliveredAt && (

                                            <p className="text-green-400 mt-3">
                                                Delivered On :
                                                <br />
                                                {formatDate(order.deliveredAt)}
                                            </p>

                                        )}

                                    {order.status === "CANCELLED" &&
                                        order.cancelledAt && (

                                            <p className="text-red-400 mt-3">
                                                Cancelled On :
                                                <br />
                                                {formatDate(order.cancelledAt)}
                                            </p>

                                        )}

                                </div>

                                <div className="text-right">

                                    <h2 className="text-3xl font-bold text-yellow-400">
                                        ₹{order.totalAmount.toLocaleString("en-IN")}
                                    </h2>

                                    <span className="inline-block mt-4 px-5 py-2 rounded-full bg-yellow-500 text-black font-bold">
                                        {order.status.replaceAll("_", " ")}
                                    </span>

                                </div>

                            </div>

                            <div className="mt-8 border-l-2 border-gray-700 pl-6 space-y-6">

                                {order.status === "CANCELLED" ? (

                                    <>
                                        <div>

                                            <h3 className="text-red-400 font-bold text-lg">
                                                Order Cancelled
                                            </h3>

                                            <p className="text-gray-400 text-sm">
                                                {formatDate(order.cancelledAt)}
                                            </p>

                                        </div>
                                    </>

                                ) : (

                                    steps.map((step, index) => {

                                        const completed =
                                            index <= currentIndex;

                                        const date =
                                            order[step.field];

                                        return (

                                            <div
                                                key={step.key}
                                                className="relative"
                                            >

                                                <div
                                                    className={`
                                                    absolute
                                                    -left-[34px]
                                                    top-1
                                                    w-4
                                                    h-4
                                                    rounded-full
                                                    ${completed
                                                        ? "bg-green-500"
                                                        : "bg-gray-600"}
                                                `}
                                                />

                                                <h3
                                                    className={`font-bold text-lg
                                                    ${completed
                                                        ? "text-green-400"
                                                        : "text-gray-500"}
                                                `}
                                                >
                                                    {step.label}
                                                </h3>

                                                <p className="text-sm text-gray-400">

                                                    {date
                                                        ? formatDate(date)
                                                        : "Pending"}

                                                </p>

                                            </div>

                                        );

                                    })

                                )}

                            </div>

                        </div>

                    );

                })

            )}

        </div>

    );

}