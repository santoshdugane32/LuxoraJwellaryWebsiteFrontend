import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductPrice() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/product-price/1`)
      .then(res => {
        setPrice(Number(res.data)); // ensure number
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-5 bg-black text-white rounded-xl border border-yellow-500/30 shadow-lg">

      <h2 className="text-lg font-semibold text-gray-300">
        Product Price
      </h2>

      {/* SAFE RENDERING */}
      {price !== null ? (
        <h1 className="text-yellow-400 text-3xl font-bold">
          ₹{price.toFixed(2)}
        </h1>
      ) : (
        <div className="text-gray-400 animate-pulse">
          Calculating price...
        </div>
      )}

    </div>
  );
}