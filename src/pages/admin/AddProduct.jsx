
import { useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialProduct = {
    name: "",
    category: "Gold",
    imageUrl: "",
    stock: "",
    weightInGrams: "",
    purity: "22",
    makingChargePercent: "",
};

const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10";

const labelClass =
    "mb-2 block text-sm font-medium text-zinc-300";

export default function AddProduct() {
    const [product, setProduct] = useState(initialProduct);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [imageError, setImageError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProduct((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (name === "imageUrl") {
            setImageError(false);
        }

        setMessage("");
        setMessageType("");
    };

    const saveProduct = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Your session has expired. Please log in again.");
            setMessageType("error");
            return;
        }

        if (!API_BASE_URL) {
            setMessage("API URL is not configured. Check your frontend environment settings.");
            setMessageType("error");
            return;
        }

        const weight = Number(product.weightInGrams);
        const stock = Number(product.stock);
        const makingCharge = Number(product.makingChargePercent);

        if (
            !product.name.trim() ||
            !product.imageUrl.trim() ||
            !Number.isFinite(weight) ||
            weight <= 0 ||
            !Number.isInteger(stock) ||
            stock < 0 ||
            !Number.isFinite(makingCharge) ||
            makingCharge < 0
        ) {
            setMessage(
                "Enter a product name, image URL, positive weight, valid stock, and non-negative making charge."
            );
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.post(
                `${API_BASE_URL.replace(/\/+$/, "")}/api/products`,
                {
                    ...product,
                    name: product.name.trim(),
                    imageUrl: product.imageUrl.trim(),
                    stock,
                    weightInGrams: weight,
                    purity: Number(product.purity),
                    makingChargePercent: makingCharge,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProduct({ ...initialProduct });
            setImageError(false);
            setMessage(
                response.data?.message || "Product added successfully to your collection."
            );
            setMessageType("success");
        } catch (error) {
            console.error("Add product error:", error);

            const status = error.response?.status;

            if (status === 401) {
                setMessage("Your session has expired. Please log in again.");
            } else if (status === 403) {
                setMessage("Only an authorized administrator can add products.");
            } else if (error.response) {
                const data = error.response.data;
                const serverMessage =
                    typeof data === "string"
                        ? data
                        : data?.message || data?.error;

                setMessage(
                    serverMessage || `Unable to add product (HTTP ${status}).`
                );
            } else {
                setMessage("Unable to connect to the server. Please try again.");
            }

            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <AdminNavbar />

            <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
                {/* Page heading */}
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300">
                            Inventory Management
                        </span>
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Add a <span className="text-amber-400">Product</span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                        Expand your collection with a new piece of jewellery.
                        Add its details, image and inventory information below.
                    </p>
                </div>

                {/* Form and preview */}
                <form onSubmit={saveProduct}>
                    <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
                        <div className="space-y-6">
                            {/* Product details */}
                            <section className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5 sm:p-7">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.07] text-xl text-amber-300">
                                        ◇
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-white">
                                            Product Details
                                        </h2>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Basic information about your jewellery
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className={labelClass} htmlFor="name">
                                            Product name <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="e.g. Classic Gold Ring"
                                            value={product.name}
                                            onChange={handleChange}
                                            className={inputClass}
                                            maxLength={150}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass} htmlFor="category">
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={product.category}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="Gold">Gold</option>
                                            <option value="Silver">Silver</option>
                                            <option value="Diamond">Diamond</option>
                                            <option value="Platinum">Platinum</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass} htmlFor="imageUrl">
                                            Product image URL <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            id="imageUrl"
                                            name="imageUrl"
                                            type="url"
                                            placeholder="https://example.com/jewellery.jpg"
                                            value={product.imageUrl}
                                            onChange={handleChange}
                                            className={inputClass}
                                            maxLength={2048}
                                            required
                                        />
                                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                                            Use a publicly accessible HTTPS image URL.
                                            The image URL is stored, not the image file.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Pricing and inventory details */}
                            <section className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5 sm:p-7">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.07] text-xl text-amber-300">
                                        ₹
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-white">
                                            Jewellery Specifications
                                        </h2>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Purity, weight and stock information
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className={labelClass} htmlFor="weightInGrams">
                                            Weight (grams)
                                        </label>
                                        <input
                                            id="weightInGrams"
                                            name="weightInGrams"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="e.g. 5.50"
                                            value={product.weightInGrams}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass} htmlFor="purity">
                                            Purity
                                        </label>
                                        <select
                                            id="purity"
                                            name="purity"
                                            value={product.purity}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="24">24K — 99.9%</option>
                                            <option value="22">22K — 91.6%</option>
                                            <option value="18">18K — 75%</option>
                                            <option value="14">14K — 58.5%</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass} htmlFor="makingChargePercent">
                                            Making charge (%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="makingChargePercent"
                                                name="makingChargePercent"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                placeholder="e.g. 5.0"
                                                value={product.makingChargePercent}
                                                onChange={handleChange}
                                                className={`${inputClass} pr-10`}
                                                required
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                                                %
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass} htmlFor="stock">
                                            Available stock
                                        </label>
                                        <input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="e.g. 25"
                                            value={product.stock}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Live image preview */}
                        <aside className="space-y-5 lg:sticky lg:top-28">
                            <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]">
                                <div className="border-b border-white/[0.07] px-5 py-4">
                                    <h2 className="font-semibold text-white">
                                        Product Preview
                                    </h2>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        Preview of your catalogue image
                                    </p>
                                </div>

                                <div className="p-5">
                                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#1a1710] to-[#090909]">
                                        {product.imageUrl && !imageError ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name || "Product preview"}
                                                className="h-full w-full object-contain p-3"
                                                onError={() => setImageError(true)}
                                                onLoad={() => setImageError(false)}
                                            />
                                        ) : (
                                            <div className="px-5 text-center">
                                                <div className="text-5xl text-amber-400/60">
                                                    ◇
                                                </div>
                                                <p className="mt-4 text-sm text-zinc-400">
                                                    {imageError
                                                        ? "Image could not be loaded"
                                                        : "Your jewellery image will appear here"}
                                                </p>
                                                {imageError && (
                                                    <p className="mt-2 text-xs text-zinc-600">
                                                        Check the image URL
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                                            {product.category}
                                        </span>

                                        <h3 className="mt-3 break-words text-lg font-semibold text-white">
                                            {product.name || "Product name"}
                                        </h3>

                                        <div className="mt-3 space-y-2 border-t border-white/[0.07] pt-4 text-sm">
                                            <div className="flex justify-between gap-3">
                                                <span className="text-zinc-500">Purity</span>
                                                <span className="text-zinc-300">{product.purity}K</span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span className="text-zinc-500">Weight</span>
                                                <span className="text-zinc-300">
                                                    {product.weightInGrams
                                                        ? `${product.weightInGrams} g`
                                                        : "—"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span className="text-zinc-500">Stock</span>
                                                <span className="text-zinc-300">
                                                    {product.stock === "" ? "—" : product.stock}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
                                <p className="text-sm font-medium text-amber-300">
                                    Before publishing
                                </p>
                                <p className="mt-2 text-xs leading-5 text-zinc-400">
                                    Check the image, weight, purity and stock.
                                    The final selling price is determined by your
                                    existing backend pricing logic.
                                </p>
                            </div>
                        </aside>
                    </div>

                    {/* Inline feedback */}
                    {message && (
                        <div
                            role={messageType === "error" ? "alert" : "status"}
                            aria-live="polite"
                            className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                                messageType === "success"
                                    ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                                    : "border-red-400/20 bg-red-400/[0.07] text-red-300"
                            }`}
                        >
                            {messageType === "success" ? "✓ " : "!"}
                            {message}
                        </div>
                    )}

                    {/* Form actions */}
                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-zinc-500">
                            <span className="text-amber-400">*</span> Required fields
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex min-w-48 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-600 px-7 py-3.5 text-sm font-semibold text-black shadow-lg shadow-amber-900/10 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                    Saving product...
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">＋</span>
                                    Save Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
