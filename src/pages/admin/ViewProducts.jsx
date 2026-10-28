
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import AdminNavbar from "./AdminNavbar";

const CATEGORIES = ["Gold", "Silver", "Diamond", "Platinum"];

const EMPTY_MESSAGE = {
    type: "",
    text: "",
};

const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        Number(value) || 0
    );

const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-400/60";

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                {label}
            </span>
            {children}
        </label>
    );
}

function StockBadge({ stock }) {
    const quantity = Number(stock) || 0;

    const style =
        quantity === 0
            ? "border-red-400/20 bg-red-400/10 text-red-300"
            : quantity <= 5
            ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
            : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    const label =
        quantity === 0
            ? "Out of stock"
            : quantity <= 5
            ? "Low stock"
            : "In stock";

    return (
        <div>
            <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
            >
                {label}
            </span>
            <p className="mt-1 text-xs text-zinc-500">
                {quantity} units
            </p>
        </div>
    );
}

export default function ViewProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [notice, setNotice] = useState(EMPTY_MESSAGE);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setLoadError("");

        try {
            const response = await api.get("/api/products");
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Load products error:", error);
            setLoadError(
                error.response?.status === 401
                    ? "Your session may have expired. Please log in again."
                    : error.response?.status === 403
                    ? "You do not have permission to view these products."
                    : "Unable to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch =
                !term ||
                String(product.name || "").toLowerCase().includes(term) ||
                String(product.id).includes(term) ||
                String(product.category || "").toLowerCase().includes(term);

            const matchesCategory =
                categoryFilter === "ALL" ||
                product.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    const stats = useMemo(
        () => ({
            total: products.length,
            gold: products.filter((p) => p.category === "Gold").length,
            lowStock: products.filter(
                (p) => Number(p.stock) <= 5
            ).length,
            outOfStock: products.filter(
                (p) => Number(p.stock) <= 0
            ).length,
        }),
        [products]
    );

    const openEditor = (product) => {
        setEditingProduct({
            ...product,
            name: product.name || "",
            category: product.category || "Gold",
            imageUrl: product.imageUrl || "",
            stock: String(product.stock ?? 0),
            weightInGrams: String(product.weightInGrams ?? ""),
            purity: String(product.purity ?? "22"),
            makingChargePercent: String(
                product.makingChargePercent ?? ""
            ),
        });
        setNotice(EMPTY_MESSAGE);
    };

    const closeEditor = () => {
        if (!saving) setEditingProduct(null);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditingProduct((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const updateProduct = async (event) => {
        event.preventDefault();

        if (!editingProduct) return;

        const name = editingProduct.name.trim();
        const imageUrl = editingProduct.imageUrl.trim();
        const stock = Number(editingProduct.stock);
        const weight = Number(editingProduct.weightInGrams);
        const purity = Number(editingProduct.purity);
        const makingCharge = Number(editingProduct.makingChargePercent);

        if (
            !name ||
            !imageUrl ||
            !Number.isInteger(stock) ||
            stock < 0 ||
            !Number.isFinite(weight) ||
            weight <= 0 ||
            !Number.isFinite(purity) ||
            purity <= 0 ||
            !Number.isFinite(makingCharge) ||
            makingCharge < 0
        ) {
            setNotice({
                type: "error",
                text: "Please check all fields. Stock and charges cannot be negative.",
            });
            return;
        }

        setSaving(true);
        setNotice(EMPTY_MESSAGE);

        try {
            const payload = {
                ...editingProduct,
                name,
                imageUrl,
                stock,
                weightInGrams: weight,
                purity,
                makingChargePercent: makingCharge,
            };

            await api.put(
                `/api/products/${editingProduct.id}`,
                payload
            );

            setProducts((previous) =>
                previous.map((product) =>
                    product.id === editingProduct.id
                        ? { ...product, ...payload }
                        : product
                )
            );

            setEditingProduct(null);
            setNotice({
                type: "success",
                text: `Product "${name}" updated successfully.`,
            });
        } catch (error) {
            console.error("Update product error:", error);

            setNotice({
                type: "error",
                text:
                    error.response?.data?.message ||
                    (error.response?.status === 401
                        ? "Your session may have expired. Please log in again."
                        : error.response?.status === 403
                        ? "Only an authorized administrator can update products."
                        : "Unable to update product. Please try again."),
            });
        } finally {
            setSaving(false);
        }
    };

    const deleteProduct = async (product) => {
        const confirmed = window.confirm(
            `Delete "${product.name}" (Product #${product.id})?\n\nThis action may not be reversible.`
        );

        if (!confirmed) return;

        setDeletingId(product.id);
        setNotice(EMPTY_MESSAGE);

        try {
            await api.delete(`/api/products/${product.id}`);

            setProducts((previous) =>
                previous.filter((item) => item.id !== product.id)
            );

            setNotice({
                type: "success",
                text: `"${product.name}" was deleted successfully.`,
            });
        } catch (error) {
            console.error("Delete product error:", error);

            setNotice({
                type: "error",
                text:
                    error.response?.data?.message ||
                    (error.response?.status === 401
                        ? "Your session may have expired. Please log in again."
                        : error.response?.status === 403
                        ? "Only an authorized administrator can delete products."
                        : "Unable to delete product. Please try again."),
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <AdminNavbar />

            <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
                {/* Header */}
                <section className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300">
                            Inventory Management
                        </span>
                    </div>

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Manage <span className="text-amber-400">Products</span>
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                                Curate your jewellery collection, update
                                product details and monitor inventory.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadProducts}
                            disabled={loading}
                            className="self-start rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-amber-400/30 hover:text-amber-300 disabled:opacity-50 sm:self-auto"
                        >
                            {loading ? "Refreshing..." : "⟳ Refresh Products"}
                        </button>
                    </div>
                </section>

                {/* Summary */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { label: "Total Products", value: stats.total, icon: "◇" },
                        { label: "Gold Collection", value: stats.gold, icon: "✧" },
                        { label: "Low Stock", value: stats.lowStock, icon: "◷" },
                        { label: "Out of Stock", value: stats.outOfStock, icon: "!" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-zinc-400">{item.label}</p>
                                <span className="text-xl text-amber-300">
                                    {item.icon}
                                </span>
                            </div>
                            <p className="mt-4 text-3xl font-semibold">
                                {loading ? "—" : item.value}
                            </p>
                        </div>
                    ))}
                </section>

                {/* Inline messages */}
                {notice.text && (
                    <div
                        role={notice.type === "error" ? "alert" : "status"}
                        aria-live="polite"
                        className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                            notice.type === "success"
                                ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                                : "border-red-400/20 bg-red-400/[0.07] text-red-300"
                        }`}
                    >
                        {notice.type === "success" ? "✓ " : "! "}
                        {notice.text}
                    </div>
                )}

                {/* Search and filters */}
                <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[#111111] p-4 sm:p-5">
                    <div className="grid gap-4 md:grid-cols-[1fr_240px]">
                        <Field label="Search collection">
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by product name, ID or category..."
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Category">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className={inputClass}
                            >
                                <option value="ALL">All categories</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <p className="mt-3 text-xs text-zinc-500">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </section>

                {/* Product table */}
                <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]">
                    <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="font-semibold">Product Catalogue</h2>
                            <p className="mt-1 text-xs text-zinc-500">
                                Product details and inventory
                            </p>
                        </div>
                        <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400">
                            {filteredProducts.length} items
                        </span>
                    </div>

                    {loading ? (
                        <div className="px-6 py-20 text-center text-sm text-zinc-400">
                            Loading your collection...
                        </div>
                    ) : loadError ? (
                        <div className="px-6 py-16 text-center">
                            <p className="text-sm text-red-300">{loadError}</p>
                            <button
                                type="button"
                                onClick={loadProducts}
                                className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm hover:border-amber-400/30"
                            >
                                Try again
                            </button>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <p className="text-lg font-medium">
                                {products.length ? "No matching products" : "No products yet"}
                            </p>
                            <p className="mt-2 text-sm text-zinc-500">
                                Try changing your search or category filter.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[950px] text-left">
                                <thead className="bg-white/[0.025] text-[11px] uppercase tracking-wider text-zinc-500">
                                    <tr>
                                        <th className="px-5 py-4 font-medium">Product</th>
                                        <th className="px-4 py-4 font-medium">Category</th>
                                        <th className="px-4 py-4 font-medium">Weight</th>
                                        <th className="px-4 py-4 font-medium">Purity</th>
                                        <th className="px-4 py-4 font-medium">Making</th>
                                        <th className="px-4 py-4 font-medium">Inventory</th>
                                        <th className="px-5 py-4 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/[0.06]">
                                    {filteredProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="transition hover:bg-white/[0.02]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src =
                                                                "https://placehold.co/100x100/171717/D4AF37?text=LUXORA";
                                                        }}
                                                        className="h-14 w-14 shrink-0 rounded-xl border border-white/10 bg-black object-cover"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="max-w-[230px] truncate text-sm font-medium text-white">
                                                            {product.name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            ID #{product.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="rounded-lg border border-amber-400/15 bg-amber-400/[0.06] px-2.5 py-1.5 text-xs text-amber-200">
                                                    {product.category}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-zinc-300">
                                                {formatNumber(product.weightInGrams)} g
                                            </td>

                                            <td className="px-4 py-4 text-sm text-zinc-300">
                                                {product.purity}K
                                            </td>

                                            <td className="px-4 py-4 text-sm text-zinc-300">
                                                {formatNumber(product.makingChargePercent)}%
                                            </td>

                                            <td className="px-4 py-4">
                                                <StockBadge stock={product.stock} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditor(product)}
                                                        className="rounded-lg border border-amber-400/20 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-400/10"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteProduct(product)}
                                                        disabled={deletingId === product.id}
                                                        className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                                                    >
                                                        {deletingId === product.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <footer className="mt-8 border-t border-white/[0.07] py-5 text-center text-xs text-zinc-600">
                    LUXORA · Inventory Management
                </footer>
            </main>

            {/* Edit product modal */}
            {editingProduct && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeEditor();
                    }}
                >
                    <form
                        onSubmit={updateProduct}
                        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-400/20 bg-[#111111] shadow-2xl shadow-black/60"
                    >
                        <div className="flex items-start justify-between border-b border-white/[0.08] px-5 py-5 sm:px-7">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300">
                                    Inventory Editor
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold">
                                    Edit <span className="text-amber-400">Product</span>
                                </h2>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Product ID #{editingProduct.id}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditor}
                                disabled={saving}
                                aria-label="Close editor"
                                className="rounded-lg border border-white/10 px-3 py-2 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
                            {editingProduct.imageUrl && (
                                <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-black/30 p-3">
                                    <img
                                        src={editingProduct.imageUrl}
                                        alt="Product preview"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src =
                                                "https://placehold.co/100x100/171717/D4AF37?text=LUXORA";
                                        }}
                                        className="h-20 w-20 rounded-lg object-cover"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">
                                            {editingProduct.name || "Product preview"}
                                        </p>
                                        <p className="mt-1 break-all text-xs text-zinc-500">
                                            Image preview
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Product name">
                                    <input
                                        name="name"
                                        value={editingProduct.name}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                        required
                                    />
                                </Field>

                                <Field label="Category">
                                    <select
                                        name="category"
                                        value={editingProduct.category}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                        required
                                    >
                                        {CATEGORIES.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <div className="sm:col-span-2">
                                    <Field label="Image URL">
                                        <input
                                            name="imageUrl"
                                            type="url"
                                            value={editingProduct.imageUrl}
                                            onChange={handleEditChange}
                                            className={inputClass}
                                            required
                                        />
                                    </Field>
                                </div>

                                <Field label="Weight (grams)">
                                    <input
                                        name="weightInGrams"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={editingProduct.weightInGrams}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                        required
                                    />
                                </Field>

                                <Field label="Purity">
                                    <select
                                        name="purity"
                                        value={editingProduct.purity}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                        required
                                    >
                                        {[24, 22, 18, 14].map((purity) => (
                                            <option key={purity} value={purity}>
                                                {purity}K
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Making charge (%)">
                                    <input
                                        name="makingChargePercent"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={editingProduct.makingChargePercent}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                        required
                                    />
                                </Field>

                                <Field label="Available stock">
                                    <input
                                        name="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={editingProduct.stock}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                        required
                                    />
                                </Field>
                            </div>

                            {notice.text && notice.type === "error" && (
                                <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm text-red-300">
                                    {notice.text}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] bg-black/20 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
                            <button
                                type="button"
                                onClick={closeEditor}
                                disabled={saving}
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.04] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-gradient-to-r from-amber-300 to-yellow-600 px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Saving Changes..." : "Save Changes →"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
