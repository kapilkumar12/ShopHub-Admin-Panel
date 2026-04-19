import { useEffect,useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data,setData] = useState(null);
  const [view,setView] = useState("monthly");
  const [chartData,setChartData] = useState([]);
  const [loading,setLoading] = useState(false);

  const endpoints = {
    daily: "/admin/sales/daily",
    weekly: "/admin/sales/weekly",
    monthly: "/admin/sales/monthly",
  };

  useEffect(() => {
    API.get("/admin/dashboard").then((res) => {
      setData(res.data);
      withCredentials: true;
    });
  },[]);


  const fetchSales = async (type) => {
    try {
      setLoading(true);

      const res = await API.get(endpoints[type]);

      const safeData =
        res.data?.data ||
        res.data?.sales ||
        res.data ||
        [];

      let formatted = [];

      if (type === "monthly") {
        formatted = safeData.map((item) => ({
          label: item.month,   // Apr
          total: item.total,
        }));
      }

      else if (type === "weekly") {
        formatted = safeData.map((item) => ({
          label: item.week || `Week ${item._id}`, 
          total: item.total,
        }));
      }

      else if (type === "daily") {
        formatted = safeData.map((item) => ({
          label: item.date || item._id, // 17 Apr
          total: item.total,
        }));
      }

      setChartData(formatted);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(view);
  },[view]);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      {/* 🔥 STATS CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card title="Total Orders" value={data.totalOrders} />
        <Card title="Revenue" value={`₹${data.totalRevenue}`} />
        <Card title="Pending" value={data.pendingOrders} />
        <Card title="Cancelled" value={data.cancelledOrders} />
      </div>

      {/* 📈 SALES GRAPH */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <div className="flex gap-3 mb-4">
          {["daily","weekly","monthly"].map((type) => (
            <button
              key={type}
              onClick={() => setView(type)}
              className={`px-3 py-1 rounded ${view === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📦 RECENT ORDERS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.recentOrders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3">{o._id}</td>
                <td className="p-3">{o.user?.name}</td>
                <td className="p-3">₹{o.totalPrice}</td>
                <td className="p-3">
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////////
// 🔥 CARD COMPONENT
//////////////////////////////////////////////////////////////////

function Card({ title,value }) {
  return (
    <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

//////////////////////////////////////////////////////////////////
// 🔥 STATUS BADGE
//////////////////////////////////////////////////////////////////

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-gray-400",
    confirmed: "bg-blue-500",
    shipped: "bg-yellow-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <span className={`text-white px-2 py-1 rounded ${colors[status]}`}>
      {status}
    </span>
  );
}