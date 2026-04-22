import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState(10000);

  const [page, setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);

  const [categories,setCategories] = useState([]);

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH ORDERS (OPTIMIZED)
  ////////////////////////////////////////////////////////////////
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/orders/filter", {
        params: {
          search,
          page,
          category,
          sort,
          maxPrice: priceRange,
        },
      });

      // 🛡️ SAFE HANDLING
      const data = res.data;
      console.log("data", data)

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        console.warn("Unexpected API format:", data);
        setOrders([]);
      }

      setTotalPages(data.totalPages || 1);
      setCategories(data.categories || []);

    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders ❌");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [search, page, category, sort, priceRange]);

  ////////////////////////////////////////////////////////////////
  // 🔥 DEBOUNCE FETCH
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    const timer = setTimeout(fetchOrders, 400);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  ////////////////////////////////////////////////////////////////
  // 🔥 UPDATE STATUS
  ////////////////////////////////////////////////////////////////
  const updateStatus = async (orderId, status) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Change status to ${status}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    });

    if (!result.isConfirmed) return;

    try {
      await API.put("/orders/update-status", { orderId, status });

      toast.success(`Order ${status} ✅`);

      // ⚡ instant UI update (better UX)
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );

    } catch (err) {
      toast.error("Update failed ❌");
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 DOWNLOAD INVOICE
  ////////////////////////////////////////////////////////////////
  const downloadInvoice = async (id) => {
    try {
      const res = await API.get(`/orders/invoice/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-${id}.pdf`;
      link.click();

    } catch (error) {
      console.log(error);
      toast.error("Download failed ❌");
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 RENDER
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-5">📦 Orders</h1>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-3">

        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded w-64"
        />

        <select value={category} onChange={(e) => {setCategory(e.target.value); setPage(1)}} className="border px-3 py-2 rounded">
          <option value="">All Categories</option>
          {categories.map((cat,index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => {
          setSort(e.target.value);
          setPage(1);
          }} className="border px-3 py-2 rounded">
          <option value="">Sort</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
          <option value="latest">Latest</option>
        </select>

        <div className="flex items-center gap-2">
          <span>₹0</span>
          <input
            type="range"
            min="0"
            max="10000"
            value={priceRange}
            onChange={(e) => {
              setPriceRange(e.target.value);
              setPage(1);
            }}
          />
          <span>₹{priceRange}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : !Array.isArray(orders) || orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-5 text-gray-500">
                  No orders found 😔
                </td>
              </tr>
            ) : (
              orders.map((o, index) => (
                <tr key={o._id} className="border-t">
                  <td className="p-3">{index + 1}</td>

                  <td
                    className="p-3 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/orders/${o._id}`)}
                  >
                    {o._id.slice(-6)}
                  </td>

                  <td className="p-3">{o.user?.name || "N/A"}</td>

                  <td className="p-3">₹{o.totalPrice}</td>

                  <td className="p-3">
                    <StatusBadge status={o.status} />
                  </td>

                  <td className="p-3 space-x-2">
                    <button onClick={() => updateStatus(o._id, "confirmed")} className="bg-blue-500 text-white px-2 py-1 rounded">Approve</button>
                    <button onClick={() => updateStatus(o._id, "shipped")} className="bg-yellow-500 text-white px-2 py-1 rounded">Ship</button>
                    <button onClick={() => updateStatus(o._id, "delivered")} className="bg-green-500 text-white px-2 py-1 rounded">Deliver</button>
                    <button onClick={() => updateStatus(o._id, "cancelled")} className="bg-red-500 text-white px-2 py-1 rounded">Cancel</button>
                    <button onClick={() => downloadInvoice(o._id)} className="bg-gray-700 text-white px-2 py-1 rounded">Invoice</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1 bg-gray-100 rounded">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////
// 🔥 STATUS BADGE
//////////////////////////////////////////////////////////////
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-gray-400",
    confirmed: "bg-blue-500",
    shipped: "bg-yellow-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <span className={`text-white px-3 py-1 rounded text-sm capitalize ${styles[status] || "bg-gray-400"}`}>
      {status}
    </span>
  );
}

//////////////////////////////////////////////////////////////
// 🔥 SKELETON
//////////////////////////////////////////////////////////////
function SkeletonRows() {
  return Array(5).fill(0).map((_, i) => (
    <tr key={i} className="border-t animate-pulse">
      {[...Array(6)].map((_, idx) => (
        <td key={idx} className="p-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </td>
      ))}
    </tr>
  ));
}