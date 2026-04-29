import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";
import socket from "../services/socket";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  /////////////////////////////////////////////////////////////
  // 🔥 FETCH ORDER (TRY-CATCH)
  /////////////////////////////////////////////////////////////

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/order/single/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      Swal.fire("Error", "Failed to load order", "error");
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <p>Loading...</p>;
  if (!order) return <p>No order found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📦 Order Details</h1>

      {/* 🧾 BASIC INFO */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>User:</b> {order.user?.name}</p>
        <p><b>Total:</b> ₹{order.totalPrice}</p>

        <p className="mb-4">
          <b>Status:</b> 
          <span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
            {order.status}
          </span>
        </p>

      </div>

      {/* 📦 ITEMS */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">Items</h2>

        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <p>{item.product?.name}</p>
            <p>₹{item.price} × {item.quantity}</p>
          </div>
        ))}
      </div>

      {/* 🚚 TIMELINE */}
      <OrderTimeline history={order.trackingHistory} />
    </div>
  );
}

/////////////////////////////////////////////////////////////
// 🔥 TIMELINE COMPONENT
/////////////////////////////////////////////////////////////

function OrderTimeline({ history }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-semibold mb-4">Order Timeline</h2>

      <div className="relative border-l-2 border-gray-200 ml-4">
        {history.map((h, i) => (
          <div key={i} className="mb-6 ml-4">
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 mt-1"></div>

            <p className="font-medium capitalize">{h.status}</p>
            <p className="text-sm text-gray-500">{h.message}</p>
            <p className="text-xs text-gray-400">
              {new Date(h.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}