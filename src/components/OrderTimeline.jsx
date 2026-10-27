
export default function OrderTimeline({ status }) {
  const steps = [
    "PENDING",
    "CONFIRMED",
    "QUALITY_CHECK",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  // Normalize backend status safely
  const normalizedStatus =
    typeof status === "string" ? status.trim().toUpperCase() : "";

  const currentIndex = steps.indexOf(normalizedStatus);

  const formatStatus = (value) =>
    value.replaceAll("_", " ");

  // Special order statuses
  const specialStatuses = {
    CANCELLED: {
      title: "Order Cancelled",
      description: "This order has been cancelled.",
      icon: "✕",
      color: "red",
    },
    RETURN_REQUESTED: {
      title: "Return Requested",
      description: "Your return request is being processed.",
      icon: "↩",
      color: "orange",
    },
    RETURNED: {
      title: "Product Returned",
      description: "The product has been returned.",
      icon: "✓",
      color: "gray",
    },
    REFUNDED: {
      title: "Refund Completed",
      description: "Your refund has been processed.",
      icon: "₹",
      color: "emerald",
    },
  };

  const specialStatus = specialStatuses[normalizedStatus];

  const specialStyles = {
    red: "border-red-500/30 bg-red-500/10 text-red-400",
    orange: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    gray: "border-gray-500/30 bg-gray-500/10 text-gray-300",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div className="mt-6 rounded-2xl border border-amber-400/15 bg-neutral-950 p-5 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          LUXORA ORDER TRACKING
        </p>

        <h3 className="mt-2 text-lg font-semibold text-white">
          Order Status
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Follow your order from confirmation to delivery.
        </p>
      </div>

      {/* Special statuses */}
      {specialStatus ? (
        <div
          className={`rounded-xl border p-4 ${
            specialStyles[specialStatus.color]
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current text-xl">
              {specialStatus.icon}
            </div>

            <div>
              <h4 className="text-base font-bold">
                {specialStatus.title}
              </h4>

              <p className="mt-1 text-sm opacity-80">
                {specialStatus.description}
              </p>
            </div>
          </div>
        </div>
      ) : currentIndex === -1 ? (
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
          <p className="font-medium text-gray-200">
            Order status unavailable
          </p>

          <p className="mt-1 text-sm text-gray-400">
            We couldn't identify this order's current status.
          </p>

          {normalizedStatus && (
            <p className="mt-2 text-xs text-gray-500">
              Received status: {normalizedStatus}
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Current status */}
          <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <p className="text-sm text-gray-400">
              Current Status
            </p>

            <p className="mt-1 font-semibold text-amber-300">
              {formatStatus(normalizedStatus)}
            </p>
          </div>

          {/* Order timeline */}
          <div className="space-y-0">
            {steps.map((step, index) => {
              const completed = index <= currentIndex;
              const current = index === currentIndex;
              const isLast = index === steps.length - 1;

              return (
                <div key={step} className="flex gap-4">
                  {/* Step icon and connecting line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                        completed
                          ? "border-amber-400 bg-amber-400 text-black"
                          : "border-gray-700 bg-gray-900 text-gray-500"
                      } ${
                        current
                          ? "ring-4 ring-amber-400/10"
                          : ""
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    {!isLast && (
                      <div
                        className={`my-1 min-h-8 w-[2px] flex-1 ${
                          index < currentIndex
                            ? "bg-amber-400"
                            : "bg-gray-800"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step details */}
                  <div
                    className={`${
                      isLast ? "pb-0" : "pb-6"
                    } pt-1`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        current
                          ? "text-amber-300"
                          : completed
                          ? "text-gray-200"
                          : "text-gray-500"
                      }`}
                    >
                      {formatStatus(step)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {current
                        ? "Your order is currently at this stage."
                        : completed
                        ? "This step has been completed."
                        : "Coming up next."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
