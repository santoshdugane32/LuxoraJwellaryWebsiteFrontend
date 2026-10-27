
import { CheckCircle, Package, ShoppingBag, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    orderId,
    amount,
    paymentId,
    paymentMethod,
    paymentDate,
    productName,
    quantity,
  } = location.state || {};

  const numericAmount = Number(amount);
  const hasAmount =
    amount !== null &&
    amount !== undefined &&
    amount !== "" &&
    Number.isFinite(numericAmount);

  const formattedAmount = hasAmount
    ? numericAmount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "Not available";

  const formattedDate = paymentDate
    ? new Date(paymentDate).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not available";

  // The payment details are passed from the checkout page.
  // If the user opens this page directly, they may be missing.
  const hasPaymentDetails = Boolean(orderId || paymentId || hasAmount);

  if (!hasPaymentDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black px-4 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-yellow-500/20 bg-gray-900/80 p-8 text-center shadow-2xl sm:p-10">
          <ShoppingBag
            size={56}
            className="mx-auto mb-5 text-yellow-400"
          />

          <h1 className="text-2xl font-bold sm:text-3xl">
            Payment Details Unavailable
          </h1>

          <p className="mt-3 text-gray-400">
            This page may have been opened directly or refreshed.
            Please check your orders to confirm your payment status.
          </p>

          <button
            onClick={() => navigate("/my-orders")}
            className="mt-7 w-full rounded-xl bg-yellow-500 px-5 py-3 font-bold text-black transition hover:bg-yellow-400"
          >
            Check My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black px-4 py-10 text-white sm:px-6">
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-yellow-500/20 bg-gray-900/80 shadow-2xl shadow-yellow-500/5">
        {/* Success header */}
        <div className="border-b border-white/10 px-5 py-10 text-center sm:px-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10">
            <CheckCircle size={58} className="text-green-400" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-yellow-400">
            LUXORA
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Payment Successful!
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400 sm:text-base">
            Thank you for choosing LUXORA. Your payment confirmation
            details are shown below.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
            <ShieldCheck size={18} />
            Payment confirmed
          </div>
        </div>

        {/* Amount summary */}
        <div className="mx-5 mt-6 rounded-2xl border border-yellow-500/20 bg-black/50 p-6 text-center sm:mx-8 sm:p-8">
          <p className="text-sm text-gray-400">Amount Paid</p>
          <h2 className="mt-2 break-words text-3xl font-bold text-yellow-400 sm:text-4xl">
            {formattedAmount}
          </h2>

          <p className="mt-3 text-xs text-gray-500">
            Keep your transaction details for future reference.
          </p>
        </div>

        {/* Payment details */}
        <div className="p-5 sm:p-8">
          <h2 className="mb-4 text-xl font-bold">Payment Details</h2>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            {[
              {
                label: "Order ID",
                value: orderId ? `#${orderId}` : "Not available",
              },
              {
                label: "Payment Status",
                value: "SUCCESS",
                success: true,
              },
              {
                label: "Payment Method",
                value: paymentMethod || "Razorpay",
              },
              {
                label: "Transaction ID",
                value: paymentId || "Not available",
                breakAll: true,
              },
              {
                label: "Payment Date",
                value: formattedDate,
              },
              {
                label: "Estimated Delivery",
                value: "3–5 days",
                success: true,
              },
            ].map((item, index, items) => (
              <div
                key={item.label}
                className={`flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-5 ${
                  index !== items.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <span className="shrink-0 text-sm text-gray-400">
                  {item.label}
                </span>

                <span
                  className={`text-sm font-semibold sm:max-w-[65%] sm:text-right ${
                    item.success ? "text-green-400" : "text-white"
                  } ${item.breakAll ? "break-all" : "break-words"}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Purchased item */}
          {(productName || quantity != null) && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">
                  <Package size={25} className="text-yellow-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-semibold text-white">
                    {productName || "LUXORA Order"}
                  </h3>

                  {quantity != null && (
                    <p className="mt-1 text-sm text-gray-400">
                      Quantity: {quantity}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-sm font-bold text-yellow-400">
                  {formattedAmount}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-4 font-bold text-black transition hover:bg-yellow-400"
            >
              <Package size={20} />
              View My Orders
            </button>

            <button
              onClick={() => navigate("/products")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-4 font-bold text-white transition hover:border-yellow-500/50 hover:bg-white/10"
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-gray-500">
            Thank you for shopping with LUXORA.
          </p>
        </div>
      </div>
    </div>
  );
}
