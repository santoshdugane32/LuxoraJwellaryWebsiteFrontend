import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddProduct() {

    const [product, setProduct] = useState({
        name: "",
        category: "Gold",
        imageUrl: "",
        stock: "",
        weightInGrams: "",
        purity: "22",
        makingChargePercent: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const saveProduct = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again.");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post(
                `${API_BASE_URL}/api/products`,
                {
                    ...product,
                    stock: Number(product.stock),
                    weightInGrams: Number(product.weightInGrams),
                    purity: Number(product.purity),
                    makingChargePercent: Number(product.makingChargePercent)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            alert("✅ Product Added Successfully");

            setProduct({
                name: "",
                category: "Gold",
                imageUrl: "",
                stock: "",
                weightInGrams: "",
                purity: "22",
                makingChargePercent: ""
            });

        } catch (error) {

            console.log(error);

            if (error.response) {

                if (error.response.status === 401) {
                    alert("Session expired. Please login again.");
                }
                else if (error.response.status === 403) {
                    alert("Only Admin can add products.");
                }
                else {
                    alert(error.response.data);
                }

            } else {
                alert("Unable to connect to server.");
            }

        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-black flex justify-center items-center py-10">

            <form
                onSubmit={saveProduct}
                className="w-[600px] bg-zinc-900 rounded-3xl p-10 shadow-2xl border border-yellow-500/20"
            >

                <h1 className="text-5xl font-bold text-white mb-8">
                    Add Product
                </h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    className="w-full p-4 mb-5 bg-black text-white border border-gray-600 rounded-xl"
                    required
                />

                <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full p-4 mb-5 bg-black text-white border border-gray-600 rounded-xl"
                >
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Platinum">Platinum</option>
                </select>

                <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={product.imageUrl}
                    onChange={handleChange}
                    className="w-full p-4 mb-5 bg-black text-white border border-gray-600 rounded-xl"
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="weightInGrams"
                    placeholder="Weight (grams)"
                    value={product.weightInGrams}
                    onChange={handleChange}
                    className="w-full p-4 mb-5 bg-black text-white border border-gray-600 rounded-xl"
                    required
                />

                <select
                    name="purity"
                    value={product.purity}
                    onChange={handleChange}
                    className="w-full p-4 mb-5 bg-black text-white border border-gray-600 rounded-xl"
                >
                    <option value="24">24K (99.9%)</option>
                    <option value="22">22K (91.6%)</option>
                    <option value="18">18K (75%)</option>
                    <option value="14">14K (58.5%)</option>
                </select>

                <input
                    type="number"
                    step="0.1"
                    name="makingChargePercent"
                    placeholder="Making Charge (%)"
                    value={product.makingChargePercent}
                    onChange={handleChange}
                    className="w-full p-4 mb-5 bg-black text-white border border-gray-600 rounded-xl"
                    required
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={product.stock}
                    onChange={handleChange}
                    className="w-full p-4 mb-8 bg-black text-white border border-gray-600 rounded-xl"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 rounded-xl hover:scale-105 transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Product"}
                </button>

            </form>

        </div>
    );
}