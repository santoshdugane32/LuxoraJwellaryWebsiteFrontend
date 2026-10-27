
export default function OrderTrackingVertical({ status }) {
  const steps = [
    "PENDING",
    "CONFIRMED",
    "QUALITY_CHECK",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  // Normalize status received from Spring Boot
  const normalizedStatus =
    typeof status === "string" ? status.trim().toUpperCase() : "";

  const currentIndex = steps.indexOf(normalizedStatus);

  // Special statuses
  const specialStatuses = {
    CANCELLED: {
      title: "Order Cancelled",
      description: "Your order has been cancelled.",
      icon: "✕",
      color: "red",
    },
    RETURN_REQUESTED: {
      title: "Return Requested",
      description: "Your return request is under review.",
      icon: "↩",
      color: "orange",
    },
    RETURNED: {
      title: "Product Returned",
      description: "The returned item has been received.",
      icon: "📦",
      color: "gray",
    },
    REFUNDED: {
      title: "Refund Completed",
      description: "Your refund has been processed successfully.",
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

  const formatStatus = (value) => value.replaceAll("_", " ");

  return (
    <div className="mt-6 rounded-2xl border border-amber-400/15 bg-neutral-950 p-5 md:p-6">
      {/* Header */}
      <div className="mb-7">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          LUXORA ORDER TRACKING
        </p>

        <h3 className="mt-2 text-xl font-semibold text-white">
          Delivery Progress
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Follow your order through every stage.
        </p>
      </div>

      {/* Cancelled, returned, return requested or refunded */}
      {specialStatus ? (
        <div
          className={`rounded-xl border p-5 ${
            specialStyles[specialStatus.color]
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current text-xl">
              {specialStatus.icon}
            </div>

            <div>
              <h4 className="text-lg font-bold">
                {specialStatus.title}
              </h4>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {specialStatus.description}
              </p>
            </div>
          </div>
        </div>
      ) : currentIndex === -1 ? (
        /* Unknown status */
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
          <h4 className="font-semibold text-gray-200">
            Status unavailable
          </h4>

          <p className="mt-2 text-sm text-gray-400">
            We couldn't identify the current order status.
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
          <div className="mb-8 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Current Status
            </p>

            <p className="mt-2 font-semibold text-amber-300">
              {formatStatus(normalizedStatus)}
            </p>
          </div>

          {/* Vertical timeline */}
          <div className="relative ml-2 border-l-2 border-gray-800 pl-7">
            {steps.map((step, index) => {
              const completed = index <= currentIndex;
              const active = index === currentIndex;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={step}
                  className={isLast ? "relative" : "relative pb-8"}
                >
                  {/* Timeline circle */}
                  <div
                    className={`absolute -left-[37px] top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-neutral-950 ${
                      completed
                        ? "bg-amber-400"
                        : "bg-gray-700"
                    } ${
                      active
                        ? "ring-4 ring-amber-400/20"
                        : ""
                    }`}
                  >
                    {completed && (
                      <span className="text-[10px] font-bold text-black">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Step label */}
                  <h4
                    className={`text-base font-semibold ${
                      active
                        ? "text-amber-300"
                        : completed
                        ? "text-gray-200"
                        : "text-gray-500"
                    }`}
                  >
                    {formatStatus(step)}
                  </h4>

                  {/* Step description */}
                  <p className="mt-1 text-sm text-gray-500">
                    {active
                      ? "Your order is currently at this stage."
                      : completed
                      ? "This step has been completed."
                      : "Waiting for the previous step to complete."}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
