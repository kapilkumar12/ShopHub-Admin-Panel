import { useEffect,useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  },[]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders");
      setOrders(res.data.orders);
      console.log("orders", res.data.orders)
      setLoading(false);
    } catch (error) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId,status) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Change status to ${status}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, update",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await API.put("/order/update-status",{
        orderId,
        status,
      });

      console.log("UPDATE RESPONSE:",res.data);
      toast.success(`Order ${status} successfully ✅`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update ❌");
    }
  };


  const downloadInvoice = async (id) => {
    try {
      const res = await API.get(`/order/invoice/${id}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(res.data);
    const link = document.createElement("a");

    link.href = url;
    link.download = `invoice-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    } catch (error) {
      console.log(error.response || error);
      alert("Download failed ❌");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📦 Orders</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
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
            ) : (orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td
                  className="p-3 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/orders/${o._id}`)}
                >{o._id}</td>
                <td className="p-3">{o.user?.name}</td>
                <td className="p-3">₹{o.totalPrice}</td>

                {/* STATUS */}
                <td className="p-3">
                  <StatusBadge status={o.status} />
                </td>

                {/* ACTIONS */}
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => updateStatus(o._id,"confirmed")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(o._id,"shipped")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Ship
                  </button>

                  <button
                    onClick={() => updateStatus(o._id,"delivered")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Deliver
                  </button>

                  <button
                    onClick={() => updateStatus(o._id,"cancelled")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => downloadInvoice(o._id)}>
                    Download Invoice
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


//////////////////////////////////////////////////////////////////
// 🔥 STATUS BADGE
//////////////////////////////////////////////////////////////////


function StatusBadge({ status }) {
  const styles = {
    pending: "bg-gray-400",
    confirmed: "bg-blue-500",
    shipped: "bg-yellow-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <span
      className={`text-white px-3 py-1 rounded text-sm capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

//////////////////////////////////////////////////////////////////
// 🔥 SKELETON LOADER
//////////////////////////////////////////////////////////////////

function SkeletonRows() {
  return Array(5)
    .fill(0)
    .map((_,i) => (
      <tr key={i} className="border-t animate-pulse">
        <td className="p-3">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </td>
        <td className="p-3">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </td>
        <td className="p-3">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </td>
        <td className="p-3">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </td>
        <td className="p-3">
          <div className="h-4 bg-gray-300 rounded w-40"></div>
        </td>
      </tr>
    ));
}